import { Navigate, Route, Routes } from "react-router-dom";
import ComponentDemand from "../pages/LabStaff/ComponentDemand";
import Notifications from "../pages/LabStaff/Notifications";


import LabStaffLayout from "../layouts/LabStaffLayout";


import LabStaffDashboard from "../pages/LabStaff/Dashboard";
import LabStaffInventoryManagement from "../pages/LabStaff/InventoryManagement";
import LabStaffComponentRequests from "../pages/LabStaff/ComponentRequests";
import LabStaffIssuedComponents from "../pages/LabStaff/IssuedComponents";
import LabStaffReturnManagement from "../pages/LabStaff/ReturnManagement";
import LabStaffDamageReports from "../pages/LabStaff/DamageReports";

import FacultyDashboard from "../pages/Faculty/FacultyDashboard";
import FacultyProjectApprovals from "../pages/Faculty/ProjectApprovals";
import FacultyComponentRequests from "../pages/Faculty/ComponentsRequests";
import FacultyEvents from "../pages/Faculty/Events";
import FacultyNotifications from "../pages/Faculty/Notifications";

import FacultyGalleryApprovals from "../pages/Faculty/GalleryApprovals";
import FacultyStudentProgress from "../pages/Faculty/StudentProgress";

import CompleteProfile from "../pages/TeamLeader/CompleteProfile";
import StudentDashboard from "../pages/TeamLeader/StudentDashboard";
import RegisterProjectTeam from "../pages/TeamLeader/RegisterProjectTeam";
import AddMembers from "../pages/TeamLeader/AddMembers";
import ReviewTeamDetails from "../pages/TeamLeader/ReviewTeamDetails";
import TeamManagement from "../pages/TeamLeader/TeamManagement";
import LabStaffSettings from "../pages/LabStaff/Settings";
import TeamLeaderSettings from "../pages/TeamLeader/Settings";
import ComponentInventory from "../pages/TeamLeader/ComponentInventory";
import CartPage from "../pages/TeamLeader/CartPage";
import NotificationsPage from "../pages/TeamLeader/Notifications";
import Login from "../pages/Auth/Login";
import SignupPage from "../pages/Auth/Signup";
import GroupLeaderLayout from "../layouts/GroupLeaderLayout";

const ComingSoon = ({ title, description }) => (
  
    <GroupLeaderLayout>
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#859397]">
      Coming Soon
    </p>
    <h1 className="mt-3 text-3xl font-bold text-white">{title}</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bbc9cd]">
      {description}
    </p> 
  </GroupLeaderLayout>
);


const AppRoutes = () => {
  return (
    <Routes>
      <Route
      path="/"
      element={<Navigate to="/login" replace />}
      />


      {/* GROUP LEADER */}

      <Route
        path="/student/complete-profile"
        element={<CompleteProfile />}
      />

      <Route
        path="/student/student-dashboard"
        element={<StudentDashboard />}
      />
      <Route
        path="/student/team-management/register"
        element={<RegisterProjectTeam />}
      />
      <Route
        path="/student/team-management/add-members"
        element={<AddMembers />}
      />
      <Route
        path="/student/team-management/review-team-details"
        element={<ReviewTeamDetails />}
      />
      <Route
        path="/student/team-management"
        element={<TeamManagement />}
      />
      <Route
      path="/student/component-inventory"
      element={<ComponentInventory />}
      />
      <Route
      path="/student/cart"
      element={<CartPage />}
      />
      <Route
        path="/student/issue-history"
        element={
          <ComingSoon
            title="Issue History"
            description="View all issued, returned, pending, and damaged component records for your team."
          />
        }
      />
      <Route
        path="/student/component-requests"
        element={
          <ComingSoon
            title="New Requests"
            description="Create and track component requests for your project."
          />
        }
      />
      <Route
        path="/student/gallery"
        element={
          <ComingSoon
            title="Project Gallery"
            description="Showcase project milestones, photos, videos, and achievements."
          />
        }
      />
      <Route path="/student/settings" element={<TeamLeaderSettings />} />
      <Route
        path="/student/notifications"
        element={<NotificationsPage />}
      />


      
      {/* FACULTY */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      <Route
        path="/faculty/project-approvals"
        element={<FacultyProjectApprovals />}
      />
      <Route
        path="/faculty/component-requests"
        element={<FacultyComponentRequests />}
      />
      <Route path="/faculty/events" element={<FacultyEvents />} />
      <Route path="/faculty/notifications" element={<FacultyNotifications />} />
      <Route
        path="/faculty/gallery-approvals"
        element={<FacultyGalleryApprovals />}
      />
      <Route
        path="/faculty/student-progress"
        element={<FacultyStudentProgress />}
      />




      {/* LABSTAFF */}
      <Route path="/lab-staff" element={<LabStaffLayout />}>

        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<LabStaffDashboard />} />
        <Route path="inventory" element={<LabStaffInventoryManagement />} />
        <Route path="requests" element={<LabStaffComponentRequests />} />
        <Route path="issued" element={<LabStaffIssuedComponents />} />
        <Route path="returns" element={<LabStaffReturnManagement />} />
        <Route path="damage" element={<LabStaffDamageReports />} />
        <Route path="demand" element={<ComponentDemand />} />
        <Route path="notifications" element={<Notifications />} />

        <Route path="settings" element={<LabStaffSettings />} />
      </Route>

      <Route
        path="*"
        element={
          <div>
            Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
