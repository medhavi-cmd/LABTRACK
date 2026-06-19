import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

export default function GroupLeaderLayout({
  children,
}) {
  return (
    <div className="flex min-h-screen bg-[#0b1326]">
      <Sidebar
        items={SIDEBAR_CONFIG.groupLeader}
        title="LABTRACK"
        subtitle="Group Leader Portal"
      />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}