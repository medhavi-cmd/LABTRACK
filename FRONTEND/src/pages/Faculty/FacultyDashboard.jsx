import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import { getFacultyDashboard } from "../../services/facultyDashboardService.js";

function FacultyDashboard() {
  const [stats, setStats] = useState({
    total_projects: 0,
    approved_projects: 0,
    pending_requests: 0,
    upcoming_events: 0,
  });

  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFacultyDashboard();

      setStats(response.data.stats);
      setProjectData(response.data.projects);
    } catch (err) {
      console.error("Error loading faculty dashboard:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load faculty dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Faculty Dashboard"
          subtitle="Monitor projects, approvals, events and class progress"
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={loading ? "..." : stats.total_projects}
            change="Class project records"
          />

          <StatCard
            title="Approved Projects"
            value={loading ? "..." : stats.approved_projects}
            change="Faculty-approved projects"
          />

          <StatCard
            title="Pending Requests"
            value={loading ? "..." : stats.pending_requests}
            change="Awaiting Lab Staff approval"
          />

          <StatCard
            title="Upcoming Events"
            value={loading ? "..." : stats.upcoming_events}
            change="Scheduled future events"
          />
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Project Monitoring"
            subtitle="Track all student projects"
          />

          {loading ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-[#6B7280] shadow-sm">
              Loading project records...
            </div>
          ) : (
            <DataTable
              columns={["Title", "Team", "Status", "Faculty"]}
              data={projectData}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default FacultyDashboard;
