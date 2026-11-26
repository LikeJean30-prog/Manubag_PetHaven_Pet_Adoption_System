import client from './client'

export async function getMyPets() {
  const res = await client.get('/shelter/pets')
  return res.data
}

export async function getMyPet(petId) {
  const res = await client.get(`/shelter/pets/${petId}`)
  return res.data
}

export async function createPet(data) {
  const res = await client.post('/pets', data)
  return res.data
}

export async function updatePet(petId, data) {
  const res = await client.put(`/pets/${petId}`, data)
  return res.data
}

export async function uploadPetPhotos(petId, files) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  const res = await client.post(`/pets/${petId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function deletePetPhoto(petId, photoId) {
  const res = await client.delete(`/pets/${petId}/photos/${photoId}`)
  return res.data
}

export async function setPrimaryPhoto(petId, photoId) {
  const res = await client.patch(`/pets/${petId}/photos/${photoId}/primary`)
  return res.data
}