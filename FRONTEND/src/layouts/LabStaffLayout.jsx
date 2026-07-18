import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

const LabStaffLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        items={SIDEBAR_CONFIG.labStaff}
        title="LABTRACK"
        subtitle="Lab Staff Module"
      />

      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LabStaffLayout;