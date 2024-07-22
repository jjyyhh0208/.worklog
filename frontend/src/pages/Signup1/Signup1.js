import React, { useEffect, useState } from 'react';
import AdminService from '../../utils/AdminService';
import { useNavigate } from 'react-router-dom';
import KakaoLogin from '../../components/KakaoLogin/KakaoLogin';

function Signup1({ signUpInfo, setSignUpInfo }) {
    const [error, setError] = useState('');
    const [isIdAvailable, setIsIdAvailable] = useState(null);
    const [isPasswordAvailable, setIsPasswordAvailable] = useState(true);
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const navigate = useNavigate();

    const signUpChangeHandler = (e) => {
        setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        localStorage.removeItem('authToken');
    }, []);

    const checkUserNameHandler = async (e) => {
        e.preventDefault();

        setError('');
        setAvailabilityMessage('');

        if (signUpInfo.username.trim() === '') {
            setAvailabilityMessage('아이디를 입력해주세요.');
            setIsIdAvailable(false);
            return;
        }

        try {
            const response = await AdminService.checkUserName(signUpInfo.username);
            if (response.isUnique) {
                setIsIdAvailable(true);
                setAvailabilityMessage('사용 가능한 아이디입니다.');
            } else {
                setIsIdAvailable(false);
                setAvailabilityMessage('아이디가 중복되었습니다. 다른 아이디를 입력해주세요.');
            }
        } catch (error) {
            const apiErrorMessage = error.message || '아이디 중복 확인 도중 오류가 발생했습니다. 다시 시도해주세요.';
            setError(apiErrorMessage);
            setAvailabilityMessage(apiErrorMessage);
        }
    };

    const signUpHandler = async (e) => {
        e.preventDefault();

        if (isIdAvailable === false || isIdAvailable === null) {
            setAvailabilityMessage('아이디 중복 확인을 해주세요.');
            setIsIdAvailable(false);
            return;
        }

        try {
            await AdminService.registerUser({
                username: signUpInfo.username,
                password1: signUpInfo.password1,
                password2: signUpInfo.password2,
            });

            // 회원가입이 성공했을 때 로그인을 시도
            await AdminService.login({
                username: signUpInfo.username,
                password: signUpInfo.password1,
            });

            navigate('/signup/2');
        } catch (error) {
            const apiErrorMessage = error.message || '회원가입 도중 오류가 발생했습니다. 다시 시도해주세요.';
            setError(apiErrorMessage);
            setAvailabilityMessage(apiErrorMessage);
            setIsPasswordAvailable(false);
        }
    };

    const logoHandler = () => {
        navigate('/');
    };
    const handleBackClick = () => {
        localStorage.removeItem('authToken');
        signUpInfo.username = '';
        signUpInfo.password1 = '';
        signUpInfo.password2 = '';

        navigate('/');
    };

    return (
        <div className="w-[100%] flex flex-col items-center p-5 w-full md:w-4/5 max-w-2xl mx-auto">
            <h1 className="text-[#4053ff] text-4xl font-extrabold cursor-pointer mb-5" onClick={logoHandler}>
                .WORKLOG
            </h1>
            <div className="w-[100%] border border-gray-300 rounded-lg p-5 w-full relative">
                <div className="absolute top-5 left-5">
                    <button type="button" onClick={handleBackClick} className="focus:outline-none hover:bg-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M15.5 19l-7-7 7-7"
                                stroke="#4053ff"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                <h2 className="text-black text-2xl font-bold text-center mb-8">SIGN UP</h2>
                <div className="w-full text-sm mb-5 min-h-3">
                    {availabilityMessage && (
                        <div className={`${isIdAvailable && isPasswordAvailable ? 'text-blue-500' : 'text-red-500'}`}>
                            {isIdAvailable && isPasswordAvailable ? (
                                <span>&#x2714; {availabilityMessage}</span>
                            ) : (
                                <span>&#x2716; {availabilityMessage}</span>
                            )}
                        </div>
                    )}
                </div>
                <form className="flex flex-col items-center w-full" onSubmit={signUpHandler}>
                    <div className="flex justify-start items-center w-full mb-2">
                        <span className="text-base font-bold w-12 mr-1">아이디</span>
                        <span className="text-xs font-medium flex-1 whitespace-nowrap text-gray-500">
                            아이디는 최초 설정 이후 변경이 불가합니다.
                        </span>
                    </div>
                    <div className="flex justify-between w-full mb-2">
                        <input
                            className="w-2/3 h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="영문자, 숫자 외 문자는 포함될 수 없습니다"
                            name="username"
                            value={signUpInfo.username}
                            onChange={signUpChangeHandler}
                        />
                        <button
                            className="bg-[#4053ff] text-white px-5 py-2 rounded-md text-sm w-24 h-10"
                            type="button"
                            onClick={checkUserNameHandler}
                        >
                            중복 확인
                        </button>
                    </div>
                    <span className="w-full text-base font-bold mb-1">비밀번호</span>
                    <input
                        className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        name="password1"
                        value={signUpInfo.password1}
                        onChange={signUpChangeHandler}
                    />
                    <span className="w-full text-base font-bold mb-1">비밀번호 재입력</span>
                    <input
                        className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요"
                        name="password2"
                        value={signUpInfo.password2}
                        onChange={signUpChangeHandler}
                    />
                    <div className="w-full flex justify-center">
                        <button
                            className="w-full py-2 px-32 bg-[#4053ff] text-white rounded-md text-xl cursor-pointer"
                            type="submit"
                        >
                            NEXT
                        </button>
                    </div>
                </form>
                <KakaoLogin></KakaoLogin>
            </div>
        </div>
    );
}

export default Signup1;
