import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FiEye, FiCheck, FiInfo, FiX, FiSearch, FiLoader } from "react-icons/fi";
import { authFetch } from "../../services/api";
 
// ─── Config ─────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api/requests";
 
// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:  { label: "Pending",  style: "bg-yellow-500/20 text-amber-500" },
  approved: { label: "Approved", style: "bg-green-500/20 text-green-600" },
  issued:   { label: "Issued",   style: "bg-cyan-500/20 text-cyan-600" },
  rejected: { label: "Rejected", style: "bg-red-50 text-red-600" },
  returned: { label: "Returned", style: "bg-slate-500/20 ls-text-secondary" },
};
 
const getStatusConfig = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] ?? {
    label: status ?? "Unknown",
    style: "bg-slate-500/20 ls-text-secondary",
  };
 
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};
 
// ─── Student / Request info modal ──────────────────────────────────────────────
const RequestInfoModal = ({ request, onClose }) => {
  if (!request) return null;
 
  const fields = [
    { label: "Student Name",     value: request.student_name },
    { label: "Enrollment Number", value: request.enrollment_no },
    { label: "Team Name",        value: request.team_name },
    { label: "Purpose",          value: request.purpose },
    { label: "Component",        value: request.component_name },
    { label: "Quantity",         value: request.quantity },
    { label: "Status",           value: getStatusConfig(request.status).label },
    { label: "Request Date",     value: formatDate(request.request_date) },
  ];
 
  return (
    <div
      className="ls-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white border border-cyan-200 rounded-xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ls-modal-header">
          <h3 className="ls-title-card">Request Information</h3>
          <button
            onClick={onClose}
            className="ls-text-secondary hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
 
        <div className="space-y-3 text-sm">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between gap-4 border-b border-cyan-200 pb-3 last:border-0 last:pb-0"
            >
              <span className="ls-text-secondary shrink-0">{label}</span>
              <span className="text-right font-medium">{value ?? "—"}</span>
            </div>
          ))}
        </div>
 
        <button
          onClick={onClose}
          className="mt-6 w-full ls-btn-secondary px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
 
// ─── Main page ─────────────────────────────────────────────────────────────────
const ComponentRequests = () => {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);
 
  // Tracks which request is currently being approved (by request_id)
  const [approvingId, setApprovingId] = useState(null);
 
  // Small inline toast for success/error feedback on approve actions
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }
 
  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await authFetch(API_BASE);
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to load requests.");
      }
      const raw = result.data ?? result;
      setRequests(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setError(err.message || "Failed to load requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadRequests();
  }, [loadRequests]);
 
  // Auto-dismiss the toast after a few seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
 
  // ── Approve ────────────────────────────────────────────────────────────────
  const handleApprove = async (requestId) => {
    if (!requestId || approvingId) return;
 
    try {
      setApprovingId(requestId);
      setToast(null);
 
      const res = await authFetch(`${API_BASE}/${requestId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
 
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to approve request.");
      }
 
      setToast({ type: "success", message: result.message || "Request approved successfully." });
      await loadRequests(); // refresh table + stats from the source of truth
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to approve request." });
    } finally {
      setApprovingId(null);
    }
  };
 
  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!Array.isArray(requests)) return { pending: 0, approved: 0, rejected: 0 };
    return {
      pending:  requests.filter((r) => r.status?.toLowerCase() === "pending").length,
      approved: requests.filter((r) => r.status?.toLowerCase() === "approved").length,
      rejected: requests.filter((r) => r.status?.toLowerCase() === "rejected").length,
    };
  }, [requests]);
 
  // ── Search ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!Array.isArray(requests)) return [];
    const term = searchTerm.toLowerCase().trim();
    if (!term) return requests;
    return requests.filter((r) =>
      [r.component_name, r.student_name, r.enrollment_no, r.team_name]
        .some((field) => field?.toLowerCase().includes(term))
    );
  }, [requests, searchTerm]);
 
  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Component Requests</h1>
        <p className="ls-text-secondary mt-2">
          Review and approve component requests from students
        </p>
      </div>
 
      {/* Toast */}
      {toast && (
        <div
          className={`mb-6 rounded-xl border px-5 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-600"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
 
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-cyan-200 rounded-xl p-6">
          <p className="ls-text-secondary">Pending Requests</p>
          <h2 className="text-4xl font-bold mt-3">
            {loading ? "—" : stats.pending}
          </h2>
        </div>
        <div className="bg-white border border-cyan-200 rounded-xl p-6">
          <p className="ls-text-secondary">Approved Requests</p>
          <h2 className="text-4xl font-bold mt-3 text-green-600">
            {loading ? "—" : stats.approved}
          </h2>
        </div>
        <div className="bg-white border border-cyan-200 rounded-xl p-6">
          <p className="ls-text-secondary">Rejected Requests</p>
          <h2 className="text-4xl font-bold mt-3 text-red-600">
            {loading ? "—" : stats.rejected}
          </h2>
        </div>
      </div>
 
      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by component, student, enrollment no, or team..."
          className="w-full bg-white border border-cyan-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-cyan-500"
        />
      </div>
 
      {/* Table card */}
      <div className="bg-white border border-cyan-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-cyan-200">
          <h2 className="text-2xl font-semibold">All Requests</h2>
        </div>
 
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 ls-text-secondary gap-3">
            <svg className="animate-spin w-5 h-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading component requests...
          </div>
        )}
 
        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}
 
        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
            <p className="ls-text-secondary">No component requests found.</p>
            {searchTerm && (
              <p className="ls-text-secondary text-sm">
                No results for "{searchTerm}". Try a different search term.
              </p>
            )}
          </div>
        )}
 
        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#081222]">
                <tr>
                  <th className="ls-table-th">Request ID</th>
                  <th className="ls-table-th">Component</th>
                  <th className="ls-table-th">Qty</th>
                  <th className="ls-table-th">Enrollment No</th>
                  <th className="ls-table-th">Team</th>
                  <th className="ls-table-th">Purpose</th>
                  <th className="ls-table-th">Date</th>
                  <th className="ls-table-th">Status</th>
                  <th className="ls-table-th">Actions</th>
                </tr>
              </thead>
 
              <tbody>
                {filtered.map((request) => {
                  const statusConfig = getStatusConfig(request.status);
                  const isPending = request.status?.toLowerCase() === "pending";
                  const isApproving = approvingId === request.request_id;
 
                  return (
                    <tr
                      key={request.request_id}
                      className="border-t border-cyan-200 hover:bg-[#081222]"
                    >
                      <td className="ls-table-td">
                        <div className="flex items-center gap-2">
                          <span>#{request.request_id}</span>
                          <button
                            onClick={() => setActiveRequest(request)}
                            className="ls-text-secondary hover:text-cyan-600 transition-colors"
                            title="View request details"
                          >
                            <FiInfo className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="ls-table-td font-medium">
                        {request.component_name ?? "—"}
                      </td>
                      <td className="ls-table-td">{request.quantity ?? "—"}</td>
                      <td className="ls-table-td text-slate-600">
                        {request.enrollment_no ?? "—"}
                      </td>
                      <td className="ls-table-td text-slate-600">
                        {request.team_name ?? "—"}
                      </td>
                      <td className="ls-table-td text-slate-600 max-w-[160px]">
                        <span
                          className="block truncate"
                          title={request.purpose}
                        >
                          {request.purpose ?? "—"}
                        </span>
                      </td>
                      <td className="ls-table-td text-slate-600 whitespace-nowrap">
                        {formatDate(request.request_date)}
                      </td>
                      <td className="ls-table-td">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${statusConfig.style}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="ls-table-td">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setActiveRequest(request)}
                            className="text-cyan-600 hover:text-cyan-300 transition-colors"
                            title="View"
                          >
                            <FiEye size={18} />
                          </button>
 
                          {isApproving ? (
                            <span className="flex items-center gap-1.5 ls-text-secondary text-sm">
                              <FiLoader className="w-4 h-4 animate-spin" />
                              Approving...
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApprove(request.request_id)}
                              disabled={!isPending}
                              title={isPending ? "Approve" : "Only pending requests can be approved"}
                              className={`transition-colors ${
                                isPending
                                  ? "text-green-600 hover:text-green-300 cursor-pointer"
                                  : "text-slate-600 cursor-not-allowed"
                              }`}
                            >
                              <FiCheck size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
 
      {/* Modal */}
      {activeRequest && (
        <RequestInfoModal
          request={activeRequest}
          onClose={() => setActiveRequest(null)}
        />
      )}
    </div>
  );
};
 
export default ComponentRequests;