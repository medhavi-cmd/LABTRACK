import React from "react";

const Dashboard = () => {
  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Overview of laboratory inventory and component activities
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Total Components</p>
          <h2 className="text-4xl font-bold mt-3">245</h2>
        </div>

        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Pending Requests</p>
          <h2 className="text-4xl font-bold mt-3 text-yellow-400">18</h2>
        </div>

        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Issued Components</p>
          <h2 className="text-4xl font-bold mt-3 text-cyan-400">324</h2>
        </div>

        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Damage Components</p>
          <h2 className="text-4xl font-bold mt-3 text-red-400">4</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Recent Component Requests
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-cyan-900/20 pb-3">
              <span>Arduino Uno R3</span>
              <span className="text-yellow-400">Pending</span>
            </div>

            <div className="flex justify-between border-b border-cyan-900/20 pb-3">
              <span>Raspberry Pi 4</span>
              <span className="text-green-400">Approved</span>
            </div>

            <div className="flex justify-between">
              <span>LED Strip 5m</span>
              <span className="text-green-400">Approved</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Low Stock Components
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-cyan-900/20 pb-3">
              <span>Breadboard</span>
              <span className="text-red-400">2 Left</span>
            </div>

            <div className="flex justify-between border-b border-cyan-900/20 pb-3">
              <span>Servo Motor</span>
              <span className="text-red-400">1 Left</span>
            </div>

            <div className="flex justify-between">
              <span>Temperature Sensor</span>
              <span className="text-red-400">3 Left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;