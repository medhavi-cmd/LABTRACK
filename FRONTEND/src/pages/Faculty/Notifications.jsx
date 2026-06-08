import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import ActionButton from "../../components/ui/ActionButton";
import StatCard from "../../components/ui/StatCard";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Project Review Reminder",
      message: "All teams must be ready for the upcoming project review.",
      audience: "All Students",
      date: "10-06-2026",
      status: "Active",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "All Students",
  });

  const handleSend = () => {
    if (!form.title.trim() || !form.message.trim()) return;

    const newNotification = {
      id: Date.now(),
      ...form,
      date: new Date().toLocaleDateString("en-GB"),
      status: "Active",
    };

    setNotifications([newNotification, ...notifications]);

    setForm({
      title: "",
      message: "",
      audience: "All Students",
    });
  };

  const handleArchive = (id) => {
    setNotifications(
      notifications.map((item) =>
        item.id === id ? { ...item, status: "Archived" } : item
      )
    );
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((item) => item.id !== id));
  };

  const activeCount = notifications.filter(
    (item) => item.status === "Active"
  ).length;

  const archivedCount = notifications.filter(
    (item) => item.status === "Archived"
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Notification Center"
          subtitle="Send, archive and manage faculty notifications"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Notifications"
            value={notifications.length}
            change="All notifications"
          />

          <StatCard
            title="Active"
            value={activeCount}
            change="Visible to students"
          />

          <StatCard
            title="Archived"
            value={archivedCount}
            change="Hidden from students"
          />
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-[#081122] p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Send Notification
          </h2>

          <input
            className="w-full rounded-lg bg-[#050816] border border-cyan-500/20 px-4 py-3 text-white outline-none"
            placeholder="Notification title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="w-full rounded-lg bg-[#050816] border border-cyan-500/20 px-4 py-3 text-white outline-none min-h-28"
            placeholder="Write notification message..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <select
            className="w-full rounded-lg bg-[#050816] border border-cyan-500/20 px-4 py-3 text-white outline-none"
            value={form.audience}
            onChange={(e) => setForm({ ...form, audience: e.target.value })}
          >
            <option>All Students</option>
            <option>Team Alpha</option>
            <option>Team Beta</option>
            <option>Team Gamma</option>
          </select>

          <ActionButton text="Send Notification" onClick={handleSend} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Sent Notifications
          </h2>

          {notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-cyan-500/20 bg-[#081122] p-5"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-slate-400 text-sm mt-2">
                    {item.message}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold ${
                    item.status === "Active"
                      ? "text-cyan-300"
                      : "text-slate-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="flex gap-3 mt-4 text-xs text-slate-400">
                <span>{item.audience}</span>
                <span>•</span>
                <span>{item.date}</span>
              </div>

              <div className="flex gap-3 mt-5">
                {item.status === "Active" ? (
                  <ActionButton
                    text="Archive"
                    onClick={() => handleArchive(item.id)}
                  />
                ) : (
                  <span className="text-sm text-slate-500">
                    Already Archived
                  </span>
                )}

                <ActionButton
                  text="Delete"
                  color="red"
                  onClick={() => handleDelete(item.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;