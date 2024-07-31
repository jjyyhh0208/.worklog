import React from 'react';
import { Navigate } from 'react-router-dom';

// 이미 로그인한 경우 회원가입 페이지 접근 금지
const AuthRedirect = ({ element: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('authToken');

    return isAuthenticated ? <Navigate to="/" /> : <Component {...rest} />;
};

export default AuthRedirect;
