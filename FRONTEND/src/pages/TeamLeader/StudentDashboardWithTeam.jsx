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

import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";

export default function StudentDashboardWithTeam() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const stats = [
    {
      label: "Total Requests",
      value: 0,
      description: "Component requests created by your team",
      icon: ClipboardList,
    },
    {
      label: "Pending Requests",
      value: 0,
      description: "Requests awaiting lab or faculty action",
      icon: Clock3,
    },
    {
      label: "Components Issued",
      value: 0,
      description: "Components currently issued to your team",
      icon: ArrowDownToLine,
    },
    {
      label: "Components Returned",
      value: 0,
      description: "Components successfully returned to the lab",
      icon: RotateCcw,
    },
  ];

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
              Track your team’s component requests, issued items, and return activity.
            </p>
          </div>

          {/* Team active banner */}
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-[#1e4273] bg-[#11253e] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#22d3ee]" size={22} />

              <div>
                <h2 className="font-semibold text-white">Project Team Registered</h2>
                <p className="mt-1 text-sm text-[#bbc9cd]">
                  Your team workspace is active and available for lab operations.
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
                  <h2 className="font-semibold text-white">Project Workspace</h2>
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
                <h2 className="font-semibold text-white">Recent Component Activity</h2>
                <p className="text-sm text-[#bbc9cd]">
                  Recent requests, issues, and returns from your team.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-[#3c494c] bg-[#0b1326]/50 p-8 text-center">
              <Package className="mx-auto mb-3 text-[#859397]" size={28} />
              <p className="font-medium text-[#dae2fd]">No component activity yet</p>
              <p className="mt-1 text-sm text-[#859397]">
                Activity will appear after your team starts requesting components.
              </p>
            </div>
          </section>
        </div>
      </div>
    </GroupLeaderLayout>
  );
}