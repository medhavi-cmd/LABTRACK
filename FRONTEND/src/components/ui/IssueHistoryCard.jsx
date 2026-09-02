import { Eye } from "lucide-react";

const statusColors = {
  pending: "bg-amber-50 border border-amber-200 text-amber-700",
  approved: "bg-green-50 border border-green-200 text-green-700",
  issued: "bg-cyan-50 border border-cyan-200 text-cyan-700",
  returned: "bg-purple-50 border border-purple-200 text-purple-700",
  rejected: "bg-red-50 border border-red-200 text-red-700",
};

export default function IssueHistoryCard({ request, onView }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 w-full min-w-0">
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
                statusColors[request.status] ||
                "bg-slate-50 border border-slate-200 text-slate-700"
              }`}
            >
              {request.status}
            </span>
          </div>
        </div>

        <button
          onClick={onView}
          className="shrink-0 flex items-center gap-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] px-3 py-2 text-[10px] sm:text-xs font-bold text-white transition active:scale-[0.98]"
        >
          <Eye size={14} />
          <span className="hidden sm:inline">View</span>
        </button>
      </div>
    </div>
  );
}
