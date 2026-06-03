import { Search, Bell, UserCircle } from "lucide-react";

function Topbar() {
  return (
    <header className="h-20 bg-[#050816] border-b border-cyan-500/20 text-white px-8 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">
          LABTRACK 
        </h2>
        <p className="text-xs text-slate-500">
          BML MUNJAL UNIVERSITY
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-2 bg-[#0b1020] border border-white/10 rounded-xl px-4 py-2 w-80">
          <Search size={16} className="text-slate-500" />
          <input
            placeholder="Search systems, reports..."
            className="bg-transparent outline-none text-sm text-slate-300 w-full"
          />
        </div>

        <button className="relative p-2 rounded-xl bg-white/5 border border-white/10">
          <Bell size={18} className="text-slate-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <UserCircle size={30} className="text-cyan-400" />
          <div className="hidden md:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-slate-500">System Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;