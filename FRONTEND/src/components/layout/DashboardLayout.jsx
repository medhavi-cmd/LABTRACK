import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#020617] flex">
      <Sidebar />

      <main className="flex-1 min-h-screen">
        <Topbar />

        <section className="p-8">
          {children}
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;