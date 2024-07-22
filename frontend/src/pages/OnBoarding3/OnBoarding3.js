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
        <div className="w-[100%] flex flex-col items-center mt-36">
            <h1 className="absolute top-7 left-9 text-[#4053ff] text-center text-4xl font-extrabold">.WORKLOG</h1>
            <div className="flex justify-center gap-5 mb-12">
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
                <span className="text-black text-2xl font-bold">
                    직관적으로 볼 수 있는 깔끔한 UI 로
                    <br />
                    내가 팔로우한 친구들의 업무 스타일까지 간편하게
                </span>
            </div>
            <div className="relative w-full max-w-screen-lg h-[700px] p-10 cursor-pointer">
                <div
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: "url('/images/onboarding3.png')" }}
                />
            </div>
            <div className="absolute top-[900px] right-5 flex">
                <button
                    className="w-52 h-12 rounded-xl bg-[#4053ff] text-white text-lg font-bold mr-2 cursor-pointer"
                    onClick={handleProfileClick}
                >
                    내 프로필 바로 가기
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="49" viewBox="0 0 50 49" fill="none">
                    <path
                        d="M25.0314 27.1023L7.97165 47.9208C6.79252 49.3597 4.88585 49.3597 3.71927 47.9208L0.884345 44.4613C-0.294782 43.0223 -0.294782 40.6956 0.884345 39.2719L12.9767 24.5153L0.884345 9.75867C-0.294782 8.31974 -0.294782 5.99297 0.884345 4.56935L3.70672 1.07919C4.88585 -0.359731 6.79252 -0.359731 7.95911 1.07919L25.0188 21.8977C26.2105 23.3366 26.2105 25.6634 25.0314 27.1023ZM49.1157 21.8977L32.0559 1.07919C30.8768 -0.359731 28.9701 -0.359731 27.8036 1.07919L24.9686 4.53874C23.7895 5.97766 23.7895 8.30444 24.9686 9.72805L37.061 24.4847L24.9686 39.2413C23.7895 40.6803 23.7895 43.007 24.9686 44.4306L27.8036 47.8902C28.9827 49.3291 30.8894 49.3291 32.0559 47.8902L49.1157 27.0717C50.2948 25.6634 50.2948 23.3366 49.1157 21.8977Z"
                        fill="#4053FF"
                    />
                </svg>
            </div>
        </div>
    );
};

export default OnBoarding3;
