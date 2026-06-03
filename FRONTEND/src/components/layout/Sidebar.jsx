import {
  LayoutDashboard,
  Brain,
  Users,
  Archive,
  Shield,
  Bell,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Intelligence",
    icon: Brain,
  },
  {
    label: "Faculty",
    icon: Users,
  },
  {
    label: "Archives",
    icon: Archive,
  },
  {
    label: "Security",
    icon: Shield,
  },
  {
    label: "Notices",
    icon: Bell,
  },
];

function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#050816] border-r border-cyan-500/20 text-white p-5">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-cyan-400">
          LABTRACK
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Command Interface
        </p>
      </div>

      <nav className="space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                item.active
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;