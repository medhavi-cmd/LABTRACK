import { Bell, Search, UserCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-20 bg-[#060e20] border-b border-[#222a3d] px-8 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Group Leader Workspace
        </h2>

        <p className="text-xs text-[#859397]">
          LabTrack 
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 bg-[#171f33] border border-[#222a3d] rounded-lg px-4 py-2 w-80">
          <Search size={16} className="text-[#859397]" />

          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-white w-full"
          />
        </div>

        <button className="relative p-2 rounded-lg bg-[#171f33] border border-[#222a3d]">
          <Bell size={18} className="text-[#bbc9cd]" />

          <span className="absolute top-1 right-1 w-2 h-2 bg-[#22d3ee] rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle
            size={34}
            className="text-[#22d3ee]"
          />

          <div>
            <p className="text-sm text-white">
              John Doe
            </p>

            <p className="text-xs text-[#859397]">
              Group Leader
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}