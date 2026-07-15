import { useEffect, useMemo, useState } from "react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import IssueHistoryCard from "../../components/ui/IssueHistoryCard";
import { getIssueHistory } from "../../services/issueHistoryApi";
import { Loader2 } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-1 py-2 sm:px-4">
        
        <div className="space-y-1 pb-4 border-b border-slate-800">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            Issue History
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            View all component requests made by your team.
          </p>
        </div>

        <div className="mt-5 sm:mt-6 w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Request ID, purpose, or component..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#27324d] bg-[#111a2f] px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        {loading && (
          <div className="mt-8 rounded-xl bg-[#111a2f] p-12 text-center flex flex-col items-center justify-center gap-3 text-gray-400 border border-slate-800/40">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-500" />
            <p className="text-xs sm:text-sm">Loading issuance history...</p>
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="mt-8 rounded-xl bg-[#111a2f] p-8 sm:p-12 text-center border border-slate-800/40">
            <h2 className="text-base sm:text-xl font-semibold text-white">
              No Requests Found
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-400 max-w-xs mx-auto">
              Your issue history matches or dynamic search inputs will appear here.
            </p>
          </div>
        )}

        {!loading && filteredRequests.length > 0 && (
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
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
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm pb-6">
            <button
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-lg bg-[#18243d] px-3 py-2 text-white font-medium disabled:opacity-40 transition hover:bg-[#223150]"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg font-semibold transition ${
                  page === currentPage
                    ? "bg-cyan-500 text-black"
                    : "bg-[#18243d] text-white hover:bg-[#223150]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-lg bg-[#18243d] px-3 py-2 text-white font-medium disabled:opacity-40 transition hover:bg-[#223150]"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </GroupLeaderLayout>
  );
}