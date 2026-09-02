import { useState, useCallback } from "react";
import { useListQuery, toQueryString } from "../../hooks/useListQuery";
import { FiPlus, FiEye, FiInfo, FiX, FiSearch, FiAlertTriangle, FiChevronUp, FiChevronDown, FiFilter } from "react-icons/fi";
import { authFetch } from "../../services/api";
import CommentsSection from "../../components/ui/CommentsSection";

const getStatusStyle = (status) => {
  if (status === "Resolved") return "bg-green-50 text-green-600 border border-green-200";
  return "bg-amber-50 text-amber-600 border border-amber-200";
};

const getSeverityStyle = (severity) => {
  if (severity === "High") return "bg-red-50 text-red-600 border border-red-200";
  if (severity === "Medium") return "bg-amber-50 text-amber-500 border border-amber-200";
  return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
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
    { label: "Student Name", value: student.name },
    { label: "Enrollment Number", value: student.enrollmentNo },
    { label: "Group", value: student.group },
    { label: "Email", value: student.email },
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

const DamageReportModal = ({ report, onClose, onMarkResolved }) => {
  if (!report) return null;
  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="ls-modal-header">
        <h3 className="ls-title-card">Damage Report Details</h3>
        <button onClick={onClose} className="ls-text-secondary hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><FiX className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Report ID", value: report.reportId },
            { label: "Component", value: report.component },
            { label: "Damage Type", value: report.damageType },
            { label: "Report Date", value: report.reportDate },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="ls-text-secondary mb-1">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
          <div>
            <p className="ls-text-secondary mb-1">Penalty</p>
            <p className="font-medium text-red-600">₹{report.penalty.toLocaleString()}</p>
          </div>
          <div>
            <p className="ls-text-secondary mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusStyle(report.status)}`}>{report.status}</span>
          </div>
        </div>
        <div>
          <p className="ls-text-secondary mb-1">Severity Level</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${getSeverityStyle(report.severity)}`}>{report.severity}</span>
        </div>
        <div className="border-t border-slate-200 pt-4">
          <p className="ls-text-secondary mb-1">Damage Description</p>
          <p className="text-slate-600 leading-relaxed">{report.description}</p>
        </div>
        <div className="border-t border-slate-200 pt-4">
          <p className="ls-text-secondary mb-1">Resolution Notes</p>
          <p className="text-slate-600 leading-relaxed">{report.resolutionNotes || "No resolution notes yet."}</p>
        </div>
      </div>
      <CommentsSection entityType="damage" entityId={report.issue_id} />
      <div className="flex gap-3 mt-4">
        {report.status === "Pending" && (
          <button onClick={() => onMarkResolved(report.reportId)} className="flex-1 ls-btn-primary px-4 py-2 rounded-lg font-medium transition-colors">Mark as Resolved</button>
        )}
        <button onClick={onClose} className="flex-1 ls-btn-secondary px-4 py-2 rounded-lg font-medium transition-colors">Close</button>
      </div>
    </Modal>
  );
};

const AddDamageReportModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ component: "", damageType: "", severity: "Low", penalty: "", description: "" });
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const handleSubmit = () => { if (!form.component || !form.damageType || !form.penalty) return; onAdd(form); };
  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="ls-modal-header">
        <h3 className="ls-title-card">New Damage Report</h3>
        <button onClick={onClose} className="ls-text-secondary hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><FiX className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">
        {[
          { label: "Component Name", field: "component", placeholder: "e.g. Arduino Mega 2560" },
          { label: "Damage Type", field: "damageType", placeholder: "e.g. Short Circuit" },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className="block text-sm ls-text-secondary mb-2">{label}</label>
            <input type="text" value={form[field]} onChange={(e) => handleChange(field, e.target.value)} placeholder={placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500" />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm ls-text-secondary mb-2">Severity</label>
            <select value={form.severity} onChange={(e) => handleChange("severity", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500">
              <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm ls-text-secondary mb-2">Penalty (₹)</label>
            <input type="number" value={form.penalty} onChange={(e) => handleChange("penalty", e.target.value)} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm ls-text-secondary mb-2">Description</label>
          <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Describe the damage..." rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500 resize-none" />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={handleSubmit} className="flex-1 ls-btn-primary px-4 py-2 rounded-lg font-medium transition-colors">Submit Report</button>
        <button onClick={onClose} className="flex-1 ls-btn-secondary px-4 py-2 rounded-lg font-medium transition-colors">Cancel</button>
      </div>
    </Modal>
  );
};

// Search, filter and sort are resolved by the API (damageComponentsService.js).
const fetchDamagePage = async (params, signal) => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/damage-components${toQueryString(params)}`,
    { signal }
  );
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "Failed to load damage components.");
  return { data: result.data ?? [], stats: result.stats ?? null };
};

const EMPTY_STATS = {
  total: 0, pending: 0, totalPenalties: 0, highSeverity: 0, damageTypeFrequency: [],
};

const DamageReports = () => {
  const {
    data: filteredReports,
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
    reload: fetchReports,
  } = useListQuery(fetchDamagePage, {
    initialFilters: { status: "all", severity: "all" },
    initialSortField: "reportDate",
    initialSortDir: "desc",
  });

  const filterStatus = filters.status;
  const filterSeverity = filters.severity;
  const setFilterStatus = useCallback((v) => setFilter("status", v), [setFilter]);
  const setFilterSeverity = useCallback((v) => setFilter("severity", v), [setFilter]);

  const stats = extra?.stats ?? EMPTY_STATS;
  const totalReports      = stats.total;
  const pendingResolution = stats.pending;
  const totalPenalties    = stats.totalPenalties;
  const highSeverityCases = stats.highSeverity;
  const damageTypeFrequency = stats.damageTypeFrequency ?? [];
  const maxDamageCount = damageTypeFrequency.length > 0 ? Math.max(...damageTypeFrequency.map((d) => d.count)) : 1;

  const [selectedReport, setSelectedReport]   = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen]   = useState(false);
  const [isAddModalOpen, setIsAddModalOpen]         = useState(false);

  const markResolved = async (reportId) => {
    try {
      const report = filteredReports.find((r) => r.reportId === reportId);
      if (!report) return;
      const res    = await authFetch(`${import.meta.env.VITE_API_URL}/damage-components/${report.issue_id}/resolve`, { method: "PATCH" });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);
      fetchReports();
      setIsReportModalOpen(false);
    } catch (err) { alert("Failed to resolve: " + err.message); }
  };

  const handleAddReport = async (form) => {
    try {
      const res    = await authFetch(`${import.meta.env.VITE_API_URL}/damage-components`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);
      setIsAddModalOpen(false); fetchReports();
    } catch (err) { alert("Failed to add report: " + err.message); }
  };

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="ls-title-main">Damage Components</h1>
          <p className="ls-text-secondary mt-1">Manage damaged components and associated penalties</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 ls-btn-primary px-4 py-2 rounded-lg font-medium transition-colors self-start sm:self-auto">
          <FiPlus />New Damage Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Total Reports</p><h2 className="ls-stat-value">{totalReports}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Pending Resolution</p><h2 className="ls-title-main text-amber-600 mt-2">{pendingResolution}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Total Penalties</p><h2 className="ls-stat-value text-red-600">₹{totalPenalties.toLocaleString()}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">High Severity</p><h2 className="ls-stat-value text-red-600">{highSeverityCases}</h2></div>
      </div>

      <div className="ls-stat-card mb-8">
        <h2 className="text-lg font-semibold mb-4">Most Common Damage Types</h2>
        <div className="space-y-4">
          {damageTypeFrequency.map((item) => (
            <div key={item.type}>
              <div className="flex justify-between text-sm mb-1.5"><span>{item.type}</span><span className="ls-text-secondary">{item.count}</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${(item.count / maxDamageCount) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by Report ID, Component, or Damage Type..." className="ls-input ls-input-search" />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
          <FiFilter className="text-slate-400 shrink-0" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="outline-none text-sm text-slate-700 bg-transparent cursor-pointer">
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
          <FiFilter className="text-slate-400 shrink-0" />
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="outline-none text-sm text-slate-700 bg-transparent cursor-pointer">
            <option value="all">All Severity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="ls-card overflow-hidden">
        <div className="ls-table-header flex items-center justify-between">
          <h2 className="ls-title-card">All Damage Reports</h2>
          {!loading && !error && <span className="text-sm ls-text-secondary">{filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""}</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <SortTh label="Report ID" field="reportId" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Component" field="component" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Damage Type" field="damageType" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Severity" field="severity" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Report Date" field="reportDate" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Penalty" field="penalty" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <th className="ls-table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="px-6 py-16 text-center ls-text-secondary">Loading damage reports...</td></tr>}
              {!loading && error && <tr><td colSpan={8} className="px-6 py-16 text-center text-red-600"><FiAlertTriangle className="mx-auto mb-2 w-6 h-6" />{error}</td></tr>}
              {!loading && !error && filteredReports.map((item) => (
                <tr key={item.reportId} className="ls-table-tr">
                  <td className="ls-table-td">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">{item.reportId}</span>
                      <button onClick={() => { setSelectedStudent(item.student); setIsStudentModalOpen(true); }} className="ls-text-secondary hover:text-cyan-600 cursor-pointer transition-colors" title="View student details"><FiInfo className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                  <td className="ls-table-td">{item.component}</td>
                  <td className="ls-table-td text-slate-600">{item.damageType}</td>
                  <td className="ls-table-td"><span className={`px-3 py-1 rounded-full text-sm ${getSeverityStyle(item.severity)}`}>{item.severity}</span></td>
                  <td className="ls-table-td text-slate-600">{item.reportDate}</td>
                  <td className="ls-table-td text-red-600 font-medium">₹{item.penalty.toLocaleString()}</td>
                  <td className="ls-table-td"><span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(item.status)}`}>{item.status}</span></td>
                  <td className="ls-table-td">
                    <button onClick={() => { setSelectedReport(item); setIsReportModalOpen(true); }} className="flex items-center gap-1.5 ls-btn-secondary px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                      <FiEye className="w-4 h-4" />View
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && !error && filteredReports.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-8 text-center ls-text-secondary">
                  {totalReports === 0 ? "No damaged components found." : "No damage reports match your search."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isStudentModalOpen && <StudentInfoModal student={selectedStudent} onClose={() => { setIsStudentModalOpen(false); setSelectedStudent(null); }} />}
      {isReportModalOpen && <DamageReportModal report={selectedReport} onClose={() => { setIsReportModalOpen(false); setSelectedReport(null); }} onMarkResolved={markResolved} />}
      {isAddModalOpen && <AddDamageReportModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddReport} />}
    </div>
  );
};

export default DamageReports;