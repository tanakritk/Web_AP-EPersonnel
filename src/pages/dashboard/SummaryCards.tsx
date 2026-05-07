import React from "react";
import { Avatar } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EventBusyIcon from "@mui/icons-material/EventBusy";

interface SummaryCardsProps {
  totalUsers: number;
  workingToday: number;
  onLeaveToday: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalUsers,
  workingToday,
  onLeaveToday,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Card */}
      <div className="rounded-2xl shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 flex items-center p-6 border border-blue-100">
        <Avatar sx={{ bgcolor: "#3b82f6", width: 56, height: 56 }} className="mr-4">
          <GroupsIcon />
        </Avatar>
        <div className="flex flex-col">
          <span className="text-gray-600 font-semibold text-sm mb-1">
            จำนวนบุคลากรทั้งหมด
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-blue-900 leading-none">
              {totalUsers}
            </span>
            <span className="text-base font-medium text-blue-900">คน</span>
          </div>
        </div>
      </div>

      {/* Working Today */}
      <div className="rounded-2xl shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center p-6 border border-emerald-100">
        <Avatar sx={{ bgcolor: "#10b981", width: 56, height: 56 }} className="mr-4">
          <HowToRegIcon />
        </Avatar>
        <div className="flex flex-col">
          <span className="text-gray-600 font-semibold text-sm mb-1">
            เข้าทำงานวันนี้
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-900 leading-none">
              {workingToday}
            </span>
            <span className="text-base font-medium text-emerald-900">คน</span>
          </div>
        </div>
      </div>

      {/* On Leave Today */}
      <div className="rounded-2xl shadow-sm bg-gradient-to-br from-rose-50 to-rose-100 flex items-center p-6 border border-rose-100">
        <Avatar sx={{ bgcolor: "#f43f5e", width: 56, height: 56 }} className="mr-4">
          <EventBusyIcon />
        </Avatar>
        <div className="flex flex-col">
          <span className="text-gray-600 font-semibold text-sm mb-1">
            ลาวันนี้
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-rose-900 leading-none">
              {onLeaveToday}
            </span>
            <span className="text-base font-medium text-rose-900">คน</span>
          </div>
        </div>
      </div>
    </div>
  );
};
