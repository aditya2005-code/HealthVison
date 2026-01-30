import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/auth.service';

const ProtectedRoute = () => {
    const user = authService.getCurrentUser();

    if (!user || !user.token) {
        // Redirect to login page but save the current location they were trying to go to
        // so we can send them there after they login (optional future enhancement)
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
