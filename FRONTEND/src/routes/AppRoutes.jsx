import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import ComponentDemand from "../pages/LabStaff/ComponentDemand";
import Notifications from "../pages/LabStaff/Notifications";
import LabStaffLayout from "../layouts/LabStaffLayout";
import LabStaffDashboard from "../pages/LabStaff/Dashboard";
import LabStaffInventoryManagement from "../pages/LabStaff/InventoryManagement";
import LabStaffComponentRequests from "../pages/LabStaff/ComponentRequests";
import LabStaffIssuedComponents from "../pages/LabStaff/IssuedComponents";
import LabStaffReturnManagement from "../pages/LabStaff/ReturnManagement";
import LabStaffDamageReports from "../pages/LabStaff/DamageReports";
import LabStaffSettings from "../pages/LabStaff/Settings";

import FacultyDashboard from "../pages/Faculty/FacultyDashboard";
import FacultyProjectApprovals from "../pages/Faculty/ProjectApprovals";
import FacultyComponentRequests from "../pages/Faculty/ComponentsRequests";
import FacultyEvents from "../pages/Faculty/Events";
import FacultyNotifications from "../pages/Faculty/Notifications";
import FacultyGalleryApprovals from "../pages/Faculty/GalleryApprovals";
import FacultyStudentProgress from "../pages/Faculty/StudentProgress";

import AboutLabtrack from "../pages/Auth/Aboutlabtrack";
import CompleteProfile from "../pages/TeamLeader/CompleteProfile";
import StudentDashboard from "../pages/TeamLeader/StudentDashboard";
import RegisterProjectTeam from "../pages/TeamLeader/RegisterProjectTeam";
import AddMembers from "../pages/TeamLeader/AddMembers";
import ReviewTeamDetails from "../pages/TeamLeader/ReviewTeamDetails";
import TeamManagement from "../pages/TeamLeader/TeamManagement";
import Settings from "../pages/TeamLeader/Settings";
import ComponentInventory from "../pages/TeamLeader/ComponentInventory";
import CartPage from "../pages/TeamLeader/CartPage";
import NotificationsPage from "../pages/TeamLeader/Notifications";
import Login from "../pages/Auth/Login";
import SignupPage from "../pages/Auth/Signup";
import GroupLeaderLayout from "../layouts/GroupLeaderLayout";
import IssueHistory from "../pages/TeamLeader/IssueHistory";
import NewRequest from "../pages/TeamLeader/NewRequests";
import ProjectGallery from "../pages/TeamLeader/ProjectGallery";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<SignupPage />} />

      <Route path="/about-labtrack" element={<AboutLabtrack />} />

      {/* GROUP LEADER */}

      <Route
        path="/student/complete-profile"
        element={
          <ProtectedRoute allowedRoles="student">
            <CompleteProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/student-dashboard"
        element={
          <ProtectedRoute allowedRoles="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/team-management/register"
        element={
          <ProtectedRoute allowedRoles="student">
            <RegisterProjectTeam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/team-management/add-members"
        element={
          <ProtectedRoute allowedRoles="student">
            <AddMembers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/team-management/review-team-details"
        element={
          <ProtectedRoute allowedRoles="student">
            <ReviewTeamDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/team-management"
        element={
          <ProtectedRoute allowedRoles="student">
            <TeamManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/component-inventory"
        element={
          <ProtectedRoute allowedRoles="student">
            <ComponentInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/cart"
        element={
          <ProtectedRoute allowedRoles="student">
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/issue-history"
        element={
          <ProtectedRoute allowedRoles="student">
            <IssueHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/new-request"
        element={
          <ProtectedRoute allowedRoles="student">
            <NewRequest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/gallery"
        element={
          <ProtectedRoute allowedRoles="student">
            <ProjectGallery />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/settings"
        element={
          <ProtectedRoute allowedRoles="student">
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/notifications"
        element={
          <ProtectedRoute allowedRoles="student">
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* FACULTY */}

      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRoles="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/project-approvals"
        element={
          <ProtectedRoute allowedRoles="faculty">
            <FacultyProjectApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/component-requests"
        element={
          <ProtectedRoute allowedRoles="faculty">
            <FacultyComponentRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/events"
        element={
          <ProtectedRoute allowedRoles="faculty">
            <FacultyEvents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/notifications"
        element={
          <ProtectedRoute allowedRoles="faculty">
            <FacultyNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/gallery-approvals"
        element={
          <ProtectedRoute allowedRoles="faculty">
            <FacultyGalleryApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/student-progress"
        element={
          <ProtectedRoute allowedRoles="faculty">
            <FacultyStudentProgress />
          </ProtectedRoute>
        }
      />

      {/* LABSTAFF */}
      <Route
        path="/lab-staff"
        element={
          <ProtectedRoute allowedRoles="lab_staff">
            <LabStaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles="lab_staff">
              <LabStaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="inventory"
          element={
            <ProtectedRoute allowedRoles="lab_staff">
              <LabStaffInventoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="requests"
          element={
            <ProtectedRoute allowedRoles="lab_staff">
              <LabStaffComponentRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="issued"
          element={
            <ProtectedRoute allowedRoles="lab_staff">
              <LabStaffIssuedComponents />
            </ProtectedRoute>
          }
        />
        <Route
          path="returns"
          element={
            <ProtectedRoute allowedRoles="lab_staff">
              <LabStaffReturnManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="damage"
          element={
            <ProtectedRoute allowedRoles="lab_staff">
              <LabStaffDamageReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="demand"
          element={
            <ProtectedRoute allowedRoles="lab_staff">
              <ComponentDemand />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute allowedRoles="lab_staff">
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles="lab_staff">
              <LabStaffSettings />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
