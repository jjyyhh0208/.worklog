import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// 회원만 들어갈 수 있는 페이지
const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    const [showWarning, setShowWarning] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('authToken');
            setIsAuthenticated(!!authToken);
            setShowWarning(!authToken);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated && showWarning) {
            alert('로그인이 필요한 페이지입니다.');
            setShowWarning(false);
            setRedirect(true);
        }
    }, [isAuthenticated, showWarning]);

    if (redirect) {
        return <Navigate to="/search" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;
