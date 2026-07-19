import { useEffect, useState } from "react";
import { Bell, UserCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTopbarData } from "../../services/topbarApi";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await getTopbarData();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-[#E5E7EB] shadow-sm px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
      
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] transition lg:hidden shrink-0"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-lg font-bold text-[#111827] truncate tracking-tight">
            LABTRACK
          </h2>
          <p className="text-[9px] sm:text-xs text-[#6B7280] tracking-wider truncate">
            BML MUNJAL UNIVERSITY
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        
        <button
          onClick={() => navigate("/student/notifications")}
          className="relative p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] transition shrink-0 group"
        >
          <Bell size={16} className="text-[#6B7280] group-hover:text-[#111827] sm:h-[18px] sm:w-[18px]" />
          {user?.unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] rounded-full bg-[#EF4444] text-white text-[9px] sm:text-[10px] flex items-center justify-center font-bold px-1">
              {user.unreadNotifications}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 sm:gap-2 text-left rounded-lg border border-[#E5E7EB] bg-white px-2 py-1.5 sm:px-3 sm:py-2 hover:bg-[#F8FAFC] transition focus:outline-none group"
          >
            <UserCircle
              size={28}
              className={`sm:h-9 sm:w-9 shrink-0 transition ${
                showProfileMenu
                  ? "text-[#2563EB]"
                  : "text-[#6B7280] group-hover:text-[#111827]"
              }`}
            />
            
            <div className="hidden sm:block min-w-0 max-w-[120px] md:max-w-[180px]">
              <p className="text-xs sm:text-sm font-semibold text-[#111827] truncate">
                {user?.full_name || "Loading..."}
              </p>
              {user?.role && (
                <p className="text-[10px] sm:text-xs text-[#6B7280] capitalize truncate">
                  {user.role}
                </p>
              )}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3.5 w-44 sm:w-48 rounded-xl border border-[#E5E7EB] bg-white shadow-lg p-1.5 z-40">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/student/settings");
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-[#111827] hover:bg-[#F8FAFC] transition"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-[#EF4444] hover:bg-[#EFF6FF] transition border-t border-[#E5E7EB] mt-1 pt-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}