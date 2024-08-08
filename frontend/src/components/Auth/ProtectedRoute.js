import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Modal = ({ message }) => (
    <div
        style={{
            position: 'fixed',
            top: 100,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 1.0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 1000,
        }}
    >
        <div>
            <h2>{message}</h2>
        </div>
    </div>
);

// 회원만 들어갈 수 있는 페이지
const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    const [showModal, setShowModal] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('authToken');
            setIsAuthenticated(!!authToken);
            if (!authToken) {
                setShowModal(true);
                // 0.7초 후에 모달을 닫고 리다이렉트
                setTimeout(() => {
                    setShowModal(false);
                    setRedirect(true);
                }, 700);
            }
        };
        checkAuth();
    }, []);

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <>
            {showModal && <Modal message="로그인이 필요한 페이지입니다." />}
            {isAuthenticated ? <Component {...rest} /> : null}
        </>
    );
};

export default ProtectedRoute;
