import { useEffect, useState } from 'react'
import { listShelters, decideShelter } from '../../api/adminApi'
import { readApiError } from '../../utils/errors'
import { formatDateTime } from '../../utils/dates'
import StatusBadge from '../../components/StatusBadge'
import '../../styles/ShelterVerification.css'

const TABS = ['PENDING', 'VERIFIED', 'REJECTED']

export default function ShelterVerification() {
  const [status, setStatus] = useState('PENDING')
  const [reloadKey, setReloadKey] = useState(0)
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [rejectingId, setRejectingId] = useState(null)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')

  useEffect(() => {
    setLoading(true)
    setMessage('')
    listShelters(status)
      .then(setShelters)
      .catch((err) => setMessage(readApiError(err).message))
      .finally(() => setLoading(false))
  }, [status, reloadKey])

  async function handleVerify(id) {
    try {
      await decideShelter(id, { decision: 'VERIFIED' })
      setReloadKey((k) => k + 1)
    } catch (err) {
      setMessage(readApiError(err).message)
    }
  }

  async function handleReject(id) {
    try {
      await decideShelter(id, { decision: 'REJECTED', reason })
      setRejectingId(null)
      setReason('')
      setReasonError('')
      setReloadKey((k) => k + 1)
    } catch (err) {
      const { message, errors } = readApiError(err)
      setReasonError(errors.reason ?? message)
    }
  }

  return (
    <div className="page-wide">
      <h1>Shelter registrations</h1>

      <div className="tabs" role="group" aria-label="Filter by status">
        {TABS.map((tab) => (
          <button key={tab} type="button" aria-pressed={status === tab}
                  className={status === tab ? 'tab active' : 'tab'}
                  onClick={() => setStatus(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {message && <div className="alert alert-error" role="alert">{message}</div>}
      {loading && <p>Loading…</p>}
      {!loading && shelters.length === 0 && <p>No {status.toLowerCase()} shelters.</p>}

      {shelters.map((s) => (
        <article key={s.shelterId} className="list-item">
          <div className="list-item-header">
            <h2>{s.organizationName}</h2>
            <StatusBadge status={s.verificationStatus} />
          </div>
          <dl className="details">
            <dt>Type</dt><dd>{s.organizationType === 'RESCUER' ? 'Independent rescuer' : 'Shelter'}</dd>
            <dt>Contact person</dt><dd>{s.contactPerson}</dd>
            <dt>Email</dt><dd>{s.email}</dd>
            <dt>Phone</dt><dd>{s.contactNumber}</dd>
            <dt>Address</dt><dd>{s.address}</dd>
            {s.description && (<><dt>About</dt><dd>{s.description}</dd></>)}
            <dt>Registered</dt><dd>{formatDateTime(s.createdAt)}</dd>
            {s.verifiedAt && (<><dt>Reviewed</dt><dd>{formatDateTime(s.verifiedAt)}</dd></>)}
            {s.rejectionReason && (<><dt>Rejection reason</dt><dd>{s.rejectionReason}</dd></>)}
          </dl>

          {s.verificationStatus === 'PENDING' && rejectingId !== s.shelterId && (
            <div className="actions">
              <button type="button" className="btn" onClick={() => handleVerify(s.shelterId)}>Verify</button>
              <button type="button" className="btn-secondary"
                      onClick={() => { setRejectingId(s.shelterId); setReason(''); setReasonError('') }}>
                Reject
              </button>
            </div>
          )}

          {rejectingId === s.shelterId && (
            <div className="form-field">
              <label htmlFor={`reason-${s.shelterId}`}>Reason for rejection</label>
              <textarea id={`reason-${s.shelterId}`} rows={3} maxLength={500}
                        value={reason} onChange={(e) => setReason(e.target.value)}
                        className={reasonError ? 'input-error' : ''} />
              {reasonError && <span className="field-error">{reasonError}</span>}
              <div className="actions">
                <button type="button" className="btn" onClick={() => handleReject(s.shelterId)}>Confirm rejection</button>
                <button type="button" className="btn-secondary" onClick={() => setRejectingId(null)}>Cancel</button>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}