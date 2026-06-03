// src/components/layout/Sidebar.jsx

import { NavLink } from "react-router-dom";

export default function Sidebar({
  items,
  title,
  subtitle,
}) {
  return (
    <aside className="w-72 bg-[#060e20] border-r border-[#222a3d]">
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
                    ? "bg-cyan-500/10 border-l-4 border-cyan-400 text-cyan-300"
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
    </aside>
  );
}