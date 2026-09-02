import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { SIDEBAR_CONFIG } from "../../config/sidebarConfig";

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all"
        />
      )}

      <Sidebar
        items={SIDEBAR_CONFIG.faculty}
        title="LABTRACK"
        subtitle="Faculty Module"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 min-h-screen min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        <section className="p-4 sm:p-8 w-full">
          {children}
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;