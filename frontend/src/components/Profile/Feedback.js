import React, { useState } from 'react';
import Paginator from './Paginator';
import DISCInfo from './DISCInfo';

const Feedback = ({
    profileData,
    positiveFeedback,
    constructiveFeedback,
    toggleFeedbackOpen,
    isFeedbackOpen,
    toggleCharacterOpen,
    isCharacterOpen,
    toggleAIOpen,
    isAIOpen,
    DISCData,
    DISCData2,
    DISCCharacter,
    DISCCharacter2,
    DISCCharacterValue,
    DISCCharacterValue2,
}) => {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const currentPositiveFeedback = (positiveFeedback || []).slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const currentConstructiveFeedback = (constructiveFeedback || []).slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div className="bg-white rounded-[50px] shadow-md mb-5 p-8 md:p-16 relative ">
            <div className="w-[30%] text-center absolute t-1 aline-center right-20  h-10 bg-[#4053FF] px-4 py-2 rounded-[10px] text-l text-white font-semibold mb-20">
                {profileData?.feedback_count}개의 피드백이 쌓였어요
            </div>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-extrabold">타인이 평가하는 나</h2>

                {profileData?.feedback_count >= 3 && (
                    <span className="flex items-center cursor-pointer" onClick={toggleFeedbackOpen}>
                        <i className={`fas fa-chevron-${isFeedbackOpen ? 'up' : 'down'} fa-lg mr-2`}></i>
                    </span>
                )}
            </div>

            <hr className="border-t border-gray-300 my-3 mb-5" />
            {profileData?.feedback_count >= 3 ? (
                <>
                    <div className="w-full md:w-[1000px] mx-auto ml-6">
                        {isFeedbackOpen &&
                            profileData.disc_scores &&
                            Object.entries(profileData.disc_scores).map(([key, value]) => {
                                const getKoreanLabel = (key) => {
                                    switch (key) {
                                        case 'D':
                                            return '주도';
                                        case 'I':
                                            return '사교';
                                        case 'S':
                                            return '안정';
                                        case 'C':
                                            return '신중';
                                        default:
                                            return key;
                                    }
                                };

                                const getTooltip = (key) => {
                                    switch (key) {
                                        case 'D':
                                            return '주도형(Dominance)은 외향적이고 업무 중심적인 성향이 결합된 행동 유형으로, 도전과 추진력으로 동기부여를 받아요.';
                                        case 'I':
                                            return '사교형(Influence)은 외향적이며 사람 중심의 성향을 가진 유형으로, 긍정적이고 유머 감각이 뛰어난 사람들이 많아요.';
                                        case 'S':
                                            return '안정형(Steadiness)은 내향적이며 사람 중심적인 성향으로, 조직과 규율에 충실한 사람들이 많아요. 변화에 적응하는 시간이 필요하며 다른 방식대로 일하자고 하면 힘들어하기도 해요.';
                                        case 'C':
                                            return '신중형(Conscientiousness)은 내향적이며 업무 중심의 성향을 지닌 사람들로, 과묵하고 이성적인 편이에요. 또한, 논리성에 기초하기에 결정을 천천히 내리는 것을 선호해요.';
                                        default:
                                            return '';
                                    }
                                };

                                return (
                                    <div key={key} className="flex items-center my-10">
                                        <span className="w-14">
                                            <span className="font-bold text-xl md:text-2xl">{getKoreanLabel(key)}</span>
                                        </span>
                                        <span className="relative flex items-center group">
                                            <i className="fas fa-info-circle fa-sm text-gray-400 ml-1 cursor-pointer"></i>
                                            <div className="absolute left-0 bottom-full mb-2 w-max max-w-xs p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                                {getTooltip(key)}
                                            </div>
                                        </span>
                                        <div className="w-8/12 h-[30px] bg-[#e0e0e0] rounded-[20px] overflow-hidden mx-3">
                                            <div
                                                className="h-full bg-[#4053ff] rounded-[20px]"
                                                style={{ width: `${value}%` }}
                                            ></div>
                                        </div>
                                        <span className="font-bold text-[#9b8f8f] ml-4">{value.toFixed(0)}</span>
                                    </div>
                                );
                            })}
                    </div>

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl md:text-3xl font-extrabold">가장 많은 친구가 생각하는 내 업무 유형</h2>
                        <span className="flex items-center cursor-pointer" onClick={toggleCharacterOpen}>
                            <i className={`fas fa-chevron-${isCharacterOpen ? 'up' : 'down'} fa-lg mr-2`}></i>
                        </span>
                    </div>
                    <hr className="border-t border-gray-300 my-3 mb-5" />
                    {isCharacterOpen && (
                        <DISCInfo
                            DISCData={DISCData}
                            DISCData2={DISCData2}
                            DISCCharacter={DISCCharacter}
                            DISCCharacter2={DISCCharacter2}
                            DISCCharacterValue={DISCCharacterValue}
                            DISCCharacterValue2={DISCCharacterValue2}
                        />
                    )}

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl md:text-3xl font-extrabold">
                            🤖<span className="ml-1"> AI 요약 피드백</span>
                        </h2>
                        <span className="flex items-center cursor-pointer" onClick={toggleAIOpen}>
                            <i className={`fas fa-chevron-${isAIOpen ? 'up' : 'down'} fa-lg mr-2`}></i>
                        </span>
                    </div>
                    <hr className="border-t border-gray-300 my-3" />
                    {isAIOpen && (
                        <div className="bg-white rounded-[20px] p-5">
                            <div className="flex flex-col justify-around mt-5">
                                <h3 className="text-3xl font-bold text-[#4053ff]">긍정적 피드백</h3>
                                <div className="flex-1 bg-[rgba(204,209,255,0.2)] rounded-[20px] p-12 m-5 md:m-12 text-xl">
                                    <Paginator
                                        items={positiveFeedback || []}
                                        itemsPerPage={itemsPerPage}
                                        handlePageClick={handlePageClick}
                                    />
                                </div>

                                <h3 className="text-3xl font-bold text-[#4053ff]">건설적 피드백</h3>
                                <div className="flex-1 bg-[rgba(204,209,255,0.2)] rounded-[20px] p-12 m-5 md:m-12 text-xl">
                                    <Paginator
                                        items={constructiveFeedback || []}
                                        itemsPerPage={itemsPerPage}
                                        handlePageClick={handlePageClick}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </>
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
                        피드백을 3개 이상 모아야 AI 분석 결과가 표시됩니다. 친구들에게 피드백 요청을 보내보세요!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Feedback;
