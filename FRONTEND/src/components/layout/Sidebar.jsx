import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Sidebar({ items, isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white border-r border-[#E5E7EB] shadow-sm h-screen transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="h-20 sm:h-28 border-b border-[#E5E7EB] flex items-center justify-between lg:justify-center px-4 shrink-0">
          <img
            src={logo}
            alt="LABTRACK"
            className="h-14 sm:h-20 w-auto object-contain mx-auto lg:mx-0"
          />
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#1E40AF] border-l-4 border-[#BFDBFE]"
                      : "text-[#4B5563] hover:bg-[#F8FAFC] hover:text-[#111827]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`shrink-0 ${
                        isActive ? "text-[#2563EB]" : "text-[#6B7280]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E5E7EB] shrink-0">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              onClose();

              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#4B5563] hover:bg-[#F8FAFC] hover:text-[#111827] transition"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
