import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";
import {
  getGalleryRequests,
  updateGalleryStatus,
} from "../../services/facultyGalleryService";

const STATUS_STYLES = {
  Approved: "bg-green-50 border-green-200 text-green-700",
  Pending: "bg-amber-50 border-amber-200 text-amber-700",
  Rejected: "bg-red-50 border-red-200 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        STATUS_STYLES[status] || STATUS_STYLES.Pending
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function GalleryApprovals() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getGalleryRequests();

      setGalleryItems(response.data);
    } catch (err) {
      console.error("Error fetching gallery requests:", err);
      setError(
        err.response?.data?.message || "Failed to load gallery requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (item, newStatus) => {
    try {
      setActionError(null);

      const response = await updateGalleryStatus(item.id, newStatus);
      const updated = response.data;

      setGalleryItems((prev) =>
        prev.map((galleryItem) =>
          galleryItem.id === item.id
            ? { ...galleryItem, ...updated }
            : galleryItem
        )
      );

      setSelectedItem((prev) =>
        prev && prev.id === item.id ? { ...prev, ...updated } : prev
      );
    } catch (err) {
      console.error("Error updating gallery request:", err);
      setActionError(
        err.response?.data?.message || "Failed to update gallery request"
      );
    }
  };

  const tableData = galleryItems.map((item) => ({
    Project: item.title,
    Team: item.team,
    "Uploaded By": item.uploadedBy,
    Status: <StatusBadge status={item.status} />,
    Actions:
      item.status === "Pending" ? (
        <div className="flex gap-2">
          <ActionButton text="View" onClick={() => setSelectedItem(item)} />
          <ActionButton
            text="Approve"
            color="green"
            onClick={() => handleStatusUpdate(item, "approved")}
          />
          <ActionButton
            text="Reject"
            color="red"
            onClick={() => handleStatusUpdate(item, "rejected")}
          />
        </div>
      ) : (
        <ActionButton text="View" onClick={() => setSelectedItem(item)} />
      ),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Gallery Approvals"
          subtitle="Review project images before publishing to gallery"
        />

        {loading ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-6 text-[#6B7280]">
            Loading gallery requests...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 shadow-sm p-6 text-red-700">
            {error}
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-6 text-[#6B7280]">
            No gallery approval requests found.
          </div>
        ) : (
          <DataTable
            columns={["Project", "Team", "Uploaded By", "Status", "Actions"]}
            data={tableData}
          />
        )}

        {selectedItem && (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#111827]">
                  Gallery Request Details
                </h2>
                <p className="text-[#6B7280] mt-1">
                  Review submitted project images before publishing
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="text-[#6B7280] hover:text-[#111827] text-sm"
              >
                Close
              </button>
            </div>

            {actionError && (
              <p className="text-sm text-red-700">{actionError}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-center aspect-video">
                {selectedItem.image ? (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#9CA3AF] text-sm">
                    No image available
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <p className="text-[#6B7280]">Project Title</p>
                  <p className="text-[#111827] font-medium">
                    {selectedItem.title}
                  </p>
                </div>

                <div>
                  <p className="text-[#6B7280]">Team</p>
                  <p className="text-[#111827] font-medium">
                    {selectedItem.team}
                  </p>
                </div>

                <div>
                  <p className="text-[#6B7280]">Uploaded By</p>
                  <p className="text-[#111827] font-medium">
                    {selectedItem.uploadedBy}
                  </p>
                </div>

                <div>
                  <p className="text-[#6B7280]">Status</p>
                  <StatusBadge status={selectedItem.status} />
                </div>

                <div>
                  <p className="text-[#6B7280]">Request Date</p>
                  <p className="text-[#111827] font-medium">
                    {formatDate(selectedItem.requestDate)}
                  </p>
                </div>

                <div>
                  <p className="text-[#6B7280]">Reviewed Date</p>
                  <p className="text-[#111827] font-medium">
                    {formatDate(selectedItem.reviewedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-[#6B7280]">Remarks</p>
                  <p className="text-[#111827] font-medium">
                    {selectedItem.remarks || "—"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default GalleryApprovals;
