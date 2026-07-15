import { useCallback, useEffect, useMemo, useState } from "react";
import { FiInfo, FiX, FiSearch, FiLoader, FiAlertTriangle } from "react-icons/fi";
 
// ─── Config ─────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api/issued-components";
 
// ─── Status badge ─────────────────────────────────────────────────────────────
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":  return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    case "overdue":  return "bg-red-500/10 text-red-400 border border-red-500/30";
    case "returned": return "bg-green-500/10 text-green-400 border border-green-500/30";
    default:         return "bg-slate-500/10 text-slate-400 border border-slate-500/30";
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
          ? "bg-green-500/10 border-green-500/30 text-green-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#0f172a] border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-xl transition-transform duration-200 scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold">Student Information</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
 
        <div className="space-y-3 text-sm">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0"
            >
              <span className="text-slate-400 shrink-0">{label}</span>
              <span className="text-right font-medium">{value ?? "—"}</span>
            </div>
          ))}
        </div>
 
        <button
          onClick={onClose}
          className="mt-6 w-full bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200"
      onClick={isSubmitting ? undefined : onCancel}
    >
      <div
        className="bg-[#0f172a] border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-xl transition-transform duration-200 scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold">Confirm Return</h3>
        </div>
 
        <div className="space-y-3 text-sm mb-5">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0"
            >
              <span className="text-slate-400 shrink-0">{label}</span>
              <span className="text-right font-medium">{value ?? "—"}</span>
            </div>
          ))}
        </div>
 
        <p className="text-slate-300 text-sm mb-6">
          Are you sure you want to mark this component as returned?
        </p>
 
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
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
      const res    = await fetch(API_BASE);
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
      const res = await fetch(`${API_BASE}/${issueId}/return`, {
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
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Issued Components</h1>
        <p className="text-slate-400 mt-1">
          Track components currently issued to students
        </p>
      </div>
 
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 transition-colors hover:border-slate-700">
          <p className="text-slate-400">Total Issued</p>
          <h2 className="text-3xl font-bold mt-2">{loading ? "—" : stats.total}</h2>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 transition-colors hover:border-slate-700">
          <p className="text-slate-400">Pending Returns</p>
          <h2 className="text-3xl font-bold text-blue-400 mt-2">{loading ? "—" : stats.pending}</h2>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 transition-colors hover:border-slate-700">
          <p className="text-slate-400">Returned</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">{loading ? "—" : stats.returned}</h2>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 transition-colors hover:border-slate-700">
          <p className="text-slate-400">Overdue Returns</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">{loading ? "—" : stats.overdue}</h2>
        </div>
      </div>
 
      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by component, student, enrollment no, or team..."
          className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-cyan-500 transition-colors"
        />
      </div>
 
      {/* Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Issued Components List</h2>
        </div>
 
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
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
            <div className="p-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={loadIssues}
              className="mt-2 text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
 
        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
            <p className="text-slate-400">
              {issues.length === 0
                ? "No components are currently issued."
                : "No issued components found."}
            </p>
            {searchTerm && (
              <p className="text-slate-500 text-sm">
                No results for "{searchTerm}". Try a different search term.
              </p>
            )}
          </div>
        )}
 
        {/* Table rows */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#111827]">
                <tr>
                  <th className="text-left px-6 py-4">Issue ID</th>
                  <th className="text-left px-6 py-4">Component</th>
                  <th className="text-left px-6 py-4">Quantity</th>
                  <th className="text-left px-6 py-4">Team</th>
                  <th className="text-left px-6 py-4">Issue Date</th>
                  <th className="text-left px-6 py-4">Return Deadline</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
 
              <tbody>
                {filtered.map((item) => {
                  const status = item.return_status?.toLowerCase();
                  const isReturned = status === "returned";
                  const isSubmitting = returningId === item.issue_id;
 
                  return (
                    <tr
                      key={item.issue_id}
                      className="border-t border-slate-800 hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-300">#{item.issue_id}</span>
                          <button
                            onClick={() => setActiveIssue(item)}
                            className="self-end mt-1 text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors"
                            title="View student details"
                          >
                            <FiInfo className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{item.component_name ?? "—"}</td>
                      <td className="px-6 py-4">{item.quantity ?? "—"}</td>
                      <td className="px-6 py-4 text-slate-300">{item.team_name ?? "—"}</td>
                      <td className="px-6 py-4 text-slate-300">{formatDate(item.issue_date)}</td>
                      <td className="px-6 py-4 text-slate-300">{formatDate(item.expected_return_date)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm transition-colors ${getStatusStyle(item.return_status)}`}>
                          {capitalize(item.return_status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleMarkReturned(item)}
                          disabled={isReturned || isSubmitting}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            isReturned
                              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                              : isSubmitting
                              ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                              : "bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
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
 