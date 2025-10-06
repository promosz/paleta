import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  
  const navigationItems = [
    { name: 'Dashboard', icon: '📊', href: '/dashboard' },
    { name: 'Analizy', icon: '📁', href: '/analysis' },
    { name: 'Reguły', icon: '⚙️', href: '/rules' },
    { name: 'Ustawienia', icon: '🔧', href: '/settings' },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-lg font-semibold text-neutral-800">
                Paleta
              </span>
            </div>
            
            {/* Close button for mobile */}
            <button 
              className="md:hidden p-1 text-neutral-600 hover:text-primary-500"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                        ${isActive 
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }
                      `}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <div className="text-xs text-neutral-500 text-center">
              Paleta v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
