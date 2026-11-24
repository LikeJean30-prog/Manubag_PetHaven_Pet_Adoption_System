import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getMe } from '../../api/authApi'
import { getMyShelter } from '../../api/shelterApi'
import { getRole } from '../../utils/auth'
import { readApiError } from '../../utils/errors'
import { formatDateTime } from '../../utils/dates'
import StatusBadge from '../../components/StatusBadge'
import '../../styles/MyAccount.css'

export default function MyAccount() {
  const role = getRole()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [shelter, setShelter] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getMe().then(setUser).catch((err) => setMessage(readApiError(err).message))
    if (role === 'SHELTER') {
      getMyShelter().then(setShelter).catch((err) => setMessage(readApiError(err).message))
    }
  }, [role])

  if (message) return <div className="card"><div className="alert alert-error" role="alert">{message}</div></div>
  if (!user) return <div className="card"><p>Loading…</p></div>

  return (
    <div className="card">
      <h1>My account</h1>

      {location.state?.saved && (
        <div className="alert alert-success" role="status">Your profile has been updated.</div>
      )}

      <dl className="details">
        <dt>Name</dt><dd>{user.firstName} {user.lastName}</dd>
        <dt>Email</dt><dd>{user.email}</dd>
         <dt>Phone</dt><dd>{user.phoneNumber || '—'}</dd>   {/* (FR-007) */}
        <dt>Role</dt><dd>{user.role}</dd>
        <dt>Status</dt><dd>{user.accountStatus}</dd>
      </dl>

      {shelter && (
        <section className="status-panel">
          <h2>Shelter verification</h2>
          <p><strong>{shelter.organizationName}</strong> <StatusBadge status={shelter.verificationStatus} /></p>
          {shelter.verificationStatus === 'PENDING' && (
            <p>An administrator is reviewing your registration. You can publish pet listings once it is verified.</p>
          )}
          {shelter.verificationStatus === 'VERIFIED' && (
            <p>Verified on {formatDateTime(shelter.verifiedAt)}. You can now publish pet listings.</p>
          )}
          {shelter.verificationStatus === 'REJECTED' && (
            <p>Your registration was not approved. Reason: {shelter.rejectionReason}</p>
          )}

          {/*(FR-007) */}
          <dl className="details">
            <dt>Type</dt><dd>{shelter.organizationType}</dd>
            <dt>Contact</dt><dd>{shelter.contactNumber || '—'}</dd>
            <dt>Address</dt><dd>{shelter.address}</dd>
            <dt>Description</dt><dd>{shelter.description || '—'}</dd>
          </dl>
        </section>
      )}

      <div className="actions">
        <Link to="/account/edit" className="btn">Edit profile</Link>
        <Link to="/account/password" className="btn btn-secondary">Change password</Link>
      </div>

      {role === 'ADMIN' && (
        <p><Link to="/admin/shelters" className="btn">Review shelter registrations</Link></p>
      )}
    </div>
  )
}