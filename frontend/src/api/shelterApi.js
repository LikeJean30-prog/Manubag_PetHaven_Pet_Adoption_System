import client from './client'

export async function getMyShelter() {
  const res = await client.get('/shelter/me');
  return res.data;
}

export async function updateMyShelter(data) {
  const res = await client.put('/shelter/me', data);
  return res.data;
}