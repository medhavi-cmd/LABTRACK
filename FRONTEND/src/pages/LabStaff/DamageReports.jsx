
import { useState, useEffect, useMemo } from "react";
import { FiPlus, FiEye, FiInfo, FiX, FiSearch, FiAlertTriangle } from "react-icons/fi";
import { authFetch } from "../../services/api";
 

 
const getStatusStyle = (status) => {
  if (status === "Resolved") {
    return "bg-green-500/10 text-green-400 border border-green-500/30";
  }
  return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
};
 
const getSeverityStyle = (severity) => {
  if (severity === "High") {
    return "bg-red-500/10 text-red-400 border border-red-500/30";
  }
  if (severity === "Medium") {
    return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
  }
  return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
};
 
const Modal = ({ children, onClose, maxWidth = "max-w-md" }) => (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200"
    onClick={onClose}
  >
    <div
      className={`bg-[#0f172a] border border-slate-800 rounded-xl w-full ${maxWidth} p-6 shadow-xl transition-transform duration-200 scale-100 max-h-[90vh] overflow-y-auto`}
      onClick={(e) => e.stopPropagation()}
    >
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
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0"
          >
            <span className="text-slate-400">{field.label}</span>
            <span className="text-right font-medium">{field.value}</span>
          </div>
        ))}
      </div>
 
      <button
        onClick={onClose}
        className="mt-6 w-full bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Close
      </button>
    </Modal>
  );
};
 
const DamageReportModal = ({ report, onClose, onMarkResolved }) => {
  if (!report) return null;
 
  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold">Damage Components Details</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
 
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 mb-1">Report ID</p>
            <p className="font-medium">{report.reportId}</p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Component</p>
            <p className="font-medium">{report.component}</p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Damage Type</p>
            <p className="font-medium">{report.damageType}</p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Report Date</p>
            <p className="font-medium">{report.reportDate}</p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Penalty</p>
            <p className="font-medium text-red-400">
              ₹{report.penalty.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusStyle(
                report.status
              )}`}
            >
              {report.status}
            </span>
          </div>
        </div>
 
        <div>
          <p className="text-slate-400 mb-1">Severity Level</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${getSeverityStyle(
              report.severity
            )}`}
          >
            {report.severity}
          </span>
        </div>
 
        <div className="border-t border-slate-800 pt-4">
          <p className="text-slate-400 mb-1">Damage Description</p>
          <p className="text-slate-200 leading-relaxed">
            {report.description}
          </p>
        </div>
 
        <div className="border-t border-slate-800 pt-4">
          <p className="text-slate-400 mb-1">Resolution Notes</p>
          <p className="text-slate-200 leading-relaxed">
            {report.resolutionNotes || "No resolution notes yet."}
          </p>
        </div>
      </div>
 
      <div className="flex gap-3 mt-6">
        {report.status === "Pending" && (
          <button
            onClick={() => onMarkResolved(report.reportId)}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Mark as Resolved
          </button>
        )}
        <button
          onClick={onClose}
          className="flex-1 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
 
const AddDamageReportModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    component: "",
    damageType: "",
    severity: "Low",
    penalty: "",
    description: "",
  });
 
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
 
  const handleSubmit = () => {
    if (!form.component || !form.damageType || !form.penalty) return;
    onAdd(form);
  };
 
  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold">New Damage Component</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
 
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Component Name
          </label>
          <input
            type="text"
            value={form.component}
            onChange={(e) => handleChange("component", e.target.value)}
            placeholder="e.g. Arduino Mega 2560"
            className="w-full bg-[#111827] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
          />
        </div>
 
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Damage Type
          </label>
          <input
            type="text"
            value={form.damageType}
            onChange={(e) => handleChange("damageType", e.target.value)}
            placeholder="e.g. Short Circuit"
            className="w-full bg-[#111827] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
          />
        </div>
 
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Severity
            </label>
            <select
              value={form.severity}
              onChange={(e) => handleChange("severity", e.target.value)}
              className="w-full bg-[#111827] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
 
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Penalty (₹)
            </label>
            <input
              type="number"
              value={form.penalty}
              onChange={(e) => handleChange("penalty", e.target.value)}
              placeholder="0"
              className="w-full bg-[#111827] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
            />
          </div>
        </div>
 
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the damage..."
            rows={3}
            className="w-full bg-[#111827] border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500 resize-none"
          />
        </div>
      </div>
 
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Submit Report
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
 
const DamageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
 
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await authFetch("http://localhost:5000/api/damage-components");
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to load damage components.");
      }
      setReports(result.data || []);
    } catch (err) {
      setError(err.message || "Failed to load damage components.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);
 
  const totalReports = reports.length;
  const pendingResolution = reports.filter((r) => r.status === "Pending").length;
  const totalPenalties = reports.reduce((sum, r) => sum + r.penalty, 0);
  const highSeverityCases = reports.filter((r) => r.severity === "High").length;
 
  const damageTypeFrequency = useMemo(() => {
    const freq = {};
    reports.forEach(r => {
      const type = r.damageType || "Unknown";
      freq[type] = (freq[type] || 0) + 1;
    });
    return Object.entries(freq)
      .map(([type, count]) => ({ type, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 5);
  }, [reports]);

  const maxDamageCount = damageTypeFrequency.length > 0 
    ? Math.max(...damageTypeFrequency.map((d) => d.count)) 
    : 1;
 
  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };
 
  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
  };
 
  const openReportModal = (report) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };
 
  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReport(null);
  };
 
  const markResolved = async (reportId) => {
    try {
      const report = reports.find(r => r.reportId === reportId);
      if (!report) return;
      const res = await authFetch(`http://localhost:5000/api/damage-components/${report.issue_id}/resolve`, {
        method: "PATCH",
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);
      
      setReports((prev) =>
        prev.map((r) =>
          r.reportId === reportId ? { ...r, status: "Resolved" } : r
        )
      );
      closeReportModal();
    } catch (err) {
      alert("Failed to resolve: " + err.message);
    }
  };
 
  const handleAddReport = async (form) => {
    try {
      const res = await authFetch("http://localhost:5000/api/damage-components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);
      
      setIsAddModalOpen(false);
      fetchReports(); 
    } catch (err) {
      alert("Failed to add report: " + err.message);
    }
  };
 
  const filteredReports = reports.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.reportId.toLowerCase().includes(term) ||
      item.component.toLowerCase().includes(term) ||
      item.damageType.toLowerCase().includes(term)
    );
  });
 
  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Damage Components</h1>
          <p className="text-slate-400 mt-1">
            Manage damaged components and their associated penalties
          </p>
        </div>
 
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FiPlus />
          New Damage Component
        </button>
      </div>
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Reports</p>
          <h2 className="text-3xl font-bold mt-2">{totalReports}</h2>
        </div>
 
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Pending Resolution</p>
          <h2 className="text-3xl font-bold text-amber-400 mt-2">
            {pendingResolution}
          </h2>
        </div>
 
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Penalties</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            ₹{totalPenalties.toLocaleString()}
          </h2>
        </div>
 
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">High Severity Cases</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {highSeverityCases}
          </h2>
        </div>
      </div>
 
      {/* Damage Analytics */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Most Common Damage Types
        </h2>
        <div className="space-y-4">
          {damageTypeFrequency.map((item) => (
            <div key={item.type}>
              <div className="flex justify-between text-sm mb-1.5">
                <span>{item.type}</span>
                <span className="text-slate-400">{item.count}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-cyan-500 h-2 rounded-full"
                  style={{
                    width: `${(item.count / maxDamageCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Report ID, Component, or Damage Type..."
          className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-cyan-500"
        />
      </div>
 
      {/* Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">All Damage Components</h2>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111827]">
              <tr>
                <th className="text-left px-6 py-4">Report ID</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Damage Type</th>
                <th className="text-left px-6 py-4">Severity</th>
                <th className="text-left px-6 py-4">Report Date</th>
                <th className="text-left px-6 py-4">Penalty</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
 
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                    Loading damage components...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-red-400">
                    <FiAlertTriangle className="mx-auto mb-2 w-6 h-6" />
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && filteredReports.map((item) => (
                <tr
                  key={item.reportId}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">{item.reportId}</span>
                      <button
                        onClick={() => openStudentModal(item.student)}
                        className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors"
                        title="View student details"
                      >
                        <FiInfo className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.component}</td>
                  <td className="px-6 py-4 text-slate-300">{item.damageType}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getSeverityStyle(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{item.reportDate}</td>
                  <td className="px-6 py-4 text-red-400 font-medium">
                    ₹{item.penalty.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openReportModal(item)}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
 
              {!loading && !error && filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    {reports.length === 0 
                      ? "No damaged components found. This is expected if all returned components are in good condition."
                      : "No damage components match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Modals */}
      {isStudentModalOpen && (
        <StudentInfoModal
          student={selectedStudent}
          onClose={closeStudentModal}
        />
      )}
 
      {isReportModalOpen && (
        <DamageReportModal
          report={selectedReport}
          onClose={closeReportModal}
          onMarkResolved={markResolved}
        />
      )}
 
      {isAddModalOpen && (
        <AddDamageReportModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddReport}
        />
      )}
    </div>
  );
};
 
export default DamageReports;
 