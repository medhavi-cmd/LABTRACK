import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function IssueHistoryCard({ request }) {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-500/10";

      case "approved":
        return "text-green-400 bg-green-500/10";

      case "issued":
        return "text-cyan-400 bg-cyan-500/10";

      case "returned":
        return "text-purple-400 bg-purple-500/10";

      case "rejected":
        return "text-red-400 bg-red-500/10";

      default:
        return "text-gray-300 bg-gray-500/10";
    }
  };

  return (
    <div className="rounded-xl border border-[#24314e] bg-[#111a2f] overflow-hidden">

      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 hover:bg-[#17223a] transition flex items-center justify-between"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">

          <div>
            <p className="text-xs text-gray-400">Request ID</p>
            <p className="text-white font-semibold">
              #{request.requestId}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Request Date</p>
            <p className="text-white">
              {new Date(request.requestDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Purpose</p>
            <p className="text-white truncate">
              {request.purpose}
            </p>
          </div>

          <div className="flex items-center justify-between">

            <span
              className={`capitalize px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                request.status
              )}`}
            >
              {request.status}
            </span>

            {open ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}

          </div>

        </div>
      </button>


      {open && (
        <div className="border-t border-[#24314e] px-6 py-6">

          {/* Components */}

          <h3 className="text-white font-semibold mb-4">
            Requested Components
          </h3>

          <div className="space-y-3">

            {request.components.map((component, index) => (
              <div
                key={index}
                className="flex justify-between rounded-lg bg-[#18243d] px-4 py-3"
              >
                <span className="text-white">
                  {component.componentName}
                </span>

                <span className="font-semibold text-cyan-400">
                  × {component.quantity}
                </span>
              </div>
            ))}

          </div>


          <div className="grid md:grid-cols-3 gap-6 mt-8">

            <div>
              <p className="text-gray-400 text-sm">
                Issue Date
              </p>

              <p className="text-white mt-1">
                {request.issueDate
                  ? new Date(request.issueDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Expected Return
              </p>

              <p className="text-white mt-1">
                {request.expectedReturnDate
                  ? new Date(request.expectedReturnDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Return Status
              </p>

              <p className="capitalize text-white mt-1">
                {request.returnStatus || "-"}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}