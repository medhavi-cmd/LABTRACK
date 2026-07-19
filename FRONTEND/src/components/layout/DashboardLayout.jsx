import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { SIDEBAR_CONFIG } from "../../config/sidebarConfig";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar
        items={SIDEBAR_CONFIG.faculty}
        title="LABTRACK"
        subtitle="Faculty Module"
      />

      <main className="flex-1 min-h-screen">
        <Topbar />

        <section className="p-8 w-full">
          {children}
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;