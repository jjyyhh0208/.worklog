import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OnBoarding3 = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleDotClick = (page) => {
        navigate(`/on-boarding/${page}`);
    };

    const handleProfileClick = () => {
        navigate('/my-profile');
    };

    const getDotClassName = (page) => {
        return location.pathname === `/on-boarding/${page}` ? 'bg-[#4053ff]' : 'bg-gray-400';
    };

    return (
        <div className="w-[100%] flex flex-col items-center mt-28" >
            <h1 className="absolute top-7 left-9 text-[#4053ff] text-center text-4xl font-extrabold">.WORKLOG</h1>
            <div className="flex justify-center gap-5 mb-4">
                <div
                    className={`${getDotClassName(1)} w-6 h-6 rounded-full`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(1);
                    }}
                ></div>
                <div
                    className={`${getDotClassName(2)} w-6 h-6 rounded-full`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(2);
                    }}
                ></div>
                <div
                    className={`${getDotClassName(3)} w-6 h-6 rounded-full`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(3);
                    }}
                ></div>
            </div>
            <div className="text-center">
                <span className="text-black text-2xl font-bold ">
                    직관적으로 볼 수 있는 깔끔한 UI 로
                    <br />
                    내가 팔로우한 친구들의 업무 스타일까지 간편하게
                </span>
            </div>
            <div className="relative w-full max-w-screen-lg h-[700px] p-10">
                <div className="absolute inset-0 flex justify-center items-center">
                    <div
                        className="w-[110%] h-[90%] bg-center bg-cover"
                        style={{ backgroundImage: "url('/images/onboarding3.png')" }}
                    />
                </div>
            </div>
            <div className="absolute top-[800px] right-5 flex">
                <button
                    className="w-52 h-12 rounded-xl bg-[#4053ff] text-white text-lg font-bold mr-2 cursor-pointer"
                    onClick={handleProfileClick}
                >
                    내 프로필 바로 가기
                </button>
                
            </div>
        </div>
    );
};

export default OnBoarding3;
