import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../../utils/AdminService';

function Login() {
    const [loginInfo, setLoginInfo] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        <div className="flex flex-col items-center mt-[226px]">
            <h1
                className="absolute top-[27px] left-[36px] text-[#4053FF] text-center text-[47.962px] font-extrabold cursor-pointer"
                onClick={logoHandler}
            >
                .WORKLOG
            </h1>
            <h2 className="text-black text-[30px] font-bold">LOGIN</h2>

            {error && <div className="text-red-500 mb-5 text-[18px]">{error}</div>}

            <form className="flex flex-col gap-2.5 w-2/5" onSubmit={loginHandler}>
                <span className="text-black text-[25px] font-bold mb-2.5 ml-[15%]">아이디</span>
                <input
                    className="flex h-[73px] w-[70%] p-2.5 justify-center items-center gap-2.5 flex-shrink-0 rounded-lg border-2 border-[#4053FF] bg-white mb-5 text-[21px] self-center"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    name="username"
                    value={loginInfo.username}
                    onChange={loginChangeHandler}
                />
                <span className="text-black text-[25px] font-bold mb-2.5 ml-[15%]">비밀번호</span>
                <input
                    className="flex h-[73px] w-[70%] p-2.5 justify-center items-center gap-2.5 flex-shrink-0 rounded-lg border-2 border-[#4053FF] bg-white mb-5 text-[21px] self-center"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    name="password"
                    value={loginInfo.password}
                    onChange={loginChangeHandler}
                />
                <button
                    className="bg-[#9da4e5] rounded-[1vw] border-none self-center w-[20vw] h-[8vw] max-w-[157.848px] max-h-[62px] flex-shrink-0 text-[#f6f6f6] text-[21px] font-normal mt-10 cursor-pointer"
                    type="submit"
                >
                    로그인
                </button>
            </form>
        </div>
    );
}

export default Login;
