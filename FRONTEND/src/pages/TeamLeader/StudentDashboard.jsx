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
        <div className="min-h-[80vh] flex items-center justify-center text-[#4B5563]">
          <div className="flex items-center gap-3 text-[#6B7280] text-xs sm:text-sm font-medium">
            <Loader2 className="animate-spin text-[#2563EB]" size={22} />
            Loading dashboard...
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  if (error) {
    return (
      <GroupLeaderLayout>
        <div className="p-4 sm:p-8">
          <div className="max-w-2xl rounded-xl border border-red-200 bg-red-50 p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={22} />
              <h1 className="text-xs font-bold uppercase tracking-wider text-red-700">
                Unable to Load Dashboard
              </h1>
            </div>
            <p className="text-red-600 text-xs sm:text-sm">{error}</p>
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  return hasTeam ? <StudentDashboardWithTeam /> : <StudentDashboardNoTeam />;
}