import React, { useState, useEffect } from 'react';
import AdminService from '../../utils/AdminService';
import { useNavigate } from 'react-router-dom';
import KakaoLogin from '../../components/KakaoLogin/KakaoLogin';

function Login() {
    const [loginInfo, setLoginInfo] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [availabilityMessage, setAvailabilityMessage] = useState('');

    const loginChangeHandler = (e) => {
        setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            localStorage.removeItem('authToken');
        }
    }, []);

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            await AdminService.login({
                username: loginInfo.username,
                password: loginInfo.password,
            });
            navigate('/my-profile');
        } catch (error) {
            setError(error.message);
        }
    };

    const logoHandler = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center p-5 w-full md:w-4/5 max-w-2xl mx-auto">
            <div className="w-full border border-gray-300 rounded-lg p-5 relative">
                <h1
                    className="text-[#4053ff] text-4xl font-extrabold cursor-pointer mb-5 text-center"
                    onClick={logoHandler}
                >
                    .WORKLOG
                </h1>
                {error && (
                    <div className="w-full text-sm text-red-500 mb-5">
                        <span>&#x2716; {availabilityMessage}</span>
                        {error}
                    </div>
                )}
                <form className="flex flex-col items-center w-full" onSubmit={loginHandler}>
                    <span className="w-full text-base font-bold mb-1">아이디</span>
                    <input
                        className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="아이디를 입력해주세요"
                        name="username"
                        value={loginInfo.username}
                        onChange={loginChangeHandler}
                    />
                    <span className="w-full text-base font-bold mb-1">비밀번호</span>
                    <input
                        className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        name="password"
                        value={loginInfo.password}
                        onChange={loginChangeHandler}
                    />
                    <div className="w-full flex justify-center mt-4">
                        <button
                            className="w-full py-2 px-4 bg-[#4053ff] text-white rounded-md text-xl font-bold cursor-pointer hover:bg-[#3442cc] transition-colors duration-200"
                            type="submit"
                        >
                            로그인
                        </button>
                    </div>
                </form>
                <KakaoLogin></KakaoLogin>
            </div>
        </div>
    );
}

export default Login;
