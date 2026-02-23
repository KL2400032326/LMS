import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ allowedRole, children }) => {
  const { isAuthenticated, user } = useAuth()

  const storedRole = localStorage.getItem('userRole') || user?.role
  const token = localStorage.getItem('userToken') || localStorage.getItem('lms-token')

  if (!isAuthenticated || !token || !storedRole) {
    return <Navigate to="/" replace />
  }

  if (allowedRole && storedRole !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
