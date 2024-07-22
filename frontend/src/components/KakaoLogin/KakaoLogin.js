import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../../utils/AdminService';

const KakaoLogin = () => {
    const navigate = useNavigate();
    const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const REDIRECT_URI = `${window.location.origin}/profiles/auth/kakao/callback`;

    const handleLogin = () => {
        alert('준비 중입니다. 조금만 기다려주세요!');
        navigate('/login');

        // const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        // window.location.href = kakaoAuthUrl;
    };

    return (
        <div className="w-full flex flex-col items-center mt-5">
            <div className="w-full flex items-center justify-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="text-gray-400 px-4">간편 로그인</span>
                <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="w-full flex justify-center mt-7">
                <img
                    src="/images/login_kakao.png"
                    alt="카카오 로그인"
                    onClick={handleLogin}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};

export default KakaoLogin;
