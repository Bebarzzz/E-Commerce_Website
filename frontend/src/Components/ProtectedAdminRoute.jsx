import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user-role');
  
  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedAdminRoute;
