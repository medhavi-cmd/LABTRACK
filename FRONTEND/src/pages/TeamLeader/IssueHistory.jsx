import { useEffect, useState } from "react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import IssueHistoryCard from "../../components/ui/IssueHistoryCard";
import { getIssueHistory } from "../../services/issueHistoryApi";

export default function IssueHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getIssueHistory();

      console.log("Issue History:", data);

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

  return (
    <GroupLeaderLayout>
      <div className="min-h-screen bg-[#0b1326] p-6 md:p-8">

        <h1 className="text-3xl font-bold text-white">
          Issue History
        </h1>

        <p className="mt-2 text-gray-400">
          View all component requests made by your team.
        </p>

        {/* Loading */}

        {loading && (
          <div className="mt-10 rounded-xl border border-[#24314e] bg-[#111a2f] p-8 text-center text-gray-300">
            Loading Issue History...
          </div>
        )}

        {/* Empty */}

        {!loading && requests.length === 0 && (
          <div className="mt-10 rounded-xl border border-[#24314e] bg-[#111a2f] p-10 text-center">

            <h2 className="text-xl font-semibold text-white">
              No Requests Found
            </h2>

            <p className="mt-2 text-gray-400">
              Your team's issued component history will appear here.
            </p>

          </div>
        )}

        {/* Cards */}

        {!loading && requests.length > 0 && (
          <div className="mt-8 space-y-8">

            {requests.map((request) => (
              <IssueHistoryCard
                key={request.requestId}
                request={request}
              />
            ))}

          </div>
        )}

      </div>
    </GroupLeaderLayout>
  );
}