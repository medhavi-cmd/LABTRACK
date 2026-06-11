import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";

function GalleryApprovals() {
  const galleryItems = [
    {
      Project: "Smart Attendance",
      Team: "Team Alpha",
      UploadedBy: "Rahul",
      Status: "Pending",
      Actions: (
        <div className="flex gap-2">
          <ActionButton text="Approve" color="green" />
          <ActionButton text="Reject" color="red" />
        </div>
      ),
    },
    {
      Project: "AI Lab Assistant",
      Team: "Team Beta",
      UploadedBy: "Priya",
      Status: "Pending",
      Actions: (
        <div className="flex gap-2">
          <ActionButton text="Approve" color="green" />
          <ActionButton text="Reject" color="red" />
        </div>
      ),
    },
    {
      Project: "Inventory Tracker",
      Team: "Team Gamma",
      UploadedBy: "Aman",
      Status: "Approved",
      Actions: <ActionButton text="View" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Gallery Approvals"
          subtitle="Review project images before publishing to gallery"
        />

        <DataTable
          columns={[
            "Project",
            "Team",
            "UploadedBy",
            "Status",
            "Actions",
          ]}
          data={galleryItems}
        />
      </div>
    </DashboardLayout>
  );
}

export default GalleryApprovals;
