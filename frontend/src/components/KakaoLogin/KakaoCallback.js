// KakaoCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../../utils/AdminService';

const KakaoCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');
        if (code) {
            handleKakaoCallback(code);
        }
    }, []);

    const handleKakaoCallback = async (code) => {
        try {
            const result = await AdminService.handleKakaoLogin(code);
            if (result.is_new_user) {
                navigate('/signup/2');
            } else {
                navigate('/my-profile');
            }
        } catch (error) {
            console.error('Kakao login failed:', error);
            console.log(error);
            navigate('/login'); // 로그인 실패 시 로그인 페이지로 리다이렉트
        }
    };

    return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
