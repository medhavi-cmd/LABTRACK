import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DataTable from "../../components/ui/DataTable";

function StudentProgress() {
  const students = [
    {
      Team: "Team Alpha",
      Project: "Smart Attendance",
      Progress: "75%",
      Guide: "Dr. Sharma",
      Status: "On Track",
    },
    {
      Team: "Team Beta",
      Project: "AI Lab Assistant",
      Progress: "60%",
      Guide: "Dr. Singh",
      Status: "Review Required",
    },
    {
      Team: "Team Gamma",
      Project: "Inventory Tracker",
      Progress: "90%",
      Guide: "Dr. Verma",
      Status: "Excellent",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Student Progress"
          subtitle="Track student project progress and evaluation status"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Active Teams" value="12" change="Ongoing projects" />
          <StatCard title="On Track" value="8" change="Meeting milestones" />
          <StatCard title="Needs Review" value="3" change="Faculty attention required" />
          <StatCard title="Completed" value="1" change="Ready for evaluation" />
        </div>

        <DataTable
          columns={[
            "Team",
            "Project",
            "Progress",
            "Guide",
            "Status",
          ]}
          data={students}
        />
      </div>
    </DashboardLayout>
  );
}

export default StudentProgress;