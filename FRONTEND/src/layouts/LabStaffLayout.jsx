import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

const LabStaffLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#020817]">
      <Sidebar
        items={SIDEBAR_CONFIG.labStaff}
        title="LABTRACK"
        subtitle="Lab Staff Module"
      />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LabStaffLayout;