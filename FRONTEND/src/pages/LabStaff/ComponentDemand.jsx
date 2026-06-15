import React from "react";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
 
const topComponents = [
  { rank: 1, name: "Arduino Uno R3", category: "Microcontrollers", total: 142, approved: 128, rejected: 14, avgQty: 2.3, trend: "Rising" },
  { rank: 2, name: "Raspberry Pi 4", category: "Single Board Computers", total: 118, approved: 105, rejected: 13, avgQty: 1.5, trend: "Rising" },
  { rank: 3, name: "Breadboard 830", category: "Prototyping", total: 95, approved: 89, rejected: 6, avgQty: 3.2, trend: "Stable" },
  { rank: 4, name: "LED Strip 5m", category: "Lighting", total: 87, approved: 78, rejected: 9, avgQty: 2.8, trend: "Rising" },
  { rank: 5, name: "DC Motor 12V", category: "Actuators", total: 76, approved: 68, rejected: 8, avgQty: 4.1, trend: "Falling" },
  { rank: 6, name: "Jumper Wires", category: "Passive Components", total: 72, approved: 70, rejected: 2, avgQty: 15.5, trend: "Stable" },
  { rank: 7, name: "Resistor Pack", category: "Passive Components", total: 68, approved: 65, rejected: 3, avgQty: 8.2, trend: "Rising" },
  { rank: 8, name: "Servo Motor", category: "Actuators", total: 54, approved: 48, rejected: 6, avgQty: 3.5, trend: "Stable" },
];
 
const demandByCategory = [
  { category: "Microcontrollers", requests: 245, approvalRate: 92 },
  { category: "Single Board Computers", requests: 178, approvalRate: 88 },
  { category: "Passive Components", requests: 312, approvalRate: 95 },
  { category: "Actuators", requests: 198, approvalRate: 87 },
  { category: "Sensors", requests: 165, approvalRate: 91 },
  { category: "Prototyping", requests: 203, approvalRate: 94 },
];
 
const requestPurposes = [
  { purpose: "Final Year Project", count: 342, percentage: 38 },
  { purpose: "Lab Assignment", count: 267, percentage: 30 },
  { purpose: "Research Project", count: 145, percentage: 16 },
  { purpose: "Workshop/Training", count: 98, percentage: 11 },
  { purpose: "Personal Learning", count: 45, percentage: 5 },
];
 
const getTrendStyle = (trend) => {
  if (trend === "Rising") {
    return "bg-green-500/10 text-green-400 border border-green-500/30";
  }
  if (trend === "Falling") {
    return "bg-red-500/10 text-red-400 border border-red-500/30";
  }
  return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
};
 
const getTrendIcon = (trend) => {
  if (trend === "Rising") return <FiTrendingUp className="w-3.5 h-3.5" />;
  if (trend === "Falling") return <FiTrendingDown className="w-3.5 h-3.5" />;
  return <FiMinus className="w-3.5 h-3.5" />;
};
 
const ComponentDemand = () => {
  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Component Demand Analysis</h1>
        <p className="text-slate-400 mt-1">
          Analyze component request patterns and demand trends
        </p>
      </div>
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <p className="text-slate-400">Total Requests</p>
          <h2 className="text-3xl font-bold mt-2">897</h2>
        </div>
 
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <p className="text-slate-400">Approval Rate</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">91%</h2>
        </div>
 
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <p className="text-slate-400">Most Requested</p>
          <h2 className="text-xl font-bold mt-2">Arduino Uno R3</h2>
          <p className="text-slate-400 text-sm mt-1">142 requests</p>
        </div>
 
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <p className="text-slate-400">Top Category</p>
          <h2 className="text-xl font-bold mt-2">Passive Components</h2>
          <p className="text-slate-400 text-sm mt-1">312 requests</p>
        </div>
      </div>
 
      {/* Most Requested Components Table */}
      <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl overflow-hidden mb-8">
        <div className="p-5 border-b border-cyan-900/30">
          <h2 className="text-xl font-semibold">Most Requested Components</h2>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111827]">
              <tr>
                <th className="text-left px-6 py-4">Rank</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Total Requests</th>
                <th className="text-left px-6 py-4">Approved</th>
                <th className="text-left px-6 py-4">Rejected</th>
                <th className="text-left px-6 py-4">Avg Quantity</th>
                <th className="text-left px-6 py-4">Trend</th>
              </tr>
            </thead>
 
            <tbody>
              {topComponents.map((item) => (
                <tr
                  key={item.rank}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-6 py-4 text-slate-300">#{item.rank}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4 text-slate-300">{item.category}</td>
                  <td className="px-6 py-4">{item.total}</td>
                  <td className="px-6 py-4 text-green-400">{item.approved}</td>
                  <td className="px-6 py-4 text-red-400">{item.rejected}</td>
                  <td className="px-6 py-4 text-slate-300">{item.avgQty}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${getTrendStyle(
                        item.trend
                      )}`}
                    >
                      {getTrendIcon(item.trend)}
                      {item.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Bottom Side-by-Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand By Category */}
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-cyan-900/30">
            <h2 className="text-xl font-semibold">Demand By Category</h2>
          </div>
 
          <div className="p-5 space-y-5">
            {demandByCategory.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{item.category}</span>
                  <span className="text-slate-400">
                    {item.requests} requests · {item.approvalRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: `${item.approvalRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Request Purposes */}
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-cyan-900/30">
            <h2 className="text-xl font-semibold">Request Purposes</h2>
          </div>
 
          <div className="p-5 space-y-5">
            {requestPurposes.map((item) => (
              <div key={item.purpose}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{item.purpose}</span>
                  <span className="text-slate-400">
                    {item.count} · {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ComponentDemand;