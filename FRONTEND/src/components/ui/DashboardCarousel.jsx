// ==========================================
// 1. components/ui/DashboardCarousel.jsx
// ==========================================
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardCarousel({
  nextEvent,
  timeLeft,
  dashboard,
}) {
  const slides = [];

  if (nextEvent) {
    slides.push({
      id: "event",
      icon: CalendarDays,
      title: nextEvent.event_name,
      subtitle: "Upcoming Event",
      color: "text-cyan-600",
      description:
        `${timeLeft?.days ?? 0}d ${timeLeft?.hours ?? 0}h ${timeLeft?.minutes ?? 0}m ${timeLeft?.seconds ?? 0}s remaining`,
    });
  }

  slides.push({
    id: "pending",
    icon: ClipboardList,
    title: `${dashboard?.pendingRequests || 0} Pending Requests`,
    subtitle: "Awaiting Lab Approval",
    color: "text-amber-600",
    description: "Your team's requests waiting for approval.",
  });

  slides.push({
    id: "issued",
    icon: CheckCircle2,
    title: `${dashboard?.issuedComponents || 0} Components Issued`,
    subtitle: "Currently with Team",
    color: "text-green-600",
    description: "Components currently issued to your team.",
  });

  slides.push({
    id: "returned",
    icon: RotateCcw,
    title: `${dashboard?.returnedComponents || 0} Components Returned`,
    subtitle: "Successfully Returned",
    color: "text-purple-600",
    description: "Components already returned to the lab.",
  });

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[index];
  const Icon = slide.icon;

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-5 p-6"
        >
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-4">
            <Icon className={slide.color} size={30} />
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-slate-400">{slide.subtitle}</p>

            <h2 className="mt-1 text-2xl font-bold text-[#111827]">
              {slide.title}
            </h2>

            <p className="mt-2 text-sm text-[#4B5563]">
              {slide.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? "w-8 bg-[#2563EB]"
                : "w-2 bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}