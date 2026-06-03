import { useState } from "react";
import Sidebar from "../../components/LabStaff/Sidebar";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#020617]">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="lg:ml-64 min-h-screen">
      

        <main className="p-6">
          <div className="bg-[#07111f] border border-cyan-900/20 rounded-xl p-6">
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