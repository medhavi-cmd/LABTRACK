import { useState } from "react";
import { FiPlus, FiEye } from "react-icons/fi";

const initialData = [
  {
    reportId: "DMG-001",
    component: "Arduino Uno R3",
    studentName: "Aarav Sharma",
    damageType: "Physical Damage",
    reportDate: "2025-06-02",
    penalty: 500,
    status: "Pending",
  },
  {
    reportId: "DMG-002",
    component: "Raspberry Pi 4 Model B",
    studentName: "Karan Singh",
    damageType: "Burnt Component",
    reportDate: "2025-06-04",
    penalty: 2000,
    status: "Resolved",
  },
  {
    reportId: "DMG-003",
    component: "16x2 LCD Display",
    studentName: "Rohan Verma",
    damageType: "Broken Pin",
    reportDate: "2025-06-05",
    penalty: 300,
    status: "Pending",
  },
  {
    reportId: "DMG-004",
    component: "DHT11 Temperature Sensor",
    studentName: "Anjali Rao",
    damageType: "Non-Functional",
    reportDate: "2025-06-07",
    penalty: 150,
    status: "Resolved",
  },
  {
    reportId: "DMG-005",
    component: "Servo Motor SG90",
    studentName: "Sneha Kapoor",
    damageType: "Gear Stripped",
    reportDate: "2025-06-08",
    penalty: 250,
    status: "Pending",
  },
  {
    reportId: "DMG-006",
    component: "Ultrasonic Sensor HC-SR04",
    studentName: "Priya Mehta",
    damageType: "Water Damage",
    reportDate: "2025-06-09",
    penalty: 400,
    status: "Pending",
  },
];

const getStatusStyle = (status) => {
  if (status === "Resolved") {
    return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
  }
  return "bg-slate-500/10 text-slate-400 border border-slate-500/30";
};

const DamageReports = () => {
  const [reports, setReports] = useState(initialData);
  const [selectedReport, setSelectedReport] = useState(null);

  const totalReports = reports.length;
  const pendingResolution = reports.filter((r) => r.status === "Pending").length;
  const totalPenalties = reports.reduce((sum, r) => sum + r.penalty, 0);

  const markResolved = (reportId) => {
    setReports((prev) =>
      prev.map((r) =>
        r.reportId === reportId ? { ...r, status: "Resolved" } : r
      )
    );
    setSelectedReport(null);
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Damage Reports</h1>
          <p className="text-slate-400 mt-1">
            Manage component damage reports and penalties
          </p>
        </div>

        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors">
          <FiPlus />
          New Damage Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Reports</p>
          <h2 className="text-3xl font-bold mt-2">{totalReports}</h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Pending Resolution</p>
          <h2 className="text-3xl font-bold text-yellow-400 mt-2">
            {pendingResolution}
          </h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Penalties</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            ₹{totalPenalties.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">All Damage Reports</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111827]">
              <tr>
                <th className="text-left px-6 py-4">Report ID</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Student</th>
                <th className="text-left px-6 py-4">Damage Type</th>
                <th className="text-left px-6 py-4">Report Date</th>
                <th className="text-left px-6 py-4">Penalty</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((item) => (
                <tr
                  key={item.reportId}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-6 py-4 text-slate-300">{item.reportId}</td>
                  <td className="px-6 py-4">{item.component}</td>
                  <td className="px-6 py-4 text-slate-300">{item.studentName}</td>
                  <td className="px-6 py-4 text-slate-300">{item.damageType}</td>
                  <td className="px-6 py-4 text-slate-300">{item.reportDate}</td>
                  <td className="px-6 py-4 text-red-400 font-medium">
                    ₹{item.penalty.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedReport(item)}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Report Details</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Report ID</span>
                <span>{selectedReport.reportId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Component</span>
                <span>{selectedReport.component}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Student</span>
                <span>{selectedReport.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Damage Type</span>
                <span>{selectedReport.damageType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Report Date</span>
                <span>{selectedReport.reportDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Penalty</span>
                <span className="text-red-400 font-medium">
                  ₹{selectedReport.penalty.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                    selectedReport.status
                  )}`}
                >
                  {selectedReport.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {selectedReport.status === "Pending" && (
                <button
                  onClick={() => markResolved(selectedReport.reportId)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageReports;
