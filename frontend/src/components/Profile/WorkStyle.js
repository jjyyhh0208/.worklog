import React from 'react';
import keywordIcons from '../../components/KeywordIcons/KeywordIcons';

const WorkStyle = ({ profileData, isMyProfile, handleKeywordEdit }) => {
    return (
        <div className="bg-white rounded-[50px] shadow-md p-4 md:p-16 mb-16 relative">
            <h2 className="text-3xl font-bold mb-2 mt-1">
                {isMyProfile ? '내가 관심 있는' : '이 사람이 관심 있는'} 업종/직군 분야
            </h2>
            <hr className="border-t border-gray-300 my-3 mb-8" />
            <div className="flex flex-wrap gap-3 mt-3 mb-8">
                {profileData?.interests &&
                    profileData.interests.map((interest) => (
                        <span
                            key={interest.id}
                            className="px-5 py-2 rounded-full bg-[#909bff] text-white text-md md:text-l font-semibold"
                        >
                            {interest.name}
                        </span>
                    ))}
            </div>
            <h2 className="text-3xl font-bold mb-2 mt-24">{isMyProfile ? '내가' : '이 사람이'} 추구하는 업무 스타일</h2>
            <hr className="border-t border-gray-300 my-3 mb-8" />
            <div className="flex flex-wrap gap-3 mt-3 mb-8">
                {profileData?.work_styles.map((style) => (
                    <span
                        key={style.id}
                        className="px-5 py-2 rounded-full bg-[#909bff] text-white text-md md:text-l font-semibold"
                    >
                        {keywordIcons[style.name]}
                    </span>
                ))}
            </div>

            <h2 className="text-3xl md:text:3xl font-bold mb-2 mt-24">
                {isMyProfile ? '타인이 바라보는 나의' : '타인이 바라보는 이 사람의'} 업무 스타일
            </h2>
            <hr className="border-t border-gray-300 my-3 mb-8" />
            {profileData?.feedback_count >= 3 ? (
                <div className="flex flex-wrap gap-3 mt-3 mb-20">
                    {profileData.feedback_workstyles &&
                        profileData.feedback_workstyles.map((style) => (
                            <span
                                key={style.id}
                                className="px-5 py-2 rounded-full bg-[#ffbf1c] text-white text-md md:text-xl font-bold"
                            >
                                {keywordIcons[style.name]}
                            </span>
                        ))}
                </div>
            ) : (
                <div className="text-center my-8 mb-20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-24 h-24 mx-auto mb-5 opacity-50"
                        viewBox="0 0 164 187"
                        fill="none"
                    >
                        <path
                            d="M145.592 81.5315H136.856V55.3249C136.856 24.8234 112.033 0 81.5315 0C51.03 0 26.2066 24.8234 26.2066 55.3249V81.5315H17.471C7.82557 81.5315 0 89.3571 0 99.0025V168.887C0 178.532 7.82557 186.358 17.471 186.358H145.592C155.237 186.358 163.063 178.532 163.063 168.887V99.0025C163.063 89.3571 155.237 81.5315 145.592 81.5315ZM107.738 81.5315H55.3249V55.3249C55.3249 40.8749 67.0815 29.1184 81.5315 29.1184C95.9815 29.1184 107.738 40.8749 107.738 55.3249V81.5315Z"
                            fill="black"
                            fillOpacity="0.25"
                        />
                    </svg>
                    <p className="text-xl font-semibold">
                        피드백을 좀 더 모아볼까요? 최소 3명의 응답이 모이면 응답이 공개됩니다.
                    </p>
                </div>
            )}

            {isMyProfile && (
                <button
                    className="absolute bottom-8 right-8 w-40 h-12 bg-white text-gray-700 text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2 border border-gray-200"
                    onClick={handleKeywordEdit}
                >
                    키워드 수정
                </button>
            )}
        </div>
    );
};

export default WorkStyle;
