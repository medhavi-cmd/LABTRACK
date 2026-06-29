import {
  Package,
  ClipboardList,
  ArrowDownToLine,
  RotateCcw,
  Users,
  FolderKanban,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getDashboardData } from "../../services/studentDashboardApi";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";

export default function StudentDashboardWithTeam() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardData();

      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Requests",
      value: dashboard?.totalRequests || 0,
      description: "Component requests created by your team",
      icon: ClipboardList,
    },
    {
      label: "Pending Requests",
      value: dashboard?.pendingRequests || 0,
      description: "Requests awaiting lab action",
      icon: Clock3,
    },
    {
      label: "Components Issued",
      value: dashboard?.issuedComponents || 0,
      description: "Components currently issued",
      icon: ArrowDownToLine,
    },
    {
      label: "Components Returned",
      value: dashboard?.returnedComponents || 0,
      description: "Components successfully returned",
      icon: RotateCcw,
    },
  ];

  if (loading) {
    return (
      <GroupLeaderLayout>
        <div className="min-h-screen flex items-center justify-center text-white">
          <Loader2 className="animate-spin mr-3 text-cyan-400" />
          Loading Dashboard...
        </div>
      </GroupLeaderLayout>
    );
  }

  return (
    <GroupLeaderLayout>
      <div className="min-h-screen bg-[#0b1326] p-8 text-[#dae2fd]">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-[#22d3ee]">
              Student Dashboard
            </p>

            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.full_name || "Student"}
            </h1>

            <p className="mt-2 text-[#bbc9cd]">
              Track your team’s component requests, issued items, and return
              activity.
            </p>
          </div>

          {/* Team active banner */}
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-[#1e4273] bg-[#11253e] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#22d3ee]" size={22} />

              <div>
                <h2 className="font-semibold text-white">
                  Project Team Registered
                </h2>
                <p className="mt-1 text-sm text-[#bbc9cd]">
                  Your team workspace is active and available for lab
                  operations.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full border border-[#22d3ee]/30 bg-[#00363e]/50 px-3 py-1 text-xs font-semibold text-[#22d3ee]">
              Active Team
            </span>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#3c494c] bg-[#171f33] p-5"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="rounded-lg border border-[#22d3ee]/20 bg-[#00363e]/40 p-2.5">
                      <Icon className="text-[#22d3ee]" size={20} />
                    </div>
                  </div>

                  <p className="text-3xl font-bold text-white">{stat.value}</p>

                  <p className="mt-2 text-sm font-semibold text-[#dae2fd]">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-[#859397]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Team workspace overview */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-[#3c494c] bg-[#171f33] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg border border-[#22d3ee]/20 bg-[#00363e]/40 p-2.5">
                  <FolderKanban className="text-[#22d3ee]" size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    Project Workspace
                  </h2>
                  <p className="text-sm text-[#bbc9cd]">
                    Manage your registered project and team details.
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#bbc9cd]">
                Your project team has been registered. Open Team Management to
                view the project details and registered members.
              </p>
            </section>

            <section className="rounded-xl border border-[#3c494c] bg-[#171f33] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg border border-[#22d3ee]/20 bg-[#00363e]/40 p-2.5">
                  <Users className="text-[#22d3ee]" size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-white">Lab Activity</h2>
                  <p className="text-sm text-[#bbc9cd]">
                    Your team’s component activity will appear here.
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#bbc9cd]">
                As your team submits requests and components are issued or
                returned, the latest activity will be shown here.
              </p>
            </section>
          </div>

          {/* Future activity section */}
          <section className="mt-6 rounded-xl border border-[#3c494c] bg-[#171f33] p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg border border-[#22d3ee]/20 bg-[#00363e]/40 p-2.5">
                <Package className="text-[#22d3ee]" size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Recent Component Activity
                </h2>
                <p className="text-sm text-[#bbc9cd]">
                  Recent requests, issues, and returns from your team.
                </p>
              </div>
            </div>

            {dashboard?.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recentActivity.map((item) => (
                  <div
                    key={item.request_item_id}
                    className="flex items-center justify-between border border-[#3c494c] rounded-lg p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {item.component_name}
                      </p>

                      <p className="text-sm text-slate-400">
                        Quantity : {item.quantity}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : item.status === "rejected"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#3c494c] bg-[#0b1326]/50 p-8 text-center">
                <Package className="mx-auto mb-3 text-[#859397]" size={28} />

                <p className="font-medium text-[#dae2fd]">
                  No component activity yet
                </p>

                <p className="mt-1 text-sm text-[#859397]">
                  Activity will appear after your team starts requesting
                  components.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </GroupLeaderLayout>
  );
}
