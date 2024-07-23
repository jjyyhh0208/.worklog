import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import keywordIcons from '../../components/KeywordIcons/KeywordIcons';
import typeData from '../../data/typeData.json';
import KakaoShareButton from '../../components/KakaoShareButton/KakaoShareButton';

function MyProfile() {
    const [isLoading, setisLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [DISCData, setDISCData] = useState(null);
    const [gptSummary, setGptSummary] = useState({ summarized: [], advice: [] });
    const navigate = useNavigate();

    const discTypeColors = typeData.types.reduce((acc, item) => {
        acc[item.disc_character] = item.color;
        return acc;
    }, {});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await ProfileService.fetchUserProfile();
                profileData.old = 2025 - profileData.age;
                profileData.gender =
                    profileData.gender === 'F' ? 'Female' : profileData.gender === 'M' ? 'Male' : 'None';
                setProfileData(profileData);

                ProfileService.getSignedImageUrl(profileData.profile_image.image)
                    .then((imageUrl) => {
                        setImageUrl(imageUrl);
                    })
                    .catch((error) => {
                        console.error('Error fetching signed URL:', error);
                    });

                const discData = typeData.types.find((item) => item.disc_character === profileData.disc_character);
                if (discData) {
                    setDISCData(discData);
                } else {
                    console.error('DISC character not found:', profileData.disc_character);
                }

                setImageUrl(profileData.profile_image.image || '/images/basicProfile.png');

                // GPT summary 처리
                if (profileData.gpt_summarized_personality) {
                    try {
                        const parsedGptSummary = JSON.parse(profileData.gpt_summarized_personality);
                        setGptSummary({
                            summarized: Array.isArray(parsedGptSummary.summarized) ? parsedGptSummary.summarized : [],
                            advice: Array.isArray(parsedGptSummary.advice) ? parsedGptSummary.advice : [],
                        });
                    } catch (error) {
                        console.error('Error parsing GPT summary:', error);
                        setGptSummary({ summarized: [], advice: [] });
                    }
                }
            } catch (error) {
                console.error('Error fetching profile data.', error);
            } finally {
                setisLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="[w-100%] bg-[#f6f6f6] h-[1000px] min-h-screen flex items-center justify-center">
                {/* Add loading spinner or message here */}
            </div>
        );
    }

    const handleCopyLink = () => {
        if (isLoading) {
            alert('프로필 데이터를 불러오는 중입니다. 잠시만 기다려주세요.');
            return;
        }
        if (!profileData || !profileData.username) {
            alert('프로필 데이터를 불러오는데 문제가 발생했습니다. 페이지를 새로고침하고 다시 시도해주세요.');
            return;
        }

        if (profileData && profileData.username) {
            const profileLink = ProfileService.getUserProfileLink(profileData.username);

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard
                    .writeText(profileLink)
                    .then(() => {
                        alert('프로필 링크가 복사되었습니다.');
                    })
                    .catch((error) => {
                        console.error('링크 복사 중 오류가 발생했습니다.', error);
                        alert('링크 복사에 실패했습니다. 다시 시도해주세요.');
                    });
            } else {
                // navigator.clipboard가 지원되지 않는 경우
                const textArea = document.createElement('textarea');
                textArea.value = profileLink;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    alert('프로필 링크가 복사되었습니다.');
                } catch (err) {
                    console.error('링크 복사 중 오류가 발생했습니다.', err);
                }
                document.body.removeChild(textArea);
            }
        } else {
            alert('프로필 데이터를 불러오는 중입니다.');
        }
    };

    const handleInstagramShare = () => {
        if (!profileData || !profileData.username) {
            alert('프로필 데이터를 불러오는데 문제가 발생했습니다. 페이지를 새로고침하고 다시 시도해주세요.');
            return;
        }

        const profileLink = ProfileService.getUserProfileLink(profileData.username);
        const instagramUrl = `instagram://story-camera?text=${encodeURIComponent(profileLink)}`;

        // 인스타그램 앱이 설치되어 있는지 확인
        setTimeout(() => {
            window.location.href = instagramUrl;
        }, 100);

        // 인스타그램 앱이 없는 경우 대체 동작 (desktop에서는 항상 이걸로 실행)
        setTimeout(() => {
            if (document.hidden) {
                return;
            }
            // 인스타그램 앱이 없는 경우, 프로필 링크를 클립보드에 복사
            navigator.clipboard
                .writeText(profileLink)
                .then(() => {
                    alert('인스타그램 앱이 설치되어 있지 않습니다. 프로필 링크가 클립보드에 복사되었습니다.');
                })
                .catch((err) => {
                    console.error('클립보드 복사 실패:', err);
                    alert('링크 복사에 실패했습니다. 수동으로 복사해주세요: ' + profileLink);
                });
        }, 2000);
    };

    const handleKeywordEdit = () => {
        navigate('/signup/3', { state: { isEditing: true, profileData } });
    };

    const handleProfileEdit = () => {
        navigate('/signup/2', { state: { isEditing: true, profileData } });
    };

    const formatListWithIndex = (list) => {
        if (!Array.isArray(list) || list.length === 0) {
            return <p>데이터가 없습니다.</p>;
        }
        return list.map((item, index) => (
            <div key={index}>
                <strong>팀원 {index + 1}</strong>
                <br />
                {item}
                <br />
                <br />
            </div>
        ));
    };

    return (
        <div className="w-full bg-[#f6f6f6] min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-5xl mx-auto">
                {/* 프로필 헤더 */}
                <div className="bg-white rounded-[50px] shadow-md p-4 sm:p-6 md:p-8 mb-8 w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        <img
                            src={imageUrl || '/images/basicProfile.png'}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-gray-200"
                        />
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-2xl sm:text-3xl font-bold">{profileData.name}</h1>
                            <p className="text-lg sm:text-xl text-gray-600 mt-1">@{profileData.username}</p>
                            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{profileData.old} 세</span>
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{profileData.gender}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 self-center md:self-start">
                            {profileData && (
                                <div
                                    className="w-[200px] h-[50px] rounded-[10px] flex items-center justify-center text-white text-2xl font-semibold "
                                    style={{
                                        backgroundColor: discTypeColors[profileData.disc_character],
                                    }}
                                >
                                    {profileData && profileData.disc_character === 'None' ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-7 h-8 mt-5 mx-auto mb-5 opacity-50"
                                            viewBox="0 0 164 187"
                                            fill="none"
                                        >
                                            <path
                                                d="M145.592 81.5315H136.856V55.3249C136.856 24.8234 112.033 0 81.5315 0C51.03 0 26.2066 24.8234 26.2066 55.3249V81.5315H17.471C7.82557 81.5315 0 89.3571 0 99.0025V168.887C0 178.532 7.82557 186.358 17.471 186.358H145.592C155.237 186.358 163.063 178.532 163.063 168.887V99.0025C163.063 89.3571 155.237 81.5315 145.592 81.5315ZM107.738 81.5315H55.3249V55.3249C55.3249 40.8749 67.0815 29.1184 81.5315 29.1184C95.9815 29.1184 107.738 40.8749 107.738 55.3249V81.5315Z"
                                                fill="black"
                                                fillOpacity="0.25"
                                            />
                                        </svg>
                                    ) : (
                                        <div
                                            className="w-[200px] h-[50px] rounded-[10px] mr-4 ml-4 flex items-center justify-center text-white text-2xl font-semibold"
                                            style={{
                                                backgroundColor:
                                                    discTypeColors[profileData.disc_character] || discTypeColors.None,
                                            }}
                                        >
                                            {profileData.disc_character}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 md:mt-4">
                        <div className="flex gap-3 mb-4 sm:mb-0">
                            <button
                                onClick={handleCopyLink}
                                className="w-10 h-10 bg-white shadow-md rounded-full hover:bg-gray-200 transition duration-300 flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                            </button>
                            <div className="w-10 h-10 bg-white shadow-md rounded-full hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                                <KakaoShareButton username={profileData.username} />
                            </div>
                            <button
                                onClick={handleInstagramShare}
                                className="w-10 h-10 bg-white shadow-md rounded-full hover:bg-gray-200 transition duration-300 flex items-center justify-center"
                            >
                                <img src="/images/instagram.png" alt="Instagram" className="w-6 h-6" />
                            </button>
                        </div>
                        <button
                            onClick={handleProfileEdit}
                            className="px-6 py-2 h-12 w-full sm:w-44 bg-[#9b8f8f] text-white text-lg font-bold rounded-[10px] hover:bg-opacity-90 transition duration-300"
                        >
                            프로필 수정
                        </button>
                    </div>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="w-[100%] max-w-[1150px]">
                    <div className="bg-white rounded-[50px] shadow-md mb-5 p-8 md:p-16 relative">
                        <h2 className="text-3xl md:text-4l font-extrabold mb-4">내가 추구하는 업무 스타일</h2>
                        <hr className="border-t border-gray-300 my-3" />
                        <div className="flex flex-wrap gap-3 mt-3 mb-8">
                            {profileData?.work_styles.map((style) => (
                                <span
                                    key={style.id}
                                    className="px-5 py-2 rounded-full bg-[#909bff] text-white text-lg md:text-2xl font-bold"
                                >
                                    {keywordIcons[style.name]}
                                </span>
                            ))}
                        </div>

                        <h2 className="text-3xl md:text-4l font-extrabold mb-4 mt-30">타인이 바라보는 업무 스타일</h2>
                        <hr className="border-t border-gray-300 my-3" />
                        {profileData?.feedback_count >= 3 ? (
                            <>
                                <div className="flex flex-wrap gap-3 mt-3 mb-8">
                                    {profileData.feedback_workstyles &&
                                        profileData.feedback_workstyles.map((style) => (
                                            <span
                                                key={style.id}
                                                className="px-5 py-2 rounded-full bg-[#ffbf1c] text-white text-lg md:text-2xl font-bold"
                                            >
                                                {keywordIcons[style.name]}
                                            </span>
                                        ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center my-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-40 h-40 mx-auto mb-5 opacity-50"
                                    viewBox="0 0 164 187"
                                    fill="none"
                                >
                                    <path
                                        d="M145.592 81.5315H136.856V55.3249C136.856 24.8234 112.033 0 81.5315 0C51.03 0 26.2066 24.8234 26.2066 55.3249V81.5315H17.471C7.82557 81.5315 0 89.3571 0 99.0025V168.887C0 178.532 7.82557 186.358 17.471 186.358H145.592C155.237 186.358 163.063 178.532 163.063 168.887V99.0025C163.063 89.3571 155.237 81.5315 145.592 81.5315ZM107.738 81.5315H55.3249V55.3249C55.3249 40.8749 67.0815 29.1184 81.5315 29.1184C95.9815 29.1184 107.738 40.8749 107.738 55.3249V81.5315Z"
                                        fill="black"
                                        fillOpacity="0.25"
                                    />
                                </svg>
                                <p className="text-xl font-bold">
                                    피드백을 좀 더 모아볼까요? 최소 3명의 응답이 모이면 응답이 공개됩니다.
                                </p>
                            </div>
                        )}
                        <h2 className="text-3xl md:text-4l font-extrabold mb-4">내가 관심 있는 업종/직군 분야는?</h2>
                        <hr className="border-t border-gray-300 my-3" />
                        <div className="flex flex-wrap gap-3 mt-3 mb-20">
                            {profileData?.interests &&
                                profileData.interests.map((interest) => (
                                    <span
                                        key={interest.id}
                                        className="px-5 py-2 rounded-full bg-[#909bff] text-white text-lg md:text-2xl font-bold"
                                    >
                                        {interest.name}
                                    </span>
                                ))}
                        </div>
                        <button
                            className="absolute bottom-10 right-10 w-40 h-[50px] bg-[#9b8f8f] text-white text-xl font-bold rounded-[10px]"
                            onClick={handleKeywordEdit}
                        >
                            키워드 수정
                        </button>
                    </div>

                    <div className="bg-white rounded-[50px] shadow-md mb-5 p-8 md:p-16 relative">
                        <h2 className="text-3xl md:text-4l font-extrabold mb-4">타인이 평가하는 나</h2>
                        <div className="absolute top-8 right-12 bg-[#e1e1e1] px-4 py-2 rounded-[10px] text-xl font-bold">
                            {profileData?.feedback_count}개의 피드백이 쌓였어요
                        </div>
                        <hr className="border-t border-gray-300 my-3" />
                        {profileData?.feedback_count >= 3 ? (
                            <>
                                <div className="w-full md:w-[1000px] mx-auto">
                                    {profileData.disc_scores &&
                                        Object.entries(profileData.disc_scores).map(([key, value]) => (
                                            <div key={key} className="flex items-center my-10">
                                                <span className="w-20 font-bold text-2xl mr-3">{key}</span>
                                                <div className="w-4/5 h-[30px] bg-[#e0e0e0] rounded-[20px] overflow-hidden mx-3">
                                                    <div
                                                        className="h-full bg-[#4053ff] rounded-[20px]"
                                                        style={{ width: `${value}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-bold text-[#9b8f8f]">{value.toFixed(0)}</span>
                                            </div>
                                        ))}
                                </div>
                                <div className="flex flex-wrap flex-col justify-around mt-8">
                                    <div className="items-center justify-left flex">
                                        {profileData && DISCData ? (
                                            <div
                                                className="w-60 h-[60px] rounded-[20px] flex items-center justify-center text-white text-2xl font-bold mt-5"
                                                style={{ backgroundColor: discTypeColors[profileData.disc_character] }}
                                            >
                                                {DISCData.disc_character}
                                            </div>
                                        ) : (
                                            <div className="w-60 h-[60px] rounded-[20px] flex items-center justify-center bg-gray-200 text-2xl font-bold mt-5">
                                                데이터 로딩 중...
                                            </div>
                                        )}
                                        <img
                                            src={DISCData.disc_img}
                                            alt={DISCData.disc_character}
                                            className="w-44 h-44"
                                        />
                                    </div>
                                    <div className="w-full md:w-[70%] text-xl mt-5">
                                        <p>{DISCData.description}</p>
                                        <div className="font-semibold mt-8 mb-3">
                                            <strong className="mt-8 mb-2 font-bold text-[#4053FF]">
                                                강점 및 보완할 점은?
                                            </strong>
                                        </div>
                                        <strong>이 유형의 강점은:</strong> {DISCData.strength}
                                        <br />
                                        <strong>상대적으로 이 유형은:</strong> {DISCData.weakness}
                                        <div className="font-semibold mt-8 mb-3">
                                            <strong className="mt-8 mb-2 font-bold text-[#4053FF]">
                                                {DISCData.disc_character}와 맞는 협업 유형은?
                                            </strong>
                                        </div>
                                        {DISCData.suitable_type.map((type, index) => (
                                            <div key={index}>
                                                <strong className="mt-8 mb-2 font-semibold text-[#4053FF]">
                                                    {type.name}
                                                </strong>
                                                <p>{type.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-10">
                                    <div className="flex items-center ml-8 mt-12">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-8 h-12 mr-2"
                                            viewBox="0 0 34 38"
                                            fill="none"
                                        >
                                            <path
                                                d="M22.4512 38C24.1716 38 25.7487 37.0663 26.6074 35.576C27.809 33.492 28.5 31.0791 28.5 28.5C28.5 25.8192 27.7519 23.3188 26.4634 21.1805L29.6875 17.9565L30.3837 18.6527C30.8475 19.1165 31.5994 19.1165 32.0632 18.6527L32.9019 17.8125C33.3658 17.3486 33.3658 16.5968 32.9019 16.1329L28.9913 12.2223C28.5275 11.7585 27.7756 11.7585 27.3118 12.2223L26.4723 13.0618C26.0085 13.5256 26.0085 14.2775 26.4723 14.7413L27.1685 15.4375L24.2436 18.3625C23.3856 17.5186 22.423 16.7794 21.375 16.1723V4.7307L22.5603 4.72922C23.2149 4.72848 23.7455 4.19781 23.7463 3.5432L23.7493 1.18899C23.75 0.532149 23.2171 -0.000741413 22.5603 7.74325e-07L5.93973 0.0192976C5.28512 0.0200398 4.75445 0.550704 4.75371 1.20531L4.75074 3.56027C4.75 4.21711 5.28289 4.74926 5.93973 4.74852L7.125 4.74703V16.1715C2.87004 18.6363 0 23.2282 0 28.5C0 31.0791 0.690977 33.4927 1.89258 35.576C2.75203 37.0663 4.32918 38 6.04883 38H22.4512ZM8.9107 19.2546L10.6875 18.2252V4.74332L17.8125 4.73516V18.2252L19.5893 19.2546C21.4307 20.3211 22.8638 21.9064 23.7871 23.75H4.71289C5.63691 21.9064 7.06934 20.3211 8.9107 19.2546Z"
                                                fill="#4053FF"
                                            />
                                        </svg>
                                        <h2 className="text-3xl font-bold text-[#4053ff]">AI 요약</h2>
                                    </div>
                                    <div className="bg-white rounded-[20px] p-5 mt-5">
                                        <p className="text-2xl font-semibold text-center mb-12">
                                            팀원들은 나의 협업 성향에 대해 다음과 같이 느꼈어요!
                                        </p>
                                        <div className="bg-white rounded-[20px] p-5 mt-5">
                                            <p className="text-2xl font-semibold text-center mb-12">
                                                팀원들은 나의 협업 성향에 대해 다음과 같이 느꼈어요!
                                            </p>
                                            <div className="flex flex-col justify-around mt-5">
                                                <h3 className="text-3xl font-bold text-[#4053ff]">Summary</h3>
                                                <div className="flex-1 bg-[rgba(204,209,255,0.2)] rounded-[20px] p-12 m-5 md:m-12 text-xl">
                                                    {formatListWithIndex(gptSummary.summarized)}
                                                </div>
                                                <h3 className="text-3xl font-bold text-[#4053ff]">Advice</h3>
                                                <div className="flex-1 bg-[rgba(204,209,255,0.2)] rounded-[20px] p-12 m-5 md:m-12 text-xl">
                                                    {formatListWithIndex(gptSummary.advice)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center my-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-40 h-40 mx-auto mb-5 opacity-50"
                                    viewBox="0 0 164 187"
                                    fill="none"
                                >
                                    <path
                                        d="M145.592 81.5315H136.856V55.3249C136.856 24.8234 112.033 0 81.5315 0C51.03 0 26.2066 24.8234 26.2066 55.3249V81.5315H17.471C7.82557 81.5315 0 89.3571 0 99.0025V168.887C0 178.532 7.82557 186.358 17.471 186.358H145.592C155.237 186.358 163.063 178.532 163.063 168.887V99.0025C163.063 89.3571 155.237 81.5315 145.592 81.5315ZM107.738 81.5315H55.3249V55.3249C55.3249 40.8749 67.0815 29.1184 81.5315 29.1184C95.9815 29.1184 107.738 40.8749 107.738 55.3249V81.5315Z"
                                        fill="black"
                                        fillOpacity="0.25"
                                    />
                                </svg>
                                <p className="text-xl font-bold">
                                    피드백을 좀 더 모아볼까요? 최소 3명의 응답이 모이면 응답이 공개됩니다.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
