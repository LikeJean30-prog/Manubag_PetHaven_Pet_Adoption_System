import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMe } from '../../api/authApi'
import { listShelters } from '../../api/adminApi'
import { readApiError } from '../../utils/errors'
import '../../styles/Dashboard.css'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [counts, setCounts] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getMe().then(setUser).catch(() => {})
    Promise.all([listShelters('PENDING'), listShelters('VERIFIED'), listShelters('REJECTED')])
      .then(([p, v, r]) => setCounts({ pending: p.length, verified: v.length, rejected: r.length }))
      .catch((err) => setMessage(readApiError(err).message))
  }, [])

  return (
    <div className="page-wide">
      <h1>Welcome{user ? `, ${user.firstName}` : ''}!</h1>
      <p>Dashboard</p>
      {message && <div className="alert alert-error" role="alert">{message}</div>}

      <div className="dash-grid">
        <Link to="/admin/shelters" className="dash-tile">
          <h2>Pending shelters</h2>
          <p className="dash-stat">{counts ? counts.pending : '…'}</p>
          <p>Review and verify new registrations.</p>
        </Link>
        <div className="dash-tile">
          <h2>Verified shelters</h2>
          <p className="dash-stat">{counts ? counts.verified : '…'}</p>
        </div>
        <div className="dash-tile">
          <h2>Rejected shelters</h2>
          <p className="dash-stat">{counts ? counts.rejected : '…'}</p>
        </div>
      </div>
    </div>
  )
}