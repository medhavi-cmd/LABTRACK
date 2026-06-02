import React from 'react'
import { FiBox, FiCheckSquare, FiPackage, FiRotateCcw, FiAlertTriangle, FiTrendingUp, FiBell, FiSettings, FiMenu, FiX } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiBox, path: '/lab-staff/dashboard' },
    { id: 'inventory', label: 'Inventory Management', icon: FiPackage, path: '/lab-staff/inventory' },
    { id: 'requests', label: 'Component Requests', icon: FiCheckSquare, path: '/lab-staff/requests' },
    { id: 'issued', label: 'Issued Components', icon: FiTrendingUp, path: '/lab-staff/issued' },
    { id: 'returns', label: 'Return Management', icon: FiRotateCcw, path: '/lab-staff/returns' },
    { id: 'damage', label: 'Damage Reports', icon: FiAlertTriangle, path: '/lab-staff/damage' },
    { id: 'demand', label: 'Component Demand', icon: FiTrendingUp, path: '/lab-staff/demand' },
    { id: 'notifications', label: 'Notifications', icon: FiBell, path: '/lab-staff/notifications' },
    { id: 'settings', label: 'Settings', icon: FiSettings, path: '/lab-staff/settings' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 dark:bg-gray-950 text-white transition-transform duration-300 ease-in-out z-40 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="sticky top-0 bg-gray-950 p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiBox className="text-white" size={20} />
            </div>
            LabTrack
          </h1>
          <p className="text-xs text-gray-400 mt-2">Lab Staff Portal</p>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-950 border-t border-gray-800">

        </div>
      </aside>
    </>
  )
}

export default Sidebar
