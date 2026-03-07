import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/auth.service';
import { isProfileComplete } from '../utils/user.utils';

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
        } else if (user && isProfileComplete && !isProfileComplete(user) && location.pathname !== '/profile') {
            toast.error("Please complete your profile details first", { id: 'profile-incomplete' });
            navigate('/profile', { replace: true });
        }
    }, [user, location.pathname, navigate]);

    if (!user || !user.token || authService.isTokenExpired(user.token)) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!isProfileComplete(user) && location.pathname !== '/profile') {
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
