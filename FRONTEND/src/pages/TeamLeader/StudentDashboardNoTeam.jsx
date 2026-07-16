// ==========================================
// 2. pages/student/StudentDashboardNoTeam.jsx
// ==========================================
import { useNavigate } from "react-router-dom";
import { UserCheck, Users } from "lucide-react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";

export default function StudentDashboardNoTeam() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <GroupLeaderLayout>
      <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto text-xs sm:text-sm text-[#4B5563]">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">
            Welcome Back, {user?.full_name || "Student"}
          </h1>
          <p className="text-[#6B7280] mt-1.5">
            Complete your project onboarding to begin using LabTrack.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 rounded-xl bg-green-50 text-green-600 border border-green-100">
              <UserCheck size={22} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Profile Status
              </p>
              <p className="text-green-700 font-bold mt-0.5">Completed</p>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Team Status
              </p>
              <p className="text-amber-700 font-bold mt-0.5">Team Not Registered</p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-[#111827]">
            Register Your Project Team
          </h2>
          <p className="text-[#4B5563] max-w-2xl leading-relaxed">
            One member from every team should register the project. That member will automatically become the Team Leader.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/student/team-management/register")}
              className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-6 py-2.5 sm:py-3 rounded-xl transition shadow-sm active:scale-[0.98]"
            >
              Register Team
            </button>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
            Project Workflow
          </h2>
          <div className="space-y-3 font-medium">
            <div className="flex items-center gap-2.5 text-green-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-[10px] font-bold border border-green-200">✓</span>
              <span>Account Created</span>
            </div>
            <div className="flex items-center gap-2.5 text-green-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-[10px] font-bold border border-green-200">✓</span>
              <span>Profile Completed</span>
            </div>
            <div className="flex items-center gap-2.5 text-amber-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-[10px] font-bold border border-amber-200">○</span>
              <span>Team Registration</span>
            </div>
          </div>
        </div>

      </div>
    </GroupLeaderLayout>
  );
}