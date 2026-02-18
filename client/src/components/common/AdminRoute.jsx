import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

export default function AdminRoute() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        toast.error('Access denied');
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
