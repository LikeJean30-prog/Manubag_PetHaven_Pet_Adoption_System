import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/FormField'
import { forgotPassword } from '../../api/authApi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setErrors({})
    setSending(true)
    try {
      const data = await forgotPassword(email)
      setSent(data.message)
    } catch (err) {
      const data = err.response?.data
      setErrors(data?.errors || {})
      setMessage(data?.message || 'Could not send the reset link. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="card">
      <h1>Forgot password</h1>
      <p>Enter the email you registered with and we'll send you a link to reset your password.</p>

      {message && <div className="alert alert-error" role="alert">{message}</div>}

      {sent ? (
        <div className="alert alert-success" role="status">{sent}</div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <button type="submit" className="btn btn-full" disabled={sending}>
            {sending ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <p><Link to="/login">Back to Log in</Link></p>
    </div>
  )
}