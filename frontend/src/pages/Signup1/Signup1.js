import React, { useEffect, useState } from 'react';
import AdminService from '../../utils/AdminService';
import { useNavigate } from 'react-router-dom';

function Signup1({ signUpInfo, setSignUpInfo }) {
    const [error, setError] = useState('');
    const [isIdAvailable, setIsIdAvailable] = useState(null);
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
        <div className="flex flex-col items-center mt-[226px] md:mt-[150px] sm:mt-[100px]">
            <h1
                className="absolute top-[27px] left-[36px] text-[#4053FF] text-center text-[48px] font-extrabold cursor-pointer md:text-[36px] md:top-[20px] md:left-[20px] sm:text-[28px] sm:top-[20px] sm:left-[10px]"
                onClick={logoHandler}
            >
                .WORKLOG
            </h1>
            <div className="mt-3 -ml-[80%]">
                <button
                    type="submit"
                    onClick={handleBackClick}
                    className="all-unset bg-inherit cursor-pointer border-none shadow-none rounded-0 p-0 overflow-visible hover:bg-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="50" viewBox="0 0 24 24" fill="none">
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
            <h2 className="text-black text-[30px] font-bold md:text-[24px] sm:text-[20px]">SIGN UP</h2>
            <form
                className="relative flex flex-col items-center gap-2.5 mt-[100px] min-w-[500px] md:min-w-[300px] sm:min-w-[250px]"
                onSubmit={signUpHandler}
            >
                <div className="absolute top-[35px] left-[150%] transform -translate-x-1/2 flex flex-col items-start text-center self-center line-height-[70px] min-w-[500px] md:min-w-[300px] sm:min-w-[250px]">
                    <button
                        className="bg-[#9da4e5] w-[145px] h-[50px] text-[#f6f6f6] text-[17px] ml-4 mt-[40px] cursor-pointer rounded-[13px] border-none md:w-[120px] md:h-[40px] md:text-[15px] sm:w-[100px] sm:h-[35px] sm:text-[14px]"
                        type="button"
                        onClick={checkUserNameHandler}
                    >
                        중복 확인
                    </button>
                    <div className="flex items-center mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
                            <g clipPath="url(#clip0_231_547)">
                                <path
                                    d="M12.5 1.06104C5.81265 1.06104 0.390625 6.48501 0.390625 13.1704C0.390625 19.8597 5.81265 25.2798 12.5 25.2798C19.1874 25.2798 24.6094 19.8597 24.6094 13.1704C24.6094 6.48501 19.1874 1.06104 12.5 1.06104ZM12.5 6.43213C13.6326 6.43213 14.5508 7.35029 14.5508 8.48291C14.5508 9.61553 13.6326 10.5337 12.5 10.5337C11.3674 10.5337 10.4492 9.61553 10.4492 8.48291C10.4492 7.35029 11.3674 6.43213 12.5 6.43213ZM15.2344 18.8345C15.2344 19.1581 14.972 19.4204 14.6484 19.4204H10.3516C10.028 19.4204 9.76562 19.1581 9.76562 18.8345V17.6626C9.76562 17.339 10.028 17.0767 10.3516 17.0767H10.9375V13.9517H10.3516C10.028 13.9517 9.76562 13.6893 9.76562 13.3657V12.1938C9.76562 11.8703 10.028 11.6079 10.3516 11.6079H13.4766C13.8001 11.6079 14.0625 11.8703 14.0625 12.1938V17.0767H14.6484C14.972 17.0767 15.2344 17.339 15.2344 17.6626V18.8345Z"
                                    fill="#29A02D"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_231_547">
                                    <rect width="25" height="25" fill="white" transform="translate(0 0.67041)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span className="ml-2">아이디는 최초 설정 이후 변경이 불가합니다.</span>
                    </div>
                </div>
                <span className="text-black text-[25px] font-bold mb-2.5 self-start md:text-[20px] sm:text-[18px]">
                    아이디
                </span>
                <input
                    className="flex w-full max-w-[422px] h-[73px] p-2.5 justify-center items-center gap-2.5 flex-shrink-0 rounded-lg border-2 border-[#4053FF] bg-white mb-5 text-[21px] md:max-w-[100%] md:h-[60px] md:text-[18px] sm:h-[50px] sm:text-[16px]"
                    type="text"
                    placeholder="영문자, 숫자 외 문자는 포함될 수 없습니다"
                    name="username"
                    value={signUpInfo.username}
                    onChange={signUpChangeHandler}
                />
                {availabilityMessage && <div className="text-[20px]">{availabilityMessage}</div>}
                <span className="text-black text-[25px] font-bold mb-2.5 self-start md:text-[20px] sm:text-[18px]">
                    비밀번호
                </span>
                <input
                    className="flex w-full max-w-[422px] h-[73px] p-2.5 justify-center items-center gap-2.5 flex-shrink-0 rounded-lg border-2 border-[#4053FF] bg-white mb-5 text-[21px] md:max-w-[100%] md:h-[60px] md:text-[18px] sm:h-[50px] sm:text-[16px]"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    name="password1"
                    value={signUpInfo.password1}
                    onChange={signUpChangeHandler}
                />
                <span className="text-black text-[25px] font-bold mb-2.5 self-start md:text-[20px] sm:text-[18px]">
                    비밀번호 재입력
                </span>
                <input
                    className="flex w-full max-w-[422px] h-[73px] p-2.5 justify-center items-center gap-2.5 flex-shrink-0 rounded-lg border-2 border-[#4053FF] bg-white mb-5 text-[21px] md:max-w-[100%] md:h-[60px] md:text-[18px] sm:h-[50px] sm:text-[16px]"
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    name="password2"
                    value={signUpInfo.password2}
                    onChange={signUpChangeHandler}
                />
                <div className="absolute top-[550px] left-[130%] transform -translate-x-1/2 items-start w-[110%] text-center self-center line-height-[70px] flex justify-around md:top-[450px] sm:top-[400px]">
                    <button
                        className="w-[148px] h-[49.109px] flex-shrink-0 rounded-[15.337px] bg-[#4053FF] border-none text-white text-[24px] font-bold absolute left-1/2 transform -translate-x-1/2 cursor-pointer md:w-[120px] md:h-[40px] md:text-[20px] sm:w-[100px] sm:h-[35px] sm:text-[18px]"
                        type="submit"
                    >
                        NEXT
                    </button>
                </div>
            </form>
        </div>
    );

}

export default Signup1;
