import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn, clearSession, getRole, dashboardPath } from '../utils/auth'

export default function MainLayout() {
  useLocation()                     // re-draw the nav bar after login/logout
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()
  const role = getRole()

  function handleLogout() {
    clearSession()                  // FR-006: discard the token
    navigate('/login')
  }

  return (
    <>
      <header className="navbar">
        <Link to={loggedIn ? dashboardPath(role) : '/'} className="logo">Pet<span>Haven</span></Link>
        <nav className="nav-links" aria-label="Main">
          {loggedIn ? (
            <>
              <Link to={dashboardPath(role)}>Dashboard</Link>
              {role === 'ADOPTER' && <Link to="/">Find a Pet</Link>}
              {role === 'ADMIN' && <Link to="/admin/shelters">Shelters</Link>}
              <Link to="/account">My account</Link>
              <button type="button" className="btn-link" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/">Find a Pet</Link>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}