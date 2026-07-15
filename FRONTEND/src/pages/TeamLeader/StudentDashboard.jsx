import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import StudentDashboardNoTeam from "./StudentDashboardNoTeam";
import StudentDashboardWithTeam from "./StudentDashboardWithTeam";
import { getMyTeamStatus } from "../../services/teamApi";

export default function StudentDashboard() {
  const [hasTeam, setHasTeam] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkTeamStatus = async () => {
      try {
        setError("");

        const response = await getMyTeamStatus();

        setHasTeam(response.hasTeam);
      } catch (err) {
        console.error("Failed to check team status:", err);
        setError(err.message || "Unable to load dashboard");
      }
    };

    checkTeamStatus();
  }, []);

  if (hasTeam === null && !error) {
    return (
      <GroupLeaderLayout>
        <div className="min-h-[80vh] flex items-center justify-center text-[#dae2fd]">
          <div className="flex items-center gap-3 text-[#bbc9cd]">
            <Loader2 className="animate-spin text-[#22d3ee]" size={22} />
            Loading dashboard...
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  if (error) {
    return (
      <>
        <div className="p-8 text-[#dae2fd]">
          <div className="max-w-2xl rounded-xl border border-red-500/30 bg-[#171f33] p-6">
            <div className="mb-3 flex items-center gap-3">
              <AlertCircle className="text-red-400" size={22} />
              <h1 className="text-xl font-semibold">Unable to Load Dashboard</h1>
            </div>

            <p className="text-[#bbc9cd]">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return hasTeam ? <StudentDashboardWithTeam /> : <StudentDashboardNoTeam />;
}