import React from "react";

const Dashboard = () => {
  return (
    <div className="">
      <div className="mb-8">
        <h1 className="ls-title-main">Dashboard</h1>
        <p className="ls-text-secondary mt-2">
          Overview of laboratory inventory and component activities
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Total Components</p>
          <h2 className="ls-stat-value">245</h2>
        </div>

        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Pending Requests</p>
          <h2 className="ls-stat-value text-amber-500">18</h2>
        </div>

        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Issued Components</p>
          <h2 className="ls-stat-value text-cyan-600">324</h2>
        </div>

        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Damage Components</p>
          <h2 className="ls-stat-value text-red-600">4</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="ls-card ls-card-hover">
          <h2 className="ls-title-card mb-4">
            Recent Component Requests
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="ls-text-primary font-medium">Arduino Uno R3</span>
              <span className="ls-badge-warning">Pending</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="ls-text-primary font-medium">Raspberry Pi 4</span>
              <span className="ls-badge-success">Approved</span>
            </div>

            <div className="flex justify-between">
              <span className="ls-text-primary font-medium">LED Strip 5m</span>
              <span className="ls-badge-success">Approved</span>
            </div>
          </div>
        </div>

        <div className="ls-card ls-card-hover">
          <h2 className="ls-title-card mb-4">
            Low Stock Components
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="ls-text-primary font-medium">Breadboard</span>
              <span className="ls-badge-error">2 Left</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="ls-text-primary font-medium">Servo Motor</span>
              <span className="ls-badge-error">1 Left</span>
            </div>

            <div className="flex justify-between">
              <span className="ls-text-primary font-medium">Temperature Sensor</span>
              <span className="ls-badge-error">3 Left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;