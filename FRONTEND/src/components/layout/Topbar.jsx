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
    <header className="h-16 sm:h-20 bg-[#060e20] border-b border-[#222a3d] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
      
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg bg-[#171f33] border border-[#222a3d] text-[#bbc9cd] hover:border-cyan-400 transition lg:hidden shrink-0"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-lg font-bold text-white truncate tracking-tight">
            LABTRACK
          </h2>
          <p className="text-[9px] sm:text-xs text-[#859397] tracking-wider truncate">
            BML MUNJAL UNIVERSITY
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        
        <button
          onClick={() => navigate("/student/notifications")}
          className="relative p-2 rounded-lg bg-[#171f33] border border-[#222a3d] hover:border-cyan-400 transition shrink-0"
        >
          <Bell size={16} className="text-[#bbc9cd] sm:h-[18px] sm:w-[18px]" />
          {user?.unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] rounded-full bg-red-500 text-white text-[9px] sm:text-[10px] flex items-center justify-center font-bold px-1">
              {user.unreadNotifications}
            </span>
          )}
        </button>

   
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 sm:gap-2 text-left focus:outline-none"
          >
            <UserCircle size={28} className="text-cyan-400 sm:h-9 sm:w-9 shrink-0" />
            
          
            <div className="hidden sm:block min-w-0 max-w-[120px] md:max-w-[180px]">
              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {user?.full_name || "Loading..."}
              </p>
              {user?.role && (
                <p className="text-[10px] sm:text-xs text-[#859397] capitalize truncate">
                  {user.role}
                </p>
              )}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3.5 w-44 sm:w-48 rounded-xl border border-cyan-500/20 bg-[#081122] shadow-xl p-1.5 z-40">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/student/settings");
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-slate-300 hover:bg-white/5 transition"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-red-400 hover:bg-white/5 transition border-t border-slate-800/60 mt-1 pt-2"
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