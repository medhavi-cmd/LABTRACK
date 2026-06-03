import DashboardLayout from "../../layouts/DashboardLayout";
import { leaderNavItems } from "../../config/sidebarConfig";

function LeaderDashboard() {
  return (
    <DashboardLayout navItems={leaderNavItems}>
      <h1 className="text-3xl font-bold text-white">
        Team Leader Dashboard
      </h1>
    </DashboardLayout>
  );
}

export default LeaderDashboard;