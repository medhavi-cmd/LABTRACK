import React from 'react'
import GroupLeaderLayout from '../../layouts/GroupLeaderLayout'

const ProjectGallery = () => {
  return (
    <GroupLeaderLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-white">Project Gallery</h1>
        <p className="mt-2 text-sm text-[#bbc9cd]">
          Showcase project milestones, photos, videos, and achievements.
        </p>
      </div>
    </GroupLeaderLayout>
  )
}

export default ProjectGallery
