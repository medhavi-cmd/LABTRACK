import { useEffect, useState } from "react";
import {
  getRequestFormDetails,
  submitPurchaseRequest,
} from "../../services/purchaseRequestApi";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";

const initialForm = {
  componentName: "",
  category: "",
  quantityRequired: 1,
  reason: "",
};

const NewRequest = () => {
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
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <GroupLeaderLayout>
        <div className="text-white text-lg">
          Loading...
        </div>
      </GroupLeaderLayout>
    );
  }

  return (
    <GroupLeaderLayout>
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-white">
          New Purchase Request
        </h1>

        <p className="text-gray-400 mt-2">
          Request components that are currently unavailable in the laboratory.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8"
        >

          {/* Auto Details */}

          <div className="bg-[#10192d] rounded-xl p-6 border border-slate-700">

            <h2 className="text-xl font-semibold text-white mb-5">
              Team Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="text-sm text-gray-400">
                  Team Name
                </label>

                <input
                  value={team?.team_name || ""}
                  disabled
                  className="mt-2 w-full rounded-lg bg-[#1a2744] text-white px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Project Title
                </label>

                <input
                  value={team?.project_title || ""}
                  disabled
                  className="mt-2 w-full rounded-lg bg-[#1a2744] text-white px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-400">
                  Faculty Mentor(s)
                </label>

                <textarea
                  disabled
                  rows={2}
                  value={
                    team?.faculty
                      ?.map((f) => f.name)
                      .join(", ") || "Not Assigned"
                  }
                  className="mt-2 w-full rounded-lg bg-[#1a2744] text-white px-4 py-3"
                />
              </div>

            </div>
          </div>

          {/* Component Details */}

          <div className="bg-[#10192d] rounded-xl p-6 border border-slate-700">

            <h2 className="text-xl font-semibold text-white mb-5">
              Component Details
            </h2>

            <div className="space-y-6">

              <div>

                <label className="text-sm text-gray-400">
                  Component Name
                </label>

                <input
                  required
                  name="componentName"
                  value={form.componentName}
                  onChange={handleChange}
                  placeholder="Example : Arduino Uno R3"
                  className="mt-2 w-full rounded-lg bg-[#1a2744] text-white px-4 py-3"
                />

              </div>

              <div>

                <label className="text-sm text-gray-400">
                  Category
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="mt-2 w-full rounded-lg bg-[#1a2744] text-white px-4 py-3"
                />

              </div>

              <div>

                <label className="text-sm text-gray-400">
                  Quantity Required
                </label>

                <input
                  required
                  type="number"
                  min={1}
                  name="quantityRequired"
                  value={form.quantityRequired}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg bg-[#1a2744] text-white px-4 py-3"
                />

              </div>

              <div>

                <label className="text-sm text-gray-400">
                  Reason
                </label>

                <textarea
                  required
                  rows={5}
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Explain why your team needs this component."
                  className="mt-2 w-full rounded-lg bg-[#1a2744] text-white px-4 py-3"
                />

              </div>

            </div>

          </div>

          <div className="flex justify-end">

            <button
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Request"}
            </button>

          </div>

        </form>

      </div>
    </GroupLeaderLayout>
  );
};

export default NewRequest;