import React from "react";
import { FiEye, FiCheck } from "react-icons/fi";

const ComponentRequests = () => {
  const requests = [
    {
      id: "REQ-1023",
      student: "Sarah Johnson",
      component: "Arduino Uno R3",
      quantity: 2,
      date: "May 28, 2026",
      priority: "Normal",
      status: "Pending",
    },
    {
      id: "REQ-1022",
      student: "Michael Chen",
      component: "Raspberry Pi 4",
      quantity: 1,
      date: "May 28, 2026",
      priority: "High",
      status: "Pending",
    },
    {
      id: "REQ-1021",
      student: "Emma Davis",
      component: "LED Strip 5m",
      quantity: 3,
      date: "May 27, 2026",
      priority: "Normal",
      status: "Approved",
    },
    {
      id: "REQ-1020",
      student: "James Wilson",
      component: "DC Motor 12V",
      quantity: 4,
      date: "May 27, 2026",
      priority: "Normal",
      status: "Rejected",
    },
  ];

  const statusStyle = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Approved: "bg-green-500/20 text-green-400",
    Rejected: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Component Requests</h1>
        <p className="text-slate-400 mt-2">
          Review and approve component requests from students
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Pending Requests</p>
          <h2 className="text-4xl font-bold mt-3">18</h2>
        </div>

        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Approved This Month</p>
          <h2 className="text-4xl font-bold mt-3 text-cyan-400">156</h2>
        </div>

        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Rejected This Month</p>
          <h2 className="text-4xl font-bold mt-3 text-red-400">12</h2>
        </div>
      </div>

      <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-cyan-900/20">
          <h2 className="text-2xl font-semibold">All Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#081222]">
              <tr>
                <th className="text-left px-6 py-4">Request ID</th>
                <th className="text-left px-6 py-4">Student</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Quantity</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Priority</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-cyan-900/20 hover:bg-[#081222]"
                >
                  <td className="px-6 py-4">{request.id}</td>
                  <td className="px-6 py-4">{request.student}</td>
                  <td className="px-6 py-4">{request.component}</td>
                  <td className="px-6 py-4">{request.quantity}</td>
                  <td className="px-6 py-4">{request.date}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        request.priority === "High"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {request.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyle[request.status]
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-cyan-400 hover:text-cyan-300">
                        <FiEye size={18} />
                      </button>

                      <button className="text-green-400 hover:text-green-300">
                        <FiCheck size={18} />
                      </button>
                    </div>
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

export default ComponentRequests;