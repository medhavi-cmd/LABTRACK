import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";

import { StepIndicator } from "../../components/ui/StepIndicator";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { registerTeam } from "../../services/teamApi";

export default function ReviewTeamDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const projectData = location.state?.projectData;
  const teamData = location.state?.teamData;

  // Catch anomalies and force fallback loop
  useEffect(() => {
  if (!projectData || !teamData) {
    navigate("/student/team-management", { replace: true });
  }
}, [projectData, teamData, navigate]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalDeploymentSubmit = async () => {
  try {
    setIsSubmitting(true);

    const memberEnrollmentNumbers = teamData.members
      .filter(
        (member) =>
          String(member.enrollmentNo) !==
          String(teamData.leader.enrollment_no)
      )
      .map((member) => String(member.enrollmentNo));

    await registerTeam({
      projectName: projectData.projectName,
      description: projectData.description,
      memberEnrollmentNumbers,
    });

    alert(
      "Team registered successfully. It is now awaiting faculty approval."
    );

    navigate("/student/team-management", { replace: true });
  } catch (error) {
    alert(error.message || "Failed to register team");
  } finally {
    setIsSubmitting(false);
  }
};

  if (!projectData || !teamData) return null;

  return (
    <GroupLeaderLayout>
      <div className="w-full min-h-screen bg-[#0b1326] text-[#dae2fd] p-8 overflow-y-auto font-sans selection:bg-[#22d3ee]/30 selection:text-[#22d3ee]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1.5">
            Review Team Registration
          </h1>
          <p className="text-sm text-[#bbc9cd]">
            Verify your entry data accurately prior to institutional database
            commit locks.
          </p>
        </div>

        <StepIndicator currentStep={3} />

        <div className="max-w-5xl mx-auto mt-8 space-y-6">
          {/* SECURITY BANNER */}
          <div className="w-full bg-[#11253e] border border-[#1e4273] rounded-lg p-4 flex items-start gap-3">
            <ShieldCheck className="text-[#22d3ee] shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-sm font-bold text-white">
                System Data Lock Notice
              </h4>
              <p className="text-xs text-[#bbc9cd] mt-0.5 leading-relaxed">
                Confirming registry submission assigns your dynamic team
                workspace profile parameters to the verification route.
                Modifications cannot be performed mid-transit during review
                cycles.
              </p>
            </div>
          </div>

          {/* PROJECT CORE SUMMARY CARD */}
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-2.5 border-b border-[#222a3d] pb-4 mb-6">
              <FileText size={18} className="text-[#22d3ee]" />
              <h2 className="text-base font-bold tracking-wide text-[#dae2fd]">
                Project Core Parameters
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3 bg-[#0b1326] border border-[#222a3d]/60 rounded-md p-4">
                <span className="block font-mono text-[10px] tracking-widest text-[#859397] uppercase mb-1">
                  Registered Project Name
                </span>
                <span className="text-base font-bold text-white">
                  {projectData.projectName}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#859397] uppercase mb-1">
                  Academic Department
                </span>
                <span className="text-sm font-semibold text-[#dae2fd]">
                  {projectData.department}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#859397] uppercase mb-1">
                  Calendar Allocation Year
                </span>
                <span className="text-sm font-mono text-[#22d3ee]">
                  {projectData.year}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#859397] uppercase mb-1">
                  Section Track ID
                </span>
                <span className="text-sm font-semibold text-[#dae2fd]">
                  {projectData.section}
                </span>
              </div>

              <div className="md:col-span-3 bg-[#0b1326]/40 p-4 rounded-md border border-[#222a3d]/40 text-xs leading-relaxed text-[#bbc9cd]">
                <span className="block font-mono text-[9px] text-[#859397] uppercase tracking-wider mb-1">
                  Abstract Profile Description
                </span>
                {projectData.description}
              </div>
            </div>
          </div>

          {/* ARCHITECTURE LEADER SUMMARY */}
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-2.5 border-b border-[#222a3d] pb-4 mb-6">
              <Layers size={18} className="text-[#22d3ee]" />
              <h2 className="text-base font-bold tracking-wide text-[#dae2fd]">
                Team Leader Metadata Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#859397] uppercase mb-0.5">
                  Leader Identity Name
                </span>
                <p className="text-sm font-bold text-white">
                  {teamData.leader?.name || "—"}
                </p>
              </div>

              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#859397] uppercase mb-0.5">
                  Enrollment ID Registry
                </span>
                <p className="text-sm font-mono text-[#22d3ee] font-bold">
                  {teamData.leader?.enrollment_no ||
                    teamData.leader?.enrollmentNo ||
                    "—"}
                </p>
              </div>

              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#859397] uppercase mb-0.5">
                  Institutional Contact
                </span>
                <p className="text-xs text-[#bbc9cd] truncate">
                  {teamData.leader?.email || "Not available"}
                </p>
              </div>

              <div>
                <span className="block font-mono text-[10px] tracking-widest text-[#859397] uppercase mb-0.5">
                  Secure Comms Line
                </span>
                <p className="text-sm text-[#bbc9cd]">
                  {teamData.leader?.phone_no ||
                    teamData.leader?.phone ||
                    "Not available"}
                </p>
              </div>
            </div>
          </div>

          {/* MATRIX TEAM SUMMARY CARDS */}
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-2.5 border-b border-[#222a3d] pb-4 mb-6">
              <Users size={18} className="text-[#22d3ee]" />
              <h2 className="text-base font-bold tracking-wide text-[#dae2fd]">
                Allocated Members Array Matrix ({teamData.members.length})
              </h2>
            </div>

            <div className="divide-y divide-[#222a3d]/50 space-y-4">
              {teamData.members.map((member, i) => (
                <div
                  key={member.id}
                  className="pt-4 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                >
                  <div className="md:col-span-1">
                    <div className="w-7 h-7 rounded bg-[#0b1326] border border-[#222a3d] flex items-center justify-center font-mono text-xs text-[#22d3ee] font-bold">
                      0{i + 1}
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-sm font-bold text-white">
                      {member.name || "—"}
                    </p>
                    <p className="text-xs font-mono text-[#859397]">
                      {member.enrollmentNo || "—"}
                    </p>
                  </div>
                  <div className="md:col-span-4">
                    <p className="text-xs text-[#bbc9cd] truncate">
                      {member.email || "—"}
                    </p>
                    <p className="text-xs text-[#859397]">
                      {member.phone || "—"}
                    </p>
                  </div>
                  <div className="md:col-span-4">
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-[#00363e]/40 border border-[#22d3ee]/20 text-[#22d3ee]">
                      {member.role || "Unspecified architecture track"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FINAL INTERACTION CONTROL FOOTER */}
          <div className="flex items-center justify-between bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 shadow-xl">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                navigate("/student/team-management/add-members", {
                  state: { projectData, teamData },
                })
              }
              className="flex items-center gap-2 text-sm font-semibold text-[#bbc9cd] hover:text-white transition-colors disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Back to Editing
            </button>

            <button
              type="button"
              onClick={handleFinalDeploymentSubmit}
              disabled={isSubmitting}
              className="h-11 px-6 bg-[#22d3ee] text-[#00363e] rounded-md text-sm font-bold shadow-xl shadow-[#22d3ee]/10 hover:bg-[#8aebff] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles size={16} />
              {isSubmitting ? "Locking Registry..." : "Confirm & Final Submit"}
            </button>
          </div>
        </div>
      </div>
    </GroupLeaderLayout>
  );
}
