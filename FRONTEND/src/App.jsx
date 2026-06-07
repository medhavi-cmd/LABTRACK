import { Navigate, Route, Routes } from "react-router-dom";

import FacultyDashboard from "./pages/Faculty/FacultyDashboard";
import ProjectApprovals from "./pages/Faculty/ProjectApprovals";
import ComponentsRequests from "./pages/Faculty/ComponentsRequests";
import Events from "./pages/Faculty/Events";
import Notifications from "./pages/Faculty/Notifications";
import GalleryApprovals from "./pages/Faculty/GalleryApprovals";
import StudentProgress from "./pages/Faculty/StudentProgress";

import RegisterProjectTeam from "./pages/TeamLeader/RegisterProjectTeam";
import AddMembers from "./pages/TeamLeader/AddMembers";
import ReviewTeamDetails from "./pages/TeamLeader/ReviewTeamDetails";
import Login from "./pages/Auth/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/faculty/dashboard" />} />

      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="/faculty/project-approvals" element={<ProjectApprovals />} />
      <Route path="/faculty/component-requests" element={<ComponentsRequests />} />
      <Route path="/faculty/events" element={<Events />} />
      <Route path="/faculty/notifications" element={<Notifications />} />
      <Route path="/faculty/gallery-approvals" element={<GalleryApprovals />} />
      <Route path="/faculty/student-progress" element={<StudentProgress />} />

      <Route path="/login" element={<Login />} />
      <Route path="/Team-Management" element={<RegisterProjectTeam />} />
      <Route path="/Team-Management/Add-Members" element={<AddMembers />} />
      <Route path="/Team-Management/Review-Team" element={<ReviewTeamDetails />} />
    </Routes>
  );
}

export default App;