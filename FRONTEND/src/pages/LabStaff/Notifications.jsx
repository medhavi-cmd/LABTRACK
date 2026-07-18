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
  Success: "bg-green-50 text-green-600 border border-green-200",
  Warning: "bg-amber-50 text-amber-500 border border-amber-200",
  Inventory: "bg-cyan-50 text-cyan-600 border border-cyan-200",
  Request: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  Rejected: "bg-red-50 text-red-600 border border-red-200",
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
    <div className="">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="ls-title-main">Notifications</h1>
          <p className="ls-text-secondary mt-1">
            Stay updated with lab activities and alerts
          </p>
        </div>
 
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 ls-btn-primary px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Mark All as Read
        </button>
      </div>
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="ls-card">
          <p className="ls-text-secondary">Unread</p>
          <h2 className="ls-stat-value text-cyan-600 mt-2">
            {unreadCount}
          </h2>
        </div>
 
        <div className="ls-card">
          <p className="ls-text-secondary">Today</p>
          <h2 className="ls-stat-value">{todayCount}</h2>
        </div>
 
        <div className="ls-card">
          <p className="ls-text-secondary">Urgent</p>
          <h2 className="ls-stat-value text-red-600">
            {urgentCount}
          </h2>
        </div>
      </div>
 
      {/* Notifications List */}
      <div className="bg-white border border-cyan-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-cyan-200">
          <h2 className="ls-title-card">All Notifications</h2>
        </div>
 
        <div className="divide-y divide-slate-100">
          {notifications.map((item) => {
            const Icon = typeIcons[item.type];
 
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-5 hover:bg-slate-50"
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
                      <span className="bg-cyan-50 text-cyan-600 border border-cyan-200 px-2 py-0.5 rounded-full text-xs">
                        New
                      </span>
                    )}
                  </div>
                  <p className="ls-text-secondary text-sm mt-1">
                    {item.description}
                  </p>
                </div>
 
                <span className="ls-text-secondary text-sm whitespace-nowrap">
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