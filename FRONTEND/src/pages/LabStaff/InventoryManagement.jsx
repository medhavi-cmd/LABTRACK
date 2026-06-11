import React from "react";
import { FiSearch, FiPlus } from "react-icons/fi";

const InventoryManagement = () => {
  const components = [
    {
      name: "Arduino Uno",
      category: "Microcontroller",
      quantity: 25,
      status: "Available",
    },
    {
      name: "Raspberry Pi 4",
      category: "SBC",
      quantity: 10,
      status: "Available",
    },
    {
      name: "Breadboard",
      category: "Prototyping",
      quantity: 0,
      status: "Out of Stock",
    },
    {
      name: "LED Pack",
      category: "Electronics",
      quantity: 5,
      status: "Low Stock",
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Available") {
      return "bg-green-500/10 text-green-400 border border-green-500/30";
    }

    if (status === "Low Stock") {
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
    }

    return "bg-red-500/10 text-red-400 border border-red-500/30";
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-slate-400 mt-1">
            Manage and monitor laboratory components
          </p>
        </div>

        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium">
          <FiPlus />
          Add Component
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <FiSearch className="absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search component..."
          className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-cyan-500"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Components</p>
          <h2 className="text-3xl font-bold mt-2">245</h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Available</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">180</h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Low Stock</p>
          <h2 className="text-3xl font-bold text-yellow-400 mt-2">25</h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Out of Stock</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">40</h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Components List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111827]">
              <tr>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Quantity</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {components.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4 text-slate-300">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
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

export default InventoryManagement;