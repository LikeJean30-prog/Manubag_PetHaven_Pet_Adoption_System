import client from './client'

export const listShelters = (status) =>
  client.get('/admin/shelters', { params: { status } }).then((res) => res.data)

export const decideShelter = (id, body) =>
  client.patch(`/admin/shelters/${id}/verification`, body).then((res) => res.data)