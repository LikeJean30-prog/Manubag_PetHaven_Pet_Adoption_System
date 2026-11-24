import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PasswordField from '../../components/PasswordField'
import { resetPassword } from '../../api/authApi'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''

  const [form, setForm] = useState({ newPassword: '', confirmNewPassword: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    if (form.newPassword !== form.confirmNewPassword) {
      setErrors({ confirmNewPassword: 'New passwords do not match.' })
      return
    }

    setSaving(true)
    try {
      await resetPassword({ token, ...form })
      navigate('/login', { state: { passwordChanged: true } })
    } catch (err) {
      const data = err.response?.data
      const fieldErrors = data?.errors || {}
      setErrors(fieldErrors)
      setMessage(fieldErrors.token || data?.message || 'Could not reset your password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!token) {
    return (
      <div className="card">
        <h1>Reset password</h1>
        <div className="alert alert-error" role="alert">This reset link is missing or incomplete.</div>
        <p><Link to="/forgot-password">Request a new reset link</Link></p>
      </div>
    )
  }

  return (
    <div className="card">
      <h1>Reset password</h1>
      <p>Choose a new password for your account.</p>

      {message && (
        <div className="alert alert-error" role="alert">
          {message} {errors.token && <Link to="/forgot-password">Request a new link</Link>}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <PasswordField
          label="New password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
        />
        <PasswordField
          label="Confirm new password"
          name="confirmNewPassword"
          value={form.confirmNewPassword}
          onChange={handleChange}
          error={errors.confirmNewPassword}
        />
        <button type="submit" className="btn btn-full" disabled={saving}>
          {saving ? 'Saving…' : 'Reset password'}
        </button>
      </form>

      <p><Link to="/login">Back to Log in</Link></p>
    </div>
  )
}