import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// 회원만 들어갈 수 있는 페이지
const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('authToken');
            setIsAuthenticated(!!authToken);
        };

        checkAuth();

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkAuth();
                if (!isAuthenticated) {
                    setShowWarning(true);
                }
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated]);

    const handleAlertDismiss = () => {
        setShowWarning(false);
    };

    return isAuthenticated ? (
        <Component {...rest} />
    ) : (
        showWarning && (
            <>
                {alert('로그인 이후 접속 가능합니다.')}
                <Navigate to="/login" />
            </>
        )
    );
};

export default ProtectedRoute;
