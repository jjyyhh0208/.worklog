import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const KakaoLogin = () => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_LOGIN_API_KEY;
    const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
    const REDIRECT_URI = `${REACT_APP_BASE_URL}/${process.env.REACT_APP_KAKAO_LOGIN_CALLBACK_URL}`;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&next=${encodeURIComponent(
        window.location.href
    )}`;
    console.log(KAKAO_AUTH_URL);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('error')) {
            alert('카카오톡 로그인 기능은 준비 중입니다.');
        }
    }, [location]);

    return (
        <div className="w-full flex flex-col items-center mt-5">
            <div className="w-full flex items-center justify-center mt-5">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="text-gray-400 px-4">간편 로그인</span>
                <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="w-full flex justify-center mt-7">
                <a href={KAKAO_AUTH_URL}>
                    <img src="/images/login_kakao.png" alt="카카오 로그인" style={{ cursor: 'pointer' }} />
                </a>
            </div>
        </div>
    );
};

export default KakaoLogin;
