import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import RegisterAdopter from '../pages/auth/RegisterAdopter'
import MyAccount from '../pages/account/MyAccount'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAdopter />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<MyAccount />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}