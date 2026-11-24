import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField'
import PasswordField from '../../components/PasswordField'
import { registerAdopter, registerShelter } from '../../api/authApi'
import { readApiError } from '../../utils/errors'
import '../../styles/Register.css' 

const sharedFields = {
  email: '', phoneNumber: '', password: '', confirmPassword: '', privacyConsent: false,
}
const emptyAdopter = { firstName: '', lastName: '', ...sharedFields }
const emptyShelter = {
  organizationName: '', organizationType: 'SHELTER',
  contactFirstName: '', contactLastName: '', address: '', description: '',
  ...sharedFields,
}

// Admin is not offered here: admin accounts are created by the system owner (A-05)
export default function Register() {
  const [role, setRole] = useState('ADOPTER')
  const [form, setForm] = useState(emptyAdopter)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function chooseRole(next) {
    setRole(next)
    setForm((prev) => ({
      ...(next === 'ADOPTER' ? emptyAdopter : emptyShelter),
      email: prev.email,
      phoneNumber: prev.phoneNumber,
      password: prev.password,
      confirmPassword: prev.confirmPassword,
      privacyConsent: prev.privacyConsent,
    }))
    setErrors({})
    setMessage('')
  }

  const update = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setMessage('')

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match.' })
      return
    }

    const { confirmPassword: _confirm, ...payload } = form

    setSubmitting(true)
    try {
      if (role === 'ADOPTER') {
        await registerAdopter(payload)          // FR-001
      } else {
        await registerShelter(payload)          // FR-002: saved as PENDING
      }
      navigate('/login', { state: { registered: role } })
    } catch (err) {
      const { message, errors } = readApiError(err)
      setMessage(message)
      setErrors(errors)                      // field-level errors (NFR-017)
    } finally {
      setSubmitting(false)
    }
  }

  // small helper so each input line stays short
  const field = (id, label, props = {}) => (
    <FormField id={id} label={label} value={form[id]} onChange={update} error={errors[id]} {...props} />
  )

  return (
    <div className="card">
      <h1>Create an account</h1>

      <fieldset className="role-options">
        <legend>I am registering as</legend>
        <label className={role === 'ADOPTER' ? 'role-option selected' : 'role-option'}>
          <input type="radio" name="role" value="ADOPTER"
                checked={role === 'ADOPTER'} onChange={() => chooseRole('ADOPTER')} />
          <strong>Adopter</strong>
          <span>I want to adopt a pet</span>
        </label>
        <label className={role === 'SHELTER' ? 'role-option selected' : 'role-option'}>
          <input type="radio" name="role" value="SHELTER"
                checked={role === 'SHELTER'} onChange={() => chooseRole('SHELTER')} />
          <strong>Shelter / Rescuer</strong>
          <span>I want to list pets for adoption</span>
        </label>
      </fieldset>

      {message && <div className="alert alert-error" role="alert">{message}</div>}

      <form onSubmit={handleSubmit} noValidate>
        {role === 'ADOPTER' ? (
          <div className="form-row">
            {field('firstName', 'First name', { autoComplete: 'given-name' })}
            {field('lastName', 'Last name', { autoComplete: 'family-name' })}
          </div>
        ) : (
          <>
            {field('organizationName', 'Organization name', { autoComplete: 'organization' })}

            <div className="form-field">
              <label htmlFor="organizationType">Organization type</label>
              <select id="organizationType" name="organizationType"
                      value={form.organizationType} onChange={update}>
                <option value="SHELTER">Shelter</option>
                <option value="RESCUER">Independent rescuer</option>
              </select>
              {errors.organizationType && <span className="field-error">{errors.organizationType}</span>}
            </div>

            <div className="form-row">
            {field('contactFirstName', "Contact person's first name", { autoComplete: 'given-name' })}
            {field('contactLastName', "Contact person's last name", { autoComplete: 'family-name' })}
            </div>
            {field('address', 'Address', {
              autoComplete: 'street-address',
              hint: 'Street, barangay and city, e.g. Osmena Blvd, Cebu City',
            })}

            <div className="form-field">
              <label htmlFor="description">About your organization (optional)</label>
              <textarea id="description" name="description" rows={4} maxLength={1000}
                        value={form.description} onChange={update}
                        className={errors.description ? 'input-error' : ''} />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>
          </>
        )}

        {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
        {field('phoneNumber', 'Phone number', { type: 'tel', autoComplete: 'tel' })}
                <PasswordField id="password" label="Password" autoComplete="new-password"
                      hint="At least 8 characters, with a letter and a number."
                      value={form.password} onChange={update} error={errors.password} />
        <PasswordField id="confirmPassword" label="Confirm password" autoComplete="new-password"
                      value={form.confirmPassword} onChange={update} error={errors.confirmPassword} />

        <div className="form-field checkbox-field">
          <label htmlFor="privacyConsent">
            <input id="privacyConsent" name="privacyConsent" type="checkbox"
                  checked={form.privacyConsent} onChange={update} />
            <span>
              I agree to the privacy notice. PetHaven collects only the details needed for adoption,
              under the Data Privacy Act of 2012 (RA 10173).
            </span>
          </label>
          {errors.privacyConsent && <span className="field-error">{errors.privacyConsent}</span>}
        </div>

        {role === 'SHELTER' && (
          <p className="note">
            An administrator reviews shelter accounts before you can publish pet listings.
          </p>
        )}

        <button type="submit" className="btn btn-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  )
}