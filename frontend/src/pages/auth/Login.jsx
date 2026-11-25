import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField'
import { login } from '../../api/authApi'
import { saveSession, dashboardPath } from '../../utils/auth'
import { readApiError } from '../../utils/errors'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const registeredAs = location.state?.registered

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    setMessage('')
    try {
      const result = await login(form)
      saveSession(result)
      navigate(dashboardPath(result.role))
    } catch (err) {
      const { message, errors } = readApiError(err)
      setMessage(message)          // FR-003: "Invalid email or password"
      setErrors(errors)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h1>Log in</h1>
      {registeredAs === 'ADOPTER' && !message && (
        <div className="alert alert-success" role="status">Account created. You can now log in.</div>
        )}
        {registeredAs === 'SHELTER' && !message && (
          <div className="alert alert-success" role="status">
            Registration received. An administrator will verify your shelter. You can log in to check its status.
            </div>
          )}
        {location.state?.passwordChanged && !message && (
        <div className="alert alert-success" role="status">
          Password changed. Please log in with your new password.
        </div>
      )}
          
      {message && <div className="alert alert-error" role="alert">{message}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <FormField id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={update} error={errors.email} />
        <FormField id="password" label="Password" type="password" autoComplete="current-password" value={form.password} onChange={update} error={errors.password} />
        <button type="submit" className="btn btn-full" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
        <p className="forgot-link">
            <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </form>

      <p>New to PetHaven? <Link to="/register">Create an account</Link></p>
    </div>
  )
}