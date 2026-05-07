import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

interface AttendanceChartProps {
  totalUsers: number;
  workingToday: number;
  onLeaveToday: number;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  totalUsers,
  workingToday,
  onLeaveToday,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full flex flex-col border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        รายงานสรุปการมาทำงาน (วันนี้)
      </h3>
      <div className="flex-1 flex justify-center items-center min-h-[300px]">
        {totalUsers > 0 ? (
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: workingToday, label: "มาทำงาน", color: "#10b981" },
                  { id: 1, value: onLeaveToday, label: "ลา", color: "#f43f5e" },
                  {
                    id: 2,
                    value: Math.max(0, totalUsers - workingToday - onLeaveToday),
                    label: "ขาด/ยังไม่เข้า",
                    color: "#fcd34d",
                  },
                ],
                innerRadius: 40,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
              },
            ]}
            width={400}
            height={200}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
              },
            }}
          />
        ) : (
          <span className="text-gray-500">ไม่มีข้อมูล</span>
        )}
      </div>
    </div>
  );
};
