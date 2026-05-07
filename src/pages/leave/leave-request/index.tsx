import AccordionCustom from "@/components/Accordion-Custom";
import ContentLayout from "@/layout/content-layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import FormLeave from "./form-leave";
import { useEffect, useState } from "react";
import _LeaveApi, { LeaveModel } from "@/api/controller/leave";
import { useLoading } from "@/context/loading-context";
import { useAlert } from "@/context/alert-context";
import { getLoginStorage } from "@/helpers/set-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import { useQuery } from "@tanstack/react-query";
import { BaseSearchModel } from "@/api/interface";
import { omit } from "lodash";
import dayjs from "dayjs";
import TableHistoryApprove, {
  TableHistoryApproveRow,
} from "./table-history-approve";

const PageLeaveRequest = (): JSX.Element => {
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const navigate = useNavigate();
  const params = useParams();
  const id = CryptoHelper.decrypt(params?.id as string);
  const action = params?.action;
  const queryClient = useQueryClient();
  const profile = getLoginStorage().profile;
  const [rowsApprove, setRowsApprove] = useState<TableHistoryApproveRow[]>([]);
  const [formRequest, setFormRequest] = useState<LeaveModel>({
    leaveType: "",
    reasonLeave: "",
    startDate: "",
    endDate: "",
    leaveFormat: "เต็มวัน",
    statusLeaveId: 1,
  });

  const {
    data: leaveData,
    isLoading: isLoadingLeaveData,
    // refetch: refetchLeaveData,
  } = useQuery({
    queryKey: ["leave-request", id],
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
      console.log("***");
      const result = await _LeaveApi().search(payload);
      return result.data[0] || null;
    },
    enabled: !!id && (action === "edit" || action === "view"),
  });

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
      // if( leaveData?.mas_statusleave > 1 ){
      //   let rowsApproveData = []
      //   if( leaveData?.leaderApprove ){
      //     rowsApproveData.push({
      //       no: 1,
      //       // name: leaveData?.leaderApprove.name,
      //       position: "หัวหน้าฝ่ายงานกลุ่มบริหารงานบุคคล",
      //       note: leaveData?.leaderReason,
      //     })
      //   }
      // }
    }
  }, [leaveData]);

  const { mutate: onAction, isPending: isLoadingAction } = useMutation({
    mutationFn: async (payload: LeaveModel) => {
      if (action === "edit" && id) {
        return await _LeaveApi().update(Number(id), payload);
      } else {
        return await _LeaveApi().create(payload);
      }
    },
    onSuccess: () => {
      const alertMessage =
        action === "create" ? "บันทึกข้อมูลสำเร็จ" : "แก้ไขข้อมูลสำเร็จ";
      setAlertContext({
        type: "success",
        message: alertMessage,
      });
      queryClient.invalidateQueries({ queryKey: ["leave-history-list"] });
      queryClient.invalidateQueries({ queryKey: ["leave-approve-list"] });
      queryClient.invalidateQueries({ queryKey: ["leave-request"] });
      queryClient.invalidateQueries({
        queryKey: ["leave-history-list-for-admin"],
      });
      navigate(
        "/leave-history/" +
          encodeURIComponent(CryptoHelper.encrypt(profile?.id)),
      );
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

  const fnValidate = () => {
    let err = "";
    if (formRequest.leaveType === "") err += "กรุณาระบุประเภทการลา\n";
    if (formRequest.leaveFormat === "") err += "กรุณาระบุรูปแบบการลา\n";
    if (formRequest.reasonLeave === "") err += "กรุณาระบุเหตุผลการลา\n";
    if (formRequest.startDate === "") err += "กรุณาระบุวันเริ่มลา\n";
    if (formRequest.endDate === "") err += "กรุณาระบุวันสิ้นสุดการลา\n";
    return err;
  };

  const onClickSave = () => {
    const err = fnValidate();
    if (err !== "") {
      setAlertContext({
        type: "warning",
        message: err,
      });
      return;
    }

    const payload = {
      ...formRequest,
      userId: profile?.id,
    };
    if (action === "edit" && id) {
      delete payload.id; // Usually ID is in the URL, not body for update
    }
    return onAction(payload);
  };

  useEffect(() => {
    const finalLoading = isLoadingAction || isLoadingLeaveData;
    setLoadingContext(finalLoading);
  }, [setLoadingContext, isLoadingAction, isLoadingLeaveData]);

  useEffect(() => {
    if (action === "create") {
      // refetchLeaveData();
      setFormRequest({
        leaveType: "",
        reasonLeave: "",
        startDate: "",
        endDate: "",
        leaveFormat: "เต็มวัน",
        statusLeaveId: 1,
      });
    }
  }, [action]);
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
                ขอลางาน
                {action === "edit"
                  ? "(แก้ไข)"
                  : action === "view"
                    ? "(ดู)"
                    : ""}
              </Divider>
            </Box>
          }
        />

        <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
          <AccordionCustom title="ขอลางาน" defaultExpanded>
            <FormLeave
              form={formRequest}
              returnForm={setFormRequest}
              isDisabled={action === "view"}
              action={action as "create" | "edit" | "view"}
            />
          </AccordionCustom>

          {leaveData?.mas_statusleave.id > 1 && action !== "create" && (
            <AccordionCustom title="ประวัติการอนุมัติ" defaultExpanded>
              <TableHistoryApprove rows={rowsApprove} />
            </AccordionCustom>
          )}

          <div
            className="flex justify-end space-x-3"
            style={{ marginTop: "60px" }}
          >
            {action !== "create" && (
              <Button variant="outlined" onClick={() => navigate(-1)}>
                ย้อนกลับ
              </Button>
            )}
            {action !== "view" && (
              <Button variant="contained" onClick={onClickSave}>
                บันทึกข้อมูล
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default PageLeaveRequest;
