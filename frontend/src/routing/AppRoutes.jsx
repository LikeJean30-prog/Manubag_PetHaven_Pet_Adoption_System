import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import MyAccount from '../pages/account/MyAccount'
import AdopterDashboard from '../pages/dashboard/AdopterDashboard'
import ShelterDashboard from '../pages/dashboard/ShelterDashboard'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import ShelterVerification from '../pages/admin/ShelterVerification'
import EditProfile from '../pages/account/EditProfile'
import ChangePassword from '../pages/account/ChangePassword'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import PetPhotos from '../pages/shelter/PetPhotos'
import MyPets from '../pages/shelter/MyPets'
import PetForm from '../pages/shelter/PetForm'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<MyAccount />} />
          <Route path="/account/edit" element={<EditProfile />} />
          <Route path="/account/password" element={<ChangePassword />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ADOPTER']} />}>
          <Route path="/adopter" element={<AdopterDashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={['SHELTER']} />}>
        <Route path="/shelter" element={<ShelterDashboard />} />
        <Route path="/shelter/pets" element={<MyPets />} />
        <Route path="/shelter/pets/new" element={<PetForm />} />
        <Route path="/shelter/pets/:petId/edit" element={<PetForm />} />
        <Route path="/shelter/pets/:petId/photos" element={<PetPhotos />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/shelters" element={<ShelterVerification />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}