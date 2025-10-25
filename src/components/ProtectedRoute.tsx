
import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth()

  // Debug logging
  console.log('🔒 ProtectedRoute:', { isLoaded, isSignedIn })

  // Show loading while checking auth status
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    )
  }

  // Redirect to about page if not signed in
  if (!isSignedIn) {
    console.log('🔒 ProtectedRoute: Redirecting to /about (not signed in)')
    return <Navigate to="/about" replace />
  }

  // User is signed in, show protected content
  return <>{children}</>
}

export default ProtectedRoute

