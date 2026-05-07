import AccordionCustom from "@/components/Accordion-Custom";
import ContentLayout from "@/layout/content-layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import _LeaveApi, { LeaveModel } from "@/api/controller/leave";
import { useNavigate, useParams } from "react-router-dom";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import FormLeave from "../leave-request/form-leave";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BaseSearchModel } from "@/api/interface";
import { useLoading } from "@/context/loading-context";
import TableHistoryApprove, {
  TableHistoryApproveRow,
} from "../leave-request/table-history-approve";
import dayjs from "dayjs";
import { omit } from "lodash";
import { getLoginStorage } from "@/helpers/set-storage";
import _DropdownApi, { DropdownModel } from "@/api/controller/dropdown";
import _LeaveApproveApi, {
  LeaveApproveModel,
} from "@/api/controller/leave-approve";
import { useAlert } from "@/context/alert-context";

const PageLeaveApprove = (): JSX.Element => {
  const params = useParams();
  const action = params?.action;
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const navigate = useNavigate();
  const profile = useMemo(() => getLoginStorage().profile, []);
  const queryClient = useQueryClient();
  const id = CryptoHelper.decrypt(params?.id as string);
  const [formRequest, setFormRequest] = useState<LeaveModel>({
    leaveType: "",
    reasonLeave: "",
    startDate: "",
    endDate: "",
    leaveFormat: "เต็มวัน",
    statusLeaveId: 1,
  });
  const [formApprove, setFormApprove] = useState<LeaveApproveModel>({
    note: "",
    statusLeaveId: null,
    userId: Number(profile?.id),
    leaveId: Number(id),
  });
  const [rowsApprove, setRowsApprove] = useState<TableHistoryApproveRow[]>([]);

  const { data: leaveData, isLoading: isLoadingLeaveData } = useQuery({
    queryKey: ["leave-approve", id],
    queryFn: async () => {
      const payload: BaseSearchModel = {
        page: 1,
        limit: 1,
        filterOperator: "and",
        relation: [
          "mas_statusleave",
          "trn_leaveapprove.mas_statusleave",
          "trn_leaveapprove.mas_user",
        ],
        filter: [{ field: "id", operator: "=", value: id }],
      };
      const result = await _LeaveApi().search(payload);
      return result.data[0] || null;
    },
    enabled: !!id,
  });

  const { data: ddl, isLoading: isLoadingDDL } = useQuery({
    queryKey: ["ddl", "approve-approve"],
    queryFn: async () => {
      const result = await _DropdownApi().statusLeave();
      return {
        statusLeave: result.data,
      };
    },
  });

  const { mutate: onActionApprove, isPending: isLoadingAction } = useMutation({
    mutationFn: async (payload: LeaveApproveModel) => {
      const result = await _LeaveApproveApi().create(payload);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-history-list"] });
      queryClient.invalidateQueries({ queryKey: ["leave-approve-list"] });
      queryClient.invalidateQueries({ queryKey: ["leave-request"] });

      navigate("/leave-approve-list");
    },
    onError: (err) => {
      setAlertContext({
        type: "warning",
        message: err.message,
      });
    },
    onSettled: () => {
      setLoadingContext(false);
    },
  });

  const onClickSave = () => {
    if (!formApprove.statusLeaveId) {
      setAlertContext({
        type: "warning",
        message: "กรุณาระบุสถานะ การรับทราบ / อนุมัติ",
      });
      return;
    }
    onActionApprove(formApprove);
  };

  useEffect(() => {
    if (leaveData) {
      const newForm = omit(leaveData, [
        "createdDate",
        "updatedDate",
        "deletedDate",
        "mas_statusleave",
        "trn_leaveapprove",
        "no",
      ]);
      const newData = {
        ...newForm,
        startDate: dayjs(leaveData.startDate).format("YYYY-MM-DD HH:mm:ss"),
        endDate: dayjs(leaveData.endDate).format("YYYY-MM-DD HH:mm:ss"),
        statusLeaveId: leaveData.mas_statusleave.id,
      };
      setFormRequest(newData);
      const listApprove: TableHistoryApproveRow[] =
        leaveData?.trn_leaveapprove.map(
          (item: any, index: number): TableHistoryApproveRow => {
            return {
              no: index + 1,
              name: item?.mas_user?.firstname + " " + item?.mas_user?.surname,
              position: item?.mas_user?.position,
              status: item?.mas_statusleave?.name,
              note: item?.note,
              date: item?.createdDate,
            };
          },
        );
      setRowsApprove(listApprove);
    }
  }, [leaveData]);

  const ddlStatusLeave = useMemo(() => {
    if (!ddl?.statusLeave) return [];

    const { position, headWorkDepartment, deputyDirector } = profile || {};

    const statusMap: Record<string, number[]> = {
      หัวหน้าฝ่ายงาน:
        headWorkDepartment === "กลุ่มงานบริหารงานบุคคล" ? [2, 3] : [],
      รองผู้อำนวยการ: deputyDirector === "กลุ่มงานบริหารงานบุคคล" ? [4, 5] : [],
      ผู้อำนวยการ: [6, 7],
    };

    const allowedStatusIds = statusMap[position as string] || [];
    return ddl.statusLeave.filter((item: any) =>
      allowedStatusIds.includes(item.value),
    );
  }, [ddl, profile]);

  useEffect(() => {
    const finalLoading = isLoadingLeaveData || isLoadingDDL || isLoadingAction;
    setLoadingContext(finalLoading);
  }, [setLoadingContext, isLoadingLeaveData, isLoadingDDL, isLoadingAction]);
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
                อนุมัติการลา
              </Divider>
            </Box>
          }
        />

        <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
          <AccordionCustom title="ขอลางาน" defaultExpanded>
            <FormLeave
              form={formRequest}
              returnForm={setFormRequest}
              isDisabled={true}
              action="view"
            />
          </AccordionCustom>

          <AccordionCustom title="ประวัติการอนุมัติ" defaultExpanded>
            <TableHistoryApprove rows={rowsApprove} />
          </AccordionCustom>

          {action === "approve" && (
            <>
              <AccordionCustom title="ฟอร์มอนุมัติ" defaultExpanded>
                <div className="my-6 space-y-6">
                  <div className="flex flex-wrap">
                    <div className="basis-full px-3 mb-3">
                      <p>หมายเหตุ</p>
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        name="note"
                        value={formApprove.note}
                        onChange={(e) =>
                          setFormApprove({
                            ...formApprove,
                            note: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="basis-full px-3">
                      <RadioGroup
                        value={formApprove.statusLeaveId}
                        onChange={(e) =>
                          setFormApprove({
                            ...formApprove,
                            statusLeaveId: Number(e.target.value),
                          })
                        }
                      >
                        {ddlStatusLeave?.map(
                          (item: DropdownModel, index: number) => (
                            <FormControlLabel
                              key={"radio-status-leave" + index}
                              value={item.value}
                              control={<Radio />}
                              label={item.label}
                            />
                          ),
                        )}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </AccordionCustom>
              <div
                className="flex justify-end space-x-3"
                style={{ marginTop: "60px" }}
              >
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  ย้อนกลับ
                </Button>
                <Button variant="contained" onClick={onClickSave}>
                  บันทึกข้อมูล
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default PageLeaveApprove;
