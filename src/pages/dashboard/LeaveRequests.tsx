import React from "react";
import { Chip, Divider } from "@mui/material";
import dayjs from "dayjs";
import { LeaveModel } from "@/api/controller/leave";

interface LeaveRequestsProps {
  leaveRequests: LeaveModel[];
}

export const LeaveRequests: React.FC<LeaveRequestsProps> = ({
  leaveRequests,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full flex flex-col border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        คำขอการลาล่าสุด (Leave Requests)
      </h3>

      {leaveRequests.length > 0 ? (
        <div className="flex flex-col">
          {leaveRequests.map((leave, index) => (
            <div key={leave.id || index}>
              <div className="flex justify-between items-center py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-base">
                    {leave.mas_user?.firstname} {leave.mas_user?.surname}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    เหตุผล: {leave.reasonLeave || "ไม่ระบุ"} |{" "}
                    {dayjs(leave.startDate).format("DD/MM/YYYY")} -{" "}
                    {dayjs(leave.endDate).format("DD/MM/YYYY")}
                  </span>
                </div>
                <Chip
                  label={leave.mas_statusleave?.name}
                  // color={}
                  size="small"
                  className="font-semibold"
                />
              </div>
              {index < leaveRequests.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 flex justify-center items-center h-full">
          <span className="text-gray-500">
            ไม่พบรายการคำขอการลาที่รอดำเนินการ
          </span>
        </div>
      )}
    </div>
  );
};
