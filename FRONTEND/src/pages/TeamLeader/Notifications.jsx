import { Grab } from 'lucide-react'
import React from 'react'
import GroupLeaderLayout from '../../layouts/GroupLeaderLayout'

const Notifications = () => {
  return (
    <GroupLeaderLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <Grab className="text-[#22d3ee] mb-4" size={40} />
        <h1 className="text-3xl font-bold text-white">Notifications</h1>
        <p className="mt-2 text-sm text-[#bbc9cd]">
          This feature is currently under development. Please check back later.
        </p>
      </div>
    </GroupLeaderLayout>
  )
}

export default Notifications
