import client from './client'

export const getMyShelter = () =>
  client.get('/shelter/me').then((res) => res.data)