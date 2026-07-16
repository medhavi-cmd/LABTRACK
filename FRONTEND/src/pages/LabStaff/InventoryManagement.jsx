import React, { useEffect, useState, useMemo } from "react";
import { authFetch } from "../../services/api";
import {
  FiSearch,
  FiPlus,
  FiAlertCircle,
  FiPackage,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
 
const API_BASE = "http://localhost:5000/api/inventory";
 
// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  available: {
    label: "Available",
    style: "bg-green-500/10 text-green-400 border border-green-500/30",
  },
  low_stock: {
    label: "Low Stock",
    style: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  },
  out_of_stock: {
    label: "Out of Stock",
    style: "bg-red-500/10 text-red-400 border border-red-500/30",
  },
};
 
const getStatusConfig = (status) =>
  STATUS_CONFIG[status] ?? {
    label: status ?? "Unknown",
    style: "bg-slate-500/10 text-slate-400 border border-slate-500/30",
  };
 
// ─── Empty form state ─────────────────────────────────────────────────────────
const emptyForm = {
  component_name: "",
  category: "",
  description: "",
  total_quantity: "",
  available_quantity: "",
};
 
// ─── Validate form ────────────────────────────────────────────────────────────
const validateForm = (form) => {
  const errors = {};
  if (!form.component_name.trim()) errors.component_name = "Component name is required.";
  if (!form.category.trim()) errors.category = "Category is required.";
  if (form.total_quantity === "") {
    errors.total_quantity = "Total quantity is required.";
  } else if (isNaN(form.total_quantity) || Number(form.total_quantity) < 0) {
    errors.total_quantity = "Must be a non-negative number.";
  }
  if (form.available_quantity === "") {
    errors.available_quantity = "Available quantity is required.";
  } else if (isNaN(form.available_quantity) || Number(form.available_quantity) < 0) {
    errors.available_quantity = "Must be a non-negative number.";
  }
  if (
    !errors.total_quantity &&
    !errors.available_quantity &&
    Number(form.available_quantity) > Number(form.total_quantity)
  ) {
    errors.available_quantity = "Cannot exceed total quantity.";
  }
  return errors;
};
 
// ─── Reusable overlay modal wrapper ──────────────────────────────────────────
const Modal = ({ children, onClose, maxWidth = "max-w-lg" }) => (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
    onClick={onClose}
  >
    <div
      className={`bg-[#0f172a] border border-slate-800 rounded-xl w-full ${maxWidth} p-6 shadow-xl max-h-[90vh] overflow-y-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);
 
// ─── Field component ──────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm text-slate-400 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);
 
const inputClass =
  "w-full bg-[#111827] border rounded-lg px-4 py-2.5 outline-none transition-colors";
const inputStyle = (hasError) =>
  `${inputClass} ${hasError ? "border-red-500 focus:border-red-400" : "border-slate-800 focus:border-cyan-500"}`;
 
// ─── Add / Edit Form Modal ────────────────────────────────────────────────────
const ComponentFormModal = ({ initialData, onClose, onSuccess }) => {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState(
    isEdit
      ? {
          component_name: initialData.component_name ?? "",
          category: initialData.category ?? "",
          description: initialData.description ?? "",
          total_quantity: String(initialData.total_quantity ?? ""),
          available_quantity: String(initialData.available_quantity ?? ""),
        }
      : emptyForm
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
 
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };
 
  const handleSubmit = async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
 
    setSubmitting(true);
    setApiError("");
 
    try {
      const url = isEdit
        ? `${API_BASE}/${initialData.component_id}`
        : API_BASE;
      const method = isEdit ? "PUT" : "POST";
 
      const response = await authFetch(url, {
        method,
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
 
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Request failed.");
      }
 
      onSuccess(data.message || (isEdit ? "Component updated." : "Component added."));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">
          {isEdit ? "Edit Component" : "Add Component"}
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
 
      <div className="space-y-4">
        <Field label="Component Name" required error={errors.component_name}>
          <input
            type="text"
            value={form.component_name}
            onChange={(e) => handleChange("component_name", e.target.value)}
            placeholder="e.g. Arduino Uno R3"
            className={inputStyle(errors.component_name)}
          />
        </Field>
 
        <Field label="Category" required error={errors.category}>
          <input
            type="text"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="e.g. Microcontroller"
            className={inputStyle(errors.category)}
          />
        </Field>
 
        <Field label="Description" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Optional description..."
            rows={3}
            className={`${inputStyle(false)} resize-none`}
          />
        </Field>
 
        <div className="grid grid-cols-2 gap-4">
          <Field label="Total Quantity" required error={errors.total_quantity}>
            <input
              type="number"
              min="0"
              value={form.total_quantity}
              onChange={(e) => handleChange("total_quantity", e.target.value)}
              placeholder="0"
              className={inputStyle(errors.total_quantity)}
            />
          </Field>
 
          <Field label="Available Quantity" required error={errors.available_quantity}>
            <input
              type="number"
              min="0"
              value={form.available_quantity}
              onChange={(e) => handleChange("available_quantity", e.target.value)}
              placeholder="0"
              className={inputStyle(errors.available_quantity)}
            />
          </Field>
        </div>
 
        <p className="text-slate-500 text-xs">
          Status is calculated automatically based on available quantity.
        </p>
 
        {apiError && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {apiError}
          </div>
        )}
      </div>
 
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {submitting
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
            ? "Save Changes"
            : "Add Component"}
        </button>
        <button
          onClick={onClose}
          disabled={submitting}
          className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
 
// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteConfirmModal = ({ component, onClose, onSuccess }) => {
  const [deleting, setDeleting] = useState(false);
  const [apiError, setApiError] = useState("");
 
  const handleDelete = async () => {
    setDeleting(true);
    setApiError("");
    try {
      const response = await authFetch(`${API_BASE}/${component.component_id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Delete failed.");
      }
      onSuccess("Component deleted successfully.");
    } catch (err) {
      setApiError(err.message);
      setDeleting(false);
    }
  };
 
  return (
    <Modal onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold">Delete Component</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
 
      <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5">
        <FiAlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
        <p className="text-sm text-slate-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">
            {component.component_name}
          </span>
          ? This action cannot be undone.
        </p>
      </div>
 
      {apiError && (
        <p className="text-red-400 text-sm mb-4">{apiError}</p>
      )}
 
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
          onClick={onClose}
          disabled={deleting}
          className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
 
// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
 
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0f172a] border border-green-500/40 text-green-400 px-5 py-3 rounded-xl shadow-xl text-sm font-medium">
      <FiCheckCircle className="w-5 h-5" />
      {message}
    </div>
  );
};
 
// ─── Main Page ────────────────────────────────────────────────────────────────
const InventoryManagement = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
 
  // modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);   // component object to edit
  const [deleteTarget, setDeleteTarget] = useState(null); // component object to delete
 
  // toast
  const [toast, setToast] = useState("");
 
  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
 
      const response = await authFetch(API_BASE);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
 
      const data = await response.json();
      console.log("Inventory API Response:", data);
 
      const raw = data.data ?? data;
      const safeArray = Array.isArray(raw) ? raw : [];
      setComponents(safeArray);
    } catch (err) {
      console.error("fetchInventory error:", err);
      setError(err.message || "Failed to fetch inventory.");
      setComponents([]);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchInventory();
  }, []);
 
  // ── Derived values ─────────────────────────────────────────────────────────
  const filteredComponents = useMemo(() => {
    if (!Array.isArray(components)) return [];
    const term = searchTerm.toLowerCase().trim();
    if (!term) return components;
    return components.filter(
      (item) =>
        item.component_name?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
    );
  }, [components, searchTerm]);
 
  const stats = useMemo(() => {
    if (!Array.isArray(components)) {
      return { total: 0, available: 0, lowStock: 0, outOfStock: 0 };
    }
    return {
      total: components.length,
      available: components.filter((c) => c.status === "available").length,
      lowStock: components.filter((c) => c.status === "low_stock").length,
      outOfStock: components.filter((c) => c.status === "out_of_stock").length,
    };
  }, [components]);
 
  // ── Modal callbacks ────────────────────────────────────────────────────────
  const handleFormSuccess = async (message) => {
    setShowAddModal(false);
    setEditTarget(null);
    await fetchInventory();
    setToast(message);
  };
 
  const handleDeleteSuccess = async (message) => {
    setDeleteTarget(null);
    await fetchInventory();
    setToast(message);
  };
 
  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-slate-400 mt-1">
            Manage and monitor laboratory components
          </p>
        </div>
 
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FiPlus />
          Add Component
        </button>
      </div>
 
      {/* Search */}
      <div className="relative mb-8">
        <FiSearch className="absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by component name or category..."
          className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-cyan-500"
        />
      </div>
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Components</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "—" : stats.total}
          </h2>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Available</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {loading ? "—" : stats.available}
          </h2>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Low Stock</p>
          <h2 className="text-3xl font-bold text-yellow-400 mt-2">
            {loading ? "—" : stats.lowStock}
          </h2>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Out of Stock</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {loading ? "—" : stats.outOfStock}
          </h2>
        </div>
      </div>
 
      {/* Table Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Components List</h2>
        </div>
 
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <svg
              className="animate-spin w-6 h-6 mr-3 text-cyan-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading inventory...
          </div>
        )}
 
        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <FiAlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-red-400 font-medium">Failed to load inventory</p>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        )}
 
        {/* Empty */}
        {!loading && !error && filteredComponents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <FiPackage className="w-10 h-10 text-slate-600" />
            <p className="text-slate-400 font-medium">No components found.</p>
            {searchTerm && (
              <p className="text-slate-500 text-sm">
                No results for "{searchTerm}". Try a different search term.
              </p>
            )}
          </div>
        )}
 
        {/* Table */}
        {!loading && !error && filteredComponents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#111827]">
                <tr>
                  <th className="text-left px-6 py-4">Component</th>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Total Qty</th>
                  <th className="text-left px-6 py-4">Available Qty</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
 
              <tbody>
                {filteredComponents.map((item) => {
                  const statusConfig = getStatusConfig(item.status);
                  return (
                    <tr
                      key={item.component_id}
                      className="border-t border-slate-800 hover:bg-slate-900/40"
                    >
                      <td className="px-6 py-4 font-medium">
                        <div>
                          {item.component_name}
                          {item.description && (
                            <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[180px]"
                               title={item.description}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{item.category}</td>
                      <td className="px-6 py-4">{item.total_quantity}</td>
                      <td className="px-6 py-4">{item.available_quantity}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${statusConfig.style}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setEditTarget(item)}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="Edit component"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete component"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
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
 
      {/* Add Modal */}
      {showAddModal && (
        <ComponentFormModal
          initialData={null}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}
 
      {/* Edit Modal */}
      {editTarget && (
        <ComponentFormModal
          initialData={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={handleFormSuccess}
        />
      )}
 
      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          component={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
 
      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
};
 
export default InventoryManagement;
 