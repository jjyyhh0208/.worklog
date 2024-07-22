import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OnBoarding1 = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNextPage = () => {
        navigate('/on-boarding/2');
    };

    const handleDotClick = () => {
        navigate('/on-boarding/3');
    };

    const getDotClassName = (page) => {
        return location.pathname === `/on-boarding/${page}` ? 'bg-[#4053ff]' : 'bg-gray-400';
    };

    return (
        <div className="w-[100%] flex flex-col items-center mt-28">
            <h1 className="absolute top-7 left-9 text-[#4053ff] text-center text-4xl font-extrabold">.WORKLOG</h1>
            <div className="flex justify-center gap-5 mb-4">
                <div
                    className={`${getDotClassName(1)} w-6 h-6 rounded-full cursor-pointer`}
                    onClick={handleNextPage}
                ></div>
                <div
                    className={`${getDotClassName(2)} w-6 h-6 rounded-full cursor-pointer`}
                    onClick={handleNextPage}
                ></div>
                <div
                    className={`${getDotClassName(3)} w-6 h-6 rounded-full cursor-pointer`}
                    onClick={handleDotClick}
                ></div>
            </div>
            <div className="text-center">
                <span className="text-black text-2xl font-medium">
                    나의 키워드, 강점, 보완할 점까지 AI와 함께
                    <br />
                    링크만 전달해도 자동으로 쌓이는
                </span>
                <span className="text-black text-2xl font-bold"> 나의 업무 성향 분석 레포트</span>
            </div>
            <div
                className="relative w-full max-w-screen-lg h-[700px] p-10 hover:cursor-pointer"
                onClick={handleNextPage}
            >
                <div className="absolute inset-0 flex justify-center items-center">
                    <div
                        className="w-[110%] h-[90%] bg-center bg-cover"
                        style={{ backgroundImage: "url('/images/onboarding1.png')" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default OnBoarding1;
