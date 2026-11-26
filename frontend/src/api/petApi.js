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