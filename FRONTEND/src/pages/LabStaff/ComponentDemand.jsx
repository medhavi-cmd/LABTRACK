import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiAlertTriangle } from "react-icons/fi";
import { authFetch } from "../../services/api";

const getDemandStyle = (status) => {
  const normalized = status?.toLowerCase();
  if (normalized === "low") {
    return "bg-green-50 text-green-600 border border-green-200";
  }
  if (normalized === "medium") {
    return "bg-amber-50 text-amber-600 border border-amber-200";
  }
  if (normalized === "high") {
    return "bg-orange-50 text-orange-600 border border-orange-200";
  }
  if (normalized === "critical") {
    return "bg-red-50 text-red-600 border border-red-200";
  }
  return "bg-slate-100 ls-text-secondary border border-slate-200";
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
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="ls-title-main">Component Demand</h1>
        <p className="ls-text-secondary mt-1">
          Monitor component stock levels and demand status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="ls-stat-card">
          <p className="ls-text-secondary">Total Components</p>
          <h2 className="ls-stat-value">{loading ? "—" : stats.total}</h2>
        </div>

        <div className="ls-stat-card">
          <p className="ls-text-secondary">Low Demand</p>
          <h2 className="ls-stat-value text-green-600">
            {loading ? "—" : stats.low}
          </h2>
        </div>

        <div className="ls-stat-card">
          <p className="ls-text-secondary">High Demand</p>
          <h2 className="ls-stat-value text-orange-600">
            {loading ? "—" : stats.high}
          </h2>
        </div>

        <div className="ls-stat-card">
          <p className="ls-text-secondary">Critical (Out of Stock)</p>
          <h2 className="ls-stat-value text-red-600">
            {loading ? "—" : stats.critical}
          </h2>
        </div>
      </div>

      {/* Demand Status Summary */}
      <div className="ls-stat-card mb-8">
        <h2 className="text-lg font-semibold mb-4">Demand Status Summary</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Low Demand</span>
              <span className="ls-text-secondary">{loading ? "—" : `${stats.lowPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.lowPercent}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Medium Demand</span>
              <span className="ls-text-secondary">{loading ? "—" : `${stats.mediumPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.mediumPercent}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>High Demand</span>
              <span className="ls-text-secondary">{loading ? "—" : `${stats.highPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${loading ? 0 : stats.highPercent}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Critical Demand</span>
              <span className="ls-text-secondary">{loading ? "—" : `${stats.criticalPercent}%`}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
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
        <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Component ID, Name, or Category..."
          className="ls-input ls-input-search"
        />
      </div>

      {/* Table */}
      <div className="ls-card overflow-hidden">
        <div className="ls-table-header">
          <h2 className="ls-title-card">Demand Analysis</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="ls-table-th">Component ID</th>
                <th className="ls-table-th">Component</th>
                <th className="ls-table-th">Category</th>
                <th className="ls-table-th">Total Stock</th>
                <th className="ls-table-th">Available Stock</th>
                <th className="ls-table-th">Total Requested (All Time)</th>
                <th className="ls-table-th">Demand Status</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-16">
                    <div className="flex items-center justify-center ls-text-secondary gap-3">
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
                  <td colSpan={7} className="px-6 py-16 text-center text-red-600">
                    <FiAlertTriangle className="mx-auto mb-2 w-6 h-6" />
                    {error}
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {!loading && !error && filteredData.map((item) => (
                <tr
                  key={item.componentId}
                  className="ls-table-tr"
                >
                  <td className="ls-table-td text-slate-600">{item.componentId}</td>
                  <td className="ls-table-td font-medium">{item.componentName}</td>
                  <td className="ls-table-td text-slate-600">{item.category}</td>
                  <td className="ls-table-td text-slate-600">{item.totalStock}</td>
                  <td className="ls-table-td text-slate-600">{item.availableStock}</td>
                  <td className="ls-table-td text-slate-600">{item.totalRequested}</td>
                  <td className="ls-table-td">
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
                    className="px-6 py-8 text-center ls-text-secondary"
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