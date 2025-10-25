
import { Link, useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Button } from '../ui'

interface HeaderProps {
  onNewAnalysis?: () => void
}

const Header: React.FC<HeaderProps> = ({ onNewAnalysis }) => {
  const navigate = useNavigate()

  const handleNewAnalysis = () => {
    if (onNewAnalysis) {
      onNewAnalysis()
    } else {
      navigate('/analysis')
    }
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-800">
                Paleta
              </h1>
              <p className="text-xs text-neutral-500">
                Analiza produktów
              </p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard"
              className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/analysis"
              className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Analizy
            </Link>
            <Link 
              to="/rules"
              className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Reguły
            </Link>
            <Link 
              to="/settings"
              className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Ustawienia
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            <SignedIn>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleNewAnalysis}
              >
                Nowa analiza
              </Button>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="secondary" size="sm">
                  Zaloguj się
                </Button>
              </SignInButton>
            </SignedOut>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-neutral-600 hover:text-primary-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
