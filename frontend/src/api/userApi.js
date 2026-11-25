import client from './client';

// FR-007: update my own name and phone
export async function updateMe(data) {
const res = await client.put('/users/me', data);
return res.data;
}

// FR-007: change password (needs the current password)
export async function changePassword(data) {
const res = await client.put('/users/me/password', data);
return res.data;
}