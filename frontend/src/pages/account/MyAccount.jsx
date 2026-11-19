import { useEffect, useState } from 'react'
import { getMe } from '../../api/authApi'
import { readApiError } from '../../utils/errors'

export default function MyAccount() {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => setMessage(readApiError(err).message))
  }, [])

  if (message) return <div className="card"><div className="alert alert-error" role="alert">{message}</div></div>
  if (!user) return <div className="card"><p>Loading…</p></div>

  return (
    <div className="card">
      <h1>My account</h1>
      <dl>
        <dt><strong>Name</strong></dt><dd>{user.firstName} {user.lastName}</dd>
        <dt><strong>Email</strong></dt><dd>{user.email}</dd>
        <dt><strong>Role</strong></dt><dd>{user.role}</dd>
        <dt><strong>Status</strong></dt><dd>{user.accountStatus}</dd>
      </dl>
    </div>
  )
}