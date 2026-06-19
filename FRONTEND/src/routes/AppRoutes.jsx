import { Navigate, Route, Routes } from "react-router-dom";
import ComponentDemand from "../pages/LabStaff/ComponentDemand";
import Notifications from "../pages/LabStaff/Notifications";
import Settings from "../pages/LabStaff/Settings";

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

import GroupLeaderDashboard from "../pages/TeamLeader/LeaderDashboard";
import RegisterProjectTeam from "../pages/TeamLeader/RegisterProjectTeam";
import AddMembers from "../pages/TeamLeader/AddMembers";
import ReviewTeamDetails from "../pages/TeamLeader/ReviewTeamDetails";

import Login from "../pages/Auth/Login";

const ComingSoon = ({ title, description }) => (
  <div className="min-h-[60vh] rounded-2xl border border-[#222a3d] bg-[#131b2e] p-8 text-[#dae2fd] shadow-2xl">
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#859397]">
      Coming Soon
    </p>
    <h1 className="mt-3 text-3xl font-bold text-white">{title}</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bbc9cd]">
      {description}
    </p>
  </div>
);


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/faculty/dashboard" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="/faculty/project-approvals" element={<FacultyProjectApprovals />} />
      <Route path="/faculty/component-requests" element={<FacultyComponentRequests />} />
      <Route path="/faculty/events" element={<FacultyEvents />} />
      <Route path="/faculty/notifications" element={<FacultyNotifications />} />
      <Route path="/faculty/gallery-approvals" element={<FacultyGalleryApprovals />} />
      <Route path="/faculty/student-progress" element={<FacultyStudentProgress />} />

      <Route path="/Student/Dashboard" element={<GroupLeaderDashboard />} />
      <Route path="/Student/Team-Management" element={<RegisterProjectTeam />} />
      <Route path="/Student/Team-Management/Add-Members" element={<AddMembers />} />
      <Route path="/Student/Team-Management/Review-Team" element={<ReviewTeamDetails />} />
      <Route
        path="/Student/Component-Inventory"
        element={
          <ComingSoon
            title="Component Inventory"
            description="The sidebar already points here, so this route is reserved for the Group Leader component inventory experience."
          />
        }
      />
      <Route
        path="/Student/Issue-History"
        element={
          <ComingSoon
            title="Issue History"
            description="This page will show the full history of requested, issued, and returned components for a project team."
          />
        }
      />
      <Route
        path="/Student/New-Requests"
        element={
          <ComingSoon
            title="New Requests"
            description="This sidebar entry is reserved for future request submission and tracking screens."
          />
        }
      />
      <Route
        path="/Student/gallery"
        element={
          <ComingSoon
            title="Project Gallery"
            description="This route is reserved for the project gallery view in the Group Leader module."
          />
        }
      />
      <Route
        path="/Student/settings"
        element={
          <ComingSoon
            title="Settings"
            description="This route is reserved for Group Leader account and preference settings."
          />
        }
      />
      <Route path="/Team-Management" element={<Navigate to="/Student/Team-Management" replace />} />
      <Route path="/Team-Management/Add-Members" element={<AddMembers />} />
      <Route path="/Team-Management/Review-Team" element={<ReviewTeamDetails />} />

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

        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;