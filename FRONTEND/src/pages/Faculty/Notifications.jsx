import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import ActionButton from "../../components/ui/ActionButton";
import StatCard from "../../components/ui/StatCard";
import {
  getNotifications,
  createNotification,
  archiveNotification,
  deleteNotification,
} from "../../services/facultyNotificationService";

const INITIAL_FORM = {
  title: "",
  message: "",
  sourceType: "all_students",
};

const getAudienceLabel = (sourceType) => {
  if (sourceType === "all_students") {
    return "All Students";
  }

  if (sourceType === "faculty_teams") {
    return "My Assigned Teams";
  }

  if (sourceType === "team") {
    return "Specific Team";
  }

  return "Students";
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
  });

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      setNotifications(response.data.notifications || []);

      setStats(
        response.data.stats || {
          total: 0,
          active: 0,
          archived: 0,
        }
      );
    } catch (err) {
      console.error("Error loading faculty notifications:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const title = form.title.trim();
    const message = form.message.trim();

    if (!title || !message) {
      setError("Notification title and message are required.");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccessMessage("");

      await createNotification({
        title,
        message,
        sourceType: form.sourceType,
        sourceId: null,
      });

      setForm(INITIAL_FORM);
      setSuccessMessage("Notification sent successfully.");

      await loadNotifications();
    } catch (err) {
      console.error("Error sending notification:", err);

      setError(
        err.response?.data?.message ||
          "Failed to send notification."
      );
    } finally {
      setSending(false);
    }
  };

  const handleArchive = async (id) => {
    try {
      setActionId(id);
      setError("");
      setSuccessMessage("");

      const response = await archiveNotification(id);
      const updatedNotification = response.data;

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                ...updatedNotification,
                isArchived: true,
              }
            : notification
        )
      );

      setStats((currentStats) => ({
        ...currentStats,
        active: Math.max(currentStats.active - 1, 0),
        archived: currentStats.archived + 1,
      }));

      setSuccessMessage("Notification archived successfully.");
    } catch (err) {
      console.error("Error archiving notification:", err);

      setError(
        err.response?.data?.message ||
          "Failed to archive notification."
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!shouldDelete) {
      return;
    }

    const notificationToDelete = notifications.find(
      (notification) => notification.id === id
    );

    try {
      setActionId(id);
      setError("");
      setSuccessMessage("");

      await deleteNotification(id);

      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) => notification.id !== id
        )
      );

      setStats((currentStats) => ({
        total: Math.max(currentStats.total - 1, 0),

        active:
          notificationToDelete &&
          !notificationToDelete.isArchived
            ? Math.max(currentStats.active - 1, 0)
            : currentStats.active,

        archived:
          notificationToDelete &&
          notificationToDelete.isArchived
            ? Math.max(currentStats.archived - 1, 0)
            : currentStats.archived,
      }));

      setSuccessMessage("Notification deleted successfully.");
    } catch (err) {
      console.error("Error deleting notification:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete notification."
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Notification Center"
          subtitle="Send, archive and manage faculty notifications"
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title="Total Notifications"
            value={stats.total}
            change="All notifications"
          />

          <StatCard
            title="Active"
            value={stats.active}
            change="Visible to students"
          />

          <StatCard
            title="Archived"
            value={stats.archived}
            change="Archived notifications"
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#111827]">
            Send Notification
          </h2>

          <input
            type="text"
            className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            placeholder="Notification title"
            value={form.title}
            onChange={(event) =>
              setForm((currentForm) => ({
                ...currentForm,
                title: event.target.value,
              }))
            }
          />

          <textarea
            className="min-h-28 w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            placeholder="Write notification message..."
            value={form.message}
            onChange={(event) =>
              setForm((currentForm) => ({
                ...currentForm,
                message: event.target.value,
              }))
            }
          />

          <select
            className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-[#111827] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            value={form.sourceType}
            onChange={(event) =>
              setForm((currentForm) => ({
                ...currentForm,
                sourceType: event.target.value,
              }))
            }
          >
            <option value="all_students">
              All Students
            </option>

            <option value="faculty_teams">
              My Assigned Teams
            </option>
          </select>

          <div>
            <ActionButton
              text={
                sending
                  ? "Sending..."
                  : "Send Notification"
              }
              onClick={handleSend}
              disabled={sending}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#111827]">
            Sent Notifications
          </h2>

          {loading ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-[#6B7280] shadow-sm">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-[#6B7280] shadow-sm">
              No notifications have been sent.
            </div>
          ) : (
            notifications.map((item) => {
              const status = item.isArchived
                ? "Archived"
                : "Active";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[#111827]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm text-[#6B7280]">
                        {item.message}
                      </p>
                    </div>

                    <span
                      className={`h-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                        item.isArchived
                          ? "border-gray-200 bg-gray-50 text-gray-600"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#6B7280]">
                    <span>
                      {getAudienceLabel(item.sourceType)}
                    </span>

                    <span>•</span>

                    <span>
                      {item.recipientCount || 0} recipients
                    </span>

                    <span>•</span>

                    <span>{formatDate(item.createdAt)}</span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    {!item.isArchived ? (
                      <ActionButton
                        text={
                          actionId === item.id
                            ? "Archiving..."
                            : "Archive"
                        }
                        onClick={() =>
                          handleArchive(item.id)
                        }
                        disabled={actionId === item.id}
                      />
                    ) : (
                      <span className="self-center text-sm text-[#6B7280]">
                        Already Archived
                      </span>
                    )}

                    <ActionButton
                      text={
                        actionId === item.id
                          ? "Please wait..."
                          : "Delete"
                      }
                      color="red"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      disabled={actionId === item.id}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
