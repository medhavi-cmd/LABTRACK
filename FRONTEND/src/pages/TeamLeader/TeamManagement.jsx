// ==========================================
// 2. pages/student/TeamManagement.jsx
// ==========================================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FolderKanban,
  Crown,
  Mail,
  Phone,
  Hash,
  AlertCircle,
  Loader2,
} from "lucide-react";

import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getMyTeam } from "../../services/teamApi";

export default function TeamManagement() {
  const navigate = useNavigate();
  
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyTeam();
        console.log(response);

        setTeam(response);
      } catch (err) {
        console.error("Failed to fetch team:", err);

        if (err.message === "No team registered yet") {
          navigate("/student/team-management/register", { replace: true });
          return;
        }

        setError(err.message || "Unable to load team details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [navigate]);

  if (loading) {
    return (
      <GroupLeaderLayout>
        <div className="min-h-[80vh] flex items-center justify-center text-[#4B5563]">
          <div className="flex items-center gap-3 text-[#4B5563]">
            <Loader2 className="animate-spin text-[#2563EB]" size={22} />
            Loading team workspace...
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  if (error || !team) {
    return (
      <GroupLeaderLayout>
        <div className="p-8 text-[#4B5563]">
          <div className="max-w-2xl bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="text-red-600" size={22} />
              <h1 className="text-xl font-semibold text-red-900">Unable to Load Team</h1>
            </div>

            <p className="text-red-700">
              {error || "No registered team was found."}
            </p>
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  const members = team.members || [];

  return (
    <GroupLeaderLayout>
      <div className="min-h-screen bg-[#F8FAFC] text-[#4B5563] p-5 sm:p-8 font-sans">
        <div className="max-w-6xl mx-auto mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#2563EB] mb-2">
            Team Management
          </p>

          <h1 className="text-3xl font-bold text-[#111827]">
            {team.team_name}
          </h1>

          <p className="text-[#4B5563] mt-2">
            Your registered project team details are shown below.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <section className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center gap-3">
              <div className="rounded-lg border border-[#2563EB]/20 bg-[#EFF6FF] p-2 text-[#2563EB]">
                <FolderKanban size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-lg text-[#111827]">
                  Project Details
                </h2>

                <p className="text-sm text-[#6B7280]">
                  Registered project information
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Project Title
                </p>

                <p className="text-base font-semibold text-[#111827]">
                  {team.project_title || team.team_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Team ID
                </p>

                <p className="text-base font-mono font-semibold text-[#2563EB]">
                  #{team.team_id}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Project Description
                </p>

                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg p-4 text-sm leading-relaxed text-[#4B5563]">
                  {team.description || "No project description was provided."}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="px-6 py-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-[#2563EB]/20 bg-[#EFF6FF] p-2 text-[#2563EB]">
                  <Users size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-lg text-[#111827]">
                    Team Members
                  </h2>

                  <p className="text-sm text-[#6B7280]">
                    {members.length} registered member
                    {members.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF]">
                Registered Team
              </span>
            </div>

            <div className="divide-y divide-[#E5E7EB]">
              {members.map((member, index) => {
                const isLeader = member.project_role === "leader";

                return (
                  <div
                    key={member.student_id || index}
                    className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-[#FFFFFF]"
                  >
                    <div className="lg:col-span-1">
                      <div className="w-9 h-9 rounded-md bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center font-mono text-sm text-slate-500">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#111827]">
                          {member.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <Hash size={13} />
                        {member.enrollment_no}
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-[#4B5563]">
                        <Mail size={14} className="text-[#2563EB]" />
                        <span>{member.email || "Email unavailable"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-[#4B5563]">
                        <Phone size={14} className="text-[#2563EB]" />
                        <span>{member.phone_no || "Phone unavailable"}</span>
                      </div>
                    </div>

                    <div className="lg:col-span-4 lg:text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold border ${
                          isLeader
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        {isLeader ? "Team Leader" : "Team Member"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 text-sm text-[#1E40AF]">
            This team registration is currently read-only. Contact your faculty
            coordinator if changes are required.
          </div>
        </div>
      </div>
    </GroupLeaderLayout>
  );
}