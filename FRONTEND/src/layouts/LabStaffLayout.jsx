import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/LabStaff/Sidebar";
import TopNavbar from "../components/LabStaff/TopNavbar";

const LabStaffLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#020817]">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 lg:ml-64">
        <TopNavbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LabStaffLayout;