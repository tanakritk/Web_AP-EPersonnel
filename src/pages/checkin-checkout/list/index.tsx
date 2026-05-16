import _AttendenceApi, { AttendenceModel } from "@/api/controller/attendence";
import _DropdownApi, { DropdownModel } from "@/api/controller/dropdown";
import {
  BaseSearchModel,
  FilterOption,
  PaginationModel,
} from "@/api/interface";
import AccordionCustom from "@/components/Accordion-Custom";
import TableCustom, { Column } from "@/components/table-custom";
import { useAlert } from "@/context/alert-context";
import { useLoading } from "@/context/loading-context";
import ContentLayout from "@/layout/content-layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";

const PageCheckInCheckOutList = (): JSX.Element => {
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const [search, setSearch] = useState({
    userId: "",
    searchType: "monthly",
    date: dayjs().format("YYYY-MM-DD"),
    month: dayjs().format("YYYY-MM"),
  });
  const [pagination, setPagination] = useState<PaginationModel>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const columns: Column[] = [
    {
      field: "No1",
      label: "วันที่",
      bodyAlign: "center",
      width: "10%",
      render: (row: AttendenceModel) =>
        dayjs(row.attendanceDate).format("DD/MM/BBBB"),
    },
    {
      field: "name",
      label: "ชื่อ-สกุล",
      bodyAlign: "center",
      width: "25%",
      render: (row: AttendenceModel) =>
        row.mas_user?.firstname + " " + row.mas_user?.surname,
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
      width: "10%",
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
    queryKey: ["attendance-history-list2", pagination.page, search],
    queryFn: async () => {
      let filter: FilterOption[] = [];
      if (search.userId) {
        filter.push({
          field: "mas_user.id",
          operator: "=",
          value: search.userId,
        });
      }
      if (search.searchType === "daily" && search.date) {
        const dateStr = dayjs(search.date).format("YYYY-MM-DD");
        filter.push({
          field: "attendanceDate",
          operator: "between",
          value: [dateStr, dateStr],
        });
      } else if (search.searchType === "monthly" && search.month) {
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
        relation: ["mas_user"],
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

  const fnBorderStyle = (worksheet: any, col: string, row: string) => {
    worksheet.getCell(`${col}${row}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getRow(row).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    // worksheet.getRow(row).height = 30;
  };

  const onExportExcel = (rows: AttendenceModel[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ข้อมูลการบันทึกเวลา");
    for (let i = 65; i <= 70; i++) {
      const char = String.fromCharCode(i); //A-F
      fnBorderStyle(worksheet, char, "1");
      worksheet.getColumn(char).width = 20;
    }
    worksheet.getColumn("A").width = 10;

    worksheet.getCell("A1").value = "ลำดับ";
    worksheet.getCell("B1").value = "วันที่";
    worksheet.getCell("C1").value = "ชื่อ-สกุล";
    worksheet.getCell("D1").value = "เวลาเข้างาน";
    worksheet.getCell("E1").value = "เวลาออกงาน";
    worksheet.getCell("F1").value = "สถานะ";

    worksheet.getCell("A1").font = { bold: true };
    worksheet.getCell("B1").font = { bold: true };
    worksheet.getCell("C1").font = { bold: true };
    worksheet.getCell("D1").font = { bold: true };
    worksheet.getCell("E1").font = { bold: true };
    worksheet.getCell("F1").font = { bold: true };

    for (let i = 0; i < rows.length; i++) {
      const columnB = rows[i].attendanceDate
        ? dayjs(rows[i].attendanceDate).format("DD-MM-BB")
        : "";
      const columnC =
        rows[i].mas_user?.firstname + " " + rows[i].mas_user?.surname;
      const columnD = rows[i].checkInTime
        ? dayjs(rows[i].checkInTime).format("HH:mm")
        : "";
      const columnE = rows[i].checkOutTime
        ? dayjs(rows[i].checkOutTime).format("HH:mm")
        : "";

      worksheet.getCell(`A${i + 2}`).value = i + 1;
      worksheet.getCell(`B${i + 2}`).value = columnB;
      worksheet.getCell(`C${i + 2}`).value = columnC;
      worksheet.getCell(`D${i + 2}`).value = columnD;
      worksheet.getCell(`E${i + 2}`).value = columnE;
      worksheet.getCell(`F${i + 2}`).value = rows[i].status;
    }

    // -------------------------------- Steam file ---------------------------------------- //

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ข้อมูลการบันทึกเวลา.xlsx`;
      a.click();
    });

    // setLoadingContext(false);
  };

  const onClickExport = async () => {
    if (search.searchType === "daily" && !search.date) {
      setAlertContext({
        type: "warning",
        message: "กรุณาเลือกวันที่",
      });
      return;
    }
    if (search.searchType === "monthly" && !search.month) {
      setAlertContext({
        type: "warning",
        message: "กรุณาเลือกเดือน",
      });
      return;
    }

    let filter: FilterOption[] = [];
    if (search.userId) {
      filter.push({
        field: "mas_user.id",
        operator: "=",
        value: search.userId,
      });
    }
    if (search.searchType === "daily" && search.date) {
      const dateStr = dayjs(search.date).format("YYYY-MM-DD");
      filter.push({
        field: "attendanceDate",
        operator: "between",
        value: [dateStr, dateStr],
      });
    } else if (search.searchType === "monthly" && search.month) {
      const start = dayjs(search.month).startOf("month").format("YYYY-MM-DD");
      const end = dayjs(search.month).endOf("month").format("YYYY-MM-DD");
      filter.push({
        field: "attendanceDate",
        operator: "between",
        value: [start, end],
      });
    }

    const payload: BaseSearchModel = {
      page: 1,
      limit: 10000,
      filterOperator: "and",
      relation: ["mas_user"],
      filter: filter,
      sorting: [
        {
          field: "attendanceDate",
          pattern: "DESC",
        },
      ],
    };
    try {
      setLoadingContext(true);
      const result = await _AttendenceApi().search(payload);
      onExportExcel(result.data);
    } catch (error: any) {
      console.error(error);
      setAlertContext({
        type: "warning",
        message: error.message,
      });
    } finally {
      setLoadingContext(false);
    }
  };

  const onClearSearch = () => {
    setSearch({
      userId: "",
      searchType: "monthly",
      date: dayjs().format("YYYY-MM-DD"),
      month: dayjs().format("YYYY-MM"),
    });
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  useEffect(() => {
    const isAnyLoading = isLoadingRows || isLoadingDDL;
    setLoadingContext(isAnyLoading);
  }, [setLoadingContext, isLoadingRows, isLoadingDDL]);
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
                  ประวัติการบันทึกเวลา เข้างาน-ออกงาน
                </Divider>
              </Box>
            }
          />

          <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
            <AccordionCustom
              title="ประวัติการบันทึกเวลา เข้างาน-ออกงาน"
              defaultExpanded
            >
              <div className="my-6 space-y-6">
                <div className="flex basis-full flex-wrap items-end">
                  <div className="lg:basis-2/5 basis-full px-3 mb-3">
                    <p>ชื่อบุคลากร</p>
                    <Select
                      fullWidth
                      value={search.userId}
                      onChange={(e) => {
                        setSearch({
                          ...search,
                          userId: e.target.value,
                        });
                      }}
                    >
                      {ddl?.user?.map((item: DropdownModel, index: number) => (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div className="lg:basis-1/5 basis-full px-3 mb-3">
                    <p>ประเภทการค้นหา</p>
                    <Select
                      fullWidth
                      size="small"
                      value={search.searchType}
                      onChange={(e) => {
                        setSearch({
                          ...search,
                          searchType: e.target.value as string,
                        });
                      }}
                    >
                      <MenuItem value="daily">รายวัน</MenuItem>
                      <MenuItem value="monthly">รายเดือน</MenuItem>
                    </Select>
                  </div>
                  <div className="lg:basis-1/5 basis-full px-3 mb-3">
                    <p>{search.searchType === "daily" ? "วันที่" : "เดือน"}</p>
                    <DatePicker
                      className="w-full"
                      value={
                        search.searchType === "daily"
                          ? dayjs(search.date)
                          : dayjs(search.month)
                      }
                      views={
                        search.searchType === "daily"
                          ? ["year", "month", "day"]
                          : ["year", "month"]
                      }
                      format={
                        search.searchType === "daily" ? "DD/MM/YYYY" : "MM/YYYY"
                      }
                      onChange={(newValue) => {
                        if (search.searchType === "daily") {
                          setSearch({
                            ...search,
                            date: newValue?.format("YYYY-MM-DD") as string,
                          });
                        } else {
                          setSearch({
                            ...search,
                            month: newValue?.format("YYYY-MM") as string,
                          });
                        }
                      }}
                      slotProps={{
                        textField: {
                          error: false,
                          size: "small",
                        },
                      }}
                    />
                  </div>

                  {/* <div className="lg:basis-2/5 basis-full px-3 mb-3">
                    <Button variant="outlined" onClick={onClearSearch}>
                      ล้าง
                    </Button>
                  </div> */}
                  <div className="lg:basis-2/5 basis-full px-3 mb-3 flex flex-wrap ">
                    <div className="w-1/2 lg:w-1/4 px-1">
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClearSearch}
                      >
                        ล้าง
                      </Button>
                    </div>
                    <div className="w-1/2 lg:w-1/4 px-1">
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={onClickExport}
                      >
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
                {/* <div className="lg:basis-1/5 basis-full px-3 mb-3">
                    <p>เดือน</p>
                    <DateTimePicker
                      // disablePast
                      name="month"
                      // onChange={(newValue) => onChangeDate("birthday", newValue)}
                      className="w-full"
                      //   value={dayjs()}
                      views={["year", "month"]}
                      //   onChange={(newValue) =>
                      //     onChangeDate("DateExpireCard", newValue)
                      //   }
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
                  </div> */}

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

export default PageCheckInCheckOutList;
