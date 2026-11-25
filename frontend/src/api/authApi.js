import client from './client'

export const registerAdopter = (data) =>
  client.post('/auth/register/adopter', data).then((res) => res.data)   // FR-001

export const login = (data) =>
  client.post('/auth/login', data).then((res) => res.data)              // FR-003

export const getMe = () =>
  client.get('/users/me').then((res) => res.data)                       // FR-007

export const registerShelter = (data) =>
  client.post('/auth/register/shelter', data).then((res) => res.data)   // FR-002

export async function forgotPassword(email) {
  const res = await client.post('/auth/forgot-password', { email })
  return res.data
}

export async function resetPassword(data) {
  const res = await client.post('/auth/reset-password', data)
  return res.data
}