import React, { useEffect, useState, useMemo } from "react";
import { authFetch } from "../../services/api";
import CommentsSection from "../../components/ui/CommentsSection";
import {
  FiSearch,
  FiAlertCircle,
  FiClipboard,
  FiX,
  FiCheckCircle,
  FiEye,
  FiChevronUp,
  FiChevronDown,
  FiFilter,
} from "react-icons/fi";

const API_BASE = `${import.meta.env.VITE_API_URL}/purchase-requests`;

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    style: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  approved: {
    label: "Approved",
    style: "bg-green-50 text-green-600 border border-green-200",
  },
  rejected: {
    label: "Rejected",
    style: "bg-red-50 text-red-600 border border-red-200",
  },
};

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] ?? {
    label: status ?? "Unknown",
    style: "bg-slate-100 ls-text-secondary border border-slate-200",
  };

const Modal = ({ children, onClose, maxWidth = "max-w-lg" }) => (
  <div
    className="ls-modal-overlay"
    onClick={onClose}
  >
    <div
      className={`ls-card w-full ${maxWidth} p-6 shadow-xl max-h-[90vh] overflow-y-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const Toast = ({ message, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 text-green-600 px-5 py-3 rounded-xl shadow-xl text-sm font-medium">
      <FiCheckCircle className="w-5 h-5" />
      {message}
    </div>
  );
};

const NewComponentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("request_date");
  const [sortDir, setSortDir] = useState("desc");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [toast, setToast] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authFetch(`${API_BASE}/all`);
      if (!response.ok) throw new Error("Failed to load requests.");
      const data = await response.json();
      setRequests(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let list = filterStatus === "all" ? [...requests] : requests.filter((r) => r.status === filterStatus);
    if (term) list = list.filter((r) =>
      [r.component_name, r.team_name, r.project_title, r.category]
        .some((val) => val?.toLowerCase().includes(term))
    );
    list.sort((a, b) => {
      let av = a[sortField] ?? ""; let bv = b[sortField] ?? "";
      if (sortField.includes("date")) { av = new Date(av || 0); bv = new Date(bv || 0); }
      else { if (typeof av === "string") av = av.toLowerCase(); if (typeof bv === "string") bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [requests, searchTerm, filterStatus, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    };
  }, [requests]);

  const handleAction = async (status) => {
    if (!selectedRequest) return;
    setSubmitting(true);
    setApiError("");
    try {
      const response = await authFetch(`${API_BASE}/${selectedRequest.purchase_request_id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, remarks }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update request.");
      
      setToast(data.message || `Request ${status} successfully.`);
      setSelectedRequest(null);
      setRemarks("");
      await fetchRequests();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="ls-title-main">New Component Requests</h1>
        <p className="ls-text-secondary mt-2">
          Review requests for components that are currently unavailable in the laboratory.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Total Requests</p>
          <h2 className="ls-stat-value">{loading ? "—" : stats.total}</h2>
        </div>
        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Pending</p>
          <h2 className="ls-stat-value text-amber-500">{loading ? "—" : stats.pending}</h2>
        </div>
        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Approved</p>
          <h2 className="ls-stat-value text-green-600">{loading ? "—" : stats.approved}</h2>
        </div>
        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Rejected</p>
          <h2 className="ls-stat-value text-red-600">{loading ? "—" : stats.rejected}</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by component, category, or team..."
            className="ls-input ls-input-search"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
          <FiFilter className="text-slate-400 shrink-0" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="outline-none text-sm text-slate-700 bg-transparent cursor-pointer">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="ls-table-container">
        <div className="ls-table-header">
          <h2 className="ls-title-card">Component Purchase Requests</h2>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 ls-text-secondary">
            Loading requests...
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <FiAlertCircle className="w-10 h-10 text-red-600" />
            <p className="text-red-600 font-medium">Failed to load requests</p>
            <p className="ls-text-secondary text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filteredRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <FiClipboard className="w-10 h-10 text-slate-400" />
            <p className="ls-text-secondary font-medium">No component requests found.</p>
          </div>
        )}

        {!loading && !error && filteredRequests.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="ls-table-th">
                    <button onClick={() => handleSort("component_name")} className="flex items-center gap-1 group hover:text-cyan-600">
                      Component
                      <span className="flex flex-col opacity-50 group-hover:opacity-100">
                        <FiChevronUp className={`w-3 h-3 -mb-0.5 ${sortField === "component_name" && sortDir === "asc" ? "text-cyan-500 opacity-100" : ""}`} />
                        <FiChevronDown className={`w-3 h-3 ${sortField === "component_name" && sortDir === "desc" ? "text-cyan-500 opacity-100" : ""}`} />
                      </span>
                    </button>
                  </th>
                  <th className="ls-table-th">
                    <button onClick={() => handleSort("category")} className="flex items-center gap-1 group hover:text-cyan-600">
                      Category
                      <span className="flex flex-col opacity-50 group-hover:opacity-100">
                        <FiChevronUp className={`w-3 h-3 -mb-0.5 ${sortField === "category" && sortDir === "asc" ? "text-cyan-500 opacity-100" : ""}`} />
                        <FiChevronDown className={`w-3 h-3 ${sortField === "category" && sortDir === "desc" ? "text-cyan-500 opacity-100" : ""}`} />
                      </span>
                    </button>
                  </th>
                  <th className="ls-table-th">Qty</th>
                  <th className="ls-table-th">
                    <button onClick={() => handleSort("team_name")} className="flex items-center gap-1 group hover:text-cyan-600">
                      Team
                      <span className="flex flex-col opacity-50 group-hover:opacity-100">
                        <FiChevronUp className={`w-3 h-3 -mb-0.5 ${sortField === "team_name" && sortDir === "asc" ? "text-cyan-500 opacity-100" : ""}`} />
                        <FiChevronDown className={`w-3 h-3 ${sortField === "team_name" && sortDir === "desc" ? "text-cyan-500 opacity-100" : ""}`} />
                      </span>
                    </button>
                  </th>
                  <th className="ls-table-th">
                    <button onClick={() => handleSort("request_date")} className="flex items-center gap-1 group hover:text-cyan-600">
                      Date
                      <span className="flex flex-col opacity-50 group-hover:opacity-100">
                        <FiChevronUp className={`w-3 h-3 -mb-0.5 ${sortField === "request_date" && sortDir === "asc" ? "text-cyan-500 opacity-100" : ""}`} />
                        <FiChevronDown className={`w-3 h-3 ${sortField === "request_date" && sortDir === "desc" ? "text-cyan-500 opacity-100" : ""}`} />
                      </span>
                    </button>
                  </th>
                  <th className="ls-table-th">
                    <button onClick={() => handleSort("status")} className="flex items-center gap-1 group hover:text-cyan-600">
                      Status
                      <span className="flex flex-col opacity-50 group-hover:opacity-100">
                        <FiChevronUp className={`w-3 h-3 -mb-0.5 ${sortField === "status" && sortDir === "asc" ? "text-cyan-500 opacity-100" : ""}`} />
                        <FiChevronDown className={`w-3 h-3 ${sortField === "status" && sortDir === "desc" ? "text-cyan-500 opacity-100" : ""}`} />
                      </span>
                    </button>
                  </th>
                  <th className="ls-table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const statusConfig = getStatusConfig(req.status);
                  return (
                    <tr key={req.purchase_request_id} className="ls-table-tr">
                      <td className="ls-table-td font-medium">{req.component_name}</td>
                      <td className="ls-table-td text-slate-500">{req.category || "—"}</td>
                      <td className="ls-table-td">{req.quantity_required}</td>
                      <td className="ls-table-td">{req.team_name || "—"}</td>
                      <td className="ls-table-td">{new Date(req.request_date).toLocaleDateString()}</td>
                      <td className="ls-table-td">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.style}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="ls-table-td">
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setRemarks(req.remarks || "");
                            setApiError("");
                          }}
                          className="text-cyan-600 hover:text-cyan-700 transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-5 h-5" />
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

      {selectedRequest && (
        <Modal onClose={() => !submitting && setSelectedRequest(null)}>
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-semibold text-slate-900">Request Details</h3>
            <button
              onClick={() => !submitting && setSelectedRequest(null)}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="ls-text-secondary">Component</span>
              <span className="font-medium ls-text-primary">{selectedRequest.component_name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="ls-text-secondary">Category</span>
              <span className="font-medium ls-text-primary">{selectedRequest.category || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="ls-text-secondary">Quantity</span>
              <span className="font-medium ls-text-primary">{selectedRequest.quantity_required}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="ls-text-secondary">Team</span>
              <span className="font-medium ls-text-primary">{selectedRequest.team_name || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="ls-text-secondary">Project</span>
              <span className="font-medium ls-text-primary text-right max-w-[200px] truncate" title={selectedRequest.project_title}>
                {selectedRequest.project_title || "—"}
              </span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="ls-text-secondary">Reason</span>
              <span className="font-medium ls-text-primary text-right max-w-[200px]">
                {selectedRequest.reason || "—"}
              </span>
            </div>
          </div>

          {selectedRequest.status !== "pending" && (
            <div className={`p-4 rounded-lg mb-6 ${selectedRequest.status === 'approved' ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm font-medium mb-1">
                Status: {selectedRequest.status.toUpperCase()}
              </p>
              <p className="text-sm">Remarks: {selectedRequest.remarks || "No remarks provided."}</p>
            </div>
          )}

          {selectedRequest.status === "pending" && (
            <div className="mb-6">
              <label className="block text-sm ls-text-secondary mb-2">Remarks (Optional)</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks..."
                rows={3}
                className="ls-input resize-none"
              />
            </div>
          )}

          <CommentsSection entityType="purchase_request" entityId={selectedRequest.purchase_request_id} />

          {apiError && (
            <div className="mb-4 text-red-600 text-sm flex items-start gap-2">
              <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {selectedRequest.status === "pending" ? (
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleAction("approved")}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction("rejected")}
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="ls-btn-secondary"
              >
                Close
              </button>
            </div>
          )}
        </Modal>
      )}

      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
};

export default NewComponentRequests;
