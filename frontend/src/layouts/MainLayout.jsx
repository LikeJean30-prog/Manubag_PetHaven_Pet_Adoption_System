import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn, clearSession, getRole, dashboardPath } from '../utils/auth'
import { getMe } from '../api/authApi'
import logo from '../images/logo.png'
import githubIcon from '../images/github.png'
import '../styles/MainLayout.css'

const MENU = {
  ADOPTER: [
    { to: '/adopter', label: 'Home' },
    { label: 'Find a pet', soon: true },
    { label: 'Favorites', soon: true },
    { to: '/account', label: 'Profile' },
  ],
  SHELTER: [
    { to: '/shelter', label: 'Home' },
    { to: '/shelter/pets', label: 'My pets', end: false },
    { label: 'Applications', soon: true },
    { to: '/account', label: 'Profile' },
  ],
  ADMIN: [
    { to: '/admin', label: 'Home' },
    { to: '/admin/shelters', label: 'Shelters' },
    { to: '/account', label: 'Profile' },
  ],
}

function Brand({ to }) {
  return (
    <Link to={to} className="brand">
      <img src={logo} alt="" className="brand-logo" />
      <span className="brand-text">
        <span className="logo">Pet<span>Haven</span></span>
        <span className="tagline">Adopt. Care. Connect.</span>
      </span>
    </Link>
  )
}

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()
  const role = getRole()

  const [me, setMe] = useState(null)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!loggedIn) { setMe(null); return }
    getMe().then(setMe).catch(() => setMe(null))
  }, [loggedIn, location.pathname])

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  const initials = me
    ? `${me.firstName?.[0] || ''}${me.lastName?.[0] || ''}`.toUpperCase()
    : '?'

  const footer = (
    <footer className="site-footer">
      <p>© 2026 PetHaven</p>
      <div className="social">
        <span className="social-title">Social Media</span>
        <nav className="social-links" aria-label="Social media">
          <a href="https://github.com/LikeJean30-prog/Manubag_PetHaven_Pet_Adoption_System" target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="PetHaven on GitHub" />
          </a>
        </nav>
      </div>
    </footer>
  )

  if (!loggedIn) {
    return (
      <>
        <header className="navbar">
          <Brand to="/" />
          <nav className="nav-links" aria-label="Main">
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn">Register</Link>
          </nav>
        </header>
        <main className="container">
          <Outlet />
        </main>
        {footer}
      </>
    )
  }

  return (
    <>
      <div className="app-shell">
        <aside className="sidebar" aria-label="Sidebar">
          <div className="sidebar-brand">
            <Brand to={dashboardPath(role)} />
          </div>
          <nav>
            {(MENU[role] || []).map((item) =>
              item.soon ? (
                <span key={item.label} className="soon" title="Coming in a later increment">
                  {item.label}<small>Coming soon</small>
                </span>
              ) : (
                <NavLink key={item.label} to={item.to} end={item.end !== false}>
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
        </aside>

        <div className="app-content">
          <header className="navbar topbar">
            <div className="user-menu" ref={menuRef}>
              <button
                type="button"
                className="avatar-btn"
                onClick={() => setOpen(!open)}
                aria-label="Open account menu"
                aria-expanded={open}
              >
                {initials}
              </button>

              {open && (
                <div className="dropdown">
                  {me && (
                    <div className="dropdown-header">
                      <strong>{me.firstName} {me.lastName}</strong>
                      <small>{me.email}</small>
                    </div>
                  )}
                  <Link to="/account">Profile</Link>
                  <Link to="/account/password">Settings</Link>
                  <button type="button" onClick={handleLogout}>Log out</button>
                </div>
              )}
            </div>
          </header>

          <main className="app-main">
            <div className="container">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      {footer}
    </>
  )
}