// ==========================================
// 3. pages/student/NewRequests.jsx (Purchase Requests)
// ==========================================
import { useEffect, useState } from "react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getMyPurchaseRequests } from "../../services/purchaseRequestApi";
import PurchaseRequestForm from "./PurchaseRequestForm";
import { X, Plus, Loader2, ShoppingBag } from "lucide-react";

const statusColors = {
  pending: "bg-amber-50 border border-amber-200 text-amber-700",
  approved: "bg-green-50 border border-green-200 text-green-700",
  rejected: "bg-red-50 border border-red-200 text-red-700",
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
      <div className="min-h-screen bg-[#F8FAFC] text-[#4B5563] p-5 sm:p-8 font-sans">
        
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            {/* <div className="rounded-lg border border-[#2563EB]/20 bg-[#EFF6FF] p-2 text-[#2563EB]">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
            </div> */}
            <div className="space-y-0.5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#2563EB]">
                Procurement
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                Purchase Requests
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                Track all purchase requests submitted by your team.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white font-semibold text-xs sm:text-sm transition active:scale-[0.98] w-full sm:w-auto shrink-0 shadow-sm"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>New Request</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3 text-[#4B5563]">
                <Loader2 className="h-7 w-7 animate-spin text-[#2563EB]" />
                <p className="text-xs sm:text-sm">Loading request profiles...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-14 px-4">
                <p className="text-[#6B7280] text-sm sm:text-base max-w-xs mx-auto">
                  No purchase requests submitted yet.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-[#2563EB] hover:bg-blue-700 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition active:scale-[0.98] shadow-sm"
                >
                  Create First Request
                </button>
              </div>
            ) : (
              <>
                <table className="w-full hidden md:table border-collapse text-left">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="text-[#4B5563] text-xs font-semibold tracking-wider uppercase border-b border-[#E5E7EB]">
                      <th className="px-6 py-4">Component</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Request Date</th>
                      <th className="px-6 py-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {requests.map((request) => (
                      <tr
                        key={request.purchase_request_id}
                        className="hover:bg-slate-50/80 transition text-sm text-[#4B5563]"
                      >
                        <td className="px-6 py-4 text-[#111827] font-medium">
                          {request.component_name}
                        </td>
                        <td className="px-6 py-4">
                          {request.category || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {request.quantity_required}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[request.status] || "bg-slate-100 text-slate-700"}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(request.request_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280] max-w-xs truncate">
                          {request.remarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="block md:hidden divide-y divide-[#E5E7EB]">
                  {requests.map((request) => (
                    <div
                      key={request.purchase_request_id}
                      className="p-4 space-y-3 hover:bg-slate-50/50 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-[#111827] truncate">
                            {request.component_name}
                          </h4>
                          <p className="text-[11px] text-[#6B7280] mt-0.5">
                            Category: {request.category || "-"}
                          </p>
                        </div>
                        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${statusColors[request.status] || "bg-slate-100 text-slate-700"}`}>
                          {request.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E5E7EB]">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Quantity</span>
                          <span className="text-[#111827] font-medium">{request.quantity_required}</span>
                        </div>
                        <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E5E7EB]">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Req Date</span>
                          <span className="text-[#111827] font-medium">
                            {new Date(request.request_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {request.remarks && (
                        <div className="text-xs bg-slate-50 p-2 rounded-lg border border-[#E5E7EB]">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Remarks</span>
                          <p className="text-[#6B7280] italic mt-0.5 break-words line-clamp-2">
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
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6">
            <div className="bg-[#FFFFFF] rounded-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto relative border border-[#E5E7EB] shadow-2xl flex flex-col">
              
              <div className="sticky top-0 bg-[#FFFFFF] px-4 py-3 sm:px-6 sm:py-4 border-b border-[#E5E7EB] flex justify-between items-center z-10 shrink-0">
                <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                  Create Purchase Request
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg bg-slate-100 text-[#6B7280] hover:text-[#111827] hover:bg-slate-200 transition focus:outline-none"
                >
                  <X className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
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