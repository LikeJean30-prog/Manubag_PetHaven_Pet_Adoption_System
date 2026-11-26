import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { deletePetPhoto, getMyPet, setPrimaryPhoto, uploadPetPhotos } from '../../api/petApi'
import '../../styles/Pets.css'

const MAX_PHOTOS = 5
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function readError(err, fallback) {
  const data = err.response?.data
  return data?.errors?.files || data?.errors?.photos || data?.message || fallback
}

export default function PetPhotos() {
  const { petId } = useParams()
  const location = useLocation()
  const fileInput = useRef(null)

  const [pet, setPet] = useState(null)
  const [selected, setSelected] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(
    location.state?.created ? 'Pet listing created. Now add at least one photo so adopters can see it.' : ''
  )
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getMyPet(petId)
      .then(setPet)
      .catch((err) => setError(readError(err, 'Could not load this pet.')))
  }, [petId])

  useEffect(() => {
    const urls = selected.map((file) => URL.createObjectURL(file))
    setPreviews(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [selected])

  const photos = pet?.photos ?? []
  const remaining = MAX_PHOTOS - photos.length

  function handleSelect(e) {
    setError('')
    setNotice('')
    const files = Array.from(e.target.files || [])
    e.target.value = ''

    const wrongType = files.find((f) => !ALLOWED_TYPES.includes(f.type))
    if (wrongType) {
      setError(`"${wrongType.name}" is not a JPEG, PNG or WebP image.`)
      return
    }
    const tooBig = files.find((f) => f.size > MAX_BYTES)
    if (tooBig) {
      setError(`"${tooBig.name}" is larger than 5 MB.`)
      return
    }
    const combined = [...selected, ...files]
    if (combined.length > remaining) {
      setError(`You can add ${remaining} more photo${remaining === 1 ? '' : 's'} (maximum ${MAX_PHOTOS} per pet).`)
      return
    }
    setSelected(combined)
  }

  function removeSelected(index) {
    setSelected(selected.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    if (selected.length === 0) {
      setError('Choose at least one photo.')
      return
    }
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const count = selected.length
      const updated = await uploadPetPhotos(petId, selected)
      setPet(updated)
      setSelected([])
      setNotice(`${count} photo${count === 1 ? '' : 's'} uploaded.`)
    } catch (err) {
      setError(readError(err, 'Upload failed. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  async function handlePrimary(photoId) {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      setPet(await setPrimaryPhoto(petId, photoId))
      setNotice('Primary photo updated.')
    } catch (err) {
      setError(readError(err, 'Could not change the primary photo.'))
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(photoId) {
    if (!window.confirm('Delete this photo? It will also be removed from Cloudinary.')) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      setPet(await deletePetPhoto(petId, photoId))
      setNotice('Photo deleted.')
    } catch (err) {
      setError(readError(err, 'Could not delete the photo.'))
    } finally {
      setBusy(false)
    }
  }

  if (!pet && !error) return <div className="card"><p>Loading…</p></div>

  if (!pet) {
    return (
      <div className="card">
        <div className="alert alert-error" role="alert">{error}</div>
        <p><Link to="/shelter/pets">Back to My pets</Link></p>
      </div>
    )
  }

  return (
    <div className="page-wide">
      <div className="page-header">
        <div>
          <h1>Photos of {pet.name}</h1>
          <p>{photos.length} of {MAX_PHOTOS} photos · JPEG, PNG or WebP, up to 5 MB each</p>
        </div>
        <Link to="/shelter/pets" className="btn btn-secondary">Back to My pets</Link>
      </div>

      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      {error && <div className="alert alert-error" role="alert">{error}</div>}

      {photos.length === 0 && (
        <div className="alert alert-info" role="status">
          This pet has no photos yet, so it is hidden from the public catalog. Add at least one photo.
        </div>
      )}

      {photos.length > 0 && (
        <div className="photo-grid">
          {photos.map((photo) => (
            <figure key={photo.photoId} className={`photo-card${photo.primary ? ' is-primary' : ''}`}>
              <img src={photo.url} alt={`${pet.name}`} />
              {photo.primary && <span className="photo-badge">Primary</span>}
              <figcaption className="photo-actions">
                {!photo.primary && (
                  <button type="button" className="btn btn-secondary btn-small"
                    onClick={() => handlePrimary(photo.photoId)} disabled={busy}>
                    Make primary
                  </button>
                )}
                <button type="button" className="btn btn-danger btn-small"
                  onClick={() => handleDelete(photo.photoId)}
                  disabled={busy || photos.length <= 1}
                  title={photos.length <= 1 ? 'A pet must keep at least one photo' : undefined}>
                  Delete
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <section className="upload-box">
          <h2>Add photos</h2>
          <p className="hint">You can add {remaining} more.</p>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp"
            multiple hidden onChange={handleSelect} />
          <button type="button" className="btn btn-secondary" onClick={() => fileInput.current?.click()} disabled={busy}>
            Choose photos
          </button>

          {previews.length > 0 && (
            <>
              <div className="photo-grid">
                {previews.map((url, i) => (
                  <figure key={url} className="photo-card is-preview">
                    <img src={url} alt={selected[i]?.name || 'Selected photo'} />
                    <figcaption className="photo-actions">
                      <span className="photo-name">{selected[i]?.name}</span>
                      <button type="button" className="btn btn-secondary btn-small"
                        onClick={() => removeSelected(i)} disabled={busy}>
                        Remove
                      </button>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <button type="button" className="btn" onClick={handleUpload} disabled={busy}>
                {busy ? 'Uploading…' : `Upload ${selected.length} photo${selected.length === 1 ? '' : 's'}`}
              </button>
            </>
          )}
        </section>
      )}
    </div>
  )
}