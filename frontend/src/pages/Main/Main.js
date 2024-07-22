import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Main() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setIsLoggedIn(true);
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/signup/1');
    };

    const handleGuestClick = () => {
        navigate('/search');
    };

    return (
        <div className="flex flex-col items-center mt-72 md:mt-36 sm:mt-24">
            <h1 className="text-[#4053FF] text-center text-7xl font-extrabold mb-12 md:text-6xl md:mb-10 sm:text-4xl sm:mb-8">
                .WORKLOG
            </h1>
            <h3 className="text-black text-center text-2xl font-bold mb-12 md:text-xl md:mb-10 sm:text-lg sm:mb-8">
                타인이 바라 보는 나의 업무 성향을 파악하고 협업 스킬셋을 관리해보세요!
            </h3>
            <div className="flex flex-col">
                <button
                    className="bg-[#4053FF] rounded-xl text-white text-2xl text-center w-[423px] h-[84px] mx-auto my-5 cursor-pointer md:w-[350px] md:h-[70px] md:text-xl sm:w-[300px] sm:h-[60px] sm:text-lg xs:w-[250px] xs:h-[50px] xs:text-base"
                    onClick={handleLoginClick}
                >
                    로그인
                </button>
                <button
                    className="bg-[#4053FF] rounded-xl text-white text-2xl text-center w-[423px] h-[84px] mx-auto my-5 cursor-pointer md:w-[350px] md:h-[70px] md:text-xl sm:w-[300px] sm:h-[60px] sm:text-lg xs:w-[250px] xs:h-[50px] xs:text-base"
                    onClick={handleSignUpClick}
                >
                    회원가입
                </button>
                <button
                    className="bg-[#4053FF] rounded-xl text-white text-2xl text-center w-[423px] h-[84px] mx-auto my-5 cursor-pointer md:w-[350px] md:h-[70px] md:text-xl sm:w-[300px] sm:h-[60px] sm:text-lg xs:w-[250px] xs:h-[50px] xs:text-base"
                    onClick={handleGuestClick}
                >
                    비회원으로 평가하기
                </button>
            </div>
        </div>
    );
}

export default Main;
