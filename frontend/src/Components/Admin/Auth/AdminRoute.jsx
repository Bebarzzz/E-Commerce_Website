import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyToken, logoutUser } from '../../../services/userService';

const AdminRoute = ({ children }) => {
    const location = useLocation();
    const [authState, setAuthState] = useState({
        isLoading: true,
        isAuthenticated: false,
        isAdmin: false,
        error: null
    });

    useEffect(() => {
        const verifyAccess = async () => {
            try {
                // Always verify token with backend - prevents localStorage manipulation
                const response = await verifyToken();
                
                if (response.success && response.user) {
                    setAuthState({
                        isLoading: false,
                        isAuthenticated: true,
                        isAdmin: response.user.role === 'admin',
                        error: null
                    });
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                // Clear any potentially tampered data
                logoutUser();
                setAuthState({
                    isLoading: false,
                    isAuthenticated: false,
                    isAdmin: false,
                    error: error.message
                });
            }
        };

        verifyAccess();
    }, [location.pathname]); // Re-verify on route change

    // Loading state - show spinner while verifying with backend
    if (authState.isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: '#666' }}>Verifying access...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!authState.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Authenticated but not admin - show access denied
    if (!authState.isAdmin) {
        return (
            <div style={{ 
                padding: '50px', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh'
            }}>
                <div style={{
                    background: '#fee2e2',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                }}>
                    <span style={{ fontSize: '40px' }}>🚫</span>
                </div>
                <h1 style={{ color: '#dc2626', marginBottom: '10px' }}>Access Denied</h1>
                <p style={{ color: '#666', marginBottom: '25px' }}>You do not have admin permissions to view this page.</p>
                <button 
                    onClick={() => window.location.href = '/'}
                    style={{
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Go to Homepage
                </button>
            </div>
        );
    }

    // Verified admin - render children
    return children;
};

export default AdminRoute;
