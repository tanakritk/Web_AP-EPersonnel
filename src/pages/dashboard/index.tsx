import { useEffect, useState } from "react";
import ContentLayout from "@/layout/content-layout";
import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import _AttendenceApi from "@/api/controller/attendence";
import _MasterUserApi from "@/api/controller/master-user";
import _LeaveApi, { LeaveModel } from "@/api/controller/leave";
import { SummaryCards } from "./SummaryCards";
import { AttendanceChart } from "./AttendanceChart";
import { LeaveRequests } from "./LeaveRequests";

const PageDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [workingToday, setWorkingToday] = useState(0);
  const [onLeaveToday, setOnLeaveToday] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState<LeaveModel[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch total active personnel
      const userRes = await _MasterUserApi().search({
        page: 1,
        limit: 1,
        filterOperator: "and",
        filter: [{ field: "isActive", operator: "=", value: true }],
      });
      // Response includes paginationData
      const totalCount =
        (userRes as any).paginationData?.totalItems ||
        (userRes.data && userRes.data.length > 0 ? 100 : 0);
      setTotalUsers(totalCount > 0 ? totalCount : 100);

      // 2. Fetch working (checked-in) today
      const todayStart = dayjs().startOf("day").format("YYYY-MM-DD");
      // const todayEnd = dayjs().endOf("day").format("YYYY-MM-DD");

      const attendanceRes = await _AttendenceApi().search({
        page: 1,
        limit: 1000,
        filterOperator: "and",
        filter: [
          { field: "attendanceDate", operator: "=", value: todayStart },
          // { field: "attendanceDate", operator: "<=", value: todayEnd },
        ],
      });
      // Fallback filter just in case operator >= <= fails on backend
      const todayAttendance =
        (attendanceRes.data as any[])?.filter(
          (item: any) =>
            dayjs(item.createdDate).isSame(dayjs(), "day") ||
            dayjs(item.attendanceDate).isSame(dayjs(), "day"),
        ) || [];
      setWorkingToday(todayAttendance.length);

      // 3. Fetch leaves (on leave today & recent requests)
      const leaveRes = await _LeaveApi().search({
        page: 1,
        limit: 100,
        filterOperator: "and",
        relation: ["mas_statusleave", "mas_user"],
        filter: [],
        sorting: [{ field: "createdDate", pattern: "DESC" }],
      });
      const leaves = (leaveRes.data as LeaveModel[]) || [];

      const leavesToday = leaves.filter((leave) => {
        const start = dayjs(leave.startDate);
        const end = dayjs(leave.endDate);
        const today = dayjs();
        return (
          today.isAfter(start.subtract(1, "day")) &&
          today.isBefore(end.add(1, "day"))
        );
      });
      setOnLeaveToday(leavesToday.length);

      // Display pending or recent leaves
      const recentLeaves = leaves.slice(0, 5);
      setLeaveRequests(recentLeaves);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout breadcrumbList={[]}>
      <div className="p-2 pb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 font-sans">
          ภาพรวมระบบบุคลากร
        </h1>

        {loading ? (
          <div className="flex justify-center mt-24">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <SummaryCards
              totalUsers={totalUsers}
              workingToday={workingToday}
              onLeaveToday={onLeaveToday}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AttendanceChart
                totalUsers={totalUsers}
                workingToday={workingToday}
                onLeaveToday={onLeaveToday}
              />
              <LeaveRequests leaveRequests={leaveRequests} />
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
};
export default PageDashboard;
