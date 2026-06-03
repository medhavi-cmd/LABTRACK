import { Routes, Route, Navigate } from "react-router-dom";

import LabStaffLayout from "../layouts/LabStaffLayout";

import Dashboard from "../pages/LabStaff/Dashboard";
import InventoryManagement from "../pages/LabStaff/InventoryManagement";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/lab-staff/dashboard" />}
      />

      <Route path="/lab-staff" element={<LabStaffLayout />}>
        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="inventory"
          element={<InventoryManagement />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;