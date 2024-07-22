import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OnBoarding2 = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleDotClick = (page) => {
        navigate(`/on-boarding/${page}`);
    };

    const handleContainerClick = () => {
        navigate('/on-boarding/3');
    };

    const getDotClassName = (page) => {
        return location.pathname === `/on-boarding/${page}` ? 'bg-[#4053ff]' : 'bg-gray-400';
    };

    return (
        <div className="w-[100%] flex flex-col items-center mt-28" onClick={handleContainerClick}>
            <h1 className="absolute top-7 left-9 text-[#4053ff] text-center text-4xl font-extrabold">.WORKLOG</h1>
            <div className="flex justify-center gap-5 mb-4">
                <div
                    className={`${getDotClassName(1)} w-6 h-6 rounded-full cursor-pointer`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(1);
                    }}
                ></div>
                <div
                    className={`${getDotClassName(2)} w-6 h-6 rounded-full cursor-pointer`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(2);
                    }}
                ></div>
                <div
                    className={`${getDotClassName(3)} w-6 h-6 rounded-full cursor-pointer`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(3);
                    }}
                ></div>
            </div>
            <div className="text-center">
                <span className="text-black text-2xl font-medium">
                    내가 생각하는 팀원의 업무 스타일은?
                    <br />
                </span>
                <span className="text-black text-2xl font-bold">직관적이고 답하기 쉬운 설문지 구성</span>
            </div>
            <div className="relative w-full max-w-screen-lg h-[700px] p-10 ">
                <div className="absolute inset-0 flex justify-center items-center">
                    <div
                        className="w-[110%] h-[90%] bg-center bg-cover"
                        style={{ backgroundImage: "url('/images/onboarding2.png')" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default OnBoarding2;
