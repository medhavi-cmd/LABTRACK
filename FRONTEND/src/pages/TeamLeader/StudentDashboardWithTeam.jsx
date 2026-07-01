import {
  Package,
  ClipboardList,
  ArrowDownToLine,
  RotateCcw,
  Users,
  FolderKanban,
  Clock3,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getDashboardData } from "../../services/studentDashboardApi";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getNextEvent } from "../../services/eventApi";

export default function StudentDashboardWithTeam() {
  const [nextEvent, setNextEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchNextEvent();
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

  const fetchNextEvent = async () => {
    try {
      const data = await getNextEvent();

      setNextEvent(data);

      updateCountdown(data.event_datetime);

      const interval = setInterval(() => {
        updateCountdown(data.event_datetime);
      }, 1000);

      return () => clearInterval(interval);
    } catch (err) {
      console.log(err);
    }
  };

  const updateCountdown = (eventTime) => {
    const difference = new Date(eventTime) - new Date();

    if (difference <= 0) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    });
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

      
          <div className="mb-8 rounded-xl border border-cyan-500/20 bg-[#171f33] p-5">
            {nextEvent ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="text-cyan-400" size={22} />

                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Upcoming Event
                      </h2>

                      <p className="text-xs text-slate-400">
                        Countdown to the next lab event
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(nextEvent.event_datetime).toLocaleString()}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {nextEvent.event_name}
                  </h3>

                  <p className="text-sm text-slate-400 mt-1 truncate">
                    {nextEvent.event_description}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="rounded-lg bg-[#0b1326] py-3 text-center">
                    <p className="text-2xl font-bold text-cyan-400">
                      {timeLeft?.days ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-400">Days</p>
                  </div>

                  <div className="rounded-lg bg-[#0b1326] py-3 text-center">
                    <p className="text-2xl font-bold text-cyan-400">
                      {timeLeft?.hours ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-400">Hours</p>
                  </div>

                  <div className="rounded-lg bg-[#0b1326] py-3 text-center">
                    <p className="text-2xl font-bold text-cyan-400">
                      {timeLeft?.minutes ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-400">Minutes</p>
                  </div>

                  <div className="rounded-lg bg-[#0b1326] py-3 text-center">
                    <p className="text-2xl font-bold text-cyan-400">
                      {timeLeft?.seconds ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-400">Seconds</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CalendarDays
                  className="mx-auto text-slate-500 mb-2"
                  size={30}
                />

                <h2 className="text-lg font-semibold text-white">
                  No Upcoming Events
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  There are currently no scheduled lab events.
                </p>
              </div>
            )}
          </div>

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
          {/* <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"> */}
          {/* <section className="rounded-xl border border-[#3c494c] bg-[#171f33] p-6">
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
            </section> */}

          {/* <section className="rounded-xl border border-[#3c494c] bg-[#171f33] p-6">
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
            </section> */}
          {/* </div> */}

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
