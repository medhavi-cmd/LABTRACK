import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  PackageCheck,
  CalendarDays,
  Bell,
  Images,
  TrendingUp,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/faculty/dashboard",
  },
  {
    label: "Project Approvals",
    icon: CheckSquare,
    path: "/faculty/project-approvals",
  },
  {
    label: "Component Requests",
    icon: PackageCheck,
    path: "/faculty/component-requests",
  },
  {
    label: "Events",
    icon: CalendarDays,
    path: "/faculty/events",
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/faculty/notifications",
  },
  {
    label: "Gallery Approvals",
    icon: Images,
    path: "/faculty/gallery-approvals",
  },
  {
    label: "Student Progress",
    icon: TrendingUp,
    path: "/faculty/student-progress",
  },
];

function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#050816] border-r border-cyan-500/20 text-white p-5">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-cyan-400">LABTRACK</h1>
        <p className="text-xs text-slate-400 mt-1">Faculty Module</p>
      </div>

      <nav className="space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;