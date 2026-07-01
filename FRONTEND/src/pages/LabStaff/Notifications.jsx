import React, { useState } from "react";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiPackage,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
 
const initialNotifications = [
  {
    id: 1,
    title: "Request Approved",
    description:
      "Component request REQ-1023 from Sarah Johnson has been approved",
    time: "5 minutes ago",
    type: "Success",
    unread: true,
  },
  {
    id: 2,
    title: "Overdue Return Alert",
    description: "Component ISS-540 issued to David Lee is 3 days overdue",
    time: "1 hour ago",
    type: "Warning",
    unread: true,
  },
  {
    id: 3,
    title: "Low Stock Alert",
    description: "Resistor 10kΩ stock is critically low (45/100)",
    time: "2 hours ago",
    type: "Inventory",
    unread: true,
  },
  {
    id: 4,
    title: "New Request Pending",
    description: "Michael Chen has requested Raspberry Pi 4 (Qty: 1)",
    time: "3 hours ago",
    type: "Request",
    unread: false,
  },
  {
    id: 5,
    title: "Request Rejected",
    description:
      "Component request REQ-1020 from James Wilson has been rejected",
    time: "5 hours ago",
    type: "Rejected",
    unread: false,
  },
  {
    id: 6,
    title: "Component Returned",
    description: "Alex Kumar returned Oscilloscope Probe in good condition",
    time: "6 hours ago",
    type: "Success",
    unread: false,
  },
  {
    id: 7,
    title: "Damage Component Filed",
    description:
      "New damage component DMG-045 for Power Supply has been filed",
    time: "1 day ago",
    type: "Warning",
    unread: false,
  },
  {
    id: 8,
    title: "Low Stock Alert",
    description: "Breadboard 830 stock is critically low (15/50)",
    time: "1 day ago",
    type: "Inventory",
    unread: false,
  },
];
 
const typeStyles = {
  Success: "bg-green-500/10 text-green-400 border border-green-500/30",
  Warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  Inventory: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
  Request: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  Rejected: "bg-red-500/10 text-red-400 border border-red-500/30",
};
 
const typeIcons = {
  Success: FiCheckCircle,
  Warning: FiAlertTriangle,
  Inventory: FiPackage,
  Request: FiClock,
  Rejected: FiXCircle,
};
 
const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
 
  const unreadCount = notifications.filter((n) => n.unread).length;
  const todayCount = 24;
  const urgentCount = 5;
 
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };
 
  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-slate-400 mt-1">
            Stay updated with lab activities and alerts
          </p>
        </div>
 
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Mark All as Read
        </button>
      </div>
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <p className="text-slate-400">Unread</p>
          <h2 className="text-3xl font-bold text-cyan-400 mt-2">
            {unreadCount}
          </h2>
        </div>
 
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <p className="text-slate-400">Today</p>
          <h2 className="text-3xl font-bold mt-2">{todayCount}</h2>
        </div>
 
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <p className="text-slate-400">Urgent</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {urgentCount}
          </h2>
        </div>
      </div>
 
      {/* Notifications List */}
      <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-cyan-900/30">
          <h2 className="text-xl font-semibold">All Notifications</h2>
        </div>
 
        <div className="divide-y divide-slate-800">
          {notifications.map((item) => {
            const Icon = typeIcons[item.type];
 
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-5 hover:bg-slate-900/40"
              >
                <div
                  className={`p-2.5 rounded-lg ${typeStyles[item.type]}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
 
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.unread && (
                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full text-xs">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    {item.description}
                  </p>
                </div>
 
                <span className="text-slate-500 text-sm whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
 
export default Notifications;