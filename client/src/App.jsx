import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

/* Layouts */
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';

/* Route guards */
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminRoute from '@/components/common/AdminRoute';

/* Public pages */
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import VerifyOtpPage from '@/pages/VerifyOtpPage';

/* Protected pages */
import MyBookingsPage from '@/pages/MyBookingsPage';

/* Admin pages */
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCreateServicePage from '@/pages/admin/AdminCreateServicePage';
import AdminEditServicePage from '@/pages/admin/AdminEditServicePage';
import AdminBookingsPage from '@/pages/admin/AdminBookingsPage';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          error: { duration: 4000 },
          style: { fontSize: '14px' },
        }}
      />

      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />

          {/* Protected routes (logged-in users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/bookings" element={<MyBookingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin routes with AdminLayout */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/services/create" element={<AdminCreateServicePage />} />
            <Route path="/admin/services/:id/edit" element={<AdminEditServicePage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
