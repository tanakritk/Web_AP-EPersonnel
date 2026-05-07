import _DropdownApi from "@/api/controller/dropdown";
import _LeaveApi, { LeaveModel } from "@/api/controller/leave";
import {
  BaseSearchModel,
  FilterOption,
  PaginationModel,
} from "@/api/interface";
import AccordionCustom from "@/components/Accordion-Custom";
import { ApproveButton } from "@/components/icon-button";
import TableCustom, { Column } from "@/components/table-custom";
import { useLoading } from "@/context/loading-context";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
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
import { useNavigate } from "react-router-dom";

const PageLeaveApproveList = (): JSX.Element => {
  const navigate = useNavigate();
  const { setLoadingContext } = useLoading();
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
      field: "action",
      label: "",
      bodyAlign: "center",
      width: "10%",
      render: (row: any) => {
        return (
          <div className="flex justify-center">
            <ApproveButton onClick={() => onClickApprove(row)} />
            {/* <DeleteButton />; */}
          </div>
        );
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
    queryKey: ["leave-approve-list", pagination.page, userSelect, profile?.id],
    queryFn: async () => {
      let statusLeave = null;
      if (
        profile?.position === "หัวหน้าฝ่ายงาน" &&
        profile?.headWorkDepartment === "กลุ่มงานบริหารงานบุคคล"
      ) {
        statusLeave = 1; // ขอลา
      } else if (
        profile?.position === "รองผู้อำนวยการ" &&
        profile?.deputyDirector === "กลุ่มงานบริหารงานบุคคล"
      ) {
        statusLeave = 2; // หัวหน้าฝ่ายบุคคลรับทราบ
      } else if (profile?.position === "ผู้อำนวยการ") {
        statusLeave = 4; // รองผู้อำนวยการฝ่ายบุคคลเห็นควรอนุญาต
      } else {
        statusLeave = 0; // ไม่พบข้อมูล
      }
      const filterStatusLeave: FilterOption = {
        field: "mas_statusleave.id",
        operator: "=",
        value: statusLeave,
      };
      const payload: BaseSearchModel = {
        page: pagination.page,
        limit: pagination.limit,
        filterOperator: "and",
        relation: ["mas_user", "mas_statusleave"],
        filter: userSelect
          ? [
              { field: "mas_user.id", operator: "=", value: userSelect },
              { ...filterStatusLeave },
            ]
          : [{ ...filterStatusLeave }],
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

  const onClickApprove = (row: any) => {
    console.log("row--> ", row);
    const idData = encodeURIComponent(CryptoHelper.encrypt(row.id));
    navigate(`/leave-approve/approve/${idData}`);
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
                <div className="flex flex-wrap justify-between">
                  <div className="flex basis-full lg:basis-1/2 items-end">
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
                    <div className="lg:basis-2/5 basis-full px-3 mb-3">
                      <Button variant="outlined" onClick={onClearSearch}>
                        ล้าง
                      </Button>
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

export default PageLeaveApproveList;
