import _DropdownApi, { DropdownModel } from "@/api/controller/dropdown";
import _LeaveApi, { LeaveModel } from "@/api/controller/leave";
import {
  BaseSearchModel,
  FilterOption,
  PaginationModel,
} from "@/api/interface";
import AccordionCustom from "@/components/Accordion-Custom";
import { DeleteButton, EditButton, ViewButton } from "@/components/icon-button";
import TableCustom, { Column } from "@/components/table-custom";
import { useAlert } from "@/context/alert-context";
import { useLoading } from "@/context/loading-context";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import ContentLayout from "@/layout/content-layout";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PageLeaveHistory = (): JSX.Element => {
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(
    decodeURIComponent(CryptoHelper.decrypt(params?.id as string)),
  );
  const [pagination, setPagination] = useState<PaginationModel>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const [search, setSearch] = useState({
    userId: id,
    month: "",
  });

  const columns: Column[] = [
    {
      field: "date",
      label: "วันที่",
      bodyAlign: "center",
      width: "20%",
      render: (row: LeaveModel) => {
        if (row.leaveFormat === "เต็มวัน") {
          return dayjs(row.startDate).format("DD/MM/BBBB");
        } else {
          return `${dayjs(row.startDate).format("DD/MM/BBBB HH:mm")}  -  ${dayjs(row.endDate).format("DD/MM/BBBB HH:mm")}`;
        }
      },
    },
    {
      field: "leaveFormat",
      label: "รูปแบบการลา",
      bodyAlign: "center",
      width: "10%",
    },
    {
      field: "leaveType",
      label: "ประเภทการลา",
      bodyAlign: "center",
      width: "10%",
    },

    {
      field: "reasonLeave",
      label: "เหตุผลการลา",
      bodyAlign: "left",
      width: "30%",
    },
    {
      field: "mas_statusleave.name",
      label: "สถานะการลา",
      bodyAlign: "center",
      width: "20%",
      render: (row: any) => {
        return <Chip label={row?.mas_statusleave?.name} color="secondary" />;
      },
    },
    {
      field: "action",
      label: "",
      bodyAlign: "center",
      width: "10%",
      render: (row: any) => {
        if (row?.mas_statusleave?.id === 1) {
          return (
            <div className="flex justify-center">
              <EditButton onClick={() => onClickEditData(row)} />
              <DeleteButton />;
            </div>
          );
        } else {
          return <ViewButton onClick={() => onClickViewData(row)} />;
        }
      },
    },
  ];

  const { data: rows, isLoading: isLoadingRows } = useQuery({
    queryKey: ["leave-history-list", pagination.page, search],
    queryFn: async () => {
      let filter: FilterOption[] = [
        {
          field: "mas_user.id",
          operator: "=",
          value: search.userId,
        },
      ];
      if (search.month) {
        const start = dayjs(search.month).startOf("month").format("YYYY-MM-DD");
        const end = dayjs(search.month).endOf("month").format("YYYY-MM-DD");
        filter.push({
          field: "startDate",
          operator: "between",
          value: [start, end],
        });
      }
      const payload: BaseSearchModel = {
        page: pagination.page,
        limit: pagination.limit,
        relation: ["mas_user", "mas_statusleave"],
        filterOperator: "and",
        sorting: [
          {
            field: "startDate",
            pattern: "DESC",
          },
        ],
        filter: filter,
      };
      const result = await _LeaveApi().search(payload);
      if (result.statusCode !== 200) {
        setAlertContext({
          message: result.message,
          type: "warning",
        });
      }
      return result;
    },
    enabled: !!search.userId,
  });

  const { data: ddl, isLoading: isLoadingDDL } = useQuery({
    queryKey: ["ddl", "leave-history"],
    queryFn: async () => {
      const userDDL = await _DropdownApi().user();
      return {
        user: userDDL.data,
      };
    },
    enabled: !!search.userId,
  });

  const onClickEditData = (row: any) => {
    const idData = encodeURIComponent(CryptoHelper.encrypt(row.id));
    navigate(`/leave-request-detail/edit/${idData}`);
  };

  const onClickViewData = (row: any) => {
    const idData = encodeURIComponent(CryptoHelper.encrypt(row.id));
    navigate(`/leave-request-detail/view/${idData}`);
  };

  useEffect(() => {
    const finalLoading = isLoadingRows || isLoadingDDL;
    setLoadingContext(finalLoading);
  }, [setLoadingContext, isLoadingRows, isLoadingDDL]);

  useEffect(() => {
    setSearch({
      ...search,
      userId: id,
    });
  }, [id]);
  return (
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
                    borderColor: "primary.main", // กำหนดสีเส้น (ชมพู) เฉพาะที่เส้นก่อนและหลังตัวหนังสือ
                  },
                }}
              >
                ประวัติการลา
              </Divider>
            </Box>
          }
        />

        <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
          <AccordionCustom title="ประวัติการลา" defaultExpanded>
            <div className="my-6 space-y-6">
              <div className="flex flex-wrap justify-end">
                <div className="lg:basis-1/5 basis-full px-3 mb-3">
                  <p>ชื่อบุคลากร</p>
                  <Select disabled fullWidth value={search.userId}>
                    {ddl?.user?.map((item: DropdownModel, index: number) => (
                      <MenuItem key={index} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className="lg:basis-1/5 basis-full px-3 mb-3">
                  <p>เดือน</p>
                  <DateTimePicker
                    // disablePast
                    name="month"
                    // onChange={(newValue) => onChangeDate("birthday", newValue)}
                    className="w-full"
                    //   value={dayjs()}
                    views={["year", "month"]}
                    onChange={(newValue) => {
                      setSearch({
                        ...search,
                        month: newValue?.format("YYYY-MM") as string,
                      });
                    }}
                    // disabled={isDisabled}
                    slotProps={{
                      textField: {
                        error: false,
                        size: "small",
                      },
                      //   actionBar: {
                      //     actions: ["clear", "cancel", "accept"],
                      //   },
                    }}
                  />
                </div>
              </div>

              <div>
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
            </div>
          </AccordionCustom>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default PageLeaveHistory;
