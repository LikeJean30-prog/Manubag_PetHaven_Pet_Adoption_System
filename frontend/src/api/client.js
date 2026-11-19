import axios from 'axios'
import { getToken, clearSession } from '../utils/auth'

const client = axios.create({ baseURL: '/api' })

// Add "Authorization: Bearer <token>" to every request except login/register
client.interceptors.request.use((config) => {
  const token = getToken()
  if (token && !config.url.startsWith('/auth')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Token expired or invalid (NFR-008): clear it and go to login
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default client