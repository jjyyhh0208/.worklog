import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminService from '../../utils/AdminService';

const LoginRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchToken = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');

            if (!code) {
                console.error('No code found in URL');
                navigate('/login');
                return;
            }

            try {
                const data = await AdminService.getToken(code);

                if (data.token && data.is_new !== undefined) {
                    localStorage.setItem('authToken', data.token);
                    if (data.is_new) {
                        navigate('/signup/2');
                    } else {
                        navigate('/my-profile');
                    }
                } else {
                    throw new Error('Invalid token data received');
                }
            } catch (error) {
                navigate('/login', { state: { error: error.message } });
            }
        };

        fetchToken();
    }, [navigate, location]);

    return <div>로그인 처리 중...</div>;
};

export default LoginRedirect;
