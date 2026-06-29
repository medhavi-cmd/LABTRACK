import React, { useState } from "react";
 
const initialProfile = {
  firstName: "Admin",
  lastName: "Staff",
  email: "admin@labtrack.edu",
  phone: "+1 (555) 123-4567",
};
 
const initialToggles = {
  newRequest: true,
  overdueReturn: true,
  lowStock: true,
  damageReport: true,
  email: false,
};
 
const initialSystemSettings = {
  autoApproveThreshold: 7,
  defaultMinStock: 50,
  defaultReturnPeriod: 30,
};
 
const Toggle = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-cyan-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};
 
const Settings = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [toggles, setToggles] = useState(initialToggles);
  const [systemSettings, setSystemSettings] = useState(initialSystemSettings);
 
  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };
 
  const handleToggle = (field) => {
    setToggles((prev) => ({ ...prev, [field]: !prev[field] }));
  };
 
  const handleSystemChange = (field, value) => {
    setSystemSettings((prev) => ({ ...prev, [field]: value }));
  };
 
  const handleSaveProfile = () => {
    alert("Profile updated successfully");
  };
 
  const handleUpdateSettings = () => {
    alert("Settings updated successfully");
  };
 
  const notificationItems = [
    {
      key: "newRequest",
      title: "New Request Notifications",
      description: "Get notified when students submit new requests",
    },
    {
      key: "overdueReturn",
      title: "Overdue Return Alerts",
      description: "Receive alerts for overdue component returns",
    },
    {
      key: "lowStock",
      title: "Low Stock Warnings",
      description: "Alert when component stock falls below minimum",
    },
    {
      key: "damageReport",
      title: "Damage Report Notifications",
      description: "Get notified about new damage reports",
    },
    {
      key: "email",
      title: "Email Notifications",
      description: "Receive notifications via email",
    },
  ];
 
  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">
          Configure system preferences and notifications
        </p>
      </div>
 
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <p className="text-slate-400 mt-1 mb-5">
            Update your account information
          </p>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) =>
                  handleProfileChange("firstName", e.target.value)
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
              />
            </div>
 
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) =>
                  handleProfileChange("lastName", e.target.value)
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
              />
            </div>
 
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  handleProfileChange("email", e.target.value)
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
              />
            </div>
 
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  handleProfileChange("phone", e.target.value)
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
              />
            </div>
          </div>
 
          <button
            onClick={handleSaveProfile}
            className="mt-5 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
 
        {/* Notification Preferences */}
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <h2 className="text-xl font-semibold">Notification Preferences</h2>
          <p className="text-slate-400 mt-1 mb-5">
            Manage how you receive notifications
          </p>
 
          <div className="divide-y divide-slate-800">
            {notificationItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {item.description}
                  </p>
                </div>
                <Toggle
                  checked={toggles[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
              </div>
            ))}
          </div>
        </div>
 
        {/* System Settings */}
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-5">
          <h2 className="text-xl font-semibold">System Settings</h2>
          <p className="text-slate-400 mt-1 mb-5">
            Configure system preferences
          </p>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Auto-Approve Threshold (Days)
              </label>
              <input
                type="number"
                value={systemSettings.autoApproveThreshold}
                onChange={(e) =>
                  handleSystemChange("autoApproveThreshold", e.target.value)
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
              />
              <p className="text-slate-500 text-xs mt-2">
                Maximum days before pending requests are auto-rejected
              </p>
            </div>
 
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Default Minimum Stock Level
              </label>
              <input
                type="number"
                value={systemSettings.defaultMinStock}
                onChange={(e) =>
                  handleSystemChange("defaultMinStock", e.target.value)
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
              />
              <p className="text-slate-500 text-xs mt-2">
                Default minimum quantity for new components
              </p>
            </div>
 
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Default Return Period (Days)
              </label>
              <input
                type="number"
                value={systemSettings.defaultReturnPeriod}
                onChange={(e) =>
                  handleSystemChange("defaultReturnPeriod", e.target.value)
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
              />
              <p className="text-slate-500 text-xs mt-2">
                Default return deadline for issued components
              </p>
            </div>
          </div>
 
          <button
            onClick={handleUpdateSettings}
            className="mt-5 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Update Settings
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default Settings;