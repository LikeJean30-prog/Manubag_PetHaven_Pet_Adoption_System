const TOKEN_KEY = 'pethaven_token'
const ROLE_KEY = 'pethaven_role'

export function saveSession({ accessToken, role }) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(ROLE_KEY, role)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY)
}

export function isLoggedIn() {
  return Boolean(getToken())
}

// FR-006: on logout the client discards the access token
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
}

// Where each role lands after login (role-based dashboards)
export function dashboardPath(role = getRole()) {
  if (role === 'ADMIN') return '/admin'
  if (role === 'SHELTER') return '/shelter'
  return '/adopter'
}