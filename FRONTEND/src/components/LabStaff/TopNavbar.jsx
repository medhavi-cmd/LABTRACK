import React from "react";
import { FiBell, FiUser, FiLogOut, FiSettings, FiSearch } from "react-icons/fi";

const TopNavbar = ({ user = { name: "abc", role: "Lab Staff" } }) => {
  return (
    <header className="h-20 bg-[#07111f] border-b border-cyan-900/20 flex items-center justify-between px-8">
      
      {/* Left */}
      <div>
        <h1 className="text-white text-2xl font-bold">
          LABTRACK
        </h1>
        <p className="text-slate-400 text-sm">
          BML MUNJAL UNIVERSITY
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="hidden md:flex items-center bg-[#0b1728] border border-cyan-900/20 rounded-xl px-4 py-2 w-80">
          <FiSearch className="text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search systems, reports..."
            className="bg-transparent outline-none text-white w-full placeholder:text-slate-500"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-cyan-400 transition">
          <FiBell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="text-slate-400 hover:text-cyan-400 transition">
          <FiSettings size={22} />
        </button>

        <div className="h-8 w-px bg-slate-700"></div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <FiUser size={22} className="text-cyan-400" />
          </div>

          <div className="hidden md:block">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-slate-400 text-sm">{user.role}</p>
          </div>

          <button className="text-slate-400 hover:text-red-400 transition">
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;