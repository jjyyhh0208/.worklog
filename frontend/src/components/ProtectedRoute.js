import React from 'react';
import { Navigate } from 'react-router-dom';

// 회원만 들어갈 수 있는 페이지
const ProtectedRoute = ({ element: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('authToken');

    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
