import { useEffect, useState } from "react";
import { Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTopbarData } from "../../services/topbarApi";

export default function Topbar() {
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
    <header className="h-20 bg-[#060e20] border-b border-[#222a3d] px-8 flex items-center justify-between sticky top-0 z-30">


      <div>
        <h2 className="text-lg font-semibold text-white">
          LABTRACK
        </h2>

        <p className="text-xs text-[#859397]">
          BML MUNJAL UNIVERSITY
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={() => navigate("/student/notifications")}
          className="relative p-2 rounded-lg bg-[#171f33] border border-[#222a3d] hover:border-cyan-400 transition"
        >
          <Bell size={18} className="text-[#bbc9cd]" />

          {user?.unreadNotifications > 0 && (
            <span
              className="
                absolute
                -top-1
                -right-1
                min-w-[18px]
                h-[18px]
                rounded-full
                bg-red-500
                text-white
                text-[10px]
                flex
                items-center
                justify-center
                font-bold
              "
            >
              {user.unreadNotifications}
            </span>
          )}
        </button>



        <div className="relative">

          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2"
          >
            <UserCircle
              size={36}
              className="text-cyan-400"
            />

            <div className="text-left">

              <p className="text-sm font-medium text-white">
                {user?.full_name || "Loading..."}
              </p>

              <p className="text-xs text-[#859397] capitalize">
                {user?.role || ""}
              </p>

            </div>
          </button>


          {showProfileMenu && (

            <div className="absolute right-0 mt-3 w-48 rounded-xl border border-cyan-500/20 bg-[#081122] shadow-xl p-2">

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/student/settings");
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-slate-300 hover:bg-white/5"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-white/5"
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