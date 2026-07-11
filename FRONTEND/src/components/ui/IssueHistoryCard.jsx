export default function IssueHistoryCard({ request }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "approved":
        return "bg-green-500/20 text-green-400";

      case "issued":
        return "bg-cyan-500/20 text-cyan-400";

      case "returned":
        return "bg-purple-500/20 text-purple-400";

      case "rejected":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="rounded-xl border border-[#24314e] bg-[#111a2f] p-6 shadow-md">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="text-lg font-semibold text-white">
            Request #{request.requestId}
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {new Date(request.requestDate).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-1 text-sm font-semibold capitalize ${getStatusColor(
            request.status
          )}`}
        >
          {request.status}
        </span>

      </div>

      {/* Purpose */}

      <div className="mt-6">

        <p className="text-sm text-gray-400">
          Purpose
        </p>

        <p className="mt-1 text-white">
          {request.purpose}
        </p>

      </div>

      {/* Components */}

      <div className="mt-8">

        <h3 className="mb-4 font-semibold text-white">
          Requested Components
        </h3>

        <div className="overflow-x-auto rounded-lg border border-[#1f2d48]">

          <table className="w-full">

            <thead className="bg-[#18243d]">

              <tr>

                <th className="px-4 py-3 text-left text-sm text-gray-300">
                  Component
                </th>

                <th className="px-4 py-3 text-center text-sm text-gray-300">
                  Quantity
                </th>

              </tr>

            </thead>

            <tbody>

              {request.components.map((component, index) => (

                <tr
                  key={index}
                  className="border-t border-[#1f2d48]"
                >

                  <td className="px-4 py-3 text-white">
                    {component.componentName}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold text-cyan-400">
                    {component.quantity}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Issue Details */}

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <div>

          <p className="text-sm text-gray-400">
            Issue Date
          </p>

          <p className="mt-1 text-white">
            {request.issueDate
              ? new Date(request.issueDate).toLocaleDateString()
              : "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-400">
            Expected Return
          </p>

          <p className="mt-1 text-white">
            {request.expectedReturnDate
              ? new Date(request.expectedReturnDate).toLocaleDateString()
              : "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-400">
            Return Status
          </p>

          <p className="mt-1 capitalize text-white">
            {request.returnStatus || "-"}
          </p>

        </div>

      </div>

    </div>
  );
}