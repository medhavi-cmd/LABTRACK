import { useEffect, useMemo, useState } from "react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import IssueHistoryCard from "../../components/ui/IssueHistoryCard";
import { getIssueHistory } from "../../services/issueHistoryApi";

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

  /* ---------------- SEARCH ---------------- */

  const filteredRequests = useMemo(() => {
    if (!search.trim()) return requests;

    const value = search.toLowerCase();

    return requests.filter((request) => {
      const requestId = String(request.requestId);

      const purpose = request.purpose?.toLowerCase() || "";

      const componentMatch = request.components.some((component) =>
        component.componentName.toLowerCase().includes(value)
      );

      return (
        requestId.includes(value) ||
        purpose.includes(value) ||
        componentMatch
      );
    });
  }, [requests, search]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(
    filteredRequests.length / ITEMS_PER_PAGE
  );

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
      <div className="min-h-screen bg-[#0b1326] p-6 md:p-8">

        {/* Heading */}

        <h1 className="text-3xl font-bold text-white">
          Issue History
        </h1>

        <p className="mt-2 text-gray-400">
          View all component requests made by your team.
        </p>


        <div className="mt-8">

          <input
            type="text"
            placeholder="Search by Request ID, Purpose or Component..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-2xl rounded-xl border border-[#27324d] bg-[#111a2f] px-5 py-3 text-white placeholder:text-gray-500 outline-none focus:border-cyan-500"
          />

        </div>


        {loading && (
          <div className="mt-10 rounded-xl bg-[#111a2f] p-8 text-center text-gray-300">
            Loading...
          </div>
        )}

   

        {!loading && filteredRequests.length === 0 && (
          <div className="mt-10 rounded-xl bg-[#111a2f] p-10 text-center">

            <h2 className="text-xl font-semibold text-white">
              No Requests Found
            </h2>

            <p className="mt-2 text-gray-400">
              Your issue history will appear here.
            </p>

          </div>
        )}

   
        {!loading && filteredRequests.length > 0 && (

          <div className="mt-8 space-y-5">

            {currentRequests.map((request) => (

              <IssueHistoryCard
                key={request.requestId}
                request={request}
                expanded={expandedRequest === request.requestId}
                onToggle={() =>
                  setExpandedRequest((prev) =>
                    prev === request.requestId
                      ? null
                      : request.requestId
                  )
                }
              />

            ))}

          </div>

        )}

 

        {!loading && totalPages > 1 && (

          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">

            <button
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={currentPage === 1}
              className="rounded-lg bg-[#18243d] px-4 py-2 text-white disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-10 w-10 rounded-lg font-semibold transition
                  ${
                    page === currentPage
                      ? "bg-cyan-500 text-black"
                      : "bg-[#18243d] text-white hover:bg-[#223150]"
                  }`}
              >
                {page}
              </button>

            ))}

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-lg bg-[#18243d] px-4 py-2 text-white disabled:opacity-40"
            >
              Next
            </button>

          </div>

        )}

      </div>
    </GroupLeaderLayout>
  );
}