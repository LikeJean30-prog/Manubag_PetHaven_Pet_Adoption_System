import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn, clearSession, getRole, dashboardPath } from '../utils/auth'
import logo from '../images/logo.png'
import '../styles/MainLayout.css'
import githubIcon from '../images/github.png'
//import facebookIcon from '../images/facebook.png'

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
        <Link to={loggedIn ? dashboardPath(role) : '/'} className="brand">
          <img src={logo} alt="" className="brand-logo" />
          <span className="brand-text">
            <span className="logo">Pet<span>Haven</span></span>
            <span className="tagline">Adopt. Care. Connect.</span>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {loggedIn ? (
            <>
              <Link to={dashboardPath(role)}>Dashboard</Link>
              {role === 'ADMIN' && <Link to="/admin/shelters">Shelters</Link>}
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

      //Footer Section
      <footer className="site-footer">
        <p>© 2026 PetHaven · Adopt. Care. Connect.</p>
        <div className="social">
          <span className="social-title">Social Media</span>
          <nav className="social-links" aria-label="Social media">
            <a href="https://github.com/LikeJean30-prog/Manubag_PetHaven_Pet_Adoption_System" target="_blank" rel="noopener noreferrer"> <img src={githubIcon} alt="PetHaven on GitHub" /></a>
          </nav>
        </div>
      </footer>
    </>
  )
}