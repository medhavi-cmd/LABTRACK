import { useState } from "react";
import { Bell, Search, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    "Project review scheduled for 15 June",
    "2 component requests are pending",
    "Gallery approval required for Team Alpha",
  ];

  return (
    <header className="h-20 bg-[#060e20] border-b border-[#222a3d] px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-semibold text-white">LABTRACK</h2>
        <p className="text-xs text-[#859397]">BML MUNJAL UNIVERSITY</p>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="hidden lg:flex items-center gap-2 bg-[#171f33] border border-[#222a3d] rounded-lg px-4 py-2 w-[420px]">
          <Search size={16} className="text-[#859397]" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-white w-full"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-lg bg-[#171f33] border border-[#222a3d]"
          >
            <Bell size={18} className="text-[#bbc9cd]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#22d3ee] rounded-full animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl border border-cyan-500/20 bg-[#081122] shadow-xl p-4 z-50">
              <h3 className="text-white font-semibold mb-3">Notifications</h3>

              <div className="space-y-3">
                {notifications.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-[#050816] border border-white/10 p-3"
                  >
                    <p className="text-sm text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2"
          >
            <UserCircle size={34} className="text-[#22d3ee]" />

            <div className="text-left">
              <p className="text-sm text-white">Dr.Faculty</p>
              <p className="text-xs text-[#859397]">Project Supervisor</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 rounded-xl border border-cyan-500/20 bg-[#081122] shadow-xl p-2 z-50">
              <button
                onClick={() => alert("Profile page will be added later")}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-slate-300 hover:bg-white/5"
              >
                My Profile
              </button>

              <button
                onClick={() => navigate("/login")}
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