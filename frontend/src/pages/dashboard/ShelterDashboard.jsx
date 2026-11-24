import { useEffect, useState } from 'react'
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

  return (
    <div className="page-wide">
      <h1>Welcome{shelter ? `, ${shelter.organizationName}` : ''}!</h1>
      <p>Dashboard</p>
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
          {shelter.verificationStatus === 'VERIFIED' && (
            <p>Verified on {formatDateTime(shelter.verifiedAt)}. You can publish pet listings.</p>
          )}
          {shelter.verificationStatus === 'REJECTED' && (
            <p>Your registration was not approved. Reason: {shelter.rejectionReason}</p>
          )}
        </section>
      )}
    </div>
  )
}