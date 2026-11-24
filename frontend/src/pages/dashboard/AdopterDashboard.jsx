import { useEffect, useState } from 'react'
import { getMe } from '../../api/authApi'
import '../../styles/Dashboard.css'

export default function AdopterDashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => { getMe().then(setUser).catch(() => {}) }, [])

  return (
    <div className="page-wide">
      <h1>Welcome{user ? `, ${user.firstName}` : ''}!</h1>
      <p>Dashboard</p>
    </div>
  )
}