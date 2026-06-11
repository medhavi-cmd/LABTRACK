import { useState } from "react";

const initialData = [
  {
    issueId: "ISS-001",
    studentName: "Aarav Sharma",
    component: "Arduino Uno R3",
    quantity: 2,
    issueDate: "2025-06-01",
    returnDeadline: "2025-06-08",
    status: "Overdue",
  },
  {
    issueId: "ISS-002",
    studentName: "Priya Mehta",
    component: "Ultrasonic Sensor HC-SR04",
    quantity: 1,
    issueDate: "2025-06-03",
    returnDeadline: "2025-06-17",
    status: "Active",
  },
  {
    issueId: "ISS-003",
    studentName: "Rohan Verma",
    component: "16x2 LCD Display",
    quantity: 1,
    issueDate: "2025-05-28",
    returnDeadline: "2025-06-04",
    status: "Returned",
  },
  {
    issueId: "ISS-004",
    studentName: "Sneha Kapoor",
    component: "Servo Motor SG90",
    quantity: 3,
    issueDate: "2025-06-05",
    returnDeadline: "2025-06-19",
    status: "Active",
  },
  {
    issueId: "ISS-005",
    studentName: "Karan Singh",
    component: "Raspberry Pi 4 Model B",
    quantity: 1,
    issueDate: "2025-05-30",
    returnDeadline: "2025-06-06",
    status: "Overdue",
  },
  {
    issueId: "ISS-006",
    studentName: "Anjali Rao",
    component: "DHT11 Temperature Sensor",
    quantity: 2,
    issueDate: "2025-06-04",
    returnDeadline: "2025-06-18",
    status: "Active",
  },
];

const getStatusStyle = (status) => {
  if (status === "Active") {
    return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
  }
  if (status === "Overdue") {
    return "bg-red-500/10 text-red-400 border border-red-500/30";
  }
  return "bg-green-500/10 text-green-400 border border-green-500/30";
};

const IssuedComponents = () => {
  const [issues, setIssues] = useState(initialData);

  const markReturned = (issueId) => {
    setIssues((prev) =>
      prev.map((item) =>
        item.issueId === issueId ? { ...item, status: "Returned" } : item
      )
    );
  };

  const totalIssued = issues.length;
  const activeIssues = issues.filter((i) => i.status === "Active").length;
  const overdueReturns = issues.filter((i) => i.status === "Overdue").length;

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Issued Components</h1>
        <p className="text-slate-400 mt-1">
          Track components currently issued to students
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Issued</p>
          <h2 className="text-3xl font-bold mt-2">{totalIssued}</h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Active Issues</p>
          <h2 className="text-3xl font-bold text-blue-400 mt-2">
            {activeIssues}
          </h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Overdue Returns</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {overdueReturns}
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Issued Components List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111827]">
              <tr>
                <th className="text-left px-6 py-4">Issue ID</th>
                <th className="text-left px-6 py-4">Student</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Quantity</th>
                <th className="text-left px-6 py-4">Issue Date</th>
                <th className="text-left px-6 py-4">Return Deadline</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((item) => (
                <tr
                  key={item.issueId}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-6 py-4 text-slate-300">{item.issueId}</td>
                  <td className="px-6 py-4">{item.studentName}</td>
                  <td className="px-6 py-4 text-slate-300">{item.component}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4 text-slate-300">{item.issueDate}</td>
                  <td className="px-6 py-4 text-slate-300">
                    {item.returnDeadline}
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
                      onClick={() => markReturned(item.issueId)}
                      disabled={item.status === "Returned"}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        item.status === "Returned"
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-cyan-500 hover:bg-cyan-600 text-white"
                      }`}
                    >
                      {item.status === "Returned" ? "Returned" : "Mark Returned"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IssuedComponents;
