import { useCallback, useState } from "react";
import { useListQuery } from "../../hooks/useListQuery";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import CommentsSection from "../../components/ui/CommentsSection";
import {
  getGalleryRequests,
  updateGalleryStatus,
} from "../../services/facultyGalleryService";
import {
  FiSearch,
  FiX,
  FiChevronUp,
  FiChevronDown,
  FiFilter,
  FiEye,
} from "react-icons/fi";

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

const SortTh = ({ label, field, sortField, sortDir, onSort }) => {
  const active = sortField === field;
  return (
    <th className="px-5 py-4 font-medium text-left text-sm text-[#4B5563] bg-[#F8FAFC] select-none">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 group hover:text-[#2563EB] transition-colors"
      >
        {label}
        <span className="flex flex-col opacity-50 group-hover:opacity-100">
          <FiChevronUp
            className={`w-3 h-3 -mb-0.5 ${
              active && sortDir === "asc" ? "text-[#2563EB] opacity-100" : ""
            }`}
          />
          <FiChevronDown
            className={`w-3 h-3 ${
              active && sortDir === "desc" ? "text-[#2563EB] opacity-100" : ""
            }`}
          />
        </span>
      </button>
    </th>
  );
};

const GalleryDialog = ({ item, actionError, onClose, onApprove, onReject }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5 pb-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">
              Gallery Request Details
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Review submitted project images before publishing
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {actionError && (
          <p className="text-sm text-red-700 mb-4">{actionError}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-center aspect-video">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#9CA3AF] text-sm">No image available</span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm">
            {[
              { label: "Project Title", value: item.title },
              { label: "Team", value: item.team },
              { label: "Uploaded By", value: item.uploadedBy },
              { label: "Request Date", value: formatDate(item.requestDate) },
              { label: "Reviewed Date", value: formatDate(item.reviewedAt) },
              { label: "Remarks", value: item.remarks || "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[#6B7280]">{label}</p>
                <p className="text-[#111827] font-medium">{value ?? "—"}</p>
              </div>
            ))}

            <div>
              <p className="text-[#6B7280] mb-1">Status</p>
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>

        {item.status === "Pending" && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onApprove(item)}
              className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(item)}
              className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Reject
            </button>
          </div>
        )}

        <CommentsSection entityType="gallery" entityId={item.id} />

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F8FAFC] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Search, filter and sort are resolved by the API (facultyGalleryService.js).
const fetchGalleryPage = async (params, signal) => {
  const response = await getGalleryRequests(params, signal);
  return Array.isArray(response.data) ? response.data : [];
};

function GalleryApprovals() {
  const {
    data: filtered,
    loading,
    error,
    search: searchTerm,
    setSearch: setSearchTerm,
    filters,
    setFilter,
    sortField,
    sortDir,
    handleSort,
    reload: loadGalleryItems,
  } = useListQuery(fetchGalleryPage, {
    initialFilters: { status: "all" },
    initialSortField: "requestDate",
    initialSortDir: "desc",
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [actionError, setActionError] = useState(null);

  const filterStatus = filters.status;
  const setFilterStatus = useCallback((value) => setFilter("status", value), [setFilter]);

  const handleStatusUpdate = async (item, newStatus) => {
    try {
      setActionError(null);

      const response = await updateGalleryStatus(item.id, newStatus);
      const updated = response.data;

      setSelectedItem((prev) =>
        prev && prev.id === item.id ? { ...prev, ...updated } : prev
      );

      loadGalleryItems();
    } catch (err) {
      console.error("Error updating gallery request:", err);
      setActionError(
        err.response?.data?.message || "Failed to update gallery request"
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Gallery Approvals"
          subtitle="Review project images before publishing to gallery"
        />

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-3.5 text-[#6B7280]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project, team, or uploader..."
              className="w-full border border-[#E5E7EB] rounded-lg pl-12 pr-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-white"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5">
            <FiFilter className="text-[#6B7280] shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="outline-none text-sm text-[#4B5563] bg-transparent cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-6 text-[#6B7280]">
            Loading gallery requests...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 shadow-sm p-6 text-red-700">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAFC] text-[#4B5563] text-sm">
                  <tr>
                    <SortTh label="Project" field="title" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Team" field="team" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Uploaded By" field="uploadedBy" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Request Date" field="requestDate" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <th className="px-5 py-4 font-medium text-left text-sm text-[#4B5563] bg-[#F8FAFC]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-[#6B7280]">
                        No gallery approval requests found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr
                        key={item.id}
                        className="text-sm text-[#4B5563] hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-[#111827]">
                          {item.title}
                        </td>
                        <td className="px-5 py-4">{item.team}</td>
                        <td className="px-5 py-4">{item.uploadedBy}</td>
                        <td className="px-5 py-4">{formatDate(item.requestDate)}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setActionError(null);
                                setSelectedItem(item);
                              }}
                              className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            >
                              <FiEye className="w-3.5 h-3.5" />
                              View
                            </button>

                            {item.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(item, "approved")}
                                  className="bg-[#10b981] hover:bg-[#059669] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(item, "rejected")}
                                  className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <GalleryDialog
          item={selectedItem}
          actionError={actionError}
          onClose={() => {
            setSelectedItem(null);
            setActionError(null);
          }}
          onApprove={(item) => handleStatusUpdate(item, "approved")}
          onReject={(item) => handleStatusUpdate(item, "rejected")}
        />
      )}
    </DashboardLayout>
  );
}

export default GalleryApprovals;
