import { useCallback } from "react";
import { useListQuery, toQueryString } from "../../hooks/useListQuery";
import {
  FiSearch,
  FiAlertTriangle,
  FiChevronUp,
  FiChevronDown,
  FiFilter,
} from "react-icons/fi";
import { authFetch } from "../../services/api";

const SortTh = ({ label, field, sortField, sortDir, onSort }) => {
  const active = sortField === field;
  return (
    <th className="ls-table-th select-none">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 group hover:text-cyan-600 transition-colors"
      >
        {label}
        <span className="flex flex-col opacity-50 group-hover:opacity-100">
          <FiChevronUp
            className={`w-3 h-3 -mb-0.5 ${
              active && sortDir === "asc" ? "text-cyan-500 opacity-100" : ""
            }`}
          />
          <FiChevronDown
            className={`w-3 h-3 ${
              active && sortDir === "desc" ? "text-cyan-500 opacity-100" : ""
            }`}
          />
        </span>
      </button>
    </th>
  );
};

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

// Search, filter and sort are resolved by the API (componentDemandService.js).
const fetchDemandPage = async (params, signal) => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/component-demand${toQueryString(params)}`,
    { signal }
  );
  const result = await res.json();
  if (!res.ok || !result?.success) {
    throw new Error(result?.message || "Failed to load component demand.");
  }
  return { data: result.data ?? [], stats: result.stats ?? null };
};

const ComponentDemand = () => {
  const {
    data: filteredData,
    extra,
    loading,
    error,
    search: searchTerm,
    setSearch: setSearchTerm,
    filters,
    setFilter,
    sortField,
    sortDir,
    handleSort,
  } = useListQuery(fetchDemandPage, {
    initialFilters: { demandStatus: "all" },
    initialSortField: "componentName",
    initialSortDir: "asc",
  });

  const filterDemand = filters.demandStatus;
  const setFilterDemand = useCallback((value) => setFilter("demandStatus", value), [setFilter]);

  const raw = extra?.stats ?? { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
  const percentOf = (count) => (raw.total > 0 ? Math.round((count / raw.total) * 100) : 0);
  const stats = {
    ...raw,
    criticalPercent: percentOf(raw.critical),
    highPercent: percentOf(raw.high),
    mediumPercent: percentOf(raw.medium),
    lowPercent: percentOf(raw.low),
  };

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

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-3.5 ls-text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Component ID, Name, or Category..."
            className="ls-input ls-input-search"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
          <FiFilter className="text-slate-400 shrink-0" />
          <select
            value={filterDemand}
            onChange={(e) => setFilterDemand(e.target.value)}
            className="outline-none text-sm text-slate-700 bg-transparent cursor-pointer"
          >
            <option value="all">All Demand</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
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
                <SortTh label="Component ID" field="componentId" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Component" field="componentName" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Category" field="category" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Total Stock" field="totalStock" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Available Stock" field="availableStock" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Total Requested (All Time)" field="totalRequested" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Demand Status" field="demandStatus" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
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