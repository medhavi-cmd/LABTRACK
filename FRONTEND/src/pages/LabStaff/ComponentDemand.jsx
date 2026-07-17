import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiAlertTriangle } from "react-icons/fi";
import { authFetch } from "../../services/api";

const getDemandStyle = (status) => {
  const normalized = status?.toLowerCase();
  if (normalized === "low") {
    return "bg-green-500/10 text-green-400 border border-green-500/30";
  }
  if (normalized === "medium") {
    return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
  }
  if (normalized === "high") {
    return "bg-orange-500/10 text-orange-400 border border-orange-500/30";
  }
  if (normalized === "critical") {
    return "bg-red-500/10 text-red-400 border border-red-500/30";
  }
  return "bg-slate-500/10 text-slate-400 border border-slate-500/30";
};

const ComponentDemand = () => {
  const [demandData, setDemandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const loadDemand = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await authFetch("http://localhost:5000/api/component-demand");
        const result = await res.json();

        if (!res.ok || !result?.success) {
          throw new Error(result?.message || "Failed to load component demand.");
        }

        if (isMounted) {
          setDemandData(result.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load component demand.");
          setDemandData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDemand();

    return () => {
      isMounted = false;
    };
  }, []);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = demandData.length;
    const critical = demandData.filter((r) => r.demandStatus === "Critical").length;
    const high = demandData.filter((r) => r.demandStatus === "High").length;
    const medium = demandData.filter((r) => r.demandStatus === "Medium").length;
    const low = demandData.filter((r) => r.demandStatus === "Low").length;

    const percentOf = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

    return {
      total,
      critical,
      high,
      medium,
      low,
      criticalPercent: percentOf(critical),
      highPercent: percentOf(high),
      mediumPercent: percentOf(medium),
      lowPercent: percentOf(low),
    };
  }, [demandData]);

  // ── Search ─────────────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return demandData;
    return demandData.filter((item) =>
      [item?.componentId, item?.componentName, item?.category].some(
        (field) => field?.toLowerCase().includes(term)
      )
    );
  }, [demandData, searchTerm]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Component Demand</h1>
        <p className="text-slate-400 mt-1">
          Monitor component stock levels and demand status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Components</p>
          <h2 className="text-3xl font-bold mt-2">{loading ? "—" : stats.total}</h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Low Demand</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {loading ? "—" : stats.low}
          </h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">High Demand</p>
          <h2 className="text-3xl font-bold text-orange-400 mt-2">
            {loading ? "—" : stats.high}
          </h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Critical (Out of Stock)</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {loading ? "—" : stats.critical}
          </h2>
        </div>
      </div>

      {/* Demand Status Summary */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">Demand Status Summary</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Low Demand</span>
              <span className="text-slate-400">{loading ? "—" : `${stats.lowPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.lowPercent}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Medium Demand</span>
              <span className="text-slate-400">{loading ? "—" : `${stats.mediumPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.mediumPercent}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>High Demand</span>
              <span className="text-slate-400">{loading ? "—" : `${stats.highPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.highPercent}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Critical Demand</span>
              <span className="text-slate-400">{loading ? "—" : `${stats.criticalPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.criticalPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Component ID, Name, or Category..."
          className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-cyan-500"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Demand Analysis</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111827]">
              <tr>
                <th className="text-left px-6 py-4">Component ID</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Total Stock</th>
                <th className="text-left px-6 py-4">Available Stock</th>
                <th className="text-left px-6 py-4">Total Requested (All Time)</th>
                <th className="text-left px-6 py-4">Demand Status</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-16">
                    <div className="flex items-center justify-center text-slate-400 gap-3">
                      <svg
                        className="animate-spin w-5 h-5 text-cyan-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading component demand...
                    </div>
                  </td>
                </tr>
              )}

              {/* Error */}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-red-400">
                    <FiAlertTriangle className="mx-auto mb-2 w-6 h-6" />
                    {error}
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {!loading && !error && filteredData.map((item) => (
                <tr
                  key={item.componentId}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-6 py-4 text-slate-300">{item.componentId}</td>
                  <td className="px-6 py-4 font-medium">{item.componentName}</td>
                  <td className="px-6 py-4 text-slate-300">{item.category}</td>
                  <td className="px-6 py-4 text-slate-300">{item.totalStock}</td>
                  <td className="px-6 py-4 text-slate-300">{item.availableStock}</td>
                  <td className="px-6 py-4 text-slate-300">{item.totalRequested}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getDemandStyle(
                        item.demandStatus
                      )}`}
                    >
                      {item.demandStatus}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {!loading && !error && filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No component demand records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComponentDemand;