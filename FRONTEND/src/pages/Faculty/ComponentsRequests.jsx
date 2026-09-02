import { useState, useCallback } from "react";
import { useListQuery } from "../../hooks/useListQuery";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import CommentsSection from "../../components/ui/CommentsSection";
import { getComponentRequests } from "../../services/componentService";
import { FiSearch, FiX, FiChevronUp, FiChevronDown, FiFilter, FiEye } from "react-icons/fi";

const SortTh = ({ label, field, sortField, sortDir, onSort }) => {
  const active = sortField === field;
  return (
    <th className="px-5 py-4 font-medium text-left text-sm text-[#4B5563] bg-[#F8FAFC] select-none">
      <button onClick={() => onSort(field)} className="flex items-center gap-1 group hover:text-[#2563EB] transition-colors">
        {label}
        <span className="flex flex-col opacity-50 group-hover:opacity-100">
          <FiChevronUp className={`w-3 h-3 -mb-0.5 ${active && sortDir === "asc" ? "text-[#2563EB] opacity-100" : ""}`} />
          <FiChevronDown className={`w-3 h-3 ${active && sortDir === "desc" ? "text-[#2563EB] opacity-100" : ""}`} />
        </span>
      </button>
    </th>
  );
};

const RequestDialog = ({ request, onClose }) => {
  if (!request) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#111827]">Component Request Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          {[
            { label: "Component Name", value: request.component },
            { label: "Quantity",       value: request.quantity },
            { label: "Team",           value: request.team },
            { label: "Requested By",   value: request.requested_by },
            { label: "Date",           value: request.date },
            { label: "Status",         value: request.status },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[#6B7280]">{label}</p>
              <p className={`font-medium ${
                label === "Status"
                  ? request.status === "Approved" ? "text-green-700"
                  : request.status === "Rejected" ? "text-red-700"
                  : "text-amber-700"
                  : "text-[#111827]"
              }`}>
                {value ?? "—"}
              </p>
            </div>
          ))}
          <div className="md:col-span-2">
            <p className="text-[#6B7280]">Purpose</p>
            <p className="font-medium text-[#111827]">{request.purpose ?? "—"}</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 mb-2">
          <p className="text-sm font-medium text-[#4B5563]">
            Component requests are reviewed and approved by Lab Staff.
          </p>
        </div>

        <CommentsSection entityType="request" entityId={request.id} />

        <button onClick={onClose} className="mt-4 w-full px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F8FAFC] transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

// Search, filter and sort are resolved by the API (facultyComponentService.js).
const fetchRequestsPage = async (params, signal) => {
  const response = await getComponentRequests(params, signal);
  return { data: response.data?.data ?? [], stats: response.data?.stats ?? null };
};

const EMPTY_STATS = { total: 0, pending: 0, approved: 0, rejected: 0 };

function ComponentsRequests() {
  const {
    data: filtered,
    extra,
    search: searchTerm,
    setSearch: setSearchTerm,
    filters,
    setFilter,
    sortField,
    sortDir,
    handleSort,
  } = useListQuery(fetchRequestsPage, {
    initialFilters: { status: "all" },
    initialSortField: "date",
    initialSortDir: "desc",
  });

  const [selectedRequest, setSelectedRequest] = useState(null);

  const filterStatus = filters.status;
  const setFilterStatus = useCallback((value) => setFilter("status", value), [setFilter]);

  const stats = extra?.stats ?? EMPTY_STATS;
  const pendingCount  = stats.pending;
  const approvedCount = stats.approved;
  const rejectedCount = stats.rejected;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader title="Component Requests" subtitle="Monitor lab component requests submitted by student teams" />

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Requests" value={stats.total} change="All component requests" />
          <StatCard title="Pending" value={pendingCount} change="Awaiting Lab Staff approval" />
          <StatCard title="Approved" value={approvedCount} change="Issued components" />
          <StatCard title="Rejected" value={rejectedCount} change="Not approved" />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-3.5 text-[#6B7280]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by component, team, or purpose..."
              className="w-full border border-[#E5E7EB] rounded-lg pl-12 pr-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-white"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5">
            <FiFilter className="text-[#6B7280] shrink-0" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="outline-none text-sm text-[#4B5563] bg-transparent cursor-pointer">
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] text-[#4B5563] text-sm">
              <tr>
                <SortTh label="Component" field="component" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Quantity" field="quantity" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Team" field="team" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Requested By" field="requested_by" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Date" field="date" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <th className="px-5 py-4 font-medium text-left text-sm text-[#4B5563] bg-[#F8FAFC]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-[#6B7280]">No requests found.</td></tr>
              ) : (
                filtered.map((request, i) => (
                  <tr key={request.id ?? i} className="text-sm text-[#4B5563] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4 font-medium text-[#111827]">{request.component}</td>
                    <td className="px-5 py-4">{request.quantity}</td>
                    <td className="px-5 py-4">{request.team}</td>
                    <td className="px-5 py-4">{request.requested_by}</td>
                    <td className="px-5 py-4">{request.date}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        request.status === "Approved" ? "bg-green-50 border-green-200 text-green-700"
                        : request.status === "Rejected" ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        <FiEye className="w-3.5 h-3.5" />View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <RequestDialog request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}
    </DashboardLayout>
  );
}

export default ComponentsRequests;
