import { useEffect, useState } from "react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getMyPurchaseRequests } from "../../services/purchaseRequestApi";
import PurchaseRequestForm from "./PurchaseRequestForm";
import { X, Plus } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-300",
  approved: "bg-green-500/20 text-green-300",
  rejected: "bg-red-500/20 text-red-300",
};

const NewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getMyPurchaseRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GroupLeaderLayout>
      <div className="max-w-7xl mx-auto">
 

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Purchase Requests</h1>

            <p className="text-gray-400 mt-2">
              Track all purchase requests submitted by your team.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold transition"
          >
            <Plus size={20} />
            <span>New Request</span>
          </button>
        </div>

 

        <div className="bg-[#10192d] border border-slate-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-white p-8">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                No purchase requests submitted yet.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white"
              >
                Create First Request
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#17233d]">
                <tr className="text-left text-gray-300">
                  <th className="px-6 py-4">Component</th>

                  <th className="px-6 py-4">Category</th>

                  <th className="px-6 py-4">Quantity</th>

                  <th className="px-6 py-4">Status</th>

                  <th className="px-6 py-4">Request Date</th>

                  <th className="px-6 py-4">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.purchase_request_id}
                    className="border-t border-slate-700 hover:bg-[#17233d]"
                  >
                    <td className="px-6 py-4 text-white">
                      {request.component_name}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {request.category || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {request.quantity_required}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm capitalize ${
                          statusColors[request.status] ||
                          "bg-gray-600 text-white"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {new Date(request.request_date).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {request.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
            <div className="bg-[#0b1326] rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-5 right-5 text-white text-2xl"
              >
                <X size={44} color="#ffffff" />
              </button>

              <PurchaseRequestForm
                onClose={() => setShowForm(false)}
                onSuccess={() => {
                  setShowForm(false);
                  loadRequests();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </GroupLeaderLayout>
  );
};

export default NewRequests;
