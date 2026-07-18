import { useCallback, useEffect, useMemo, useState } from "react";
import { FiInfo, FiX, FiSearch, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { authFetch } from "../../services/api";
 
// ─── Config ─────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api/issued-components";
 
// ─── Status badge ─────────────────────────────────────────────────────────────
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":  return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    case "overdue":  return "bg-red-50 text-red-600 border border-red-200";
    case "returned": return "bg-green-50 text-green-600 border border-green-200";
    default:         return "bg-slate-100 ls-text-secondary border border-slate-200";
  }
};
 
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "—";
 
const formatDate = (value) => {
  if (!value) return "—";
  try { return new Date(value).toLocaleDateString(); }
  catch { return value; }
};
 
// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div
      className={`mb-6 flex items-start justify-between gap-4 rounded-xl border px-5 py-3 text-sm font-medium transition-opacity duration-200 ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-600"
          : "bg-red-50 border-red-200 text-red-600"
      }`}
    >
      <span>{isSuccess ? "✅ " : "❌ "}{toast.message}</span>
      <button
        onClick={onClose}
        className="text-current opacity-70 hover:opacity-100 transition-opacity shrink-0"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};
 
// ─── Student / Issue Info Modal ───────────────────────────────────────────────
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
    { label: "Status",                value: capitalize(issue.return_status) },
    { label: "Return Status",         value: capitalize(issue.return_status) },
    { label: "Actual Return Date",    value: formatDate(issue.actual_return_date) },
    { label: "Component Condition",   value: issue.component_condition ? capitalize(issue.component_condition) : "—" },
  ];
 
  return (
    <div
      className="ls-modal-overlay"
      onClick={onClose}
    >
      <div
        className="ls-card w-full max-w-md p-6 shadow-xl transition-transform duration-200 scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ls-modal-header">
          <h3 className="ls-title-card">Student Information</h3>
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
              className="flex justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0"
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
 
// ─── Return Confirmation Modal ────────────────────────────────────────────────
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
    <div
      className="ls-modal-overlay"
      onClick={isSubmitting ? undefined : onCancel}
    >
      <div
        className="ls-card w-full max-w-md p-6 shadow-xl transition-transform duration-200 scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-500">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="ls-title-card">Confirm Return</h3>
        </div>
 
        <div className="space-y-3 text-sm mb-5">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0"
            >
              <span className="ls-text-secondary shrink-0">{label}</span>
              <span className="text-right font-medium">{value ?? "—"}</span>
            </div>
          ))}
        </div>
 
        <p className="text-slate-600 text-sm mb-6">
          Are you sure you want to mark this component as returned?
        </p>
 
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 ls-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Returning...
              </>
            ) : (
              "Confirm Return"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
 
// ─── Main Page ────────────────────────────────────────────────────────────────
const IssuedComponents = () => {
  const [issues, setIssues]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIssue, setActiveIssue] = useState(null);
 
  // Return confirmation flow
  const [returnTarget, setReturnTarget] = useState(null); // issue pending confirmation
  const [returningId, setReturningId]   = useState(null); // issue_id currently submitting
  const [toast, setToast]               = useState(null); // { type, message }
 
  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res    = await authFetch(API_BASE);
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to load issued components.");
      }
      const raw = result.data ?? result;
      setIssues(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setError(err.message || "Failed to load issued components.");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadIssues();
  }, [loadIssues]);
 
  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
 
  // ── Return handling ───────────────────────────────────────────────────────
  const handleMarkReturned = useCallback((issue) => {
    setReturnTarget(issue);
  }, []);
 
  const cancelReturn = useCallback(() => {
    if (returningId) return; // don't allow closing mid-request
    setReturnTarget(null);
  }, [returningId]);
 
  const confirmReturn = useCallback(async () => {
    if (!returnTarget) return;
    const issueId = returnTarget.issue_id;
 
    try {
      setReturningId(issueId);
      const res = await authFetch(`${API_BASE}/${issueId}/return`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
 
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to mark as returned.");
      }
 
      setToast({ type: "success", message: result.message || "Component returned successfully." });
      setReturnTarget(null);
      await loadIssues(); // refresh list + stats from source of truth
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to mark as returned." });
    } finally {
      setReturningId(null);
    }
  }, [returnTarget, loadIssues]);
 
  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    issues.length,
    pending:  issues.filter((i) => i.return_status?.toLowerCase() === "pending").length,
    returned: issues.filter((i) => i.return_status?.toLowerCase() === "returned").length,
    overdue:  issues.filter((i) => i.return_status?.toLowerCase() === "overdue").length,
  }), [issues]);
 
  // ── Search ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return issues;
    return issues.filter((i) =>
      [i.component_name, i.leader_name, i.enrollment_no, i.team_name]
        .some((f) => f?.toLowerCase().includes(term))
    );
  }, [issues, searchTerm]);
 
  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="ls-title-main">Issued Components</h1>
        <p className="ls-text-secondary mt-1">
          Track components currently issued to students
        </p>
      </div>
 
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="ls-stat-card transition-colors hover:border-slate-200">
          <p className="ls-text-secondary">Total Issued</p>
          <h2 className="ls-stat-value">{loading ? "—" : stats.total}</h2>
        </div>
        <div className="ls-stat-card transition-colors hover:border-slate-200">
          <p className="ls-text-secondary">Pending Returns</p>
          <h2 className="ls-title-main text-blue-400 mt-2">{loading ? "—" : stats.pending}</h2>
        </div>
        <div className="ls-stat-card transition-colors hover:border-slate-200">
          <p className="ls-text-secondary">Returned</p>
          <h2 className="ls-stat-value text-green-600">{loading ? "—" : stats.returned}</h2>
        </div>
        <div className="ls-stat-card transition-colors hover:border-slate-200">
          <p className="ls-text-secondary">Overdue Returns</p>
          <h2 className="ls-stat-value text-red-600">{loading ? "—" : stats.overdue}</h2>
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
          className="ls-input ls-input-search transition-colors"
        />
      </div>
 
      {/* Table */}
      <div className="ls-card overflow-hidden">
        <div className="ls-table-header">
          <h2 className="ls-title-card">Issued Components List</h2>
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
            Loading issued components...
          </div>
        )}
 
        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <div className="p-3 rounded-full bg-red-50 border border-red-200 text-red-600">
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={loadIssues}
              className="mt-2 text-sm px-4 py-2 rounded-lg ls-btn-secondary transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
 
        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
            <p className="ls-text-secondary">
              {issues.length === 0
                ? "No components are currently issued."
                : "No issued components found."}
            </p>
            {searchTerm && (
              <p className="ls-text-secondary text-sm">
                No results for "{searchTerm}". Try a different search term.
              </p>
            )}
          </div>
        )}
 
        {/* Table rows */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="ls-table-th">Issue ID</th>
                  <th className="ls-table-th">Component</th>
                  <th className="ls-table-th">Quantity</th>
                  <th className="ls-table-th">Team</th>
                  <th className="ls-table-th">Issue Date</th>
                  <th className="ls-table-th">Return Deadline</th>
                  <th className="ls-table-th">Status</th>
                  <th className="ls-table-th">Actions</th>
                </tr>
              </thead>
 
              <tbody>
                {filtered.map((item) => {
                  const status = item.return_status?.toLowerCase();
                  const isReturned = status === "returned";
                  const isSubmitting = returningId === item.issue_id;
 
                  return (
                    <tr
                      key={`${item.issue_id}-${item.component_id}`}
                      className="ls-table-tr transition-colors"
                    >
                      <td className="ls-table-td">
                        <div className="flex flex-col">
                          <span className="text-slate-600">#{item.issue_id}</span>
                          <button
                            onClick={() => setActiveIssue(item)}
                            className="self-end mt-1 ls-text-secondary hover:text-cyan-600 cursor-pointer transition-colors"
                            title="View student details"
                          >
                            <FiInfo className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="ls-table-td text-slate-600">{item.component_name ?? "—"}</td>
                      <td className="ls-table-td">{item.quantity ?? "—"}</td>
                      <td className="ls-table-td text-slate-600">{item.team_name ?? "—"}</td>
                      <td className="ls-table-td text-slate-600">{formatDate(item.issue_date)}</td>
                      <td className="ls-table-td text-slate-600">{formatDate(item.expected_return_date)}</td>
                      <td className="ls-table-td">
                        <span className={`px-3 py-1 rounded-full text-sm transition-colors ${getStatusStyle(item.return_status)}`}>
                          {capitalize(item.return_status)}
                        </span>
                      </td>
                      <td className="ls-table-td">
                        <button
                          onClick={() => handleMarkReturned(item)}
                          disabled={isReturned || isSubmitting}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            isReturned
                              ? "bg-slate-100 ls-text-secondary cursor-not-allowed"
                              : isSubmitting
                              ? "bg-slate-100 ls-text-secondary cursor-not-allowed"
                              : "bg-cyan-600 hover:bg-cyan-500 text-slate-900 cursor-pointer"
                          }`}
                        >
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
 
      {/* Student Info Modal */}
      {activeIssue && (
        <StudentInfoModal
          issue={activeIssue}
          onClose={() => setActiveIssue(null)}
        />
      )}
 
      {/* Return Confirmation Modal */}
      {returnTarget && (
        <ReturnConfirmModal
          issue={returnTarget}
          isSubmitting={returningId === returnTarget.issue_id}
          onCancel={cancelReturn}
          onConfirm={confirmReturn}
        />
      )}
    </div>
  );
};
 
export default IssuedComponents;
 