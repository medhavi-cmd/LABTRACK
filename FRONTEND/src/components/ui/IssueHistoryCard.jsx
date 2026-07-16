// ==========================================
// 1. components/ui/IssueHistoryCard.jsx
// ==========================================
import { ChevronDown, ChevronUp } from "lucide-react";

const statusColors = {
  pending: "bg-amber-50 border border-amber-200 text-amber-700",
  approved: "bg-green-50 border border-green-200 text-green-700",
  issued: "bg-cyan-50 border border-cyan-200 text-cyan-700",
  returned: "bg-purple-50 border border-purple-200 text-purple-700",
  rejected: "bg-red-50 border border-red-200 text-red-700",
};

export default function IssueHistoryCard({ request, expanded, onToggle }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-4 sm:px-6 sm:py-5 hover:bg-slate-50/80 transition flex items-center justify-between"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 w-full mr-4">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
              Request ID
            </p>
            <p className="text-[#111827] text-xs sm:text-sm font-bold font-mono mt-0.5">
              #{request.requestId}
            </p>
          </div>

          <div>
            <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
              Request Date
            </p>
            <p className="text-[#4B5563] text-xs sm:text-sm mt-0.5">
              {new Date(request.requestDate).toLocaleDateString()}
            </p>
          </div>

          <div className="col-span-2 md:col-span-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
              Purpose
            </p>
            <p className="text-[#4B5563] text-xs sm:text-sm truncate mt-0.5">
              {request.purpose}
            </p>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t border-slate-100 md:border-t-0">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase ${
                statusColors[request.status] || "bg-slate-50 border border-slate-200 text-slate-700"
              }`}
            >
              {request.status}
            </span>
          </div>
        </div>

        <div className="shrink-0 text-[#6B7280]">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#E5E7EB] bg-[#F8FAFC]/40 px-4 py-4 sm:px-6 sm:py-5 space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-3">
              Requested Components
            </h3>
            <div className="space-y-2">
              {request.components?.map((component, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] px-4 py-2.5 shadow-sm text-xs sm:text-sm"
                >
                  <span className="text-[#4B5563] font-medium">
                    {component.componentName}
                  </span>
                  <span className="font-bold font-mono text-[#2563EB]">
                    × {component.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pt-3 border-t border-[#E5E7EB]">
            <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Issue Date
              </p>
              <p className="text-[#111827] text-xs sm:text-sm font-medium mt-0.5">
                {request.issueDate
                  ? new Date(request.issueDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Expected Return
              </p>
              <p className="text-[#111827] text-xs sm:text-sm font-medium mt-0.5">
                {request.expectedReturnDate
                  ? new Date(request.expectedReturnDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1 bg-[#FFFFFF] p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Return Status
              </p>
              <p className="capitalize text-[#111827] text-xs sm:text-sm font-medium mt-0.5">
                {request.returnStatus || "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}