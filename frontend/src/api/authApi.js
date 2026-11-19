import client from './client'

export const registerAdopter = (data) =>
  client.post('/auth/register/adopter', data).then((res) => res.data)   // FR-001

export const login = (data) =>
  client.post('/auth/login', data).then((res) => res.data)              // FR-003

export const getMe = () =>
  client.get('/users/me').then((res) => res.data)                       // FR-007