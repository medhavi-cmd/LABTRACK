import React, { useEffect, useState, useCallback } from "react";
import { useListQuery, toQueryString } from "../../hooks/useListQuery";
import {
  FiEye, FiCheck, FiX, FiSearch, FiLoader,
  FiChevronDown, FiChevronRight, FiPackage, FiChevronUp, FiFilter,
} from "react-icons/fi";
import { authFetch } from "../../services/api";
import CommentsSection from "../../components/ui/CommentsSection";

const API_BASE = `${import.meta.env.VITE_API_URL}/requests`;

const STATUS_CONFIG = {
  pending:  { label: "Pending",  style: "bg-amber-50 text-amber-600 border border-amber-200" },
  approved: { label: "Approved", style: "bg-green-50 text-green-600 border border-green-200" },
  issued:   { label: "Issued",   style: "bg-cyan-50 text-cyan-600 border border-cyan-200" },
  rejected: { label: "Rejected", style: "bg-red-50 text-red-600 border border-red-200" },
  returned: { label: "Returned", style: "bg-slate-100 text-slate-600 border border-slate-200" },
};

const getStatusConfig = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] ?? { label: status ?? "Unknown", style: "bg-slate-100 text-slate-600 border border-slate-200" };

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try { return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return dateStr; }
};

// ─── Sort Th ──────────────────────────────────────────────────────────
const SortTh = ({ label, field, sortField, sortDir, onSort }) => {
  const active = sortField === field;
  return (
    <th className="ls-table-th select-none">
      <button onClick={() => onSort(field)} className="flex items-center gap-1 group hover:text-cyan-600 transition-colors">
        {label}
        <span className="flex flex-col opacity-50 group-hover:opacity-100">
          <FiChevronUp className={`w-3 h-3 -mb-0.5 ${active && sortDir === "asc" ? "text-cyan-500 opacity-100" : ""}`} />
          <FiChevronDown className={`w-3 h-3 ${active && sortDir === "desc" ? "text-cyan-500 opacity-100" : ""}`} />
        </span>
      </button>
    </th>
  );
};

// ─── Request Details Modal ────────────────────────────────────────────
const RequestInfoModal = ({ request, onClose }) => {
  if (!request) return null;
  const statusCfg = getStatusConfig(request.status);
  return (
    <div className="ls-modal-overlay" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900">Request #{request.request_id}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><FiX className="w-5 h-5" /></button>
        </div>
        <div className="space-y-2 text-sm mb-5">
          {[
            { label: "Student",    value: request.student_name },
            { label: "Enrollment", value: request.enrollment_no },
            { label: "Team",       value: request.team_name },
            { label: "Purpose",    value: request.purpose },
            { label: "Date",       value: formatDate(request.request_date) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-0">
              <span className="text-slate-500 shrink-0">{label}</span>
              <span className="text-right font-medium text-slate-900">{value ?? "—"}</span>
            </div>
          ))}
        </div>
        <div className="mb-5">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusCfg.style}`}>{statusCfg.label}</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Requested Components</p>
          <div className="space-y-2">
            {(request.components || []).map((comp, i) => (
              <div key={comp.component_id ?? i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
                <span className="text-sm font-medium text-slate-800">{comp.component_name}</span>
                <span className="text-sm text-slate-500">× {comp.quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <CommentsSection entityType="request" entityId={request.request_id} />
        <button onClick={onClose} className="mt-4 w-full ls-btn-secondary">Close</button>
      </div>
    </div>
  );
};

// ─── Expandable Row ───────────────────────────────────────────────────
const RequestRow = ({ request, onView, onApprove, approvingId }) => {
  const [expanded, setExpanded] = useState(false);
  const statusCfg   = getStatusConfig(request.status);
  const isPending   = request.status?.toLowerCase() === "pending";
  const isApproving = approvingId === request.request_id;
  const components  = request.components || [];
  const compSummary = components.map((c) => c.component_name).join(", ");
  return (
    <>
      <tr className="ls-table-tr">
        <td className="ls-table-td">
          <button onClick={() => setExpanded((v) => !v)} className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 transition-colors font-medium">
            {expanded ? <FiChevronDown className="w-4 h-4 shrink-0 text-cyan-500" /> : <FiChevronRight className="w-4 h-4 shrink-0 text-slate-400" />}
            #{request.request_id}
          </button>
        </td>
        <td className="ls-table-td text-slate-500">{request.enrollment_no ?? "—"}</td>
        <td className="ls-table-td text-slate-500">{request.team_name ?? "—"}</td>
        <td className="ls-table-td max-w-[200px]">
          <span className="block font-medium text-slate-800 truncate" title={request.purpose}>{request.purpose ?? "—"}</span>
          {!expanded && <span className="block text-xs text-slate-400 truncate mt-0.5" title={compSummary}>{components.length} component{components.length !== 1 ? "s" : ""}: {compSummary}</span>}
        </td>
        <td className="ls-table-td whitespace-nowrap text-slate-500">{formatDate(request.request_date)}</td>
        <td className="ls-table-td"><span className={`px-3 py-1 rounded-full text-sm font-medium ${statusCfg.style}`}>{statusCfg.label}</span></td>
        <td className="ls-table-td">
          <div className="flex items-center gap-3">
            <button onClick={() => onView(request)} className="text-cyan-600 hover:text-cyan-700 transition-colors" title="View details"><FiEye size={18} /></button>
            {isApproving ? (
              <span className="flex items-center gap-1.5 text-slate-400 text-sm"><FiLoader className="w-4 h-4 animate-spin" />Approving...</span>
            ) : (
              <button onClick={() => isPending && onApprove(request.request_id)} disabled={!isPending} title={isPending ? "Approve" : "Only pending requests can be approved"} className={`transition-colors ${isPending ? "text-green-600 hover:text-green-700 cursor-pointer" : "text-slate-300 cursor-not-allowed"}`}>
                <FiCheck size={18} />
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50 border-b border-slate-100">
          <td colSpan={7} className="px-8 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2"><FiPackage className="w-3.5 h-3.5" />Requested Components</p>
            <div className="flex flex-wrap gap-2">
              {components.map((comp, i) => (
                <div key={comp.component_id ?? i} className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm">
                  <span className="font-medium text-slate-800">{comp.component_name}</span>
                  <span className="text-slate-400">×</span>
                  <span className="font-semibold text-slate-700">{comp.quantity}</span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ─── Main page ────────────────────────────────────────────────────────
// Search, filter and sort are resolved by the API (ComponentRequestService.js).
const fetchRequestsPage = async (params, signal) => {
  const res = await authFetch(`${API_BASE}${toQueryString(params)}`, { signal });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "Failed to load requests.");
  return { data: result.data ?? [], stats: result.stats ?? null };
};

const EMPTY_STATS = { total: 0, pending: 0, approved: 0, issued: 0 };

const ComponentRequests = () => {
  const {
    data: filtered,
    extra,
    loading,
    error,
    search: searchTerm,
    setSearch: setSearchTerm,
    filters,
    setFilter,
    sortField,
    sortDir,
    handleSort,
    reload: loadRequests,
  } = useListQuery(fetchRequestsPage, {
    initialFilters: { status: "all" },
    initialSortField: "request_date",
    initialSortDir: "desc",
  });

  const filterStatus = filters.status;
  const setFilterStatus = useCallback((value) => setFilter("status", value), [setFilter]);
  const stats = extra?.stats ?? EMPTY_STATS;

  const [activeRequest, setActiveRequest] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [toast, setToast]             = useState(null);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);

  const handleApprove = async (requestId) => {
    if (!requestId || approvingId) return;
    try {
      setApprovingId(requestId); setToast(null);
      const res    = await authFetch(`${API_BASE}/${requestId}/approve`, { method: "PATCH", headers: { "Content-Type": "application/json" } });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to approve.");
      setToast({ type: "success", message: result.message || "Approved successfully." });
      loadRequests();
    } catch (err) { setToast({ type: "error", message: err.message || "Failed to approve." }); }
    finally { setApprovingId(null); }
  };

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Component Requests</h1>
        <p className="ls-text-secondary mt-2">Review and approve component requests from students</p>
      </div>

      {toast && (
        <div className={`mb-6 rounded-xl border px-5 py-3 text-sm font-medium ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"}`}>
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Requests", val: stats.total, cls: "" },
          { label: "Pending", val: stats.pending, cls: "text-amber-500" },
          { label: "Approved", val: stats.approved, cls: "text-green-600" },
          { label: "Issued", val: stats.issued, cls: "text-cyan-600" },
        ].map(({ label, val, cls }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="ls-text-secondary text-sm font-medium">{label}</p>
            <h2 className={`text-3xl font-bold mt-2 ${cls}`}>{loading ? "—" : val}</h2>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by student, enrollment no, team, purpose, or component..." className="w-full bg-white border border-slate-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm" />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
          <FiFilter className="text-slate-400 shrink-0" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="outline-none text-sm text-slate-700 bg-transparent cursor-pointer">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="issued">Issued</option>
            <option value="rejected">Rejected</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="ls-table-container">
        <div className="ls-table-header flex items-center justify-between">
          <h2 className="ls-title-card">All Requests</h2>
          {!loading && !error && <span className="text-sm ls-text-secondary">{filtered.length} request{filtered.length !== 1 ? "s" : ""}</span>}
        </div>

        {loading && <div className="flex items-center justify-center py-16 ls-text-secondary gap-3"><svg className="animate-spin w-5 h-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Loading component requests...</div>}
        {!loading && error && <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6"><p className="text-red-600 font-medium">{error}</p><button onClick={loadRequests} className="text-sm text-cyan-600 hover:underline mt-1">Try again</button></div>}
        {!loading && !error && filtered.length === 0 && <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6"><FiPackage className="w-10 h-10 text-slate-300 mb-2" /><p className="ls-text-secondary font-medium">No component requests found.</p>{searchTerm && <p className="ls-text-secondary text-sm">No results for "{searchTerm}".</p>}</div>}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <SortTh label="Request ID" field="request_id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Enrollment No" field="enrollment_no" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Team" field="team_name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <th className="ls-table-th">Purpose / Components</th>
                  <SortTh label="Date" field="request_date" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <th className="ls-table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((request) => (
                  <RequestRow key={request.request_id} request={request} onView={setActiveRequest} onApprove={handleApprove} approvingId={approvingId} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeRequest && <RequestInfoModal request={activeRequest} onClose={() => setActiveRequest(null)} />}
    </div>
  );
};

export default ComponentRequests;