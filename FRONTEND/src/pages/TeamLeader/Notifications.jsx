import { Grab } from 'lucide-react'
import React from 'react'
import GroupLeaderLayout from '../../layouts/GroupLeaderLayout'

const Notifications = () => {
  return (
    <GroupLeaderLayout>
      <div className="w-full min-h-[85vh] bg-slate-50 flex flex-col items-center justify-center text-slate-600 px-4 text-center font-sans">
        <Grab className="text-cyan-600 mb-4 animate-bounce" size={44} />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed font-medium">
          This feature is currently under development. Please check back later.
        </p>
      </div>
    </GroupLeaderLayout>
  );
};

export default Notifications;

