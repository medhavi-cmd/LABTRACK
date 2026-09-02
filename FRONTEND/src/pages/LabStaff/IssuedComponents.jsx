import { useCallback, useEffect, useState } from "react";
import { useListQuery, toQueryString } from "../../hooks/useListQuery";
import { FiInfo, FiX, FiSearch, FiLoader, FiAlertTriangle, FiChevronUp, FiChevronDown, FiFilter } from "react-icons/fi";
import { authFetch } from "../../services/api";
import CommentsSection from "../../components/ui/CommentsSection";

const API_BASE = `${import.meta.env.VITE_API_URL}/issued-components`;

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":  return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    case "overdue":  return "bg-red-50 text-red-600 border border-red-200";
    case "returned": return "bg-green-50 text-green-600 border border-green-200";
    default:         return "bg-slate-100 ls-text-secondary border border-slate-200";
  }
};

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "—";
const formatDate = (value) => { if (!value) return "—"; try { return new Date(value).toLocaleDateString(); } catch { return value; } };

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

// ─── Toast ────────────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className={`mb-6 flex items-start justify-between gap-4 rounded-xl border px-5 py-3 text-sm font-medium ${isSuccess ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"}`}>
      <span>{isSuccess ? "✅ " : "❌ "}{toast.message}</span>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100 transition-opacity shrink-0"><FiX className="w-4 h-4" /></button>
    </div>
  );
};

// ─── Student Info Modal ───────────────────────────────────────────────
const StudentInfoModal = ({ issue, onClose }) => {
  if (!issue) return null;
  const fields = [
    { label: "Issue ID",              value: issue.issue_id },
    { label: "Student Name",          value: issue.leader_name },
    { label: "Enrollment Number",     value: issue.enrollment_no },
    { label: "Team Name",             value: issue.team_name },
    { label: "Component Name",        value: issue.component_name },
    { label: "Quantity",              value: issue.quantity },
    { label: "Issue Date",            value: formatDate(issue.issue_date) },
    { label: "Expected Return Date",  value: formatDate(issue.expected_return_date) },
    { label: "Return Status",         value: capitalize(issue.return_status) },
    { label: "Actual Return Date",    value: formatDate(issue.actual_return_date) },
    { label: "Component Condition",   value: issue.component_condition ? capitalize(issue.component_condition) : "—" },
  ];
  return (
    <div className="ls-modal-overlay" onClick={onClose}>
      <div className="ls-card w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="ls-modal-header">
          <h3 className="ls-title-card">Issue Details</h3>
          <button onClick={onClose} className="ls-text-secondary hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><FiX className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3 text-sm">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
              <span className="ls-text-secondary shrink-0">{label}</span>
              <span className="text-right font-medium">{value ?? "—"}</span>
            </div>
          ))}
        </div>
        <CommentsSection entityType="issue" entityId={issue.issue_id} />
        <button onClick={onClose} className="mt-4 w-full ls-btn-secondary px-4 py-2 rounded-lg font-medium transition-colors">Close</button>
      </div>
    </div>
  );
};

// ─── Return Confirmation Modal ────────────────────────────────────────
const ReturnConfirmModal = ({ issue, isSubmitting, onCancel, onConfirm }) => {
  if (!issue) return null;
  const fields = [
    { label: "Component Name",  value: issue.component_name },
    { label: "Student Name",    value: issue.leader_name },
    { label: "Team",            value: issue.team_name },
    { label: "Quantity",        value: issue.quantity },
    { label: "Issue Date",      value: formatDate(issue.issue_date) },
    { label: "Return Deadline", value: formatDate(issue.expected_return_date) },
  ];
  return (
    <div className="ls-modal-overlay" onClick={isSubmitting ? undefined : onCancel}>
      <div className="ls-card w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-500"><FiAlertTriangle className="w-5 h-5" /></div>
          <h3 className="ls-title-card">Confirm Return</h3>
        </div>
        <div className="space-y-3 text-sm mb-5">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
              <span className="ls-text-secondary shrink-0">{label}</span>
              <span className="text-right font-medium">{value ?? "—"}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-sm mb-6">Are you sure you want to mark this component as returned?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={isSubmitting} className="flex-1 ls-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            {isSubmitting ? <><FiLoader className="w-4 h-4 animate-spin" />Returning...</> : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────
// Search, filter and sort are resolved by the API (issuedComponentsService.js).
const fetchIssuedPage = async (params, signal) => {
  const res = await authFetch(`${API_BASE}${toQueryString(params)}`, { signal });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "Failed to load issued components.");
  return { data: result.data ?? [], stats: result.stats ?? null };
};

const EMPTY_STATS = { total: 0, pending: 0, returned: 0, overdue: 0 };

const IssuedComponents = () => {
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
    reload: loadIssues,
  } = useListQuery(fetchIssuedPage, {
    initialFilters: { returnStatus: "all" },
    initialSortField: "issue_date",
    initialSortDir: "desc",
  });

  const filterStatus = filters.returnStatus;
  const setFilterStatus = useCallback((value) => setFilter("returnStatus", value), [setFilter]);
  const stats = extra?.stats ?? EMPTY_STATS;

  const [activeIssue, setActiveIssue] = useState(null);
  const [returnTarget, setReturnTarget] = useState(null);
  const [returningId, setReturningId]   = useState(null);
  const [toast, setToast]               = useState(null);

  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(null), 4000); return () => clearTimeout(timer); }, [toast]);

  const handleMarkReturned = useCallback((issue) => setReturnTarget(issue), []);
  const cancelReturn = useCallback(() => { if (returningId) return; setReturnTarget(null); }, [returningId]);

  const confirmReturn = useCallback(async () => {
    if (!returnTarget) return;
    const issueId = returnTarget.issue_id;
    try {
      setReturningId(issueId);
      const res    = await authFetch(`${API_BASE}/${issueId}/return`, { method: "PATCH", headers: { "Content-Type": "application/json" } });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to mark as returned.");
      setToast({ type: "success", message: result.message || "Component returned successfully." });
      setReturnTarget(null);
      loadIssues();
    } catch (err) { setToast({ type: "error", message: err.message || "Failed to mark as returned." }); }
    finally { setReturningId(null); }
  }, [returnTarget, loadIssues]);

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="ls-title-main">Issued Components</h1>
        <p className="ls-text-secondary mt-1">Track components currently issued to students</p>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Total Issued</p><h2 className="ls-stat-value">{loading ? "—" : stats.total}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Pending Returns</p><h2 className="ls-title-main text-blue-400 mt-2">{loading ? "—" : stats.pending}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Returned</p><h2 className="ls-stat-value text-green-600">{loading ? "—" : stats.returned}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Overdue Returns</p><h2 className="ls-stat-value text-red-600">{loading ? "—" : stats.overdue}</h2></div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by component, student, enrollment no, or team..." className="ls-input ls-input-search transition-colors" />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
          <FiFilter className="text-slate-400 shrink-0" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="outline-none text-sm text-slate-700 bg-transparent cursor-pointer">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="ls-card overflow-hidden">
        <div className="ls-table-header flex items-center justify-between">
          <h2 className="ls-title-card">Issued Components List</h2>
          {!loading && !error && <span className="text-sm ls-text-secondary">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>}
        </div>

        {loading && <div className="flex items-center justify-center py-16 ls-text-secondary gap-3"><svg className="animate-spin w-5 h-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Loading issued components...</div>}
        {!loading && error && <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6"><div className="p-3 rounded-full bg-red-50 border border-red-200 text-red-600"><FiAlertTriangle className="w-6 h-6" /></div><p className="text-red-600 font-medium">{error}</p><button onClick={loadIssues} className="mt-2 text-sm px-4 py-2 rounded-lg ls-btn-secondary transition-colors">Try Again</button></div>}
        {!loading && !error && filtered.length === 0 && <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6"><p className="ls-text-secondary">{stats.total === 0 ? "No components are currently issued." : "No issued components found."}{searchTerm && ` No results for "${searchTerm}".`}</p></div>}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="ls-table-th">Issue ID</th>
                  <SortTh label="Component" field="component_name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <th className="ls-table-th">Quantity</th>
                  <SortTh label="Team" field="team_name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Issue Date" field="issue_date" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Return Deadline" field="expected_return_date" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Status" field="return_status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <th className="ls-table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const status = item.return_status?.toLowerCase();
                  const isReturned = status === "returned";
                  const isSubmitting = returningId === item.issue_id;
                  return (
                    <tr key={`${item.issue_id}-${item.component_id}`} className="ls-table-tr transition-colors">
                      <td className="ls-table-td">
                        <button onClick={() => setActiveIssue(item)} className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-colors">
                          #{item.issue_id} <FiInfo className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="ls-table-td text-slate-600">{item.component_name ?? "—"}</td>
                      <td className="ls-table-td">{item.quantity ?? "—"}</td>
                      <td className="ls-table-td text-slate-600">{item.team_name ?? "—"}</td>
                      <td className="ls-table-td text-slate-600">{formatDate(item.issue_date)}</td>
                      <td className="ls-table-td text-slate-600">{formatDate(item.expected_return_date)}</td>
                      <td className="ls-table-td"><span className={`px-3 py-1 rounded-full text-sm transition-colors ${getStatusStyle(item.return_status)}`}>{capitalize(item.return_status)}</span></td>
                      <td className="ls-table-td">
                        <button onClick={() => handleMarkReturned(item)} disabled={isReturned || isSubmitting} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isReturned || isSubmitting ? "bg-slate-100 ls-text-secondary cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-500 text-slate-900 cursor-pointer"}`}>
                          {isSubmitting && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
                          {isReturned ? "Returned" : isSubmitting ? "Returning..." : "Mark Returned"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeIssue && <StudentInfoModal issue={activeIssue} onClose={() => setActiveIssue(null)} />}
      {returnTarget && <ReturnConfirmModal issue={returnTarget} isSubmitting={returningId === returnTarget.issue_id} onCancel={cancelReturn} onConfirm={confirmReturn} />}
    </div>
  );
};

export default IssuedComponents;