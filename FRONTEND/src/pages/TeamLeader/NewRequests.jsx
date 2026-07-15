import { useEffect, useState } from "react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getMyPurchaseRequests } from "../../services/purchaseRequestApi";
import PurchaseRequestForm from "./PurchaseRequestForm";
import { X, Plus, Loader2 } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-1 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
              Purchase Requests
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Track all purchase requests submitted by your team.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white font-semibold text-xs sm:text-sm transition active:scale-[0.98] w-full sm:w-auto shrink-0"
          >
            <Plus size={16} sm:size={20} />
            <span>New Request</span>
          </button>
        </div>

        <div className="bg-[#10192d] border border-slate-700/70 rounded-xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
              <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
              <p className="text-xs sm:text-sm">Loading request profiles...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-14 px-4">
              <p className="text-gray-400 text-sm sm:text-base max-w-xs mx-auto">
                No purchase requests submitted yet.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition active:scale-[0.98]"
              >
                Create First Request
              </button>
            </div>
          ) : (
            <>
              <table className="w-full hidden md:table border-collapse text-left">
                <thead className="bg-[#17233d]">
                  <tr className="text-gray-300 text-xs font-semibold tracking-wider uppercase border-b border-slate-700">
                    <th className="px-6 py-4">Component</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Request Date</th>
                    <th className="px-6 py-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {requests.map((request) => (
                    <tr
                      key={request.purchase_request_id}
                      className="hover:bg-[#17233d]/40 transition text-sm"
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {request.component_name}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {request.category || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {request.quantity_required}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[request.status] || "bg-gray-600 text-white"}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(request.request_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-400 max-w-xs truncate">
                        {request.remarks || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="block md:hidden divide-y divide-slate-700/60">
                {requests.map((request) => (
                  <div
                    key={request.purchase_request_id}
                    className="p-4 space-y-3 hover:bg-[#17233d]/20 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {request.component_name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Category: {request.category || "-"}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${statusColors[request.status] || "bg-gray-600 text-white"}`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-[#17233d]/30 p-2 rounded-lg border border-slate-800/60">
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Quantity</span>
                        <span className="text-slate-200 font-medium">{request.quantity_required}</span>
                      </div>
                      <div className="bg-[#17233d]/30 p-2 rounded-lg border border-slate-800/60">
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Req Date</span>
                        <span className="text-slate-200 font-medium">
                          {new Date(request.request_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {request.remarks && (
                      <div className="text-xs bg-[#17233d]/10 p-2 rounded-lg border border-slate-800/40">
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Remarks</span>
                        <p className="text-slate-300 italic mt-0.5 break-words line-clamp-2">
                          {request.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6">
            <div className="bg-[#0b1326] rounded-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto relative border border-slate-800 shadow-2xl flex flex-col">
              
              <div className="sticky top-0 bg-[#0b1326] px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 flex justify-between items-center z-10 shrink-0">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Create Purchase Request
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition focus:outline-none"
                >
                  <X size={16} sm:size={18} />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <PurchaseRequestForm
                  onClose={() => setShowForm(false)}
                  onSuccess={() => {
                    setShowForm(false);
                    loadRequests();
                  }}
                />
              </div>
              
            </div>
          </div>
        )}
      </div>
    </GroupLeaderLayout>
  );
};

export default NewRequests;