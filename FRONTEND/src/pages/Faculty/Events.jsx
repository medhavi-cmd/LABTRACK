import { useEffect, useState } from "react";
import { getEvents } from "../../services/eventService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import ActionButton from "../../components/ui/ActionButton";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const days = Array.from({ length: 30 }, (_, index) => index + 1);

  const getDayFromDate = (date) => {
    return Number(date.split("-")[0]);
  };

  const getEvent = (day) =>
    events.find((event) => getDayFromDate(event.date) === day);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Events Calendar"
          subtitle="View upcoming project reviews, evaluations and faculty events"
        />

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">June 2026</h2>
          <ActionButton text="+ Create Event" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-2xl border border-cyan-500/20 bg-[#081122] p-6">
            <div className="grid grid-cols-7 gap-3 text-center text-slate-400 text-sm mb-4">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {days.map((day) => {
                const event = getEvent(day);

                return (
                  <div
                    key={day}
                    className={`min-h-24 rounded-xl border p-3 ${
                      event
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-white/10 bg-[#050816]"
                    }`}
                  >
                    <p className="text-white font-semibold">{day}</p>

                    {event && (
                      <div className="mt-3 rounded-lg bg-cyan-500/20 p-2 overflow-hidden">
                        <p className="text-cyan-300 text-[11px] font-semibold leading-tight break-words">
                          {event.title}
                        </p>

                        <p className="text-slate-400 text-[11px] mt-1 leading-tight break-words">
                          {event.venue}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-[#081122] p-6">
            <h3 className="text-xl font-semibold text-white mb-5">
              Upcoming Events
            </h3>

            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-white/10 bg-[#050816] p-4"
                >
                  <p className="text-cyan-300 font-semibold">{event.title}</p>
                  <p className="text-slate-300 text-sm mt-1">{event.date}</p>
                  <p className="text-slate-500 text-sm">{event.venue}</p>
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