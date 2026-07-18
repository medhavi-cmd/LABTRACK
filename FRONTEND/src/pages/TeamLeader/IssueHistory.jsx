import { useEffect, useMemo, useState } from "react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import IssueHistoryCard from "../../components/ui/IssueHistoryCard";
import { getIssueHistory } from "../../services/issueHistoryApi";
import { Loader2, History } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function IssueHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRequest, setExpandedRequest] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getIssueHistory();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredRequests = useMemo(() => {
    if (!search.trim()) return requests;
    const value = search.toLowerCase();

    return requests.filter((request) => {
      const requestId = String(request.requestId);
      const purpose = request.purpose?.toLowerCase() || "";
      const componentMatch = request.components?.some((component) =>
        component.componentName.toLowerCase().includes(value)
      );

      return (
        requestId.includes(value) ||
        purpose.includes(value) ||
        componentMatch
      );
    });
  }, [requests, search]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRequests = filteredRequests.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Request ID, purpose, or component..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm text-[#111827] placeholder:text-slate-400 outline-none focus:border-[#2563EB] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            />
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
                  expanded={expandedRequest === request.requestId}
                  onToggle={() =>
                    setExpandedRequest((prev) =>
                      prev === request.requestId ? null : request.requestId
                    )
                  }
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
    </GroupLeaderLayout>
  );
}