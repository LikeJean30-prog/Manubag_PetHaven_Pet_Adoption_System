import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn, clearSession } from '../utils/auth'

export default function MainLayout() {
  useLocation()                     // re-draw the nav bar after login/logout
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  return (
    <>
      <header className="navbar">
        <Link to="/" className="logo">Pet<span>Haven</span></Link>
        <nav className="nav-links" aria-label="Main">
          <Link to="/">Find a Pet</Link>
          {loggedIn ? (
            <>
              <Link to="/account">My account</Link>
              <button type="button" className="btn-link" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
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