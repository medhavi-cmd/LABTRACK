import { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboardApi";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDashboard();
        setDashboardData(data);
      } catch (_err) {
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getRequestBadgeClass = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "pending") return "ls-badge-warning";
    if (normalizedStatus === "approved") return "ls-badge-success";
    if (normalizedStatus === "rejected") return "ls-badge-error";

    return "ls-badge-warning";
  };

  if (loading) {
    return <div className="">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="">{error}</div>;
  }

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="ls-title-main">Dashboard</h1>
        <p className="ls-text-secondary mt-2">
          Overview of laboratory inventory and component activities
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Total Components</p>
          <h2 className="ls-stat-value">{dashboardData?.stats?.totalComponents ?? 0}</h2>
        </div>

        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Pending Requests</p>
          <h2 className="ls-stat-value text-amber-500">{dashboardData?.stats?.pendingRequests ?? 0}</h2>
        </div>

        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Issued Components</p>
          <h2 className="ls-stat-value text-cyan-600">{dashboardData?.stats?.issuedComponents ?? 0}</h2>
        </div>

        <div className="ls-stat-card">
          <p className="ls-text-secondary font-medium">Damage Components</p>
          <h2 className="ls-stat-value text-red-600">{dashboardData?.stats?.damagedComponents ?? 0}</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="ls-card ls-card-hover">
          <h2 className="ls-title-card mb-4">
            Recent Component Requests
          </h2>

          <div className="space-y-4">
            {dashboardData?.recentRequests?.length ? (
              dashboardData.recentRequests.map((request, index) => (
                <div
                  key={`${request.request_id}-${index}`}
                  className={`flex justify-between ${index !== dashboardData.recentRequests.length - 1 ? "border-b border-slate-100 pb-3" : ""}`}
                >
                  <span className="ls-text-primary font-medium">
                    {request.component_name} ({request.quantity})
                  </span>
                  <span className={getRequestBadgeClass(request.status)}>
                    {request.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="ls-text-secondary">No recent requests found.</div>
            )}
          </div>
        </div>

        <div className="ls-card ls-card-hover">
          <h2 className="ls-title-card mb-4">
            Low Stock Components
          </h2>

          <div className="space-y-4">
            {dashboardData?.lowStockComponents?.length ? (
              dashboardData.lowStockComponents.map((component, index) => (
                <div
                  key={`${component.component_id}-${index}`}
                  className={`flex justify-between ${index !== dashboardData.lowStockComponents.length - 1 ? "border-b border-slate-100 pb-3" : ""}`}
                >
                  <span className="ls-text-primary font-medium">{component.component_name}</span>
                  <span className="ls-badge-error">{component.available_quantity} Left</span>
                </div>
              ))
            ) : (
              <div className="ls-text-secondary">No low stock components.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;