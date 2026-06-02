import React from 'react'
import { FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'

const TopNavbar = ({ user = { name: 'abc', role: 'Lab Staff' } }) => {
  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Title */}
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lab Inventory Management System
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Managing laboratory components and resources
          </p>
        </div>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <FiSettings size={20} />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <FiUser className="text-white" size={20} />
            </div>

            {/* User Info */}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.role}
              </p>
            </div>

            {/* Logout Button */}
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNavbar
