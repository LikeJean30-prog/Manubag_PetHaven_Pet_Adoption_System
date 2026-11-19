import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import MyAccount from '../pages/account/MyAccount'
import ShelterVerification from '../pages/admin/ShelterVerification'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<MyAccount />} />
        </Route>

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/admin/shelters" element={<ShelterVerification />} />
          </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}