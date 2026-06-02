import { useState } from "react";
import Sidebar from "../../components/LabStaff/Sidebar";
import TopNavbar from "../../components/LabStaff/TopNavbar";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="lg:ml-64 min-h-screen">
        <TopNavbar />

        <main className="p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h1 className="text-2xl font-semibold text-white">
              Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Lab Staff Dashboard setup completed.
            </p>

            <p className="text-slate-500 mt-4">
              Sidebar and Top Navbar integrated successfully.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;