import { useEffect, useState } from "react";
import {
  addEvent,
  deleteEvent,
  getEvents,
} from "../../services/eventService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import ActionButton from "../../components/ui/ActionButton";

function Events() {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();

  // Shows years from 10 years before to 10 years after current year.
  const yearOptions = Array.from(
    { length: 21 },
    (_, index) => currentYear - 10 + index
  );

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEvents();
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching events:", err);

      setError(
        err.response?.data?.message || "Failed to fetch events"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateEvent = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.date || !formData.time) {
      setError("Event title, date and time are required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await addEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time,
      });

      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
      });

      setShowCreateForm(false);
      await loadEvents();
    } catch (err) {
      console.error("Error creating event:", err);

      setError(
        err.response?.data?.message || "Failed to create event"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await deleteEvent(eventId);

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId)
      );
    } catch (err) {
      console.error("Error deleting event:", err);

      setError(
        err.response?.data?.message || "Failed to delete event"
      );
    }
  };

  const handleMonthChange = (event) => {
    const selectedMonth = Number(event.target.value);

    setCurrentMonth((current) => {
      return new Date(
        current.getFullYear(),
        selectedMonth,
        1
      );
    });
  };

  const handleYearChange = (event) => {
    const selectedYear = Number(event.target.value);

    setCurrentMonth((current) => {
      return new Date(
        selectedYear,
        current.getMonth(),
        1
      );
    });
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // Converts Sunday-first JavaScript indexing into Monday-first indexing.
  const firstDayOffset =
    (new Date(year, month, 1).getDay() + 6) % 7;

  const calendarCells = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    ),
  ];

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const eventDateValue =
        event.event_datetime ||
        event.eventDatetime ||
        event.date;

      if (!eventDateValue) {
        return false;
      }

      let eventDate;

      // Handles DD-MM-YYYY dates returned by the backend.
      if (
        typeof eventDateValue === "string" &&
        /^\d{2}-\d{2}-\d{4}$/.test(eventDateValue)
      ) {
        const [dateDay, dateMonth, dateYear] =
          eventDateValue.split("-").map(Number);

        eventDate = new Date(
          dateYear,
          dateMonth - 1,
          dateDay
        );
      } else {
        eventDate = new Date(eventDateValue);
      }

      if (Number.isNaN(eventDate.getTime())) {
        return false;
      }

      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month &&
        eventDate.getDate() === day
      );
    });
  };

  const isToday = (day) => {
    const today = new Date();

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const sortedEvents = [...events].sort((firstEvent, secondEvent) => {
    const getEventDate = (event) => {
      const value =
        event.event_datetime ||
        event.eventDatetime ||
        event.date;

      if (
        typeof value === "string" &&
        /^\d{2}-\d{2}-\d{4}$/.test(value)
      ) {
        const [day, dateMonth, dateYear] =
          value.split("-").map(Number);

        return new Date(
          dateYear,
          dateMonth - 1,
          day
        ).getTime();
      }

      const parsedDate = new Date(value).getTime();

      return Number.isNaN(parsedDate)
        ? Number.MAX_SAFE_INTEGER
        : parsedDate;
    };

    return getEventDate(firstEvent) - getEventDate(secondEvent);
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Events Calendar"
          subtitle="View upcoming project reviews, evaluations and faculty events"
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="calendar-month"
                className="text-sm font-medium text-[#4B5563]"
              >
                Month
              </label>

              <select
                id="calendar-month"
                value={month}
                onChange={handleMonthChange}
                className="cursor-pointer rounded-lg border border-[#D1D5DB] bg-white px-4 py-2.5 font-semibold text-[#111827] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              >
                {monthOptions.map((monthOption, index) => (
                  <option key={monthOption} value={index}>
                    {monthOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="calendar-year"
                className="text-sm font-medium text-[#4B5563]"
              >
                Year
              </label>

              <select
                id="calendar-year"
                value={year}
                onChange={handleYearChange}
                className="cursor-pointer rounded-lg border border-[#D1D5DB] bg-white px-4 py-2.5 font-semibold text-[#111827] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              >
                {yearOptions.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={goToCurrentMonth}
              className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2.5 font-semibold text-[#1E40AF] transition hover:bg-blue-100"
            >
              Today
            </button>
          </div>

          <ActionButton
            text={showCreateForm ? "Cancel" : "+ Create Event"}
            onClick={() =>
              setShowCreateForm((current) => !current)
            }
          />
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-sm">
          <h2 className="text-center text-2xl font-bold text-[#111827]">
            {monthName}
          </h2>
        </div>

        {showCreateForm && (
          <form
            onSubmit={handleCreateEvent}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm"
          >
            <h3 className="mb-5 text-xl font-semibold text-[#111827]">
              Create Event
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#4B5563]">
                  Event title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-[#111827] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4B5563]">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-[#111827] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4B5563]">
                  Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-[#111827] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#4B5563]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  className="min-h-28 w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-[#111827] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">
            <div className="min-w-[700px]">
              <div className="mb-4 grid grid-cols-7 gap-3 text-center text-sm font-medium text-[#6B7280]">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-[#6B7280]">
                  Loading events...
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-3">
                  {calendarCells.map((day, index) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="min-h-28 rounded-xl bg-[#F9FAFB]"
                        />
                      );
                    }

                    const dayEvents = getEventsForDay(day);
                    const today = isToday(day);

                    return (
                      <div
                        key={day}
                        className={`min-h-28 rounded-xl border p-3 transition ${
                          today
                            ? "border-[#2563EB] bg-blue-50 ring-2 ring-blue-100"
                            : dayEvents.length > 0
                              ? "border-[#BFDBFE] bg-[#EFF6FF]"
                              : "border-[#E5E7EB] bg-[#F8FAFC]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p
                            className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${
                              today
                                ? "bg-[#2563EB] text-white"
                                : "text-[#111827]"
                            }`}
                          >
                            {day}
                          </p>

                          {dayEvents.length > 0 && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 space-y-2">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="overflow-hidden rounded-lg border border-blue-100 bg-white p-2 shadow-sm"
                            >
                              <p className="break-words text-[11px] font-semibold leading-tight text-[#1E40AF]">
                                {event.title}
                              </p>

                              <p className="mt-1 text-[10px] text-[#6B7280]">
                                {event.time}
                              </p>
                            </div>
                          ))}

                          {dayEvents.length > 2 && (
                            <p className="text-[10px] font-medium text-[#2563EB]">
                              +{dayEvents.length - 2} more
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-xl font-semibold text-[#111827]">
              Upcoming Events
            </h3>

            <div className="max-h-[650px] space-y-4 overflow-y-auto pr-1">
              {!loading && sortedEvents.length === 0 && (
                <p className="text-sm text-[#6B7280]">
                  No events have been created yet.
                </p>
              )}

              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-[#1E40AF]">
                        {event.title}
                      </p>

                      <p className="mt-1 text-sm text-[#4B5563]">
                        {event.date} at {event.time}
                      </p>

                      {event.description && (
                        <p className="mt-2 break-words text-sm text-[#6B7280]">
                          {event.description}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-[#6B7280]">
                        Created by:{" "}
                        {event.created_by_name ||
                          event.createdByName ||
                          "Faculty"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Events;
