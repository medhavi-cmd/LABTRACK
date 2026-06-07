import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton.jsx";

function ProjectApprovals() {
const projects = [
  {
    Title: "Smart Attendance",
    Team: "Team Alpha",
    Status: "Pending",
    Guide: "Dr. Sharma",
    Actions: (
      <div className="flex gap-2">
        <ActionButton text="Approve" color="green" />
        <ActionButton text="Reject" color="red" />
      </div>
    ),
  },
  {
    Title: "AI Lab Assistant",
    Team: "Team Beta",
    Status: "Pending",
    Guide: "Dr. Singh",
    Actions: (
      <div className="flex gap-2">
        <ActionButton text="Approve" color="green" />
        <ActionButton text="Reject" color="red" />
      </div>
    ),
  },
  {
    Title: "Inventory Tracker",
    Team: "Team Gamma",
    Status: "Pending",
    Guide: "Dr. Verma",
    Actions: (
      <div className="flex gap-2">
        <ActionButton text="Approve" color="green" />
        <ActionButton text="Reject" color="red" />
      </div>
    ),
  },
];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Project Approvals"
          subtitle="Review and approve student projects"
        />

        <DataTable
          columns={["Title", "Team", "Status", "Guide", "Actions"]}
          data={projects}
        />
      </div>
    </DashboardLayout>
  );
}

export default ProjectApprovals;