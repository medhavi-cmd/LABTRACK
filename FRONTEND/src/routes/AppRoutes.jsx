import { Routes, Route, Navigate } from "react-router-dom";

import LabStaffLayout from "../layouts/LabStaffLayout";

import Dashboard from "../pages/LabStaff/Dashboard";
import InventoryManagement from "../pages/LabStaff/InventoryManagement";
import ComponentRequests from "../pages/LabStaff/ComponentRequests";
import IssuedComponents from "../pages/LabStaff/IssuedComponents";
import ReturnManagement from "../pages/LabStaff/ReturnManagement";
import DamageReports from "../pages/LabStaff/DamageReports";
import ComponentDemand from "../pages/LabStaff/ComponentDemand";
import Notifications from "../pages/LabStaff/Notifications";
import Settings from "../pages/LabStaff/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/lab-staff/dashboard" />}
      />

      <Route path="/lab-staff" element={<LabStaffLayout />}>

        <Route path="dashboard" element={<Dashboard />} />

        <Route path="inventory" element={<InventoryManagement />} />

        <Route path="requests" element={<ComponentRequests />} />

        <Route path="issued" element={<IssuedComponents />} />

        <Route path="returns" element={<ReturnManagement />} />

        <Route path="damage" element={<DamageReports />} />

        <Route path="demand" element={<ComponentDemand />} />

        <Route path="notifications" element={<Notifications />} />

        <Route path="settings" element={<Settings />} />


      </Route>
</Routes>
  );
};

export default AppRoutes;