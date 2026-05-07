import { Route, Routes } from "react-router-dom";
import PageMain from "@/pages/main";
import PagePersonnelInformation from "@/pages/personnel-info/information";
import PageNotFound from "@/pages/page-not-found";
import PagePersonalEducation from "@/pages/personnel-info/education";
import PagePersonnelInsignia from "@/pages/personnel-info/insignia";
import PagePersonnelAcademic from "@/pages/personnel-info/academic";
import PageCheckInCheckOut from "@/pages/checkin-checkout/checkin";
import PageCheckInCheckOutHistory from "@/pages/checkin-checkout/checkin-history";
import PageLeaveRequest from "@/pages/leave/leave-request";
import PageLeaveHistory from "@/pages/leave/leave-history";
import PagePersonnelList from "@/pages/personnel-info/list";
import PageLogin from "@/pages/login";
import PageDocuments from "@/pages/documents";
import PageAddEditPersonnel from "@/pages/personnel-info/list/add-edit";
import PageChangePassword from "@/pages/change-password";
import PageLeaveApprove from "@/pages/leave/leave-approve";
import PageCheckInCheckOutList from "@/pages/checkin-checkout/list";
import PageLeaveApproveList from "@/pages/leave/approve-list";
import PageLeaveHistoryList from "@/pages/leave/list";
import PageDashboard from "@/pages/dashboard";

// interface RouteType {
//     path: string;
//     component: React.ComponentType;
// }

const GetRoute = () => {
  // const data: RouteType[] = [
  //     { path: '/', component: PageMain },
  //     { path: '/strategic-map', component: PageMapStrategy },
  //     { path: '/strategic-map/target/:id', component: PageTarget },

  //     { path: '/strategic-map/target/:id/project/:projectId', component: PageNotFound },

  //     { path: '*', component: PageNotFound },
  // ]

  // return data
  return (
    <Routes>
      <Route path="/login" element={<PageLogin />} />
      <Route path="/change-password" element={<PageChangePassword />} />

      <Route path="/" element={<PageMain />} />
      <Route
        path="/personnel-info/information/:id"
        element={<PagePersonnelInformation />}
      />
      <Route
        path="/personnel-info/education/:id"
        element={<PagePersonalEducation />}
      />
      <Route
        path="/personnel-info/insignia/:id"
        element={<PagePersonnelInsignia />}
      />
      <Route
        path="/personnel-info/academic/:id"
        element={<PagePersonnelAcademic />}
      />

      <Route path="/checkin-checkout/:id" element={<PageCheckInCheckOut />} />
      <Route
        path="/checkin-checkout-history/:id"
        element={<PageCheckInCheckOutHistory />}
      />
      <Route
        path="/checkin-checkout-history-list"
        element={<PageCheckInCheckOutList />}
      />

      <Route path="/leave-request/:action/:id" element={<PageLeaveRequest />} />
      <Route
        path="/leave-request-detail/:action/:id"
        element={<PageLeaveRequest />}
      />
      <Route path="/leave-history/:id" element={<PageLeaveHistory />} />
      <Route path="/leave-approve-list" element={<PageLeaveApproveList />} />
      <Route path="/leave-approve/:action/:id" element={<PageLeaveApprove />} />
      <Route path="/leave-detail/:action/:id" element={<PageLeaveApprove />} />
      <Route path="/leave-history-list" element={<PageLeaveHistoryList />} />

      <Route path="/documents/:id" element={<PageDocuments />} />

      <Route path="/personnel-admin-list" element={<PagePersonnelList />} />
      <Route
        path="/personnel-admin/:action/:id?"
        element={<PageAddEditPersonnel />}
      />
      <Route path="/dashboard" element={<PageDashboard />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default GetRoute;
