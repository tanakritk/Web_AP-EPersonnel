import AccordionCustom from "@/components/Accordion-Custom";
import TabAction, { TabValueProps } from "@/components/tab-action";
import TableCustom, { Column } from "@/components/table-custom";
import ContentLayout from "@/layout/content-layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Pagination,
} from "@mui/material";
import DialogManage, { ModelDialogManageState } from "./dialog-manage";
import { useEffect, useState } from "react";
import { getLoginStorage } from "@/helpers/set-storage";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import { useLoading } from "@/context/loading-context";
import { useAlert } from "@/context/alert-context";
import { useParams } from "react-router-dom";
import { BaseSearchModel, PaginationModel } from "@/api/interface";
import _AcademicApi, { AcademicModel } from "@/api/controller/academic";
import dayjs from "dayjs";
import { DeleteButton, EditButton } from "@/components/icon-button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useConfirm from "@/components/drawer-confirm";
import { omit } from "lodash";
import CheckIcon from "@mui/icons-material/Check";

const profile = getLoginStorage()?.profile;
const idEmp = encodeURIComponent(CryptoHelper.encrypt(profile?.id));
const tabValue: TabValueProps[] = [
  {
    label: "ข้อมูลส่วนตัว",
    path: `/personnel-info/information/${idEmp}`,
  },
  { label: "ประวัติการศึกษา", path: `/personnel-info/education/${idEmp}` },
  {
    label: "ประวัติการรับเครื่องราชอิสริยาภรณ์",
    path: `/personnel-info/insignia/${idEmp}`,
  },
  {
    label: "ประวัติการเลื่อนวิทยฐานะ",
    path: `/personnel-info/academic/${idEmp}`,
    action: true,
  },
];

interface IAction {
  state: "create" | "update" | "delete";
  id: number | null;
  body: AcademicModel | null;
}

const PagePersonnelAcademic = (): JSX.Element => {
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const queryClient = useQueryClient();
  const [confirm, confirmModel] = useConfirm();
  const params = useParams();
  const [pagination, setPagination] = useState<PaginationModel>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });

  const id = Number(
    decodeURIComponent(CryptoHelper.decrypt(params?.id as string)),
  );
  const [dialogManage, setDialogManage] = useState<ModelDialogManageState>({
    isOpen: false,
    data: {},
    state: "create",
  });
  const columns: Column[] = [
    {
      field: "no",
      label: "ลำดับ",
      bodyAlign: "center",
      width: "10%",
      render: (row: AcademicModel) => {
        return (
          <div className="flex justify-center items-center space-x-2">
            {row?.isActive && <CheckIcon color="success" />}
            <span>{row?.no}</span>
          </div>
        );
      },
    },
    {
      field: "receiptDate",
      label: "วันที่รับการแต่งตั้ง",
      bodyAlign: "center",
      width: "20%",
      render: (row: AcademicModel) =>
        dayjs(row.receiptDate).format("DD/MM/BBBB"),
    },
    {
      field: "name",
      label: "ชื่อวิทยฐานะ",
      bodyAlign: "left",
      width: "40%",
    },
    {
      field: "dueDate",
      label: "วันครบกำหนด",
      bodyAlign: "center",
      width: "20%",
      render: (row: AcademicModel) => dayjs(row.dueDate).format("DD/MM/BBBB"),
    },
    {
      field: "action",
      label: "",
      bodyAlign: "center",
      width: "10%",
      render: (row: AcademicModel) => {
        return (
          <div className="flex justify-center">
            <EditButton onClick={() => onClickUpdate(row)} />
            <DeleteButton onClick={() => onDelete(row)} />
          </div>
        );
      },
    },
  ];

  const { data: rows, isLoading: isLoadindRows } = useQuery({
    queryKey: ["academic-list", pagination.page],
    queryFn: async () => {
      const payload: BaseSearchModel = {
        page: pagination.page,
        limit: pagination.limit,
        relation: ["mas_user"],
        filterOperator: "and",
        sorting: [],
        filter: [
          {
            field: "mas_user.id",
            operator: "=",
            value: id,
          },
        ],
      };
      try {
        setLoadingContext(true);
        const result = await _AcademicApi().search(payload);
        return result;
      } catch (err: any) {
        setAlertContext({
          message: err?.message,
          type: "warning",
        });
      } finally {
        setLoadingContext(false);
      }
    },
    enabled: !!id,
  });

  const { mutate: onAction, isPending: isLoadingAction } = useMutation({
    mutationFn: async ({ state, id, body }: IAction) => {
      if (state === "create") {
        const result = await _AcademicApi().create(body as AcademicModel);
        return { state, result };
      } else if (state === "update") {
        const result = await _AcademicApi().update(
          id as number,
          body as AcademicModel,
        );
        return { state, result };
      } else if (state === "delete") {
        const result = await _AcademicApi().delete(id as number);
        return { state, result };
      }
    },
    onSuccess: (response) => {
      if (response?.state === "create" || response?.state === "update") {
        setDialogManage({ ...dialogManage, isOpen: false });
      }
      queryClient.invalidateQueries({ queryKey: ["academic-list"] });
      setAlertContext({
        type: "success",
        message: "บันทึกข้อมูลสำเร็จ",
      });
    },
    onError: (err: any) => {
      setAlertContext({
        type: "warning",
        message: err?.message,
      });
    },
    onSettled: () => {
      setLoadingContext(false);
    },
  });

  const onDelete = async (row: AcademicModel): Promise<void> => {
    const resultConfirm = await confirm("ต้องการลบรายการนี้ใช่หรือไม่ ?");
    if (resultConfirm) {
      onAction({ state: "delete", id: Number(row.id), body: null });
    }
  };

  const onClickUpdate = (row: AcademicModel): void => {
    setDialogManage({
      data: row,
      isOpen: true,
      state: "update",
    });
  };

  const onSubmitDialog = (state: "create" | "update", body: AcademicModel) => {
    if (!body.name || !body.receiptDate || !body.dueDate) {
      setAlertContext({
        type: "warning",
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      return;
    }

    if (state === "create") {
      const newBody = {
        ...body,
        userId: id,
      };
      onAction({ state, id: null, body: newBody });
    } else if (state === "update") {
      const newBody = omit(body, [
        "createdDate",
        "updatedDate",
        "deletedDate",
        "id",
        "mas_user",
        "no",
      ]);
      onAction({ state, id: Number(body.id), body: newBody });
    }
  };

  useEffect(() => {
    const isFinalLoad = isLoadindRows || isLoadingAction;
    setLoadingContext(isFinalLoad);
  }, [setLoadingContext, isLoadindRows, isLoadingAction]);

  return (
    <>
      <ContentLayout titlePage="" breadcrumbList={[]}>
        <Card>
          <CardHeader
            title={
              <Box>
                <Divider
                  className="text-[22px] font-bold"
                  textAlign="left"
                  sx={{
                    mb: 2,
                    "&::before, &::after": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  ข้อมูลส่วนตัว
                </Divider>
                <div className="pr-20">
                  <TabAction tabValue={tabValue} />
                </div>
              </Box>
            }
          />

          <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
            <AccordionCustom title="ประวัติการเลื่อนวิทยฐานะ" defaultExpanded>
              <div className="my-6 space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setDialogManage({
                        ...dialogManage,
                        data: {},
                        state: "create",
                        isOpen: true,
                      })
                    }
                  >
                    เพิ่ม
                  </Button>
                </div>
                <TableCustom
                  rows={rows?.data || []}
                  columns={columns}
                  px={false}
                  border
                />

                <div className="flex justify-end mt-6">
                  <Pagination
                    page={pagination.page}
                    count={rows?.paginationData.totalPages || 0}
                    onChange={(_, value) => {
                      setPagination({
                        ...pagination,
                        page: value,
                      });
                    }}
                  />
                </div>
              </div>
            </AccordionCustom>
          </CardContent>
        </Card>
      </ContentLayout>

      <DialogManage
        isOpen={dialogManage.isOpen}
        state={dialogManage.state}
        data={dialogManage.data}
        onCloseDoalog={() =>
          setDialogManage({ ...dialogManage, isOpen: false })
        }
        onSubmit={onSubmitDialog}
      />

      {confirmModel}
    </>
  );
};

export default PagePersonnelAcademic;
