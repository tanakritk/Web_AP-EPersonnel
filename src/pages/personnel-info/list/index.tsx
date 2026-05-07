import _DropdownApi from "@/api/controller/dropdown";
import _MasterUserApi, { MasterUserModel } from "@/api/controller/master-user";
import { BaseSearchModel, PaginationModel } from "@/api/interface";
import AccordionCustom from "@/components/Accordion-Custom";
import { EditButton, ResetButton } from "@/components/icon-button";
import TableCustom, { Column } from "@/components/table-custom";
import { useAlert } from "@/context/alert-context";
import { useLoading } from "@/context/loading-context";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import ContentLayout from "@/layout/content-layout";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
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
  Switch,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import dayjs from "dayjs";

const PagePersonnelList = (): JSX.Element => {
  const navigate = useNavigate();
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const queryClient = useQueryClient();
  const [userSelect, setUserSelect] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationModel>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const columns: Column[] = [
    {
      field: "no",
      label: "ลำดับ",
      bodyAlign: "center",
      width: "5%",
      render: (row: any) => {
        return (
          <div className="flex items-center justify-center space-x-3">
            {!row.isRefactorPassword && (
              <VpnKeyIcon color="warning" fontSize="small" />
            )}
            <span>{row.id}</span>
          </div>
        );
      },
    },
    {
      field: "name",
      label: "ชื่อ-สกุล",
      bodyAlign: "left",
      width: "45%",
      render: (row: any) =>
        `${row.title ? row.title : ""} ${row.firstname ? row.firstname : ""} ${row.surname ? row.surname : ""}`,
    },
    {
      field: "position",
      label: "ตำแหน่งงานปัจจุบัน",
      bodyAlign: "left",
      width: "25%",
    },
    {
      field: "สถานะ",
      label: "สถานะ",
      bodyAlign: "center",
      width: "10%",
      render: (row: any) => {
        return (
          <Switch
            color="primary"
            checked={row.isActive}
            onChange={() => onChangeActive(row)}
          />
        );
        // return <Chip sx={{ backgroundColor: "#04d63271" }} label="Active" />;
      },
    },
    {
      field: "xx",
      label: "",
      bodyAlign: "center",
      width: "10%",
      render: (row: any) => {
        return (
          <div className="flex justify-center">
            <ResetButton onClick={() => onResetPassword(row)} />
            <EditButton onClick={() => onClickEditData(row)} />
            {/* <DeleteButton /> */}
          </div>
        );
      },
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
    queryKey: ["personnel-list", pagination.page, userSelect],
    queryFn: async () => {
      const payload: BaseSearchModel = {
        page: pagination.page,
        limit: pagination.limit,
        filterOperator: "and",
        // relation: ["child", "mate"],
        filter: userSelect
          ? [{ field: "id", operator: "=", value: userSelect }] // หรือ field ที่คุณต้องการเช็ค
          : [],
        sorting: [
          {
            field: "id",
            pattern: "ASC",
          },
        ],
      };
      return await _MasterUserApi().search(payload);
    },
  });

  const { mutate: actionChangeActive, isPending: isLoadingActionChangeActive } =
    useMutation({
      mutationFn: async ({
        id,
        payload,
      }: {
        id: number;
        payload: MasterUserModel;
      }) => {
        return await _MasterUserApi().update(id, payload);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["personnel-list"] });
        setAlertContext({ type: "success", message: "เปลี่ยนสถานะสําเร็จ" });
      },
      onError: (error) => {
        console.log("error--> ", error);
        setAlertContext({ type: "warning", message: error.message });
      },
      onSettled: () => {
        setLoadingContext(false);
      },
    });

  const {
    mutate: actionResetPassword,
    isPending: isLoadingActionResetPassword,
  } = useMutation({
    mutationFn: async (id: number) => {
      return await _MasterUserApi().resetPassword(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel-list"] });
      setAlertContext({ type: "success", message: "รีเซ็ตรหัสผ่านสําเร็จ" });
    },
    onError: (error) => {
      setAlertContext({ type: "warning", message: error.message });
    },
    onSettled: () => {
      setLoadingContext(false);
    },
  });

  const onClickAddData = () => {
    navigate(`/personnel-admin/create`);
  };

  const onClickEditData = (row: any) => {
    const idData = encodeURIComponent(CryptoHelper.encrypt(String(row.id)));
    navigate(`/personnel-admin/edit/${idData}`);
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

  const onExportExcel = (rows: MasterUserModel[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ข้อมูลบุคลากร");
    for (let i = 65; i <= 83; i++) {
      const char = String.fromCharCode(i); //A-S
      fnBorderStyle(worksheet, char, "1");
      worksheet.getColumn(char).width = 20;
    }
    worksheet.getColumn("A").width = 10;

    worksheet.getCell("A1").value = "ลำดับ";
    worksheet.getCell("B1").value = "คำนำหน้าชื่อ";
    worksheet.getCell("C1").value = "ชื่อ-สกุล";
    worksheet.getCell("D1").value = "เพศ";
    worksheet.getCell("E1").value = "วัน/เดือน/ปีเกิด";
    worksheet.getCell("F1").value = "เลขที่บัตรประชาชน";
    worksheet.getCell("G1").value = "ที่อยู่";
    worksheet.getCell("H1").value = "เบอร์โทรศัพท์";
    worksheet.getCell("I1").value = "สัญชาติ";
    worksheet.getCell("J1").value = "เชื้อชาติ";
    worksheet.getCell("K1").value = "สถานะ";
    worksheet.getCell("L1").value = "หมู่เลือด";
    worksheet.getCell("M1").value = "ตำแหน่งการทำงาน";
    worksheet.getCell("N1").value = "ตำแหน่งงานปัจจุบัน";
    worksheet.getCell("O1").value = "วิชาที่สอน";
    worksheet.getCell("P1").value = "สอนช่วงชั้น";
    worksheet.getCell("Q1").value = "เลขที่ใบประกอบวิชาชีพ";
    worksheet.getCell("R1").value = "วันหมดอายุ";
    worksheet.getCell("S1").value = "อายุราชการ";

    worksheet.getCell("A1").font = { bold: true };
    worksheet.getCell("B1").font = { bold: true };
    worksheet.getCell("C1").font = { bold: true };
    worksheet.getCell("D1").font = { bold: true };
    worksheet.getCell("E1").font = { bold: true };
    worksheet.getCell("F1").font = { bold: true };
    worksheet.getCell("G1").font = { bold: true };
    worksheet.getCell("H1").font = { bold: true };
    worksheet.getCell("I1").font = { bold: true };
    worksheet.getCell("J1").font = { bold: true };
    worksheet.getCell("K1").font = { bold: true };
    worksheet.getCell("L1").font = { bold: true };
    worksheet.getCell("M1").font = { bold: true };
    worksheet.getCell("N1").font = { bold: true };
    worksheet.getCell("O1").font = { bold: true };
    worksheet.getCell("P1").font = { bold: true };
    worksheet.getCell("Q1").font = { bold: true };
    worksheet.getCell("R1").font = { bold: true };
    worksheet.getCell("S1").font = { bold: true };

    for (let i = 0; i < rows.length; i++) {
      const columnE = rows[i].birthday
        ? dayjs(rows[i].birthday).format("DD-MM-BB")
        : "";
      const columnR = rows[i].professionalLicenseEndDate
        ? dayjs(rows[i].professionalLicenseEndDate).format("DD-MM-BB")
        : "";
      worksheet.getCell(`A${i + 2}`).value = i + 1;
      worksheet.getCell(`B${i + 2}`).value = rows[i].title;
      worksheet.getCell(`C${i + 2}`).value =
        `${rows[i].firstname} ${rows[i].surname}`;
      worksheet.getCell(`D${i + 2}`).value = rows[i].sex;
      worksheet.getCell(`E${i + 2}`).value = columnE;
      worksheet.getCell(`F${i + 2}`).value = rows[i].idCardNumber;
      worksheet.getCell(`G${i + 2}`).value = rows[i].address;
      worksheet.getCell(`H${i + 2}`).value = rows[i].phone;
      worksheet.getCell(`I${i + 2}`).value = rows[i].nationality;
      worksheet.getCell(`J${i + 2}`).value = rows[i].ethnicity;
      worksheet.getCell(`K${i + 2}`).value = rows[i].statusUser;
      worksheet.getCell(`L${i + 2}`).value = rows[i].bloodGroup;
      worksheet.getCell(`M${i + 2}`).value = rows[i].position;
      worksheet.getCell(`N${i + 2}`).value = rows[i].statusWork;
      worksheet.getCell(`O${i + 2}`).value = rows[i].subjects;
      worksheet.getCell(`P${i + 2}`).value = rows[i].class;
      worksheet.getCell(`Q${i + 2}`).value = rows[i].professionalLicenseNo;
      worksheet.getCell(`R${i + 2}`).value = columnR;
      worksheet.getCell(`S${i + 2}`).value = rows[i].yearService;
    }

    // -------------------------------- Steam file ---------------------------------------- //

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ข้อมูลบุคลากร.xlsx`;
      a.click();
    });

    // setLoadingContext(false);
  };

  const onClickExport = async () => {
    const payload: BaseSearchModel = {
      page: 1,
      limit: 10000,
      filterOperator: "and",
      // relation: ["child", "mate"],
      filter: userSelect
        ? [{ field: "id", operator: "=", value: userSelect }] // หรือ field ที่คุณต้องการเช็ค
        : [],
      sorting: [
        {
          field: "id",
          pattern: "ASC",
        },
      ],
    };
    try {
      setLoadingContext(true);
      const rows = await _MasterUserApi().search(payload);
      onExportExcel(rows.data);
    } catch (error: any) {
      console.log("error--> ", error);
      setAlertContext({ type: "warning", message: error.message });
    } finally {
      setLoadingContext(false);
    }
  };

  const onSearchUser = (event: any) => {
    setUserSelect(event.target.value);
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const onClearSearch = () => {
    setUserSelect("");
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const onChangeActive = (row: any) => {
    const payload: MasterUserModel = {
      isActive: !row.isActive,
    };
    actionChangeActive({ id: row.id, payload: payload });
  };

  const onResetPassword = (row: any) => {
    actionResetPassword(row.id);
  };

  useEffect(() => {
    const isAnyLoading =
      isLoadingRows ||
      isLoadingDDL ||
      isLoadingActionChangeActive ||
      isLoadingActionResetPassword;
    setLoadingContext(isAnyLoading);
  }, [
    setLoadingContext,
    isLoadingRows,
    isLoadingDDL,
    isLoadingActionChangeActive,
    isLoadingActionResetPassword,
  ]);
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
                  รายชื่อบุคลากร
                </Divider>
              </Box>
            }
          />

          <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
            <AccordionCustom title="รายชื่อบุคลากร" defaultExpanded>
              <div className="my-6 space-y-6">
                <div className="flex flex-wrap items-end w-full">
                  <div className="lg:basis-1/5 basis-full px-3 mb-3">
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

                  <div className="lg:basis-2/5 basis-full px-3 mb-3 flex flex-wrap flex-1">
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

                  <div className="lg:basis-1/5 basis-full px-3 mb-3 flex justify-end">
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={onClickAddData}
                    >
                      เพิ่มข้อมูล
                    </Button>
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

export default PagePersonnelList;
