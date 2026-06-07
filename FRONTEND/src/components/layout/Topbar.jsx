import { Bell, Search, UserCircle } from "lucide-react";

export default function Topbar() {
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

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 bg-[#171f33] border border-[#222a3d] rounded-lg px-4 py-2 w-[420px]">
          <Search size={16} className="text-[#859397]" />

          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-white w-full"
          />
        </div>

        <button className="relative p-2 rounded-lg bg-[#171f33] border border-[#222a3d]">
          <Bell size={18} className="text-[#bbc9cd]" />

          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#22d3ee] rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle
            size={34}
            className="text-[#22d3ee]"
          />

          <div>
            <p className="text-sm text-white">
              Dr.Faculty
            </p>

            <p className="text-xs text-[#859397]">
              Project Supervisor
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}