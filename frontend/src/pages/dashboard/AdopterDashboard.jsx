import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMe } from '../../api/authApi'
import '../../styles/Dashboard.css'

export default function AdopterDashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => { getMe().then(setUser).catch(() => {}) }, [])

  return (
    <div className="page-wide">
      <h1>Welcome{user ? `, ${user.firstName}` : ''}!</h1>
      <p>Adopter dashboard</p>
      <div className="dash-grid">
        <Link to="/" className="dash-tile">
          <h2>Find a pet</h2>
          <p>Browse pets from verified shelters and rescuers.</p>
        </Link>
        <div className="dash-tile disabled">
          <h2>My applications</h2>
          <p>Track your adoption applications. <em>Coming in Feature 4.</em></p>
        </div>
        <div className="dash-tile disabled">
          <h2>Favorites</h2>
          <p>Pets you saved. <em>Coming in Feature 5.</em></p>
        </div>
        <Link to="/account" className="dash-tile">
          <h2>My account</h2>
          <p>View your profile details.</p>
        </Link>
      </div>
    </div>
  )
}