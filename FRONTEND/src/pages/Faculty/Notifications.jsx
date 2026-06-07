import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import ActionButton from "../../components/ui/ActionButton";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      title: "Project Review Reminder",
      message: "All teams must be ready for the upcoming project review.",
      audience: "All Students",
      priority: "Important",
      date: "10-06-2026",
      status: "Sent",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "All Students",
    priority: "Normal",
  });

  const handleSend = () => {
    if (!form.title || !form.message) return;

    const newNotification = {
      ...form,
      date: new Date().toLocaleDateString("en-GB"),
      status: "Sent",
    };

    setNotifications([newNotification, ...notifications]);

    setForm({
      title: "",
      message: "",
      audience: "All Students",
      priority: "Normal",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Notification Center"
          subtitle="Send notifications and view sent announcements"
        />

        <div className="rounded-2xl border border-cyan-500/20 bg-[#081122] p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Send Notification</h2>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="rounded-lg bg-[#050816] border border-cyan-500/20 px-4 py-3 text-white outline-none"
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
            >
              <option>All Students</option>
              <option>Team Alpha</option>
              <option>Team Beta</option>
              <option>Team Gamma</option>
            </select>

            <select
              className="rounded-lg bg-[#050816] border border-cyan-500/20 px-4 py-3 text-white outline-none"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Normal</option>
              <option>Important</option>
              <option>Urgent</option>
            </select>
          </div>

          <ActionButton text="Send Notification" onClick={handleSend} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Sent Notifications</h2>

          {notifications.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-cyan-500/20 bg-[#081122] p-5"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-slate-400 text-sm mt-2">{item.message}</p>
                </div>

                <span className="text-xs text-cyan-300">{item.status}</span>
              </div>

              <div className="flex gap-3 mt-4 text-xs text-slate-400">
                <span>{item.audience}</span>
                <span>•</span>
                <span>{item.priority}</span>
                <span>•</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;