import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createPet, getMyPet, updatePet } from '../../api/petApi'
import { SPECIES, SEX, SIZE, VACCINATION, formatAge } from '../../utils/petLabels'
import '../../styles/Register.css'
import '../../styles/Pets.css'

const EMPTY = {
  name: '',
  species: '',
  breed: '',
  ageMonths: '',
  sex: '',
  size: '',
  description: '',
  vaccinationStatus: '',
}

function SelectField({ id, label, value, options, onChange, error }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={id} value={value} onChange={onChange} aria-invalid={!!error}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <small className="field-error">{error}</small>}
    </div>
  )
}

export default function PetForm() {
  const { petId } = useParams()
  const editing = Boolean(petId)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editing) return
    getMyPet(petId)
      .then((pet) => setForm({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        ageMonths: String(pet.ageMonths),
        sex: pet.sex,
        size: pet.size,
        description: pet.description || '',
        vaccinationStatus: pet.vaccinationStatus,
      }))
      .catch((err) => setMessage(err.response?.data?.message || 'Could not load this pet.'))
      .finally(() => setLoading(false))
  }, [editing, petId])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setSaving(true)

    const payload = {
      ...form,
      species: form.species || null,
      sex: form.sex || null,
      size: form.size || null,
      vaccinationStatus: form.vaccinationStatus || null,
      ageMonths: form.ageMonths === '' ? null : Number(form.ageMonths),
    }

    try {
      if (editing) {
        await updatePet(petId, payload)
        navigate('/shelter/pets', { state: { saved: 'updated' } })
            } else {
        const created = await createPet(payload)
        navigate(`/shelter/pets/${created.petId}/photos`, { state: { created: true } })
      }
    } catch (err) {
      const data = err.response?.data
      setErrors(data?.errors || {})
      setMessage(data?.message || 'Could not save this pet. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card"><p>Loading…</p></div>

  return (
    <div className="card pet-form-card">
      <h1>{editing ? 'Edit pet' : 'Add a pet'}</h1>
      <p>{editing ? 'Update this listing.' : 'New listings are shown as Available.'}</p>

      {message && <div className="alert alert-error" role="alert">{message}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} aria-invalid={!!errors.name} />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </div>
          <SelectField id="species" label="Species" value={form.species} options={SPECIES}
            onChange={handleChange} error={errors.species} />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="breed">Breed</label>
            <input id="breed" name="breed" value={form.breed} onChange={handleChange}
              placeholder="e.g. Aspin, Puspin, Shih Tzu" aria-invalid={!!errors.breed} />
            {errors.breed && <small className="field-error">{errors.breed}</small>}
          </div>
          <div className="form-field">
            <label htmlFor="ageMonths">Age (months)</label>
            <input id="ageMonths" name="ageMonths" type="number" min="0" max="360"
              value={form.ageMonths} onChange={handleChange} aria-invalid={!!errors.ageMonths} />
            {form.ageMonths !== '' && !errors.ageMonths && (
              <small className="hint">= {formatAge(Number(form.ageMonths))}</small>
            )}
            {errors.ageMonths && <small className="field-error">{errors.ageMonths}</small>}
          </div>
        </div>

        <div className="form-row">
          <SelectField id="sex" label="Sex" value={form.sex} options={SEX}
            onChange={handleChange} error={errors.sex} />
          <SelectField id="size" label="Size" value={form.size} options={SIZE}
            onChange={handleChange} error={errors.size} />
        </div>

        <SelectField id="vaccinationStatus" label="Vaccination status" value={form.vaccinationStatus}
          options={VACCINATION} onChange={handleChange} error={errors.vaccinationStatus} />

        <div className="form-field">
          <label htmlFor="description">Description (optional)</label>
          <textarea id="description" name="description" rows="5" maxLength={1000}
            value={form.description} onChange={handleChange} aria-invalid={!!errors.description} />
          <small className="hint char-count">{form.description.length} / 1000</small>
          {errors.description && <small className="field-error">{errors.description}</small>}
        </div>

        <div className="actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Create listing'}
          </button>
          <Link to="/shelter/pets" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}