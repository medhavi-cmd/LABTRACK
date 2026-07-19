import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";
import StatCard from "../../components/ui/StatCard";
import {
  getComponentRequests,
} from "../../services/componentService";

function ComponentsRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    loadComponentRequests();
  }, []);

  const loadComponentRequests = async () => {
    try {
      const response = await getComponentRequests();
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching component requests:", error);
    }
  };


  const tableData = requests.map((request) => ({
    Component: request.component,
    Quantity: request.quantity,
    Team: request.team,
    "Requested By": request.requested_by,
    Purpose: request.purpose,
    Date: request.date,
    Status: (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
          request.status === "Approved"
            ? "bg-green-50 border-green-200 text-green-700"
            : request.status === "Rejected"
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-amber-50 border-amber-200 text-amber-700"
        }`}
      >
        {request.status}
      </span>
    ),
    Actions: (
      <ActionButton
        text="View"
        onClick={() => setSelectedRequest(request)}
      />
    ),
  }));

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "Rejected"
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Component Requests"
          subtitle="Monitor lab component requests submitted by student teams"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Requests"
            value={requests.length}
            change="All component requests"
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            change="Awaiting Lab Staff approval"
          />
          <StatCard
            title="Approved"
            value={approvedCount}
            change="Issued components"
          />
          <StatCard
            title="Rejected"
            value={rejectedCount}
            change="Not approved"
          />
        </div>

        <DataTable
          columns={[
            "Component",
            "Quantity",
            "Team",
            "Requested By",
            "Purpose",
            "Date",
            "Status",
            "Actions",
          ]}
          data={tableData}
        />

        {selectedRequest && (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Component Request Details
              </h2>
              <p className="text-[#6B7280] mt-1">
                Detailed view of selected component request
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#6B7280]">Component Name</p>
                <p className="text-[#111827] font-medium">
                  {selectedRequest.component}
                </p>
              </div>

              <div>
                <p className="text-[#6B7280]">Quantity</p>
                <p className="text-[#111827] font-medium">
                  {selectedRequest.quantity}
                </p>
              </div>

              <div>
                <p className="text-[#6B7280]">Team</p>
                <p className="text-[#111827] font-medium">
                  {selectedRequest.team}
                </p>
              </div>

              <div>
                <p className="text-[#6B7280]">Requested By</p>
                <p className="text-[#111827] font-medium">
                  {selectedRequest.requested_by}
                </p>
              </div>

              <div>
                <p className="text-[#6B7280]">Date</p>
                <p className="text-[#111827] font-medium">
                  {selectedRequest.date}
                </p>
              </div>

              <div>
                <p className="text-[#6B7280]">Status</p>
                <p
                  className={`font-medium ${
                    selectedRequest.status === "Approved"
                      ? "text-green-700"
                      : selectedRequest.status === "Rejected"
                      ? "text-red-700"
                      : "text-amber-700"
                  }`}
                >
                  {selectedRequest.status}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-[#6B7280]">Purpose</p>
                <p className="text-[#111827] font-medium">
                  {selectedRequest.purpose}
                </p>
              </div>
            </div>

<div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
  <p className="text-sm font-medium text-[#4B5563]">
    Component requests are reviewed and approved by Lab Staff.
  </p>
</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ComponentsRequests;
