import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Sidebar({
  items,
  title,
  subtitle,
}) {
  const navigate = useNavigate();

  return (
    <aside className="w-72 bg-[#060e20] border-r border-[#222a3d] sticky top-0 h-screen">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-[#222a3d]">
          <h1 className="text-2xl font-bold text-[#22d3ee]">
            {title}
          </h1>

          <p className="text-xs text-[#859397] mt-1">
            {subtitle}
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border-l-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                      : "text-[#bbc9cd] hover:bg-[#171f33]"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-[#222a3d]">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#bbc9cd] hover:bg-[#171f33] transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}