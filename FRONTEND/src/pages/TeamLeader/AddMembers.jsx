import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Users, 
  Plus, 
  ChevronDown, 
  Trash2, 
  AlertCircle,
  ArrowLeft 
} from "lucide-react";

import { StepIndicator } from "../../components/ui/StepIndicator";
import { ContentCard } from "../../components/ui/ContentCard";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";

export default function AddMembers() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Intercept data passed down from step 1
  const projectData = location.state?.projectData;

  // Safety Redirect: Guard rails in case the user forces route navigation directly
  useEffect(() => {
    if (!projectData) {
      navigate("/Team-Management");
    }
  }, [projectData, navigate]);

  const existingTeamData = location.state?.teamData || {};

  // 1. Team Leader Form State
  const [leaderDetails, setLeaderDetails] = useState({
    fullName: existingTeamData.leaderDetails?.fullName || "",
    enrollmentNumber: existingTeamData.leaderDetails?.enrollmentNumber || "",
    institutionalEmail: existingTeamData.leaderDetails?.institutionalEmail || "",
    phoneNumber: existingTeamData.leaderDetails?.phoneNumber || ""
  });

  // 2. Dynamic Team Members State array
  const [members, setMembers] = useState(existingTeamData.members || [
    { id: crypto.randomUUID(), fullName: "", enrollmentNo: "", email: "", phone: "", role: "" }
  ]);

  const [errors, setErrors] = useState({});

  const handleLeaderChange = (e) => {
    const { name, value } = e.target;
    setLeaderDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleMemberChange = (id, field, value) => {
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const addMemberRow = () => {
    if (members.length >= 6) return;
    setMembers(prev => [
      ...prev,
      { id: crypto.randomUUID(), fullName: "", enrollmentNo: "", email: "", phone: "", role: "" }
    ]);
  };

  const removeMemberRow = (id) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!leaderDetails.fullName.trim()) newErrors.fullName = "Required";
    if (!leaderDetails.enrollmentNumber.trim()) newErrors.enrollmentNumber = "Required";
    if (!leaderDetails.institutionalEmail.trim()) newErrors.institutionalEmail = "Required";
    if (!leaderDetails.phoneNumber.trim()) newErrors.phoneNumber = "Required";

    members.forEach((member, index) => {
      if (!member.fullName.trim() || !member.enrollmentNo.trim() || !member.email.trim() || !member.role) {
        newErrors[`member-${index}`] = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please populate all required workspace fields marked with *");
      return;
    }

    // Bundle everything together to dispatch down to Step 3 Review Screen
    navigate("/Team-Management/Review-Team", {
      state: {
        projectData,
        teamData: { leaderDetails, members }
      }
    });
  };

  if (!projectData) return null;

  return (
    <GroupLeaderLayout>
      <div className="w-full min-h-screen bg-[#0b1326] text-[#dae2fd] p-8 overflow-y-auto font-sans selection:bg-[#22d3ee]/30 selection:text-[#22d3ee]">
        
        {/* HEADER ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1.5">Register Project Team</h1>
            <p className="text-sm text-[#bbc9cd]">Provide team architecture structure parameters for project code: <span className="text-[#22d3ee] font-mono">{projectData.projectName}</span></p>
          </div>
        </div>

        <StepIndicator currentStep={2} />

        <div className="max-w-5xl mx-auto mt-8 bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleNextStep} className="space-y-10">
            
            {/* TEAM LEADER CONFIGURATION */}
            <div>
              <div className="flex items-center gap-2.5 border-b border-[#222a3d] pb-4 mb-6">
                <User size={18} className="text-[#22d3ee]" />
                <h2 className="text-base font-bold tracking-wide text-[#dae2fd]">Team Leader Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#bbc9cd] flex justify-between">
                    <span>Full Name *</span>
                    {errors.fullName && <span className="text-red-400 text-[11px]">Required</span>}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={leaderDetails.fullName}
                    onChange={handleLeaderChange}
                    placeholder="John Doe"
                    className="w-full h-11 bg-[#0b1326] border border-[#222a3d] rounded-md px-4 text-sm text-white outline-none focus:border-[#22d3ee] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#bbc9cd] flex justify-between">
                    <span>Enrollment Number *</span>
                    {errors.enrollmentNumber && <span className="text-red-400 text-[11px]">Required</span>}
                  </label>
                  <input
                    type="text"
                    name="enrollmentNumber"
                    value={leaderDetails.enrollmentNumber}
                    onChange={handleLeaderChange}
                    placeholder="EME-2023-0045"
                    className="w-full h-11 bg-[#0b1326] border border-[#222a3d] font-mono rounded-md px-4 text-sm text-white outline-none focus:border-[#22d3ee] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#bbc9cd] flex justify-between">
                    <span>Institutional Email *</span>
                    {errors.institutionalEmail && <span className="text-red-400 text-[11px]">Required</span>}
                  </label>
                  <input
                    type="email"
                    name="institutionalEmail"
                    value={leaderDetails.institutionalEmail}
                    onChange={handleLeaderChange}
                    placeholder="john.doe@university.edu"
                    className="w-full h-11 bg-[#0b1326] border border-[#222a3d] rounded-md px-4 text-sm text-white outline-none focus:border-[#22d3ee] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#bbc9cd] flex justify-between">
                    <span>Phone Number *</span>
                    {errors.phoneNumber && <span className="text-red-400 text-[11px]">Required</span>}
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={leaderDetails.phoneNumber}
                    onChange={handleLeaderChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-11 bg-[#0b1326] border border-[#222a3d] rounded-md px-4 text-sm text-white outline-none focus:border-[#22d3ee] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC TEAM MATRIX CARDS */}
            <div>
              <div className="flex items-center justify-between border-b border-[#222a3d] pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <Users size={18} className="text-[#22d3ee]" />
                  <h2 className="text-base font-bold tracking-wide text-[#dae2fd]">Team Members</h2>
                </div>
                <span className="font-mono text-[11px] text-[#859397]">{members.length} / 6 Active</span>
              </div>

              <div className="space-y-6">
                {members.map((member, index) => (
                  <div key={member.id} className="relative p-5 rounded-lg bg-[#0f172a]/40 border border-[#222a3d]/70 transition-all">
                    {errors[`member-${index}`] && (
                      <div className="text-xs text-red-400 font-medium mb-3 flex items-center gap-1.5">
                        <AlertCircle size={14}/> Row {index + 1}: Please populate all structural required metrics (*).
                      </div>
                    )}

                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMemberRow(member.id)}
                        className="absolute top-4 right-4 text-[#859397] hover:text-red-400 p-1.5 rounded transition-all bg-[#0b1326] border border-[#222a3d]"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-[#bbc9cd]">Full Name *</label>
                          <input
                            type="text"
                            value={member.fullName}
                            onChange={(e) => handleMemberChange(member.id, 'fullName', e.target.value)}
                            className="w-full h-10 bg-[#0b1326] border border-[#222a3d] text-white text-sm rounded-md px-3 outline-none focus:border-[#22d3ee]"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-[#bbc9cd]">Enrollment No *</label>
                          <input
                            type="text"
                            value={member.enrollmentNo}
                            onChange={(e) => handleMemberChange(member.id, 'enrollmentNo', e.target.value)}
                            className="w-full h-10 bg-[#0b1326] border border-[#222a3d] font-mono text-white text-sm rounded-md px-3 outline-none focus:border-[#22d3ee]"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-[#bbc9cd]">Email *</label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                            className="w-full h-10 bg-[#0b1326] border border-[#222a3d] text-white text-sm rounded-md px-3 outline-none focus:border-[#22d3ee]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-[#bbc9cd]">Phone Number</label>
                          <input
                            type="text"
                            value={member.phone}
                            onChange={(e) => handleMemberChange(member.id, 'phone', e.target.value)}
                            className="w-full h-10 bg-[#0b1326] border border-[#222a3d] text-white text-sm rounded-md px-3 outline-none focus:border-[#22d3ee]"
                          />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="text-xs text-[#bbc9cd]">Role in Project *</label>
                          <div className="relative w-full">
                            <select
                              value={member.role}
                              onChange={(e) => handleMemberChange(member.id, 'role', e.target.value)}
                              className="w-full h-10 bg-[#0b1326] border border-[#222a3d] text-[#dae2fd] text-sm rounded-md px-3 pr-10 outline-none appearance-none cursor-pointer focus:border-[#22d3ee]"
                            >
                              <option value="" disabled hidden>Select an architecture role...</option>
                              <option value="Hardware Engineer">Hardware Engineer / Core Architect</option>
                              <option value="Firmware Developer">Firmware & Embedded Systems Lead</option>
                              <option value="Data Analyst">Data Modeler & Analyst</option>
                              <option value="Research Lead">Research Assistant</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#859397]">
                              <ChevronDown size={14} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addMemberRow}
                disabled={members.length >= 6}
                className="w-full h-11 border border-dashed border-[#222a3d] hover:border-[#3c494c] rounded-md mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[#bbc9cd] transition-all disabled:opacity-40"
              >
                <Plus size={14} className="text-[#22d3ee]" /> Add Another Member
              </button>
            </div>

            {/* ACTION NAV BAR */}
            <div className="flex items-center justify-between border-t border-[#222a3d] pt-6">
              <button
                type="button"
                onClick={() => navigate("/Team-Management", { state: { projectData } })}
                className="flex items-center gap-2 text-sm font-semibold text-[#859397] hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back to Project Details
              </button>
              <button
                type="submit"
                className="h-10 px-6 bg-[#22d3ee] text-[#00363e] rounded-md text-sm font-bold shadow-lg hover:bg-[#8aebff] transition-all"
              >
                Review Registration
              </button>
            </div>

          </form>
        </div>
      </div>
    </GroupLeaderLayout>
  );
}