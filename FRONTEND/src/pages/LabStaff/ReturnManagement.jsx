import { useState } from "react";

const initialData = [
  {
    returnId: "RET-001",
    studentName: "Aarav Sharma",
    component: "Arduino Uno R3",
    quantity: 2,
    issueDate: "2025-06-01",
    returnDate: "2025-06-08",
    condition: "Good",
    notes: "Returned in original condition.",
  },
  {
    returnId: "RET-002",
    studentName: "Priya Mehta",
    component: "Ultrasonic Sensor HC-SR04",
    quantity: 1,
    issueDate: "2025-06-03",
    returnDate: "2025-06-10",
    condition: "Fair",
    notes: "Minor scratches on casing.",
  },
  {
    returnId: "RET-003",
    studentName: "Rohan Verma",
    component: "16x2 LCD Display",
    quantity: 1,
    issueDate: "2025-05-28",
    returnDate: "2025-06-04",
    condition: "Damaged",
    notes: "One pin bent, display partially unresponsive.",
  },
  {
    returnId: "RET-004",
    studentName: "Sneha Kapoor",
    component: "Servo Motor SG90",
    quantity: 3,
    issueDate: "2025-06-05",
    returnDate: "2025-06-12",
    condition: "Good",
    notes: "All units working correctly.",
  },
  {
    returnId: "RET-005",
    studentName: "Karan Singh",
    component: "Raspberry Pi 4 Model B",
    quantity: 1,
    issueDate: "2025-05-30",
    returnDate: "2025-06-09",
    condition: "Fair",
    notes: "SD card slot slightly worn.",
  },
  {
    returnId: "RET-006",
    studentName: "Anjali Rao",
    component: "DHT11 Temperature Sensor",
    quantity: 2,
    issueDate: "2025-06-04",
    returnDate: "2025-06-11",
    condition: "Damaged",
    notes: "One sensor not functioning after use.",
  },
];

const getConditionStyle = (condition) => {
  if (condition === "Good") {
    return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
  }
  if (condition === "Fair") {
    return "bg-slate-500/10 text-slate-400 border border-slate-500/30";
  }
  return "bg-red-500/10 text-red-400 border border-red-500/30";
};

const ReturnManagement = () => {
  const [returns] = useState(initialData);

  const totalReturns = returns.length;
  const goodCondition = returns.filter((r) => r.condition === "Good").length;
  const damagedReturns = returns.filter((r) => r.condition === "Damaged").length;

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Return Management</h1>
        <p className="text-slate-400 mt-1">
          Track component returns and condition assessments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Returns This Week</p>
          <h2 className="text-3xl font-bold mt-2">{totalReturns}</h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Good Condition</p>
          <h2 className="text-3xl font-bold text-blue-400 mt-2">
            {goodCondition}
          </h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Damaged Returns</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {damagedReturns}
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Return History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111827]">
              <tr>
                <th className="text-left px-6 py-4">Return ID</th>
                <th className="text-left px-6 py-4">Student</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Quantity</th>
                <th className="text-left px-6 py-4">Issue Date</th>
                <th className="text-left px-6 py-4">Return Date</th>
                <th className="text-left px-6 py-4">Condition</th>
                <th className="text-left px-6 py-4">Notes</th>
              </tr>
            </thead>

            <tbody>
              {returns.map((item) => (
                <tr
                  key={item.returnId}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-6 py-4 text-slate-300">{item.returnId}</td>
                  <td className="px-6 py-4">{item.studentName}</td>
                  <td className="px-6 py-4 text-slate-300">{item.component}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4 text-slate-300">{item.issueDate}</td>
                  <td className="px-6 py-4 text-slate-300">{item.returnDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getConditionStyle(
                        item.condition
                      )}`}
                    >
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {item.notes}
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

export default ReturnManagement;
