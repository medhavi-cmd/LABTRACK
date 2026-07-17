
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Users, ArrowLeft, ShieldCheck, FileText, Layers, Sparkles } from "lucide-react";
import {toast} from "sonner";
import { StepIndicator } from "../../components/ui/StepIndicator";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { registerTeam } from "../../services/teamApi";

export default function ReviewTeamDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const projectData = location.state?.projectData;
  const teamData = location.state?.teamData;

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
            String(member.enrollmentNo) !== String(teamData.leader.enrollment_no)
        )
        .map((member) => String(member.enrollmentNo));

      await registerTeam({
        projectName: projectData.projectName,
        description: projectData.description,
        department: projectData.department,
        year: projectData.year,
        section: projectData.section,
        facultyIds:
          (projectData.selectedFaculty || []).map(
          faculty=>faculty.faculty_id
          ),
        memberEnrollmentNumbers,
      });

      toast.success("Team registered successfully!");
      navigate("/student/team-management", { replace: true });
    } catch (error) {
      toast.error(error.message || "Failed to register team");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!projectData || !teamData) return null;

  return (
    <GroupLeaderLayout>
      <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-8 text-xs sm:text-sm text-[#4B5563] space-y-6 max-w-5xl mx-auto">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">
            Review Team Registration
          </h1>
          <p className="text-[#6B7280] mt-1">
            Review your project and team details before submitting your registration.
          </p>
        </div>

        <StepIndicator currentStep={3} />

        <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="text-[#2563EB] shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="font-bold text-[#111827]">Before You Submit</h4>
            <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">
              Please review all the information carefully before submitting. Once your team is registered, it will be sent for faculty approval and changes cannot be made until the review process is complete.
            </p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <FileText size={18} className="text-[#2563EB]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              Project Details
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Project Name
              </span>
              <span className="text-sm sm:text-base font-bold text-[#111827] mt-0.5 block">
                {projectData.projectName}
              </span>
            </div>

            <div>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Department
              </span>
              <span className="text-[#111827] font-medium mt-0.5 block">
                {projectData.department}
              </span>
            </div>

            <div>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Academic Year
              </span>
              <span className="font-mono text-[#2563EB] font-bold mt-0.5 block">
                {projectData.year}
              </span>
            </div>

            <div>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Section
              </span>
              <span className="text-[#111827] font-medium mt-0.5 block">
                {projectData.section}
              </span>
            </div>

            <div className="sm:col-span-3">
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase mb-1.5">
                Faculty Mentors
              </span>
              <div className="flex flex-wrap gap-2">
                {projectData.selectedFaculty?.map((faculty) => (
                  <span
                    key={faculty.faculty_id}
                    className="px-2.5 py-0.5 rounded-full text-xs bg-cyan-50 border border-cyan-200 text-cyan-700 font-medium"
                  >
                    {faculty.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="sm:col-span-3 bg-[#F8FAFC]/60 p-4 rounded-xl border border-[#E5E7EB] leading-relaxed">
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase mb-1">
                Project Description
              </span>
              <p className="text-[#4B5563]">{projectData.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <Layers size={18} className="text-[#2563EB]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              Team Leader Details
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Name
              </span>
              <p className="text-[#111827] font-bold mt-0.5">
                {teamData.leader?.name || "—"}
              </p>
            </div>

            <div>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Enrollment Number
              </span>
              <p className="font-mono text-[#2563EB] font-bold mt-0.5">
                {teamData.leader?.enrollment_no || teamData.leader?.enrollmentNo || "—"}
              </p>
            </div>

            <div>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Email
              </span>
              <p className="text-[#4B5563] truncate mt-0.5">
                {teamData.leader?.email || "Not available"}
              </p>
            </div>

            <div>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Contact Number
              </span>
              <p className="text-[#4B5563] mt-0.5">
                {teamData.leader?.phone_no || teamData.leader?.phone || "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <Users size={18} className="text-[#2563EB]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              Team Members ({teamData.members.length})
            </h2>
          </div>

          <div className="divide-y divide-[#E5E7EB] space-y-3.5">
            {teamData.members.map((member, i) => (
              <div
                key={member.id}
                className="pt-3.5 first:pt-0 grid sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-1">
                  <div className="w-7 h-7 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center font-mono text-xs text-[#6B7280] font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <p className="font-bold text-[#111827]">{member.name || "—"}</p>
                  <p className="text-xs font-mono text-[#6B7280] mt-0.5">
                    {member.enrollmentNo || "—"}
                  </p>
                </div>
                <div className="sm:col-span-4">
                  <p className="text-xs text-[#4B5563] truncate">{member.email || "—"}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{member.phone || "—"}</p>
                </div>
                <div className="sm:col-span-3 sm:text-right">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 uppercase tracking-wide">
                    {member.role || "Role not assigned"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() =>
              navigate("/student/team-management/add-members", {
                state: { projectData, teamData },
              })
            }
            className="flex items-center gap-2 font-bold text-[#6B7280] hover:text-[#111827] transition-colors disabled:opacity-40"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={handleFinalDeploymentSubmit}
            disabled={isSubmitting}
            className="bg-[#2563EB] text-white rounded-xl font-bold px-6 py-2.5 sm:py-3 hover:bg-blue-700 transition active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <Sparkles size={16} />
            {isSubmitting ? "Submitting..." : "Submit Team"}
          </button>
        </div>

      </div>
    </GroupLeaderLayout>
  );
}