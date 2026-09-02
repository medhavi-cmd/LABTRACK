import { useCallback, useState } from "react";
import { useListQuery, toQueryString } from "../../hooks/useListQuery";
import { FiInfo, FiEye, FiX, FiSearch, FiAlertTriangle, FiChevronUp, FiChevronDown, FiFilter } from "react-icons/fi";
import { authFetch } from "../../services/api";
import CommentsSection from "../../components/ui/CommentsSection";

const capitalizeCondition = (value) => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const getConditionStyle = (condition) => {
  const normalized = condition?.toLowerCase();
  if (normalized === "good")    return "bg-green-50 text-green-600 border border-green-200";
  if (normalized === "fair")    return "bg-amber-50 text-amber-600 border border-amber-200";
  if (normalized === "damaged") return "bg-red-50 text-red-600 border border-red-200";
  return "bg-slate-100 ls-text-secondary border border-slate-200";
};

const calculateDuration = (issueDate, returnDate) => {
  if (!issueDate || !returnDate) return null;
  const diffDays = Math.round((new Date(returnDate) - new Date(issueDate)) / (1000 * 60 * 60 * 24));
  return Number.isFinite(diffDays) ? diffDays : null;
};

const mapReturnRecord = (record) => ({
  returnId: record?.return_id ?? "—",
  issueId:  record?.issue_id,
  component: record?.component_name ?? "—",
  quantity:  record?.quantity ?? "—",
  issueDate:  record?.issue_date ?? null,
  returnDate: record?.actual_return_date ?? null,
  condition:  capitalizeCondition(record?.component_condition),
  notes: record?.notes ?? "No notes recorded for this return.",
  student: {
    name:         record?.student_name ?? "—",
    enrollmentNo: record?.enrollment_no ?? "—",
    batch:        record?.batch ?? "—",
    group:        record?.team_name ?? "—",
    email:        record?.email ?? "—",
  },
});

// Search, filter and sort are resolved by the API (returnManagementService.js).
const fetchReturnsPage = async (params, signal) => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/returns${toQueryString(params)}`,
    { signal }
  );
  const result = await res.json();
  if (!res.ok || !result?.success) throw new Error(result?.message || "Failed to load return history.");
  return {
    data: (result.data ?? []).map(mapReturnRecord),
    stats: result.stats ?? null,
  };
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

const Modal = ({ children, onClose, maxWidth = "max-w-md" }) => (
  <div className="ls-modal-overlay" onClick={onClose}>
    <div className={`ls-card w-full ${maxWidth} p-6 shadow-xl transition-transform duration-200 scale-100 max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const StudentInfoModal = ({ student, onClose }) => {
  if (!student) return null;
  const fields = [
    { label: "Student Name",      value: student?.name },
    { label: "Enrollment Number", value: student?.enrollmentNo },
    { label: "Batch",             value: student?.batch },
    { label: "Group",             value: student?.group },
    { label: "Email",             value: student?.email },
  ];
  return (
    <Modal onClose={onClose}>
      <div className="ls-modal-header">
        <h3 className="ls-title-card">Student Information</h3>
        <button onClick={onClose} className="ls-text-secondary hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><FiX className="w-5 h-5" /></button>
      </div>
      <div className="space-y-3 text-sm">
        {fields.map((field) => (
          <div key={field.label} className="flex justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
            <span className="ls-text-secondary">{field.label}</span>
            <span className="text-right font-medium">{field.value ?? "—"}</span>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="mt-6 w-full ls-btn-secondary px-4 py-2 rounded-lg font-medium transition-colors">Close</button>
    </Modal>
  );
};

const ReturnDetailsModal = ({ returnItem, onClose }) => {
  if (!returnItem) return null;
  const duration = calculateDuration(returnItem?.issueDate, returnItem?.returnDate);
  const fields = [
    { label: "Return ID",      value: returnItem?.returnId },
    { label: "Component Name", value: returnItem?.component },
    { label: "Quantity",       value: returnItem?.quantity },
    { label: "Issue Date",     value: returnItem?.issueDate },
    { label: "Return Date",    value: returnItem?.returnDate },
  ];
  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="ls-modal-header">
        <h3 className="ls-title-card">Return Details</h3>
        <button onClick={onClose} className="ls-text-secondary hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><FiX className="w-5 h-5" /></button>
      </div>
      <div className="space-y-3 text-sm">
        {fields.map((field) => (
          <div key={field.label} className="flex justify-between gap-4 border-b border-slate-200 pb-3">
            <span className="ls-text-secondary">{field.label}</span>
            <span className="text-right font-medium">{field.value ?? "—"}</span>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-b border-slate-200 pb-3">
          <span className="ls-text-secondary">Condition</span>
          <span className={`px-3 py-1 rounded-full text-sm ${getConditionStyle(returnItem?.condition)}`}>{returnItem?.condition ?? "—"}</span>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-200 pb-3">
          <span className="ls-text-secondary">Return Duration</span>
          <span className="font-medium">{duration !== null ? `${duration} Days` : "—"}</span>
        </div>
        <div className="pt-1">
          <span className="ls-text-secondary block mb-1">Notes</span>
          <p className="text-slate-600 leading-relaxed">{returnItem?.notes ?? "—"}</p>
        </div>
      </div>
      <CommentsSection entityType="return" entityId={returnItem?.returnId} />
      <button onClick={onClose} className="mt-4 w-full ls-btn-secondary px-4 py-2 rounded-lg font-medium transition-colors">Close</button>
    </Modal>
  );
};

const ReturnManagement = () => {
  const {
    data: filteredReturns,
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
  } = useListQuery(fetchReturnsPage, {
    initialFilters: { condition: "all" },
    initialSortField: "returnDate",
    initialSortDir: "desc",
  });

  const filterCondition = filters.condition;
  const setFilterCondition = useCallback((value) => setFilter("condition", value), [setFilter]);

  const rawStats = extra?.stats ?? { total: 0, good: 0, fair: 0, damaged: 0 };
  const percentOf = (count) => (rawStats.total > 0 ? Math.round((count / rawStats.total) * 100) : 0);
  const stats = {
    ...rawStats,
    goodPercent: percentOf(rawStats.good),
    fairPercent: percentOf(rawStats.fair),
    damagedPercent: percentOf(rawStats.damaged),
  };

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedReturn, setSelectedReturn]   = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);


  return (
    <div className="">
      <div className="mb-8">
        <h1 className="ls-title-main">Return Management</h1>
        <p className="ls-text-secondary mt-1">Track component returns and condition assessments</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Total Returns</p><h2 className="ls-stat-value">{loading ? "—" : stats.total}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Good Condition</p><h2 className="ls-stat-value text-green-600">{loading ? "—" : stats.good}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Fair Condition</p><h2 className="ls-title-main text-amber-600 mt-2">{loading ? "—" : stats.fair}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Damaged Returns</p><h2 className="ls-stat-value text-red-600">{loading ? "—" : stats.damaged}</h2></div>
      </div>

      <div className="ls-stat-card mb-8">
        <h2 className="text-lg font-semibold mb-4">Return Condition Summary</h2>
        <div className="space-y-4">
          {[
            { label: "Good Returns",    pct: stats.goodPercent,    color: "bg-green-500" },
            { label: "Fair Returns",    pct: stats.fairPercent,    color: "bg-amber-500" },
            { label: "Damaged Returns", pct: stats.damagedPercent, color: "bg-red-500" },
          ].map(({ label, pct, color }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1.5"><span>{label}</span><span className="ls-text-secondary">{loading ? "—" : `${pct}%`}</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className={`${color} h-2 rounded-full`} style={{ width: `${loading ? 0 : pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by Return ID, Component, or Enrollment No..." className="ls-input ls-input-search" />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
          <FiFilter className="text-slate-400 shrink-0" />
          <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} className="outline-none text-sm text-slate-700 bg-transparent cursor-pointer">
            <option value="all">All Condition</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>
      </div>

      <div className="ls-card overflow-hidden">
        <div className="ls-table-header flex items-center justify-between">
          <h2 className="ls-title-card">Return History</h2>
          {!loading && !error && <span className="text-sm ls-text-secondary">{filteredReturns.length} record{filteredReturns.length !== 1 ? "s" : ""}</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <SortTh label="Return ID" field="returnId" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Component" field="component" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <th className="ls-table-th">Quantity</th>
                <SortTh label="Issue Date" field="issueDate" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Return Date" field="returnDate" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Condition" field="condition" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <th className="ls-table-th">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="px-6 py-16"><div className="flex items-center justify-center ls-text-secondary gap-3"><svg className="animate-spin w-5 h-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Loading return history...</div></td></tr>}
              {!loading && error && <tr><td colSpan={7} className="px-6 py-16"><div className="flex flex-col items-center justify-center gap-2 text-center"><FiAlertTriangle className="w-6 h-6 text-red-600" /><p className="text-red-600 font-medium">{error}</p></div></td></tr>}
              {!loading && !error && stats.total === 0 && <tr><td colSpan={7} className="px-6 py-8 text-center ls-text-secondary">No returned components found.</td></tr>}
              {!loading && !error && stats.total > 0 && filteredReturns.length === 0 && <tr><td colSpan={7} className="px-6 py-8 text-center ls-text-secondary">No return records match your search.</td></tr>}
              {!loading && !error && filteredReturns.map((item) => (
                <tr key={item.returnId} className="ls-table-tr">
                  <td className="ls-table-td">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">{item.returnId}</span>
                      <button onClick={() => { setSelectedStudent(item.student); setIsStudentModalOpen(true); }} className="ls-text-secondary hover:text-cyan-600 cursor-pointer transition-colors" title="View student details"><FiInfo className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                  <td className="ls-table-td text-slate-600">{item.component}</td>
                  <td className="ls-table-td">{item.quantity}</td>
                  <td className="ls-table-td text-slate-600">{item.issueDate ?? "—"}</td>
                  <td className="ls-table-td text-slate-600">{item.returnDate ?? "—"}</td>
                  <td className="ls-table-td"><span className={`px-3 py-1 rounded-full text-sm ${getConditionStyle(item.condition)}`}>{item.condition}</span></td>
                  <td className="ls-table-td">
                    <button onClick={() => { setSelectedReturn(item); setIsDetailsModalOpen(true); }} className="text-cyan-600 hover:text-cyan-300 cursor-pointer transition-colors" title="View return details"><FiEye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isStudentModalOpen && <StudentInfoModal student={selectedStudent} onClose={() => { setIsStudentModalOpen(false); setSelectedStudent(null); }} />}
      {isDetailsModalOpen && <ReturnDetailsModal returnItem={selectedReturn} onClose={() => { setIsDetailsModalOpen(false); setSelectedReturn(null); }} />}
    </div>
  );
};

export default ReturnManagement;