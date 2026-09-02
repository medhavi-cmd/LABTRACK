import { useCallback, useEffect, useState } from "react";
import { useListQuery } from "../../hooks/useListQuery";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import IssueHistoryCard from "../../components/ui/IssueHistoryCard";
import IssueDetailModal from "../../components/ui/IssueDetailModal";
import { getIssueHistory } from "../../services/issueHistoryApi";
import {
  Loader2,
  History,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

// Search and filter are resolved by the API (issueHistoryController.js).
// Sorting stays client-side: the endpoint groups rows in JS before returning.
const fetchIssueHistoryPage = async (params, signal) => {
  const { sortField, sortDir, ...serverParams } = params;
  const data = await getIssueHistory(serverParams, signal);
  const list = Array.isArray(data) ? [...data] : [];

  list.sort((a, b) => {
    let av = a[sortField] ?? "";
    let bv = b[sortField] ?? "";
    if (sortField === "requestDate") {
      av = av ? new Date(av).getTime() : 0;
      bv = bv ? new Date(bv).getTime() : 0;
    } else {
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return list;
};

export default function IssueHistory() {
  const {
    data: filteredRequests,
    loading,
    search,
    setSearch,
    filters,
    setFilter,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
  } = useListQuery(fetchIssueHistoryPage, {
    initialFilters: { status: "all" },
    initialSortField: "requestDate",
    initialSortDir: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filterStatus = filters.status;
  const setFilterStatus = useCallback((value) => setFilter("status", value), [setFilter]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRequests = filteredRequests.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, sortField, sortDir]);

  return (
    <GroupLeaderLayout>
      <div className="min-h-screen bg-[#F8FAFC] text-[#4B5563] p-5 sm:p-8 font-sans">
        
        <div className="max-w-6xl mx-auto mb-8 pb-5 border-b border-[#E5E7EB] flex items-center gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#2563EB] mb-0.5">
              Workspace Logs
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              Issue History
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              View all component requests made by your team.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:max-w-md">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by Request ID, purpose, or component..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#111827] placeholder:text-slate-400 outline-none focus:border-[#2563EB] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <Filter size={16} className="text-slate-400 shrink-0" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="outline-none text-xs sm:text-sm text-[#4B5563] bg-transparent cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="issued">Issued</option>
                <option value="returned">Returned</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="outline-none text-xs sm:text-sm text-[#4B5563] bg-transparent cursor-pointer"
              >
                <option value="requestDate">Sort: Request Date</option>
                <option value="requestId">Sort: Request ID</option>
                <option value="status">Sort: Status</option>
              </select>
              <button
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                className="text-slate-400 hover:text-[#2563EB] transition-colors"
                title={sortDir === "asc" ? "Ascending" : "Descending"}
              >
                {sortDir === "asc" ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
              </button>
            </div>
          </div>

          {loading && (
            <div className="rounded-xl bg-[#FFFFFF] p-12 text-center flex flex-col items-center justify-center gap-3 text-[#4B5563] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <Loader2 className="h-7 w-7 animate-spin text-[#2563EB]" />
              <p className="text-xs sm:text-sm">Loading issuance history...</p>
            </div>
          )}

          {!loading && filteredRequests.length === 0 && (
            <div className="rounded-xl bg-[#FFFFFF] p-8 sm:p-12 text-center border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h2 className="text-base sm:text-xl font-semibold text-[#111827]">
                No Requests Found
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#6B7280] max-w-xs mx-auto">
                Your issue history matches or dynamic search inputs will appear here.
              </p>
            </div>
          )}

          {!loading && filteredRequests.length > 0 && (
            <div className="space-y-4 sm:space-y-5">
              {currentRequests.map((request) => (
                <IssueHistoryCard
                  key={request.requestId}
                  request={request}
                  onView={() => setSelectedRequest(request)}
                />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm pt-4 pb-6">
              <button
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-3 py-2 text-[#4B5563] font-medium disabled:opacity-40 transition hover:bg-slate-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg font-semibold transition ${
                    page === currentPage
                      ? "bg-[#2563EB] text-white"
                      : "border border-[#E5E7EB] bg-[#FFFFFF] text-[#4B5563] hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-3 py-2 text-[#4B5563] font-medium disabled:opacity-40 transition hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <IssueDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </GroupLeaderLayout>
  );
}