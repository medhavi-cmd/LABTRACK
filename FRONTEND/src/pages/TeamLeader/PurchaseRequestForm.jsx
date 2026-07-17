// ==========================================
// 2. pages/student/PurchaseRequestForm.jsx
// ==========================================
import { useEffect, useState } from "react";
import {
  getRequestFormDetails,
  submitPurchaseRequest,
} from "../../services/purchaseRequestApi";

const initialForm = {
  componentName: "",
  category: "",
  quantityRequired: 1,
  reason: "",
};

const PurchaseRequestForm = ({ onSuccess }) => {
  const [team, setTeam] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      const data = await getRequestFormDetails();
      setTeam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await submitPurchaseRequest(form);
      alert("Purchase request submitted successfully.");
      setForm(initialForm);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-[#4B5563] text-xs sm:text-sm font-medium">
        Loading form profiles...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm text-[#4B5563]">
      
      {/* Section 1: Team Info */}
      <div className="bg-[#F8FAFC]/60 rounded-xl border border-[#E5E7EB] p-4 sm:p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
          Team Information
        </h4>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">
              Project Title
            </label>
            <input
              value={team?.project_title || ""}
              disabled
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#6B7280] px-4 py-2.5 cursor-not-allowed outline-none shadow-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">
              Faculty Mentor(s)
            </label>
            <textarea
              rows={2}
              disabled
              value={
                team?.faculty?.map((f) => f.name).join(", ") || "Not Assigned"
              }
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#6B7280] px-4 py-2.5 cursor-not-allowed resize-none outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Component Specs */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] p-4 sm:p-5 space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
          Component Details
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wide">
              Component Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="componentName"
              value={form.componentName}
              onChange={handleChange}
              placeholder="e.g., Arduino Uno R3"
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-2.5 text-[#111827] placeholder:text-slate-400 outline-none focus:border-[#2563EB] transition-all shadow-sm"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wide">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Optional (e.g., Sensors)"
                className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-2.5 text-[#111827] placeholder:text-slate-400 outline-none focus:border-[#2563EB] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wide">
                Quantity Required <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min={1}
                name="quantityRequired"
                value={form.quantityRequired}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-2.5 text-[#111827] font-mono outline-none focus:border-[#2563EB] transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wide">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Explain why your project team requires this new equipment component."
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-2.5 text-[#111827] placeholder:text-slate-400 resize-none outline-none focus:border-[#2563EB] transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-[#E5E7EB]">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-6 py-2.5 sm:py-3 rounded-xl transition shadow-sm active:scale-[0.98] disabled:opacity-40"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>

    </form>
  );
};

export default PurchaseRequestForm;