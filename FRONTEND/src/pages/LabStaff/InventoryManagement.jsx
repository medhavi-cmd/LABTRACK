import React, { useEffect, useState, useCallback } from "react";
import { authFetch } from "../../services/api";
import { useListQuery, toQueryString } from "../../hooks/useListQuery";
import CommentsSection from "../../components/ui/CommentsSection";
import {
  FiSearch, FiPlus, FiAlertCircle, FiPackage, FiEdit2, FiTrash2,
  FiX, FiCheckCircle, FiEye, FiChevronUp, FiChevronDown, FiFilter,
} from "react-icons/fi";

const API_BASE = `${import.meta.env.VITE_API_URL}/inventory`;

const STATUS_CONFIG = {
  available:    { label: "Available",    style: "bg-green-50 text-green-600 border border-green-200" },
  low_stock:    { label: "Low Stock",    style: "bg-amber-50 text-amber-500 border border-amber-200" },
  out_of_stock: { label: "Out of Stock", style: "bg-red-50 text-red-600 border border-red-200" },
};

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] ?? { label: status ?? "Unknown", style: "bg-slate-100 ls-text-secondary border border-slate-200" };

const emptyForm = { component_name: "", category: "", description: "", total_quantity: "", available_quantity: "" };

const validateForm = (form) => {
  const errors = {};
  if (!form.component_name.trim()) errors.component_name = "Component name is required.";
  if (!form.category.trim()) errors.category = "Category is required.";
  if (form.total_quantity === "") errors.total_quantity = "Total quantity is required.";
  else if (isNaN(form.total_quantity) || Number(form.total_quantity) < 0) errors.total_quantity = "Must be a non-negative number.";
  if (form.available_quantity === "") errors.available_quantity = "Available quantity is required.";
  else if (isNaN(form.available_quantity) || Number(form.available_quantity) < 0) errors.available_quantity = "Must be a non-negative number.";
  if (!errors.total_quantity && !errors.available_quantity && Number(form.available_quantity) > Number(form.total_quantity))
    errors.available_quantity = "Cannot exceed total quantity.";
  return errors;
};

// ─── Sort arrow button ────────────────────────────────────────────────
const SortTh = ({ label, field, sortField, sortDir, onSort }) => {
  const active = sortField === field;
  return (
    <th className="ls-table-th select-none">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 group hover:text-cyan-600 transition-colors"
      >
        {label}
        <span className="flex flex-col opacity-50 group-hover:opacity-100">
          <FiChevronUp className={`w-3 h-3 -mb-0.5 ${active && sortDir === "asc" ? "text-cyan-500 opacity-100" : ""}`} />
          <FiChevronDown className={`w-3 h-3 ${active && sortDir === "desc" ? "text-cyan-500 opacity-100" : ""}`} />
        </span>
      </button>
    </th>
  );
};

// ─── Modal shell ──────────────────────────────────────────────────────
const Modal = ({ children, onClose, maxWidth = "max-w-lg" }) => (
  <div className="ls-modal-overlay" onClick={onClose}>
    <div className={`ls-card w-full ${maxWidth} p-6 shadow-xl max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm ls-text-secondary mb-2">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

const inputClass = "w-full bg-slate-50 border rounded-lg px-4 py-2.5 outline-none transition-colors";
const inputStyle = (hasError) => `${inputClass} ${hasError ? "border-red-500 focus:border-red-400" : "border-slate-200 focus:border-cyan-500"}`;

// ─── View Detail Modal ────────────────────────────────────────────────
const ViewModal = ({ item, onClose }) => {
  if (!item) return null;
  const statusConfig = getStatusConfig(item.status);
  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900">Component Details</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
          <FiX className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-3 text-sm mb-2">
        {[
          { label: "Component Name", value: item.component_name },
          { label: "Category", value: item.category },
          { label: "Description", value: item.description || "—" },
          { label: "Total Quantity", value: item.total_quantity },
          { label: "Available Quantity", value: item.available_quantity },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-0">
            <span className="ls-text-secondary shrink-0">{label}</span>
            <span className="text-right font-medium text-slate-900">{value ?? "—"}</span>
          </div>
        ))}
        <div className="flex justify-between gap-4 pb-2">
          <span className="ls-text-secondary">Status</span>
          <span className={`px-3 py-1 rounded-full text-sm ${statusConfig.style}`}>{statusConfig.label}</span>
        </div>
      </div>
      <CommentsSection entityType="inventory" entityId={item.component_id} />
    </Modal>
  );
};

// ─── Add/Edit Form Modal ──────────────────────────────────────────────
const ComponentFormModal = ({ initialData, onClose, onSuccess }) => {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState(isEdit ? {
    component_name: initialData.component_name ?? "",
    category: initialData.category ?? "",
    description: initialData.description ?? "",
    total_quantity: String(initialData.total_quantity ?? ""),
    available_quantity: String(initialData.available_quantity ?? ""),
  } : emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSubmitting(true); setApiError("");
    try {
      const url = isEdit ? `${API_BASE}/${initialData.component_id}` : API_BASE;
      const response = await authFetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component_name: form.component_name.trim(),
          category: form.category.trim(),
          description: form.description.trim() || null,
          total_quantity: Number(form.total_quantity),
          available_quantity: Number(form.available_quantity),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Request failed.");
      onSuccess(data.message || (isEdit ? "Component updated." : "Component added."));
    } catch (err) { setApiError(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="ls-title-card">{isEdit ? "Edit Component" : "Add Component"}</h3>
        <button onClick={onClose} className="ls-text-secondary hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><FiX className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">
        <Field label="Component Name" required error={errors.component_name}>
          <input type="text" value={form.component_name} onChange={(e) => handleChange("component_name", e.target.value)} placeholder="e.g. Arduino Uno R3" className={inputStyle(errors.component_name)} />
        </Field>
        <Field label="Category" required error={errors.category}>
          <input type="text" value={form.category} onChange={(e) => handleChange("category", e.target.value)} placeholder="e.g. Microcontroller" className={inputStyle(errors.category)} />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Optional description..." rows={3} className={`${inputStyle(false)} resize-none`} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Total Quantity" required error={errors.total_quantity}>
            <input type="number" min="0" value={form.total_quantity} onChange={(e) => handleChange("total_quantity", e.target.value)} placeholder="0" className={inputStyle(errors.total_quantity)} />
          </Field>
          <Field label="Available Quantity" required error={errors.available_quantity}>
            <input type="number" min="0" value={form.available_quantity} onChange={(e) => handleChange("available_quantity", e.target.value)} placeholder="0" className={inputStyle(errors.available_quantity)} />
          </Field>
        </div>
        {apiError && <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm"><FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{apiError}</div>}
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={handleSubmit} disabled={submitting} className="flex-1 ls-btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors">
          {submitting ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Save Changes" : "Add Component")}
        </button>
        <button onClick={onClose} disabled={submitting} className="flex-1 ls-btn-secondary disabled:opacity-50 px-4 py-2 rounded-lg font-medium transition-colors">Cancel</button>
      </div>
    </Modal>
  );
};

// ─── Delete Modal ─────────────────────────────────────────────────────
const DeleteConfirmModal = ({ component, onClose, onSuccess }) => {
  const [deleting, setDeleting] = useState(false);
  const [apiError, setApiError] = useState("");
  const handleDelete = async () => {
    setDeleting(true); setApiError("");
    try {
      const response = await authFetch(`${API_BASE}/${component.component_id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Delete failed.");
      onSuccess("Component deleted successfully.");
    } catch (err) { setApiError(err.message); setDeleting(false); }
  };
  return (
    <Modal onClose={onClose} maxWidth="max-w-md">
      <div className="ls-modal-header">
        <h3 className="ls-title-card">Delete Component</h3>
        <button onClick={onClose} className="ls-text-secondary hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><FiX className="w-5 h-5" /></button>
      </div>
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
        <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        <p className="text-sm text-slate-600">Are you sure you want to delete <span className="font-semibold text-slate-900">{component.component_name}</span>? This action cannot be undone.</p>
      </div>
      {apiError && <p className="text-red-600 text-sm mb-4">{apiError}</p>}
      <div className="flex gap-3">
        <button onClick={handleDelete} disabled={deleting} className="flex-1 ls-btn-danger disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors">{deleting ? "Deleting..." : "Yes, Delete"}</button>
        <button onClick={onClose} disabled={deleting} className="flex-1 ls-btn-secondary disabled:opacity-50 px-4 py-2 rounded-lg font-medium transition-colors">Cancel</button>
      </div>
    </Modal>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────
const Toast = ({ message, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 text-green-600 px-5 py-3 rounded-xl shadow-xl text-sm font-medium">
      <FiCheckCircle className="w-5 h-5" />{message}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────
// Search, filter and sort are all resolved by the API (see inventoryService.js).
const fetchInventoryPage = async (params, signal) => {
  const response = await authFetch(`${API_BASE}${toQueryString(params)}`, { signal });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  const body = await response.json();
  return { data: body.data ?? [], stats: body.stats ?? null };
};

const EMPTY_STATS = { total: 0, available: 0, lowStock: 0, outOfStock: 0 };

const InventoryManagement = () => {
  const {
    data: filteredComponents,
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
    reload: fetchInventory,
  } = useListQuery(fetchInventoryPage, {
    initialFilters: { status: "all" },
    initialSortField: "component_name",
    initialSortDir: "asc",
  });

  const filterStatus = filters.status;
  const setFilterStatus = useCallback((value) => setFilter("status", value), [setFilter]);
  const stats = extra?.stats ?? EMPTY_STATS;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [toast, setToast] = useState("");

  const handleFormSuccess = (message) => {
    setShowAddModal(false); setEditTarget(null);
    fetchInventory(); setToast(message);
  };

  const handleDeleteSuccess = (message) => {
    setDeleteTarget(null); fetchInventory(); setToast(message);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="ls-title-main">Inventory Management</h1>
          <p className="ls-text-secondary mt-1">Manage and monitor laboratory components</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 ls-btn-primary px-4 py-2 rounded-lg font-medium transition-colors self-start sm:self-auto">
          <FiPlus />Add Component
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by component name or category..." className="ls-input ls-input-search" />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
          <FiFilter className="text-slate-400 shrink-0" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="outline-none text-sm text-slate-700 bg-transparent cursor-pointer">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Total Components</p><h2 className="ls-stat-value">{loading ? "—" : stats.total}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Available</p><h2 className="ls-stat-value text-green-600">{loading ? "—" : stats.available}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Low Stock</p><h2 className="ls-stat-value text-amber-500 mt-2">{loading ? "—" : stats.lowStock}</h2></div>
        <div className="ls-stat-card"><p className="ls-text-secondary text-sm">Out of Stock</p><h2 className="ls-stat-value text-red-600">{loading ? "—" : stats.outOfStock}</h2></div>
      </div>

      {/* Table */}
      <div className="ls-card overflow-hidden">
        <div className="ls-table-header">
          <h2 className="ls-title-card">Components List</h2>
          {!loading && !error && <span className="text-sm ls-text-secondary">{filteredComponents.length} item{filteredComponents.length !== 1 ? "s" : ""}</span>}
        </div>

        {loading && <div className="flex items-center justify-center py-16 ls-text-secondary gap-2"><svg className="animate-spin w-6 h-6 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Loading...</div>}
        {!loading && error && <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6"><FiAlertCircle className="w-10 h-10 text-red-600" /><p className="text-red-600 font-medium">Failed to load inventory</p><p className="ls-text-secondary text-sm">{error}</p></div>}
        {!loading && !error && filteredComponents.length === 0 && <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6"><FiPackage className="w-10 h-10 text-slate-600" /><p className="ls-text-secondary font-medium">No components found.{searchTerm && ` No results for "${searchTerm}".`}</p></div>}

        {!loading && !error && filteredComponents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <SortTh label="Component" field="component_name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Category" field="category" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Total Qty" field="total_quantity" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Available Qty" field="available_quantity" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortTh label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <th className="ls-table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComponents.map((item) => {
                  const statusConfig = getStatusConfig(item.status);
                  return (
                    <tr key={item.component_id} className="ls-table-tr">
                      <td className="ls-table-td font-medium">
                        <div>
                          {item.component_name}
                          {item.description && <p className="ls-text-secondary text-xs mt-0.5 truncate max-w-[180px]" title={item.description}>{item.description}</p>}
                        </div>
                      </td>
                      <td className="ls-table-td text-slate-600">{item.category}</td>
                      <td className="ls-table-td">{item.total_quantity}</td>
                      <td className="ls-table-td">{item.available_quantity}</td>
                      <td className="ls-table-td"><span className={`px-3 py-1 rounded-full text-sm ${statusConfig.style}`}>{statusConfig.label}</span></td>
                      <td className="ls-table-td">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setViewTarget(item)} className="text-slate-500 hover:text-cyan-600 transition-colors" title="View details"><FiEye className="w-4 h-4" /></button>
                          <button onClick={() => setEditTarget(item)} className="text-cyan-600 hover:text-cyan-300 transition-colors" title="Edit"><FiEdit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteTarget(item)} className="text-red-600 hover:text-red-300 transition-colors" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
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

      {viewTarget && <ViewModal item={viewTarget} onClose={() => setViewTarget(null)} />}
      {showAddModal && <ComponentFormModal initialData={null} onClose={() => setShowAddModal(false)} onSuccess={handleFormSuccess} />}
      {editTarget && <ComponentFormModal initialData={editTarget} onClose={() => setEditTarget(null)} onSuccess={handleFormSuccess} />}
      {deleteTarget && <DeleteConfirmModal component={deleteTarget} onClose={() => setDeleteTarget(null)} onSuccess={handleDeleteSuccess} />}
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
};

export default InventoryManagement;