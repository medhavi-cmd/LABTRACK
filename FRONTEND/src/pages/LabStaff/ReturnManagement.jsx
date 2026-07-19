import { useEffect, useMemo, useState } from "react";
import { FiInfo, FiEye, FiX, FiSearch, FiAlertTriangle } from "react-icons/fi";
import { authFetch } from "../../services/api";
// NOTE: adjust this import to match the actual path/name of the shared
// authFetch utility used on your other Lab Staff pages. This file assumes
// authFetch(url) resolves directly to the parsed JSON body (i.e. it already
// attaches the JWT and calls res.json() internally). If it instead returns
// a raw Response, change the single call site inside loadReturns() below.
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
const capitalizeCondition = (value) => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};
 
const getConditionStyle = (condition) => {
  const normalized = condition?.toLowerCase();
  if (normalized === "good") {
    return "bg-green-50 text-green-600 border border-green-200";
  }
  if (normalized === "fair") {
    return "bg-amber-50 text-amber-600 border border-amber-200";
  }
  if (normalized === "damaged") {
    return "bg-red-50 text-red-600 border border-red-200";
  }
  return "bg-slate-100 ls-text-secondary border border-slate-200";
};
 
const calculateDuration = (issueDate, returnDate) => {
  if (!issueDate || !returnDate) return null;
  const issued = new Date(issueDate);
  const returned = new Date(returnDate);
  const diffTime = returned - issued;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Number.isFinite(diffDays) ? diffDays : null;
};
 
// Maps a raw GET /api/returns record onto the shape the existing UI expects.
// Backend field names (per returnManagementService.js) are on the left.
const mapReturnRecord = (record) => ({
  returnId: record?.return_id ?? "—",
  issueId: record?.issue_id,
  component: record?.component_name ?? "—",
  quantity: record?.quantity ?? "—",
  issueDate: record?.issue_date ?? null,
  returnDate: record?.actual_return_date ?? null,
  condition: capitalizeCondition(record?.component_condition),
  // "notes" is not part of the current GET /api/returns response — see note
  // in the accompanying message. This is a static placeholder, not fetched data.
  notes: record?.notes ?? "No notes recorded for this return.",
  student: {
    name: record?.student_name ?? "—",
    enrollmentNo: record?.enrollment_no ?? "—",
    batch: record?.batch ?? "—",
    // Backend has no separate "group" field; team_name is used as the
    // closest equivalent available from the API.
    group: record?.team_name ?? "—",
    email: record?.email ?? "—",
  },
});
 
// ─── Modal shell ──────────────────────────────────────────────────────────────
const Modal = ({ children, onClose, maxWidth = "max-w-md" }) => (
  <div
    className="ls-modal-overlay"
    onClick={onClose}
  >
    <div
      className={`ls-card w-full ${maxWidth} p-6 shadow-xl transition-transform duration-200 scale-100 max-h-[90vh] overflow-y-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);
 
// ─── Student Info Modal ───────────────────────────────────────────────────────
const StudentInfoModal = ({ student, onClose }) => {
  if (!student) return null;
 
  const fields = [
    { label: "Student Name", value: student?.name },
    { label: "Enrollment Number", value: student?.enrollmentNo },
    { label: "Batch", value: student?.batch },
    { label: "Group", value: student?.group },
    { label: "Email", value: student?.email },
  ];
 
  return (
    <Modal onClose={onClose}>
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
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0"
          >
            <span className="ls-text-secondary">{field.label}</span>
            <span className="text-right font-medium">{field.value ?? "—"}</span>
          </div>
        ))}
      </div>
 
      <button
        onClick={onClose}
        className="mt-6 w-full ls-btn-secondary px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Close
      </button>
    </Modal>
  );
};
 
// ─── Return Details Modal ─────────────────────────────────────────────────────
const ReturnDetailsModal = ({ returnItem, onClose }) => {
  if (!returnItem) return null;
 
  const duration = calculateDuration(returnItem?.issueDate, returnItem?.returnDate);
 
  const fields = [
    { label: "Return ID", value: returnItem?.returnId },
    { label: "Component Name", value: returnItem?.component },
    { label: "Quantity", value: returnItem?.quantity },
    { label: "Issue Date", value: returnItem?.issueDate },
    { label: "Return Date", value: returnItem?.returnDate },
  ];
 
  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="ls-modal-header">
        <h3 className="ls-title-card">Return Details</h3>
        <button
          onClick={onClose}
          className="ls-text-secondary hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
 
      <div className="space-y-3 text-sm">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex justify-between gap-4 border-b border-slate-200 pb-3"
          >
            <span className="ls-text-secondary">{field.label}</span>
            <span className="text-right font-medium">{field.value ?? "—"}</span>
          </div>
        ))}
 
        <div className="flex justify-between gap-4 border-b border-slate-200 pb-3">
          <span className="ls-text-secondary">Condition</span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getConditionStyle(
              returnItem?.condition
            )}`}
          >
            {returnItem?.condition ?? "—"}
          </span>
        </div>
 
        <div className="flex justify-between gap-4 border-b border-slate-200 pb-3">
          <span className="ls-text-secondary">Return Duration</span>
          <span className="font-medium">
            {duration !== null ? `${duration} Days` : "—"}
          </span>
        </div>
 
        <div className="pt-1">
          <span className="ls-text-secondary block mb-1">Full Notes</span>
          <p className="text-slate-600 leading-relaxed">
            {returnItem?.notes ?? "—"}
          </p>
        </div>
      </div>
 
      <button
        onClick={onClose}
        className="mt-6 w-full ls-btn-secondary px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Close
      </button>
    </Modal>
  );
};
 
// ─── Main Page ────────────────────────────────────────────────────────────────
const ReturnManagement = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
 
  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
 
    const loadReturns = async () => {
      try {
        setLoading(true);
        setError("");
 
        const res = await authFetch("http://localhost:5000/api/returns");
        const result = await res.json();
 
        if (!res.ok || !result?.success) {
          throw new Error(result?.message || "Failed to load return history.");
        }
 
        const raw = result.data ?? [];
        const mapped = Array.isArray(raw) ? raw.map(mapReturnRecord) : [];
 
        if (isMounted) {
          setReturns(mapped);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load return history.");
          setReturns([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
 
    loadReturns();
 
    return () => {
      isMounted = false;
    };
  }, []);
 
  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = returns.length;
    const good = returns.filter((r) => r.condition === "Good").length;
    const fair = returns.filter((r) => r.condition === "Fair").length;
    const damaged = returns.filter((r) => r.condition === "Damaged").length;
 
    const percentOf = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);
 
    return {
      total,
      good,
      fair,
      damaged,
      goodPercent: percentOf(good),
      fairPercent: percentOf(fair),
      damagedPercent: percentOf(damaged),
    };
  }, [returns]);
 
  // ── Search ─────────────────────────────────────────────────────────────────
  const filteredReturns = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return returns;
    return returns.filter((item) =>
      [item?.returnId, item?.component, item?.student?.enrollmentNo].some(
        (field) => field?.toLowerCase().includes(term)
      )
    );
  }, [returns, searchTerm]);
 
  // ── Modal handlers ─────────────────────────────────────────────────────────
  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };
 
  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
  };
 
  const openDetailsModal = (returnItem) => {
    setSelectedReturn(returnItem);
    setIsDetailsModalOpen(true);
  };
 
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedReturn(null);
  };
 
  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="ls-title-main">Return Management</h1>
        <p className="ls-text-secondary mt-1">
          Track component returns and condition assessments
        </p>
      </div>
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="ls-stat-card">
          <p className="ls-text-secondary">Total Returns This Week</p>
          <h2 className="ls-stat-value">{loading ? "—" : stats.total}</h2>
        </div>
 
        <div className="ls-stat-card">
          <p className="ls-text-secondary">Good Condition</p>
          <h2 className="ls-stat-value text-green-600">
            {loading ? "—" : stats.good}
          </h2>
        </div>
 
        <div className="ls-stat-card">
          <p className="ls-text-secondary">Fair Condition</p>
          <h2 className="ls-title-main text-amber-600 mt-2">
            {loading ? "—" : stats.fair}
          </h2>
        </div>
 
        <div className="ls-stat-card">
          <p className="ls-text-secondary">Damaged Returns</p>
          <h2 className="ls-stat-value text-red-600">
            {loading ? "—" : stats.damaged}
          </h2>
        </div>
      </div>
 
      {/* Return Condition Summary */}
      <div className="ls-stat-card mb-8">
        <h2 className="text-lg font-semibold mb-4">Return Condition Summary</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Good Returns</span>
              <span className="ls-text-secondary">{loading ? "—" : `${stats.goodPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.goodPercent}%` }}
              ></div>
            </div>
          </div>
 
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Fair Returns</span>
              <span className="ls-text-secondary">{loading ? "—" : `${stats.fairPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.fairPercent}%` }}
              ></div>
            </div>
          </div>
 
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Damaged Returns</span>
              <span className="ls-text-secondary">{loading ? "—" : `${stats.damagedPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.damagedPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Return ID, Component, or Enrollment No..."
          className="ls-input ls-input-search"
        />
      </div>
 
      {/* Table */}
      <div className="ls-card overflow-hidden">
        <div className="ls-table-header">
          <h2 className="ls-title-card">Return History</h2>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="ls-table-th">Return ID</th>
                <th className="ls-table-th">Component</th>
                <th className="ls-table-th">Quantity</th>
                <th className="ls-table-th">Issue Date</th>
                <th className="ls-table-th">Return Date</th>
                <th className="ls-table-th">Condition</th>
                <th className="ls-table-th">Details</th>
              </tr>
            </thead>
 
            <tbody>
              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-16">
                    <div className="flex items-center justify-center ls-text-secondary gap-3">
                      <svg
                        className="animate-spin w-5 h-5 text-cyan-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Loading return history...
                    </div>
                  </td>
                </tr>
              )}
 
              {/* Error */}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <FiAlertTriangle className="w-6 h-6 text-red-600" />
                      <p className="text-red-600 font-medium">{error}</p>
                    </div>
                  </td>
                </tr>
              )}
 
              {/* Empty — no returns at all */}
              {!loading && !error && returns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center ls-text-secondary">
                    No returned components found.
                  </td>
                </tr>
              )}
 
              {/* Empty — search yielded nothing */}
              {!loading && !error && returns.length > 0 && filteredReturns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center ls-text-secondary">
                    No return records match your search.
                  </td>
                </tr>
              )}
 
              {/* Rows */}
              {!loading &&
                !error &&
                filteredReturns.map((item) => (
                  <tr
                    key={item.returnId}
                    className="ls-table-tr"
                  >
                    <td className="ls-table-td">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">{item.returnId}</span>
                        <button
                          onClick={() => openStudentModal(item.student)}
                          className="ls-text-secondary hover:text-cyan-600 cursor-pointer transition-colors"
                          title="View student details"
                        >
                          <FiInfo className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="ls-table-td text-slate-600">{item.component}</td>
                    <td className="ls-table-td">{item.quantity}</td>
                    <td className="ls-table-td text-slate-600">{item.issueDate ?? "—"}</td>
                    <td className="ls-table-td text-slate-600">{item.returnDate ?? "—"}</td>
                    <td className="ls-table-td">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getConditionStyle(
                          item.condition
                        )}`}
                      >
                        {item.condition}
                      </span>
                    </td>
                    <td className="ls-table-td">
                      <button
                        onClick={() => openDetailsModal(item)}
                        className="text-cyan-600 hover:text-cyan-300 cursor-pointer transition-colors"
                        title="View return details"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Modals */}
      {isStudentModalOpen && (
        <StudentInfoModal student={selectedStudent} onClose={closeStudentModal} />
      )}
 
      {isDetailsModalOpen && (
        <ReturnDetailsModal returnItem={selectedReturn} onClose={closeDetailsModal} />
      )}
    </div>
  );
};
 
export default ReturnManagement;
 