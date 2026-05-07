import AccordionCustom from "@/components/Accordion-Custom";
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
import { useEffect, useState } from "react";
import DialogManage, { ModelDialogManageState } from "./dialog-manage";
import { DeleteButton, DocsButton } from "@/components/icon-button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _DocumentApi from "@/api/controller/document";
import { BaseSearchModel, PaginationModel } from "@/api/interface";
import { useLoading } from "@/context/loading-context";
import { useAlert } from "@/context/alert-context";
import useConfirm from "@/components/drawer-confirm";
import dayjs from "dayjs";
import _FileApi from "@/api/controller/file";
import {
  createFileFromBase64WithMimeType,
  fnDownloadFile,
} from "@/helpers/function-service";

const PageDocuments = (): JSX.Element => {
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const queryClient = useQueryClient();
  const [confirm, confirmModel] = useConfirm();

  const [pagination, setPagination] = useState<PaginationModel>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });

  const [dialogManage, setDialogManage] = useState<ModelDialogManageState>({
    isOpen: false,
    data: {},
    state: "add",
  });

  const columns: Column[] = [
    {
      field: "no",
      label: "ลำดับ",
      bodyAlign: "center",
      width: "10%",
    },
    {
      field: "name",
      label: "ชื่อไฟล์",
      bodyAlign: "left",
      width: "60%",
    },
    {
      field: "createdDate",
      label: "วันที่อัพโหลด",
      bodyAlign: "center",
      width: "20%",
      render: (row: any) => dayjs(row.createdDate).format("DD/MM/BBBB"),
    },
    {
      field: "action",
      label: "",
      bodyAlign: "center",
      width: "10%",
      render: (row: any) => {
        return (
          <div className="flex justify-center ">
            <DocsButton onClick={() => onDownload(row)} />
            <DeleteButton onClick={() => onDelete(row)} />
          </div>
        );
      },
    },
  ];

  const { data: rows, isLoading: isLoadindRows } = useQuery({
    queryKey: ["document-list", pagination.page],
    queryFn: async () => {
      const payload: BaseSearchModel = {
        page: pagination.page,
        limit: pagination.limit,
        filterOperator: "and",
        sorting: [{ field: "createdDate", pattern: "DESC" }],
        filter: [],
      };
      try {
        setLoadingContext(true);
        const result = await _DocumentApi().search(payload);
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
  });

  const { mutate: onAction, isPending: isLoadingAction } = useMutation({
    mutationFn: async ({
      state,
      id,
      body,
    }: {
      state: "create" | "delete";
      id?: number;
      body?: FormData;
    }) => {
      if (state === "create") {
        return await _DocumentApi().create(body as FormData);
      } else if (state === "delete") {
        return await _DocumentApi().delete(id as number);
      }
    },
    onSuccess: () => {
      setDialogManage({ ...dialogManage, isOpen: false });
      queryClient.invalidateQueries({ queryKey: ["document-list"] });
      setAlertContext({
        type: "success",
        message: "ดำเนินการสำเร็จ",
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

  const onDelete = async (row: any): Promise<void> => {
    const resultConfirm = await confirm("ต้องการลบรายการนี้ใช่หรือไม่ ?");
    if (resultConfirm) {
      onAction({ state: "delete", id: Number(row.id) });
    }
  };

  const onDownload = async (row: any): Promise<void> => {
    try {
      setLoadingContext(true);
      const payload = {
        path: row.path,
      };
      const result = await _FileApi().getFile(payload);
      const file = createFileFromBase64WithMimeType(result.data, row.name);
      fnDownloadFile(file);
    } catch (err: any) {
      setAlertContext({
        type: "warning",
        message: err?.message,
      });
    } finally {
      setLoadingContext(false);
    }
  };

  const onSubmitDialog = (body: FormData) => {
    onAction({ state: "create", body });
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
                  เอกสาร
                </Divider>
              </Box>
            }
          />

          <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
            <AccordionCustom title="เอกสาร" defaultExpanded>
              <div className="my-6 space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setDialogManage({
                        ...dialogManage,
                        isOpen: true,
                        state: "add",
                        data: {},
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
        data={dialogManage.data}
        state={dialogManage.state}
        onCloseDoalog={() =>
          setDialogManage({ ...dialogManage, isOpen: false })
        }
        onSubmit={onSubmitDialog}
      />

      {confirmModel}
    </>
  );
};

export default PageDocuments;
