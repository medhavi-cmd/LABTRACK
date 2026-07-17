import React, { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../../services/labStaffProfileApi";

const initialProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
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
        checked ? "bg-cyan-500" : "bg-slate-300"
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
  const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
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
 
  const handleSaveProfile = async () => {
  try {
    setSaving(true);
    setError("");
    setSuccess("");

    const fullName = `${profile.firstName} ${profile.lastName}`.trim();

    await updateProfile({
      name: fullName,
      phone_no: profile.phone,
    });

    setSuccess("Profile updated successfully.");

    await loadProfile();
  } catch (err) {
    setError(
      err?.response?.data?.message ||
        "Failed to update profile."
    );
  } finally {
    setSaving(false);
  }
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
      title: "Damage Component Notifications",
      description: "Get notified about new damage components",
    },
    {
      key: "email",
      title: "Email Notifications",
      description: "Receive notifications via email",
    },
  ];
const splitName = (name = "") => {
  const parts = (name || "").trim().split(" ");

  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ") ?? "",
  };
};

useEffect(() => {
  loadProfile();
}, []);
const loadProfile = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await getProfile();

    const user = response.data;

    const names = splitName(user.name);

    setProfile({
      firstName: names.firstName,
      lastName: names.lastName,
      email: user.email || "",
      phone: user.phone_no || "",
    });
  } catch (err) {
    setError(
      err?.response?.data?.message ||
        "Failed to load profile."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="ls-title-main">Settings</h1>
        <p className="ls-text-secondary mt-1">
          Configure system preferences and notifications
        </p>
      </div>
 
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="ls-card">
          <h2 className="ls-title-card">Profile Settings</h2>
          <p className="ls-text-secondary mt-1 mb-5">
            Update your account information
          </p>

          {error && (
  <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-red-700">
    {error}
  </div>
)}

{success && (
  <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-700">
    {success}
  </div>
)}


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm ls-text-secondary mb-2">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) =>
                  handleProfileChange("firstName", e.target.value)
                }
                className="ls-input"
              />
            </div>
 
            <div>
              <label className="block text-sm ls-text-secondary mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) =>
                  handleProfileChange("lastName", e.target.value)
                }
                className="ls-input"
              />
            </div>
 
            <div>
              <label className="block text-sm ls-text-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="ls-input bg-slate-100 cursor-not-allowed"
                />
            </div>
 
            <div>
              <label className="block text-sm ls-text-secondary mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  handleProfileChange("phone", e.target.value)
                }
                className="ls-input"
              />
            </div>
          </div>
 
         <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="mt-5 ls-btn-primary px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {saving ? "Saving..." : "Save Changes"}
        </button>     
        </div>
 
        {/* Notification Preferences */}
        <div className="ls-card">
          <h2 className="ls-title-card">Notification Preferences</h2>
          <p className="ls-text-secondary mt-1 mb-5">
            Manage how you receive notifications
          </p>
 
          <div className="divide-y divide-slate-100">
            {notificationItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="ls-text-secondary text-sm mt-1">
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
        <div className="ls-card">
          <h2 className="ls-title-card">System Settings</h2>
          <p className="ls-text-secondary mt-1 mb-5">
            Configure system preferences
          </p>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm ls-text-secondary mb-2">
                Auto-Approve Threshold (Days)
              </label>
              <input
                type="number"
                value={systemSettings.autoApproveThreshold}
                onChange={(e) =>
                  handleSystemChange("autoApproveThreshold", e.target.value)
                }
                className="ls-input"
              />
              <p className="ls-text-secondary text-xs mt-2">
                Maximum days before pending requests are auto-rejected
              </p>
            </div>
 
            <div>
              <label className="block text-sm ls-text-secondary mb-2">
                Default Minimum Stock Level
              </label>
              <input
                type="number"
                value={systemSettings.defaultMinStock}
                onChange={(e) =>
                  handleSystemChange("defaultMinStock", e.target.value)
                }
                className="ls-input"
              />
              <p className="ls-text-secondary text-xs mt-2">
                Default minimum quantity for new components
              </p>
            </div>
 
            <div>
              <label className="block text-sm ls-text-secondary mb-2">
                Default Return Period (Days)
              </label>
              <input
                type="number"
                value={systemSettings.defaultReturnPeriod}
                onChange={(e) =>
                  handleSystemChange("defaultReturnPeriod", e.target.value)
                }
                className="ls-input"
              />
              <p className="ls-text-secondary text-xs mt-2">
                Default return deadline for issued components
              </p>
            </div>
          </div>
 
          <button
            onClick={handleUpdateSettings}
            className="mt-5 ls-btn-primary px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Update Settings
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default Settings;