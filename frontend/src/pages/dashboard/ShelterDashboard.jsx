import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyShelter } from '../../api/shelterApi'
import { readApiError } from '../../utils/errors'
import { formatDateTime } from '../../utils/dates'
import StatusBadge from '../../components/StatusBadge'
import '../../styles/Dashboard.css'

export default function ShelterDashboard() {
  const [shelter, setShelter] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getMyShelter().then(setShelter).catch((err) => setMessage(readApiError(err).message))
  }, [])

  const verified = shelter?.verificationStatus === 'VERIFIED'

  return (
    <div className="page-wide">
      <h1>{shelter ? shelter.organizationName : 'Shelter dashboard'}</h1>
      {message && <div className="alert alert-error" role="alert">{message}</div>}

      {shelter && (
        <section className="list-item">
          <div className="list-item-header">
            <h2>Verification</h2>
            <StatusBadge status={shelter.verificationStatus} />
          </div>
          {shelter.verificationStatus === 'PENDING' && (
            <p>An administrator is reviewing your registration. You can publish pet listings once it is verified.</p>
          )}
          {verified && <p>Verified on {formatDateTime(shelter.verifiedAt)}. You can publish pet listings.</p>}
          {shelter.verificationStatus === 'REJECTED' && (
            <p>Your registration was not approved. Reason: {shelter.rejectionReason}</p>
          )}
        </section>
      )}

      <div className="dash-grid">
        <div className="dash-tile disabled">
          <h2>Pet listings</h2>
          <p>{verified ? 'Add and manage your pets.' : 'Available after verification (FR-011).'} <em>Coming in Feature 2.</em></p>
        </div>
        <div className="dash-tile disabled">
          <h2>Applications received</h2>
          <p>Review adoption applications. <em>Coming in Feature 4.</em></p>
        </div>
        <Link to="/account" className="dash-tile">
          <h2>My account</h2>
          <p>View your contact details.</p>
        </Link>
      </div>
    </div>
  )
}