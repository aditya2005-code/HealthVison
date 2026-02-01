import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/auth.service';

const ProtectedRoute = () => {
    const user = authService.getCurrentUser();

    useEffect(() => {
        if (!user || !user.token) {
            toast.error("Please login to access the dashboard", { id: 'auth-error' }); // Use ID to prevent duplicates
        }
    }, [user]);

    if (!user || !user.token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
