import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";
import StatCard from "../../components/ui/StatCard";
import {
  getComponentRequests,
  updateComponentStatus,
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

  const updateStatus = async (requestToUpdate, newStatus) => {
    try {
      await updateComponentStatus(requestToUpdate.id, newStatus);

      const updatedRequests = requests.map((request) =>
        request.id === requestToUpdate.id
          ? { ...request, status: newStatus }
          : request
      );

      setRequests(updatedRequests);
      setSelectedRequest({ ...requestToUpdate, status: newStatus });
    } catch (error) {
      console.error("Error updating component request:", error);
    }
  };

  const tableData = requests.map((request) => ({
    Component: request.component,
    Quantity: request.quantity,
    Team: request.team,
    "Requested By": request.requestedBy,
    Purpose: request.purpose,
    Date: request.date,
    Status: (
      <span
        className={`font-semibold ${
          request.status === "Approved"
            ? "text-green-400"
            : request.status === "Rejected"
            ? "text-red-400"
            : "text-yellow-400"
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
          subtitle="Review lab component requests submitted by students"
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
            change="Awaiting approval"
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
          <div className="rounded-2xl border border-cyan-500/20 bg-[#081122] p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Component Request Details
              </h2>
              <p className="text-slate-400 mt-1">
                Detailed view of selected component request
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Component Name</p>
                <p className="text-white font-medium">
                  {selectedRequest.component}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Quantity</p>
                <p className="text-white font-medium">
                  {selectedRequest.quantity}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Team</p>
                <p className="text-white font-medium">
                  {selectedRequest.team}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Requested By</p>
                <p className="text-white font-medium">
                  {selectedRequest.requestedBy}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Date</p>
                <p className="text-white font-medium">
                  {selectedRequest.date}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Status</p>
                <p
                  className={`font-medium ${
                    selectedRequest.status === "Approved"
                      ? "text-green-400"
                      : selectedRequest.status === "Rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {selectedRequest.status}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-slate-400">Purpose</p>
                <p className="text-white font-medium">
                  {selectedRequest.purpose}
                </p>
              </div>
            </div>

            {selectedRequest.status === "Pending" ? (
              <div className="flex gap-3">
                <ActionButton
                  text="Approve"
                  color="green"
                  onClick={() => updateStatus(selectedRequest, "Approved")}
                />
                <ActionButton
                  text="Reject"
                  color="red"
                  onClick={() => updateStatus(selectedRequest, "Rejected")}
                />
              </div>
            ) : (
              <p
                className={`font-semibold ${
                  selectedRequest.status === "Approved"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                Already {selectedRequest.status}
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ComponentsRequests;