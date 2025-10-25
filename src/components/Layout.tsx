
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FileSpreadsheet, Settings, BarChart3, Info, LogIn, UserPlus } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  // Public navigation items (zawsze widoczne)
  const publicNavItems = [
    { path: '/about', label: 'O aplikacji', icon: Info },
  ]

  // Protected navigation items (tylko dla zalogowanych)
  const protectedNavItems = [
    { path: location.pathname.startsWith('/paleta') ? '/paleta/dashboard' : '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: location.pathname.startsWith('/paleta') ? '/paleta/analysis' : '/analysis', label: 'Analizator palet', icon: FileSpreadsheet },
    { path: location.pathname.startsWith('/paleta') ? '/paleta/settings' : '/settings', label: 'Ustawienia', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - kliknięcie prowadzi do landing page */}
            <button 
              onClick={() => navigate(location.pathname.startsWith('/paleta') ? '/paleta' : '/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">P</span>
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PalletAI
              </h1>
            </button>
            
            <nav className="flex items-center space-x-4">
              {/* Show protected nav items only when signed in */}
              {isSignedIn && (
                <>
                  {protectedNavItems.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === path
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </>
              )}
              
              {/* Always show public nav items */}
              {publicNavItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {/* Clerk Authentication Buttons */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                      <LogIn className="h-4 w-4" />
                      <span>Zaloguj się</span>
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                      <UserPlus className="h-4 w-4" />
                      <span>Zarejestruj się</span>
                    </button>
                  </SignUpButton>
                </SignedOut>
                
                <SignedIn>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </SignedIn>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout