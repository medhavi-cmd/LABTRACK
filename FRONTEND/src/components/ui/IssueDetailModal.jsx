import { X } from "lucide-react";
import CommentsSection from "./CommentsSection";

const statusColors = {
  pending: "bg-amber-50 border border-amber-200 text-amber-700",
  approved: "bg-green-50 border border-green-200 text-green-700",
  issued: "bg-cyan-50 border border-cyan-200 text-cyan-700",
  returned: "bg-purple-50 border border-purple-200 text-purple-700",
  rejected: "bg-red-50 border border-red-200 text-red-700",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "-";

export default function IssueDetailModal({ request, onClose }) {
  if (!request) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 backdrop-blur px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#2563EB]">
              Request #{request.requestId}
            </p>
            <h2 className="mt-0.5 text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
              Request Details
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                Request Date
              </p>
              <p className="mt-0.5 font-medium text-slate-900">
                {formatDate(request.requestDate)}
              </p>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                Status
              </p>
              <span
                className={`mt-1 inline-flex px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${
                  statusColors[request.status] ||
                  "bg-slate-50 border border-slate-200 text-slate-700"
                }`}
              >
                {request.status}
              </span>
            </div>

            <div className="col-span-2">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                Purpose
              </p>
              <p className="mt-0.5 font-medium text-slate-900 break-words">
                {request.purpose || "-"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">
              Requested Components
            </h3>
            <div className="space-y-2">
              {request.components?.length ? (
                request.components.map((component, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm shadow-sm"
                  >
                    <span className="font-medium text-slate-600">
                      {component.componentName}
                    </span>
                    <span className="font-mono font-bold text-[#2563EB]">
                      × {component.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-slate-400 italic">
                  No components recorded for this request.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 border-t border-slate-200 pt-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                Issue Date
              </p>
              <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-900">
                {formatDate(request.issueDate)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                Expected Return
              </p>
              <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-900">
                {formatDate(request.expectedReturnDate)}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                Return Status
              </p>
              <p className="mt-0.5 text-xs sm:text-sm font-medium capitalize text-slate-900">
                {request.returnStatus || "-"}
              </p>
            </div>
          </div>

          <CommentsSection entityType="request" entityId={request.requestId} />
        </div>
      </div>
    </div>
  );
}
