import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField'
import { registerAdopter } from '../../api/authApi'
import { readApiError } from '../../utils/errors'

const emptyForm = {
  firstName: '', lastName: '', email: '', phoneNumber: '', password: '', privacyConsent: false,
}

export default function RegisterAdopter() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const update = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    setMessage('')
    try {
      await registerAdopter(form)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      const { message, errors } = readApiError(err)
      setMessage(message)
      setErrors(errors)            // FR-001: field-level errors
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h1>Create an adopter account</h1>
      {message && <div className="alert alert-error" role="alert">{message}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <FormField id="firstName" label="First name" autoComplete="given-name"
                   value={form.firstName} onChange={update} error={errors.firstName} />
        <FormField id="lastName" label="Last name" autoComplete="family-name"
                   value={form.lastName} onChange={update} error={errors.lastName} />
        <FormField id="email" label="Email" type="email" autoComplete="email"
                   value={form.email} onChange={update} error={errors.email} />
        <FormField id="phoneNumber" label="Phone number" type="tel" autoComplete="tel"
                   value={form.phoneNumber} onChange={update} error={errors.phoneNumber} />
        <FormField id="password" label="Password" type="password" autoComplete="new-password"
                   hint="At least 8 characters, with a letter and a number."
                   value={form.password} onChange={update} error={errors.password} />

        <div className="form-field checkbox-field">
          <label htmlFor="privacyConsent">
            <input id="privacyConsent" name="privacyConsent" type="checkbox"
                   checked={form.privacyConsent} onChange={update}
                   aria-describedby={errors.privacyConsent ? 'privacyConsent-error' : undefined} />
            <span>
              I agree to the privacy notice. PetHaven collects only the details needed for adoption,
              under the Data Privacy Act of 2012 (RA 10173).
            </span>
          </label>
          {errors.privacyConsent && (
            <span id="privacyConsent-error" className="field-error">{errors.privacyConsent}</span>
          )}
        </div>

        <button type="submit" className="btn btn-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  )
}