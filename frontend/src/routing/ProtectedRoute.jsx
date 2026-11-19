import { Navigate, Outlet } from 'react-router-dom'
import { isLoggedIn, getRole } from '../utils/auth'

// Logged out → login page. Wrong role → home page (FR-004, on the website side)
export default function ProtectedRoute({ roles }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  if (roles && !roles.includes(getRole())) return <Navigate to="/" replace />
  return <Outlet />
}