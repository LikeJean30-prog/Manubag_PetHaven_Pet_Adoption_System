import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listShelters } from '../../api/adminApi'
import { readApiError } from '../../utils/errors'
import '../../styles/Dashboard.css'

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([listShelters('PENDING'), listShelters('VERIFIED'), listShelters('REJECTED')])
      .then(([p, v, r]) => setCounts({ pending: p.length, verified: v.length, rejected: r.length }))
      .catch((err) => setMessage(readApiError(err).message))
  }, [])

  return (
    <div className="page-wide">
      <h1>Administrator dashboard</h1>
      {message && <div className="alert alert-error" role="alert">{message}</div>}

      <div className="dash-grid">
        <Link to="/admin/shelters" className="dash-tile">
          <h2>Pending shelters</h2>
          <p className="dash-stat">{counts ? counts.pending : '…'}</p>
          <p>Review and verify new registrations (FR-054, FR-055).</p>
        </Link>
        <div className="dash-tile">
          <h2>Verified shelters</h2>
          <p className="dash-stat">{counts ? counts.verified : '…'}</p>
        </div>
        <div className="dash-tile">
          <h2>Rejected shelters</h2>
          <p className="dash-stat">{counts ? counts.rejected : '…'}</p>
        </div>
        <div className="dash-tile disabled">
          <h2>Listings and statistics</h2>
          <p>Moderation and adoption statistics. <em>Coming in Feature 8.</em></p>
        </div>
      </div>
    </div>
  )
}