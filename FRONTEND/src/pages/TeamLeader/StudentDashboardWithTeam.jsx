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
import DashboardCarousel from "../../components/ui/DashboardCarousel";

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
        <div className="min-h-screen flex items-center justify-center text-[#111827]">
          <Loader2 className="animate-spin mr-3 text-[#2563EB]" />
          Loading Dashboard...
        </div>
      </GroupLeaderLayout>
    );
  }

  return (
    <GroupLeaderLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-8 text-[#4B5563]">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-[#2563EB]">
              Student Dashboard
            </p>

            <h1 className="text-3xl font-bold text-[#111827]">
              Welcome back, {user?.full_name || "Student"}
            </h1>

            <p className="mt-2 text-[#4B5563]">
              Track your team’s component requests, issued items, and return
              activity.
            </p>
          </div>

          <DashboardCarousel
            nextEvent={nextEvent}
            timeLeft={timeLeft}
            dashboard={dashboard}
          />

         

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
  {stats.map((stat) => {
    const Icon = stat.icon;

    return (
      <div
        key={stat.label}
        className="group relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between min-h-[160px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {stat.label}
            </p>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
              {stat.value}
            </p>
          </div>
          
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white shrink-0">
            <Icon size={22} />
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
          {stat.description}
        </p>
      </div>
    );
  })}
</div>

          <section className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg border border-[#2563EB]/20 bg-[#EFF6FF] p-2.5">
                <Package className="text-[#2563EB]" size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-[#111827]">
                  Recent Component Activity
                </h2>
                <p className="text-sm text-[#4B5563]">
                  Recent requests, issues, and returns from your team.
                </p>
              </div>
            </div>

            {dashboard?.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recentActivity.map((item) => (
                  <div
                    key={item.request_item_id}
                    className="flex items-center justify-between border border-[#E5E7EB] rounded-lg p-4 bg-[#F8FAFC]"
                  >
                    <div>
                      <p className="font-semibold text-[#111827]">
                        {item.component_name}
                      </p>

                      <p className="text-sm text-[#6B7280]">
                        Quantity : {item.quantity}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "approved"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : item.status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : item.status === "rejected"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#D1D5DB] bg-[#F8FAFC] p-8 text-center">
                <Package className="mx-auto mb-3 text-[#6B7280]" size={28} />

                <p className="font-medium text-[#111827]">
                  No component activity yet
                </p>

                <p className="mt-1 text-sm text-[#6B7280]">
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