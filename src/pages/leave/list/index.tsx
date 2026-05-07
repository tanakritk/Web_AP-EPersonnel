import _DropdownApi from "@/api/controller/dropdown";
import _LeaveApi, { LeaveModel } from "@/api/controller/leave";
import { BaseSearchModel, PaginationModel } from "@/api/interface";
import AccordionCustom from "@/components/Accordion-Custom";
import TableCustom, { Column } from "@/components/table-custom";
import { useLoading } from "@/context/loading-context";
import { getLoginStorage } from "@/helpers/set-storage";
import ContentLayout from "@/layout/content-layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { useAlert } from "@/context/alert-context";
import { ViewButton } from "@/components/icon-button";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import { useNavigate } from "react-router-dom";

const PageLeaveHistoryList = (): JSX.Element => {
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const navigate = useNavigate();
  const profile = getLoginStorage().profile;
  const [userSelect, setUserSelect] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationModel>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const columns: Column[] = [
    {
      field: "name",
      label: "ผู้ขอลา",
      bodyAlign: "center",
      width: "15%",
      render: (row: any) =>
        `${row.mas_user?.firstname} ${row.mas_user?.surname}`,
    },
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
      width: "20%",
    },
    {
      field: "mas_statusleave.name",
      label: "สถานะการลา",
      bodyAlign: "center",
      width: "15%",
      render: (row: any) => {
        return <Chip label={row?.mas_statusleave?.name} color="secondary" />;
      },
    },
    {
      field: "mas_statusleave.name",
      label: "สถานะการลา",
      bodyAlign: "center",
      width: "10%",
      render: (row: any) => {
        return <ViewButton onClick={() => onClickViewData(row)} />;
      },
    },
  ];

  const { data: ddl, isLoading: isLoadingDDL } = useQuery({
    queryKey: ["ddl", "approve-list", profile?.id],
    queryFn: async () => {
      const result = await _DropdownApi().user();
      return {
        user: result.data,
      };
    },
  });

  const { data: rowsData, isLoading: isLoadingRows } = useQuery({
    queryKey: [
      "leave-history-list-for-admin",
      pagination.page,
      userSelect,
      profile?.id,
    ],
    queryFn: async () => {
      const payload: BaseSearchModel = {
        page: pagination.page,
        limit: pagination.limit,
        filterOperator: "and",
        relation: ["mas_user", "mas_statusleave"],
        filter: userSelect
          ? [{ field: "mas_user.id", operator: "=", value: userSelect }]
          : [],
        sorting: [
          {
            field: "startDate",
            pattern: "DESC",
          },
        ],
      };
      return await _LeaveApi().search(payload);
    },
  });

  const onSearchUser = (event: any) => {
    setUserSelect(event.target.value);
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const onClickViewData = (row: any) => {
    const idData = encodeURIComponent(CryptoHelper.encrypt(row.id));
    navigate(`/leave-detail/view/${idData}`);
  };

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

  const onExportExcel = (rows: LeaveModel[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ข้อมูลการลา");
    for (let i = 65; i <= 71; i++) {
      const char = String.fromCharCode(i); //A-G
      fnBorderStyle(worksheet, char, "1");
      worksheet.getColumn(char).width = 20;
    }
    worksheet.getColumn("A").width = 10;
    worksheet.getColumn("F").width = 30;

    worksheet.getCell("A1").value = "ลำดับ";
    worksheet.getCell("B1").value = "ผู้ขอลา";
    worksheet.getCell("C1").value = "วันที่";
    worksheet.getCell("D1").value = "รูปแบบการลา";
    worksheet.getCell("E1").value = "ประเภทการลา";
    worksheet.getCell("F1").value = "เหตุผลการลา";
    worksheet.getCell("G1").value = "สถานะ";

    worksheet.getCell("A1").font = { bold: true };
    worksheet.getCell("B1").font = { bold: true };
    worksheet.getCell("C1").font = { bold: true };
    worksheet.getCell("D1").font = { bold: true };
    worksheet.getCell("E1").font = { bold: true };
    worksheet.getCell("F1").font = { bold: true };
    worksheet.getCell("G1").font = { bold: true };

    for (let i = 0; i < rows.length; i++) {
      const columnB =
        rows[i].mas_user?.firstname + " " + rows[i].mas_user?.surname;
      const columnC =
        rows[i].leaveFormat === "เต็มวัน"
          ? dayjs(rows[i].startDate).format("DD-MM-BB")
          : `${dayjs(rows[i].startDate).format("DD-MM-BB")}  -  ${dayjs(rows[i].endDate).format("DD-MM-BB")}`;
      const columnD = rows[i].leaveFormat;
      const columnE = rows[i].leaveType;
      const columnF = rows[i].reasonLeave;
      const columnG = rows[i].mas_statusleave?.name;

      worksheet.getCell(`A${i + 2}`).value = i + 1;
      worksheet.getCell(`B${i + 2}`).value = columnB;
      worksheet.getCell(`C${i + 2}`).value = columnC;
      worksheet.getCell(`D${i + 2}`).value = columnD;
      worksheet.getCell(`E${i + 2}`).value = columnE;
      worksheet.getCell(`F${i + 2}`).value = columnF;
      worksheet.getCell(`G${i + 2}`).value = columnG;
    }

    // -------------------------------- Steam file ---------------------------------------- //

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ข้อมูลการลา.xlsx`;
      a.click();
    });

    // setLoadingContext(false);
  };

  const onClickExport = async () => {
    const payload: BaseSearchModel = {
      page: pagination.page,
      limit: pagination.limit,
      filterOperator: "and",
      relation: ["mas_user", "mas_statusleave"],
      filter: userSelect
        ? [{ field: "mas_user.id", operator: "=", value: userSelect }]
        : [],
      sorting: [
        {
          field: "startDate",
          pattern: "DESC",
        },
      ],
    };
    try {
      setLoadingContext(true);
      const result = await _LeaveApi().search(payload);
      onExportExcel(result.data);
    } catch (error: any) {
      console.log(error);
      setAlertContext({
        type: "warning",
        message: error?.message,
      });
    } finally {
      setLoadingContext(false);
    }
  };

  const onClearSearch = () => {
    setUserSelect("");
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
                  รายการขอลา
                </Divider>
              </Box>
            }
          />

          <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
            <AccordionCustom title="รายการขอลา" defaultExpanded>
              <div className="my-6 space-y-6">
                <div className="flex basis-full flex-wrap items-end">
                  <div className="lg:basis-2/5 basis-full px-3 mb-3">
                    <p>ชื่อบุคลากร</p>
                    <Select
                      fullWidth
                      onChange={onSearchUser}
                      value={userSelect}
                    >
                      {ddl?.user?.map((item: any, index: number) => (
                        <MenuItem key={"ddluser" + index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
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

export default PageLeaveHistoryList;
