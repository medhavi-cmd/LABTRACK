import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Settings as SettingsIcon, 
  Cloud, 
  HelpCircle, 
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Local Form States for Student Group Leader
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    academicEmail: "john.doe@university.edu",
    studentId: "EME-2023-0045",
    department: "Mechanical Engineering"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { id: "profile", label: "Profile Settings" },
    { id: "team", label: "Team Preferences" },
    { id: "security", label: "Security & 2FA" },
    { id: "permissions", label: "Lab Permissions" },
  ];

  return (
    <GroupLeaderLayout >
        <div className="min-h-screen bg-[#0b1326] text-white p-6 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your student profile, team project defaults, and security credentials.
        </p>
      </div>

      {/* HORIZONTAL NAVIGATION TABS */}
      <div className="flex items-center gap-8 border-b border-slate-800/60 mb-8 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-medium tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-cyan-400 text-cyan-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: FORM DETAILS (Takes up 2/3 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[#07111f] rounded-xl border border-cyan-900/10 p-6 shadow-xl">
            
            {/* Card Header Header */}
            <div className="flex items-center gap-2.5 border-b border-slate-800/40 pb-4 mb-6">
              <User size={18} className="text-cyan-400" />
              <h2 className="text-base font-bold text-slate-200 tracking-wide">
                Personal Information
              </h2>
            </div>

            {/* Input Grid Field Layout */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Full Name Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 bg-[#111c30] border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                {/* Academic Email Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                    Academic Email
                  </label>
                  <input
                    type="email"
                    name="academicEmail"
                    value={formData.academicEmail}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 bg-[#111c30] border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                {/* Student ID Code Row Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                    Student / Group Leader ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    disabled
                    value={formData.studentId}
                    className="w-full h-11 px-4 bg-[#111c30]/50 border border-slate-800/60 rounded-lg text-slate-500 text-sm cursor-not-allowed select-none"
                  />
                </div>

                {/* Primary Department Selection Component */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                    Primary Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 bg-[#111c30] border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Computer Science">Computer Science & Bio-Informatics</option>
                  </select>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="flex items-center justify-end gap-5 pt-4 border-t border-slate-800/40 mt-4">
                <button
                  type="button"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-5 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider bg-cyan-400 hover:bg-cyan-300 text-[#00363e] rounded-md shadow-lg transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDE METRICS DRAWERS (Takes up 1/3 col) */}
        <div className="flex flex-col gap-6">
          
          {/* USER CARD PROFILE PREVIEW */}
          <div className="bg-[#07111f] rounded-xl border border-cyan-900/10 p-6 flex flex-col items-center text-center shadow-xl">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-500/30 overflow-hidden relative group mb-4">
              {/* Static Avatar fallback with first letter */}
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-cyan-400">
                {formData.fullName.charAt(0)}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-200 tracking-wide">{formData.fullName}</h3>
            <p className="text-xs font-medium text-cyan-400 tracking-wider font-mono uppercase mt-0.5">
              Student Group Leader
            </p>

            {/* Quick Micro Status Panel Indicators */}
            <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-800/40 pt-4 mt-5 text-left">
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
                  Projects
                </span>
                <span className="text-sm font-semibold text-slate-200">2 Active</span>
              </div>
              <div className="border-l border-slate-800/40 pl-4">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
                  Trust Score
                </span>
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                  98/100
                </span>
              </div>
            </div>
          </div>

          {/* STORAGE METRIC WIDGET */}
          <div className="bg-[#07111f] rounded-xl border border-cyan-900/10 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Cloud size={16} className="text-slate-400" />
              <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-slate-400">
                Lab Cloud Usage
              </h4>
            </div>
            
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-100">84%</span>
              <span className="text-xs text-slate-400 font-mono font-medium">4.2TB / 5TB</span>
            </div>

            {/* Accent Storage Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3.5">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: "84%" }}></div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              Your team is reaching the tiered storage allocation limit for your active Capstone research datasets.
            </p>
          </div>

          {/* HELP AND ESCALATION REDIRECT BUTTON */}
          <div className="bg-[#07111f] rounded-xl border border-cyan-900/10 p-5 shadow-xl flex items-start gap-4">
            <div className="p-2 bg-slate-800/60 rounded-lg text-cyan-400 shrink-0">
              <HelpCircle size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-200 tracking-wide">Need Help?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contact the EME IT Helpdesk if you require project role or permission overrides.
              </p>
              <a 
                href="#ticket" 
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors pt-1.5 group"
              >
                Open Support Ticket 
                <ExternalLink size={11} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
    </GroupLeaderLayout>
  );
}