import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Sidebar({ items }) {
  const navigate = useNavigate();

  return (
    <aside className="w-72 bg-[#060e20] border-r border-[#222a3d] sticky top-0 h-screen">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="h-28 border-b border-[#222a3d] flex items-center justify-center px-4">
          <img
            src={logo}
            alt="LABTRACK"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
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
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#222a3d]">
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
