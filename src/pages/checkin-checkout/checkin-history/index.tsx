import _AttendenceApi, { AttendenceModel } from "@/api/controller/attendence";
import _DropdownApi, { DropdownModel } from "@/api/controller/dropdown";
import {
  BaseSearchModel,
  FilterOption,
  PaginationModel,
} from "@/api/interface";
import AccordionCustom from "@/components/Accordion-Custom";
import TableCustom, { Column } from "@/components/table-custom";
import { useLoading } from "@/context/loading-context";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import ContentLayout from "@/layout/content-layout";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PageCheckInCheckOutHistory = (): JSX.Element => {
  const params = useParams();
  const id = decodeURIComponent(CryptoHelper.decrypt(params.id || ""));
  const { setLoadingContext } = useLoading();
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
      field: "No1",
      label: "วันที่",
      bodyAlign: "center",
      width: "25%",
      render: (row: AttendenceModel) =>
        dayjs(row.attendanceDate).format("DD/MM/BBBB"),
    },
    {
      field: "No2",
      label: "เวลาเข้างาน",
      bodyAlign: "center",
      width: "25%",
      render: (row: AttendenceModel) =>
        row.checkInTime ? dayjs(row.checkInTime).format("HH:mm") : "",
    },
    {
      field: "No3",
      label: "เวลาออกงาน",
      bodyAlign: "center",
      width: "25%",
      render: (row: AttendenceModel) =>
        row.checkOutTime ? dayjs(row.checkOutTime).format("HH:mm") : "",
    },
    {
      field: "สถานะ",
      label: "สถานะ",
      bodyAlign: "center",
      width: "25%",
      render: (row: AttendenceModel) => row.status || "",
    },
  ];

  const { data: ddl, isLoading: isLoadingDDL } = useQuery({
    queryKey: ["ddl", "personnel-list"],
    queryFn: async () => {
      const result = await _DropdownApi().user();
      return {
        user: result.data,
      };
    },
  });

  const { data: rowsData, isLoading: isLoadingRows } = useQuery({
    queryKey: ["attendance-history-list", pagination.page, search],
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
          field: "attendanceDate",
          operator: "between",
          value: [start, end],
        });
      }

      const payload: BaseSearchModel = {
        page: pagination.page,
        limit: pagination.limit,
        filterOperator: "and",
        // relation: ["child", "mate"],
        filter: filter,
        sorting: [
          {
            field: "attendanceDate",
            pattern: "DESC",
          },
        ],
      };
      return await _AttendenceApi().search(payload);
    },
  });

  useEffect(() => {
    const finalLoading = isLoadingDDL || isLoadingRows;
    setLoadingContext(finalLoading);
  }, [setLoadingContext, isLoadingDDL, isLoadingRows]);

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
                      borderColor: "primary.main", // กำหนดสีเส้น (ชมพู) เฉพาะที่เส้นก่อนและหลังตัวหนังสือ
                    },
                  }}
                >
                  ประวัติการลงชื่อเข้างาน - ออกงาน
                </Divider>
              </Box>
            }
          />

          <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
            <AccordionCustom
              title="ประวัติการลงชื่อเข้างาน - ออกงาน"
              defaultExpanded
            >
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
                    rows={rowsData?.data || []}
                    columns={columns}
                    px={false}
                    border
                  />

                  <div className="flex justify-end mt-6">
                    <Pagination
                      page={pagination.page}
                      count={rowsData?.paginationData.totalPages || 0}
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
    </>
  );
};

export default PageCheckInCheckOutHistory;
