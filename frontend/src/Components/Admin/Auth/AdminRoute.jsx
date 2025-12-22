import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../../services/userService';

const AdminRoute = ({ children }) => {
    const location = useLocation();
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            // 1. Check if logged in
            if (!isAuthenticated()) {
                setIsAuthorized(false);
                return;
            }

            // 2. Check if admin
            if (!isAdmin()) {
                setIsAuthorized(false);
                return;
            }

            setIsAuthorized(true);
        };

        checkAuth();
    }, [location.pathname]); // Re-check on route change if needed

    if (isAuthorized === null) {
        // Loading state could go here, but for local storage it's instant
        return null;
    }

    if (!isAuthenticated()) {
        // Redirect to login, saving the location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin()) {
        // Logged in but not admin
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h1>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <button onClick={() => window.location.href = '/'}>Go Home</button>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
