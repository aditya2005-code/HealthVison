import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/auth.service';

const ProtectedRoute = () => {
    const user = authService.getCurrentUser();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.token) {
            toast.error("Please login to access the dashboard", { id: 'auth-error' });
        } else if (authService.isTokenExpired(user.token)) {
            authService.logout();
            toast.error("Session expired. Please login again.", { id: 'session-expired' });
            navigate('/login', { replace: true });
        }
    }, [user, location.pathname]);

    if (!user || !user.token || authService.isTokenExpired(user.token)) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
