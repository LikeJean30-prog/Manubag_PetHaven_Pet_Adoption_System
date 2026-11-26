import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getMyPets } from '../../api/petApi'
import { getMyShelter } from '../../api/shelterApi'
import { readApiError } from '../../utils/errors'
import { formatDateTime } from '../../utils/dates'
import { SPECIES, PET_STATUS, labelOf, formatAge } from '../../utils/petLabels'
import '../../styles/Pets.css'

export default function MyPets() {
  const location = useLocation()
  const [pets, setPets] = useState(null)
  const [shelter, setShelter] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getMyShelter().then(setShelter).catch((err) => setMessage(readApiError(err).message))
    getMyPets().then(setPets).catch((err) => setMessage(readApiError(err).message))
  }, [])

  const verified = shelter?.verificationStatus === 'VERIFIED'
  const saved = location.state?.saved

  return (
    <div className="page-wide">
      <div className="page-header">
        <div>
          <h1>My pets</h1>
          <p>Pet listings from {shelter?.organizationName || 'your shelter'}</p>
        </div>
        {verified && <Link to="/shelter/pets/new" className="btn">+ Add pet</Link>}
      </div>

      {saved && (
        <div className="alert alert-success" role="status">
          {saved === 'created' ? 'Pet listing created.' : 'Pet listing updated.'}
        </div>
      )}

      {shelter && !verified && (
        <div className="alert alert-info" role="status">
          {shelter.verificationStatus === 'REJECTED'
            ? 'Your shelter registration was not approved, so you cannot create pet listings.'
            : 'Your shelter is waiting for administrator verification. You can create pet listings once it is verified.'}
        </div>
      )}

      {message && <div className="alert alert-error" role="alert">{message}</div>}

      {pets === null && !message && <p>Loading…</p>}

      {pets && pets.length === 0 && (
        <div className="empty-state">
          <p>No pet listings yet.</p>
          {verified && <Link to="/shelter/pets/new" className="btn">Add your first pet</Link>}
        </div>
      )}

      {pets && pets.length > 0 && (
        <div className="table-wrap">
          <table className="pet-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Status</th>
                <th>Created</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.petId}>
                  <td className="pet-name">{pet.name}</td>
                  <td>{labelOf(SPECIES, pet.species)}</td>
                  <td>{pet.breed}</td>
                  <td>{formatAge(pet.ageMonths)}</td>
                  <td>
                    <span className={`pet-status pet-status-${pet.status.toLowerCase()}`}>
                      {labelOf(PET_STATUS, pet.status)}
                    </span>
                  </td>
                  <td>{formatDateTime(pet.createdAt)}</td>
                  <td>
                    <Link to={`/shelter/pets/${pet.petId}/edit`} className="btn btn-secondary btn-small">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}