import React from "react";
import {
  FiGrid,
  FiPackage,
  FiCheckSquare,
  FiTrendingUp,
  FiRotateCcw,
  FiAlertTriangle,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: FiGrid, path: "/lab-staff/dashboard" },
    { label: "Inventory Management", icon: FiPackage, path: "/lab-staff/inventory" },
    { label: "Component Requests", icon: FiCheckSquare, path: "/lab-staff/requests" },
    { label: "Issued Components", icon: FiTrendingUp, path: "/lab-staff/issued" },
    { label: "Return Management", icon: FiRotateCcw, path: "/lab-staff/returns" },
    { label: "Damage Reports", icon: FiAlertTriangle, path: "/lab-staff/damage" },
    { label: "Component Demand", icon: FiTrendingUp, path: "/lab-staff/demand" },
    { label: "Notifications", icon: FiBell, path: "/lab-staff/notifications" },
    { label: "Settings", icon: FiSettings, path: "/lab-staff/settings" },
  ];

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-cyan-600 p-2 rounded-md text-white"
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#07111f] border-r border-cyan-900/30 text-white z-40 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-cyan-900/20">
          <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">
            LABTRACK
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Lab Staff Portal
          </p>
        </div>

        {/* Menu */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    active
                      ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;