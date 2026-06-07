import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";

function ComponentsRequests() {
  const requests = [
    {
      Component: "Arduino Uno",
      Quantity: 5,
      Team: "Team Alpha",
      Date: "07-06-2026",
      Status: "Pending",
      Actions: (
        <div className="flex gap-2">
          <ActionButton text="Approve" color="green" />
          <ActionButton text="Reject" color="red" />
        </div>
      ),
    },
    {
      Component: "Raspberry Pi",
      Quantity: 2,
      Team: "Team Beta",
      Date: "07-06-2026",
      Status: "Pending",
      Actions: (
        <div className="flex gap-2">
          <ActionButton text="Approve" color="green" />
          <ActionButton text="Reject" color="red" />
        </div>
      ),
    },
    {
      Component: "Ultrasonic Sensor",
      Quantity: 10,
      Team: "Team Gamma",
      Date: "07-06-2026",
      Status: "Approved",
      Actions: (
        <div className="flex gap-2">
          <ActionButton text="View" color="blue" />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Component Requests"
          subtitle="Review lab component requests submitted by students"
        />

        <DataTable
          columns={[
            "Component",
            "Quantity",
            "Team",
            "Date",
            "Status",
            "Actions",
          ]}
          data={requests}
        />
      </div>
    </DashboardLayout>
  );
}

export default ComponentsRequests;