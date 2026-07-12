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
        <div className="min-h-[80vh] flex items-center justify-center text-[#dae2fd]">
          <div className="flex items-center gap-3 text-[#bbc9cd]">
            <Loader2 className="animate-spin text-[#22d3ee]" size={22} />
            Loading team workspace...
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  if (error || !team) {
    return (
      <GroupLeaderLayout>
        <div className="p-8 text-[#dae2fd]">
          <div className="max-w-2xl bg-[#171f33] border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="text-red-400" size={22} />
              <h1 className="text-xl font-semibold">Unable to Load Team</h1>
            </div>

            <p className="text-[#bbc9cd]">
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
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] p-5 sm:p-8 font-sans">
        <div className="max-w-6xl mx-auto mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#22d3ee] mb-2">
            Team Management
          </p>

          <h1 className="text-3xl font-bold text-white">
            {team.team_name}
          </h1>

          <p className="text-[#bbc9cd] mt-2">
            Your registered project team details are shown below.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <section className="bg-[#171f33] border border-[#3c494c] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#3c494c] flex items-center gap-3">
              <FolderKanban className="text-[#22d3ee]" size={21} />

              <div>
                <h2 className="font-semibold text-lg text-white">
                  Project Details
                </h2>

                <p className="text-sm text-[#bbc9cd]">
                  Registered project information
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#859397] mb-1">
                  Project Title
                </p>

                <p className="text-base font-semibold text-white">
                  {team.project_title || team.team_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#859397] mb-1">
                  Team ID
                </p>

                <p className="text-base font-mono text-[#22d3ee]">
                  #{team.team_id}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-mono uppercase tracking-wider text-[#859397] mb-2">
                  Project Description
                </p>

                <div className="bg-[#0b1326] border border-[#3c494c] rounded-lg p-4 text-sm leading-relaxed text-[#bbc9cd]">
                  {team.description || "No project description was provided."}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#171f33] border border-[#3c494c] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#3c494c] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Users className="text-[#22d3ee]" size={21} />

                <div>
                  <h2 className="font-semibold text-lg text-white">
                    Team Members
                  </h2>

                  <p className="text-sm text-[#bbc9cd]">
                    {members.length} registered member
                    {members.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#00363e]/50 border border-[#22d3ee]/30 text-[#22d3ee]">
                Registered Team
              </span>
            </div>

            <div className="divide-y divide-[#3c494c]">
              {members.map((member, index) => {
                const isLeader = member.project_role === "leader";

                return (
                  <div
                    key={member.student_id || index}
                    className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center"
                  >
                    <div className="lg:col-span-1">
                      <div className="w-9 h-9 rounded-md bg-[#0b1326] border border-[#3c494c] flex items-center justify-center font-mono text-sm text-[#22d3ee]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">
                          {member.name}
                        </p>

                        {/* {isLeader && (
                          <Crown size={15} className="text-yellow-400" />
                        )} */}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#859397] mt-1">
                        <Hash size={13} />
                        {member.enrollment_no}
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-[#bbc9cd]">
                        <Mail size={14} className="text-[#22d3ee]" />
                        <span>{member.email || "Email unavailable"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-[#bbc9cd]">
                        <Phone size={14} className="text-[#22d3ee]" />
                        <span>{member.phone_no || "Phone unavailable"}</span>
                      </div>
                    </div>

                    <div className="lg:col-span-4 lg:text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold border ${
                          isLeader
                            ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-300"
                            : "bg-[#00363e]/40 border-[#22d3ee]/20 text-[#22d3ee]"
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

          <div className="bg-[#11253e] border border-[#1e4273] rounded-xl p-4 text-sm text-[#bbc9cd]">
            This team registration is currently read-only. Contact your faculty
             if changes are required.
          </div>
        </div>
      </div>
    </GroupLeaderLayout>
  );
}