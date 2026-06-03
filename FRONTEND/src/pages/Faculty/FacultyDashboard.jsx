import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";

function FacultyDashboard() {
  const projectData = [
    {
      Title: "Smart Attendance",
      Team: "Team Alpha",
      Status: "Pending",
      Faculty: "Dr. Sharma",
    },
    {
      Title: "AI Lab Assistant",
      Team: "Team Beta",
      Status: "Approved",
      Faculty: "Dr. Singh",
    },
    {
      Title: "Inventory Tracker",
      Team: "Team Gamma",
      Status: "Review",
      Faculty: "Dr. Verma",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Faculty Dashboard"
          subtitle="Monitor projects, approvals, events and class progress"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value="42"
            change="Class project records"
          />

          <StatCard
            title="Approved Projects"
            value="18"
            change="Visible in gallery"
          />

          <StatCard
            title="Pending Requests"
            value="7"
            change="Need faculty review"
          />

          <StatCard
            title="Upcoming Events"
            value="3"
            change="Evaluation deadlines"
          />
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Project Monitoring"
            subtitle="Track all student projects"
          />

          <DataTable
            columns={["Title", "Team", "Status", "Faculty"]}
            data={projectData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default FacultyDashboard;