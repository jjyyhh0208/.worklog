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
    const navigate = useNavigate();

    const discTypeColors = typeData.reduce((acc, item) => {
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

                const discData = typeData.find((item) => item.disc_character === profileData.disc_character);
                if (discData) {
                    setDISCData(discData);
                } else {
                    console.error('DISC character not found:', profileData.disc_character);
                }

                setImageUrl(profileData.image || '/images/basicProfile.png');
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
            <div className="[w-100%] bg-[#f6f6f6] min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
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

    return (
        <div className="w-[100%] bg-[#f6f6f6] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* 프로필 헤더 */}
                <div className="bg-white rounded-[50px] shadow-md p-6 sm:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <img
                            src={imageUrl || '/images/basicProfile.png'}
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border border-gray-200"
                        />
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold">{profileData.name}</h1>
                            <p className="text-xl text-gray-600 mt-1">{profileData.username}</p>
                            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                    {profileData.old} years old
                                </span>
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{profileData.gender}</span>
                                {profileData && profileData.disc_character !== 'None' && (
                                    <span className="bg-[#4053ff] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {profileData.disc_character}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center sm:justify-end space-x-4">
                        <button onClick={handleCopyLink} className="text-[#4053ff] hover:underline">
                            링크 복사
                        </button>
                        <KakaoShareButton />
                        <button onClick={handleInstagramShare} className="text-[#4053ff] hover:underline">
                            Instagram 공유
                        </button>
                    </div>
                    <button
                        onClick={handleProfileEdit}
                        className="px-6 py-2 bg-[#9b8f8f] text-white text-lg font-bold rounded-[10px] hover:bg-opacity-90 transition duration-300"
                    >
                        프로필 수정
                    </button>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="bg-white rounded-[50px] shadow-md p-6 sm:p-8 mb-8">
                    {/* 업무 스타일 섹션 */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">내가 추구하는 업무 스타일</h2>
                        <div className="flex flex-wrap gap-2">
                            {profileData?.work_styles.map((style) => (
                                <span
                                    key={style.id}
                                    className="px-4 py-2 bg-[#909bff] text-white rounded-full text-lg font-semibold"
                                >
                                    {keywordIcons[style.name]}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* 타인이 바라보는 업무 스타일 섹션 */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">타인이 바라보는 업무 스타일</h2>
                        {profileData?.feedback_count >= 3 ? (
                            <div className="flex flex-wrap gap-2">
                                {profileData.feedback_workstyles &&
                                    profileData.feedback_workstyles.map((style) => (
                                        <span
                                            key={style.id}
                                            className="px-4 py-2 bg-[#ffbf1c] text-white rounded-full text-lg font-semibold"
                                        >
                                            {keywordIcons[style.name]}
                                        </span>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center my-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-24 h-24 mx-auto mb-4 opacity-50"
                                    viewBox="0 0 164 187"
                                    fill="none"
                                >
                                    <path
                                        d="M145.592 81.5315H136.856V55.3249C136.856 24.8234 112.033 0 81.5315 0C51.03 0 26.2066 24.8234 26.2066 55.3249V81.5315H17.471C7.82557 81.5315 0 89.3571 0 99.0025V168.887C0 178.532 7.82557 186.358 17.471 186.358H145.592C155.237 186.358 163.063 178.532 163.063 168.887V99.0025C163.063 89.3571 155.237 81.5315 145.592 81.5315ZM107.738 81.5315H55.3249V55.3249C55.3249 40.8749 67.0815 29.1184 81.5315 29.1184C95.9815 29.1184 107.738 40.8749 107.738 55.3249V81.5315Z"
                                        fill="black"
                                        fillOpacity="0.25"
                                    />
                                </svg>
                                <p className="text-lg font-semibold text-gray-600">
                                    피드백을 좀 더 모아볼까요? 최소 3명의 응답이 모이면 응답이 공개됩니다.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* 관심 분야 섹션 */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">관심 있는 업종/직군 분야</h2>
                        <div className="flex flex-wrap gap-2">
                            {profileData?.interests &&
                                profileData.interests.map((interest) => (
                                    <span
                                        key={interest.id}
                                        className="px-4 py-2 bg-[#909bff] text-white rounded-full text-lg font-semibold"
                                    >
                                        {interest.name}
                                    </span>
                                ))}
                        </div>
                    </section>

                    {/* 액션 버튼 */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            onClick={handleKeywordEdit}
                            className="px-6 py-2 bg-[#9b8f8f] text-white text-lg font-bold rounded-[10px] hover:bg-opacity-90 transition duration-300"
                        >
                            키워드 수정
                        </button>
                    </div>
                </div>

                {/* DISC 프로필 및 AI 요약 섹션 */}
                {profileData?.feedback_count >= 3 && (
                    <div className="bg-white rounded-[50px] shadow-md p-6 sm:p-8">
                        <h2 className="text-3xl font-bold mb-6">타인이 평가하는 나</h2>
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold mb-4">DISC 프로필</h3>
                            <div className="space-y-4">
                                {profileData.disc_scores &&
                                    Object.entries(profileData.disc_scores).map(([key, value]) => (
                                        <div key={key} className="flex items-center">
                                            <span className="w-12 font-bold text-xl mr-3">{key}</span>
                                            <div className="flex-grow h-6 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#4053ff] rounded-full"
                                                    style={{ width: `${value}%` }}
                                                ></div>
                                            </div>
                                            <span className="ml-3 font-semibold text-gray-600">
                                                {value.toFixed(0)}%
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold mb-4">AI 요약</h3>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <p className="text-lg text-gray-700">{profileData.gpt_summarized_personality}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyProfile;
