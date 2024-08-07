import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import keywordIcons from '../../components/KeywordIcons/KeywordIcons';
import typeData from '../../data/typeData.json';
import KakaoShareButton from '../../components/Kakao/KakaoShareButton';
import ReactPaginate from 'react-paginate';

function MyProfile() {
    const [isLoading, setisLoading] = useState(true);
    // Profile
    const [profileData, setProfileData] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [DISCData, setDISCData] = useState(null);
    const [DISCData2, setDISCData2] = useState(null);
    const [DISCCharacter, setDISCCharacter] = useState(null);
    const [DISCCharacter2, setDISCCharacter2] = useState('');
    const [DISCCharacterValue, setDISCCharacterValue] = useState('');
    const [DISCCharacterValue2, setDISCCharacterValue2] = useState('');

    // 아코디언
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(true);
    const [isCharacterOpen, setIsCharacterOpen] = useState(true);
    const [isAIOpen, setIsAIOpen] = useState(true);

    const toggleFeedbackOpen = () => {
        setIsFeedbackOpen(!isFeedbackOpen);
    };

    const toggleCharacterOpen = () => {
        setIsCharacterOpen(!isCharacterOpen);
    };

    const toggleAIOpen = () => {
        setIsAIOpen(!isAIOpen);
    };

    const navigate = useNavigate();
    const discTypeColors = typeData.types.reduce((acc, item) => {
        acc[item.disc_character] = item.color;
        return acc;
    }, {});

    //피드백 페이지
    const [currentPage, setCurrentPage] = useState(0);

    /*get_summaried_personality가 객채거나 스트링이거나 둘 다 처리할 수 있도록 수정 */
    const parsedPersonality =
        profileData && profileData.gpt_summarized_personality
            ? typeof profileData.gpt_summarized_personality === 'string'
                ? JSON.parse(profileData.gpt_summarized_personality)
                : profileData.gpt_summarized_personality
            : {};

    const positive_feedback = parsedPersonality.positive_feedback || [];
    const constructive_feedback = parsedPersonality.constructive_feedback || [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await ProfileService.fetchUserProfile();
                // 1. Demographic Info
                profileData.old = 2025 - profileData.age;
                profileData.gender =
                    profileData.gender === 'F' ? 'Female' : profileData.gender === 'M' ? 'Male' : 'None';
                setProfileData(profileData);
                //참고용으로 style 눈에 보이게 만듦
                profileData.style =
                    profileData.style === 'hard' ? 'hard' : profileData.style === 'soft' ? 'soft' : 'hard';
                setProfileData(profileData);

                ProfileService.getSignedImageUrl(profileData.profile_image.image)
                    .then((imageUrl) => {
                        setImageUrl(imageUrl);
                    })
                    .catch((error) => {
                        console.error('Error fetching signed URL:', error);
                    });
                setImageUrl(profileData.profile_image.image || '/images/basicProfile.png');

                // 2. DISC
                const discCharacterData = profileData.disc_character;
                if (discCharacterData) {
                    const sortedCharacters = Object.entries(discCharacterData).sort((a, b) => b[1] - a[1]);

                    // 첫 번째와 두 번째 캐릭터의 이름과 비율을 저장
                    const firstCharacter = sortedCharacters[0];
                    const secondCharacter = sortedCharacters[1];

                    const discCharacter1 = firstCharacter[0];
                    const discCharacterValue1 = firstCharacter[1];
                    const discCharacter2 = secondCharacter[0];
                    const discCharacterValue2 = secondCharacter[1];

                    setDISCCharacter(discCharacter1);
                    setDISCCharacterValue(discCharacterValue1);
                    setDISCCharacter2(discCharacter2);
                    setDISCCharacterValue2(discCharacterValue2);

                    // 1위 데이터
                    const discData = typeData.types.find((item) => item.disc_character === discCharacter1);
                    if (discData) {
                        setDISCData(discData);
                    } else {
                        console.error('DISC character not found:', discCharacter1, profileData.disc_character);
                    }

                    // 2위 데이터
                    const discData2 = typeData.types.find((item) => item.disc_character === discCharacter2);
                    if (discData) {
                        setDISCData2(discData2);
                    } else {
                        console.error('DISC character not found:', discCharacter2, profileData.disc_character);
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
        return <div className="[w-100%] bg-[#f6f6f6] h-[1000px] min-h-screen flex items-center justify-center"></div>;
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

        if (profileData && profileData?.username) {
            const profileLink = `${window.location.origin}/friend-profile/${profileData?.username}`;

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

        const profileLink = ProfileService.getUserProfileLink(profileData?.username);
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
    const itemsPerPage = 5; // 한 페이지에 표시할 피드백 수

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    const formatListWithPagination = (list, isPositive) => {
        if (!Array.isArray(list) || list.length === 0) {
            return <p>저장된 피드백 데이터가 없습니다.</p>;
        }
        // 이름 목록을 섞습니다

        const shuffledNames = [...animalNicknames].sort(() => 0.5 - Math.random());

        const offset = currentPage * itemsPerPage;
        const currentPageItems = list.slice(offset, offset + itemsPerPage);

        const paginatedItems = currentPageItems.map((item, index) => {
            const anonymousName =
                offset + index < shuffledNames.length ? shuffledNames[offset + index] : `팀원 ${offset + index + 1}`; //이름 100개가 부족하면 팀원+숫자로 전개된다.

            return (
                <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                    <strong className="text-blue-600">익명의 {anonymousName}:</strong>
                    <p className="mt-2">{item}</p>
                </div>
            );
        });

        return (
            <>
                {paginatedItems}
                <ReactPaginate
                    previousLabel={'이전'}
                    nextLabel={'다음'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(list.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination flex justify-center items-center mt-4 select-none'}
                    pageClassName={'mx-1'}
                    pageLinkClassName={
                        'flex items-center justify-center w-8 h-8 bg-white border rounded hover:bg-blue-100 transition-colors duration-200'
                    }
                    activeClassName={'bg-blue-500'} // 이 부분을 수정
                    activeLinkClassName={'text-black hover:bg-blue-600 hover:text-white'} // hover 효과 추가
                    previousClassName={'mx-1'}
                    nextClassName={'mx-1'}
                    previousLinkClassName={
                        'flex items-center justify-center px-3 py-2 bg-white border rounded hover:bg-gray-200 transition-colors duration-200'
                    }
                    nextLinkClassName={
                        'flex items-center justify-center px-3 py-2 bg-white border rounded hover:bg-gray-200 transition-colors duration-200'
                    }
                    disabledClassName={'opacity-50 cursor-not-allowed'}
                    breakClassName={'mx-1'}
                    breakLinkClassName={
                        'flex items-center justify-center w-8 h-8 bg-white border rounded hover:bg-gray-200 transition-colors duration-200'
                    }
                />
            </>
        );
    };
    //익명 팀원 리스트
    const animalNicknames = [
        '호랑이',
        '펭귄',
        '코알라',
        '기린',
        '캥거루',
        '팬더',
        '부엉이',
        '코끼리',
        '다람쥐',
        '여우',
        '고릴라',
        '카멜레온',
        '나비',
        '앵무새',
        '돌고래',
        '거북이',
        '하마',
        '콜리브리',
        '코뿔소',
        '알파카',
        '미어캣',
        '플라밍고',
        '해달',
        '타조',
        '나무늘보',
        '까마귀',
        '청설모',
        '살모사',
        '치타',
        '두더지',
        '순록',
        '바다표범',
        '뱀부쥐',
        '카피바라',
        '햄스터',
        '오리너구리',
        '아르마딜로',
        '시바견',
        '레서판다',
        '근육고양이',
        '날다람쥐',
        '큰바다사자',
        '알비노악어',
        '꿀오소리',
        '사막여우',
        '긴코털원숭이',
        '큰뿔양',
        '주머니쥐',
        '미니피그',
        '북극여우',
        '청공작',
        '큰입벌레',
        '맹꽁이',
        '슬로우로리스',
        '쿠두',
        '코요테',
        '퓨마',
        '딱따구리',
        '안경원숭이',
        '알락꼬리원숭이',
        '프레리독',
        '투칸',
        '재규어',
        '맹꽁이깨비',
        '바다코끼리',
        '킹코브라',
        '랫스네이크',
        '턱수염도마뱀',
        '바다이구아나',
        '검은맘바',
        '큰돌고래',
        '흰동가리',
        '만타가오리',
        '흰고래',
        '범고래',
        '북극곰',
        '코뿔소',
        '긴팔원숭이',
        '왈라비',
        '쥐lemur',
        '큰개미핥기',
        '킹펭귄',
        '왕오징어',
        '해마',
        '해파리',
        '바다뱀',
        '전기뱀장어',
        '박쥐',
        '날다람쥐',
        '날여우',
        '긴꼬리원숭이',
        '큰낚시개구리',
        '독화살개구리',
        '풍선물고기',
        '블루탱',
        '클라운피시',
        '흰동가리',
        '나폴레옹피시',
        '만다린피시',
        '푸들',
    ];
    return (
        <div className="w-full bg-[#f6f6f6] min-h-screen py-6 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-5xl mx-auto">
                {/* 프로필 헤더 */}
                <div className="bg-white rounded-[50px] shadow-md p-4 sm:p-6 md:p-8 mb-8 w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        <img
                            src={imageUrl || '/images/basicProfile.png'}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-gray-200"
                        />
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-2xl sm:text-3xl font-bold">{profileData?.name}</h1>
                            <p className="text-lg sm:text-xl text-gray-600 mt-1">@{profileData?.username}</p>
                            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                    {profileData?.old} 세
                                </span>
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                    {profileData?.gender}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 self-center md:self-start flex justify-center w-full">
                            {profileData && (
                                <div
                                    className="w-[200px] h-[50px] rounded-[10px] flex items-center justify-center text-white text-2xl font-semibold"
                                    style={{
                                        backgroundColor: discTypeColors[DISCCharacter] || discTypeColors.None,
                                    }}
                                >
                                    {DISCCharacter === null ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-8 h-8 mx-auto m-5 opacity-50"
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
                                        DISCCharacter
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
                                <KakaoShareButton username={profileData?.username} />
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
                            className="w-40 h-[50px] bg-[#9b8f8f] text-white text-xl font-bold rounded-[10px]"
                        >
                            프로필 수정
                        </button>
                    </div>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="w-[100%] max-w-[1150px]">
                    <div className="bg-white rounded-[50px] shadow-md mb-5 p-8 md:p-16 relative">
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">내가 추구하는 업무 스타일</h2>
                        <hr className="border-t border-gray-300 my-3" />
                        <div className="flex flex-wrap gap-3 mt-3 mb-8">
                            {profileData?.work_styles.map((style) => (
                                <span
                                    key={style.id}
                                    className="px-5 py-2 rounded-full bg-[#909bff] text-white text-md md:text-xl font-bold"
                                >
                                    {keywordIcons[style.name]}
                                </span>
                            ))}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 mt-30">타인이 바라보는 업무 스타일</h2>
                        <hr className="border-t border-gray-300 my-3" />
                        {profileData?.feedback_count >= 3 ? (
                            <>
                                <div className="flex flex-wrap gap-3 mt-3 mb-8">
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
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">내가 관심 있는 업종/직군 분야는?</h2>
                        <hr className="border-t border-gray-300 my-3" />
                        <div className="flex flex-wrap gap-3 mt-3 mb-20">
                            {profileData?.interests &&
                                profileData.interests.map((interest) => (
                                    <span
                                        key={interest.id}
                                        className="px-5 py-2 rounded-full bg-[#909bff] text-white text-md md:text-xl font-bold"
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
                    {/* 타인이 평가하는 나 */}
                    <div className="bg-white rounded-[50px] shadow-md mb-5 p-8 md:p-16 relative">
                        <div className="absolute top-8 right-12 bg-[#e1e1e1] px-4 py-2 rounded-[10px] text-xl font-bold">
                            {profileData?.feedback_count}개의 피드백이 쌓였어요
                        </div>
                        <div className="mt-16 flex items-center justify-between">
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
                                                        <span className="font-bold text-xl md:text-2xl">
                                                            {getKoreanLabel(key)}
                                                        </span>
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
                                                    <span className="font-bold text-[#9b8f8f] ml-4">
                                                        {value.toFixed(0)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>

                                {/* 친구 추측 */}
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl md:text-3xl font-extrabold">
                                        가장 많은 친구가 생각하는 내 업무 유형
                                    </h2>
                                    <span className="flex items-center cursor-pointer" onClick={toggleCharacterOpen}>
                                        <i
                                            className={`fas fa-chevron-${isCharacterOpen ? 'up' : 'down'} fa-lg mr-2`}
                                        ></i>
                                    </span>
                                </div>
                                <hr className="border-t border-gray-300 my-3 mb-5" />
                                {isCharacterOpen && (
                                    <div className="flex flex-wrap flex-col justify-center items-center text-center w-full mt-8">
                                        <div className="items-center justify-center flex flex-col">
                                            <div className="flex justify-center items-center space-x-8">
                                                <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 border border-gray-200 w-72 transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
                                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded">
                                                        1위
                                                    </div>
                                                    <div
                                                        className="w-48 h-[60px] rounded-[20px] flex items-center justify-center text-white text-2xl font-bold mt-5"
                                                        style={{ backgroundColor: discTypeColors[DISCCharacter] }}
                                                    >
                                                        {DISCData.disc_character}
                                                    </div>
                                                    <img
                                                        src={DISCData?.disc_img}
                                                        alt={DISCData?.disc_character}
                                                        className="w-44 h-44 mb-4 mt-4 rounded-full"
                                                    />
                                                    <div className="text-center max-w-xs text-gray-700 font-semibold">
                                                        {DISCCharacterValue}% 유저들의 선택
                                                    </div>
                                                </div>

                                                <div className="hidden md:flex flex-col items-center bg-white shadow-lg rounded-lg p-6 border border-gray-200 w-72 transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
                                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded">
                                                        2위
                                                    </div>
                                                    <div
                                                        className="w-48 h-[60px] rounded-[20px] flex items-center justify-center text-white text-2xl font-bold mt-5"
                                                        style={{ backgroundColor: discTypeColors[DISCCharacter2] }}
                                                    >
                                                        {DISCData2.disc_character}
                                                    </div>
                                                    <img
                                                        src={DISCData2?.disc_img}
                                                        alt={DISCData2?.disc_character}
                                                        className="w-44 h-44 mb-4 mt-4 rounded-full"
                                                    />
                                                    <div className="text-center max-w-xs text-gray-700 font-semibold">
                                                        {DISCCharacterValue2}% 유저들의 선택
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8 text-2xl md:text-3xl font-bold mb-4">
                                            {DISCData.disc_character}는..
                                        </div>

                                        <div className=" w-full md:w-[80%] text-xl mt-5">
                                            <p>{DISCData?.description}</p>
                                            <div className="font-semibold mt-8 mb-3">
                                                <strong className="mt-8 mb-2 font-bold text-[#4053FF]">
                                                    강점 및 보완할 점은?
                                                </strong>
                                            </div>
                                            <strong>이 유형의 강점은:</strong> {DISCData?.strength}
                                            <br />
                                            <strong>상대적으로 이 유형은:</strong> {DISCData?.weakness}
                                            <div className="font-semibold mt-16 mb-3">
                                                <strong className="mt-16 mb-2 font-bold text-[#4053FF]">
                                                    {DISCData?.disc_character}와 맞는 협업 유형은?
                                                </strong>
                                            </div>
                                            {DISCData?.suitable_type.map((type, index) => (
                                                <div key={index}>
                                                    <strong className="mt-12 mb-2 font-semibold text-[#4053FF]">
                                                        {type.name}
                                                    </strong>
                                                    <p>{type.description}</p>
                                                    <br />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* AI 요약 */}
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
                                                {formatListWithPagination(positive_feedback, true)}
                                            </div>
                                            <h3 className="text-3xl font-bold text-[#4053ff]">발전적 피드백</h3>
                                            <div className="flex-1 bg-[rgba(204,209,255,0.2)] rounded-[20px] p-12 m-5 md:m-12 text-xl">
                                                {formatListWithPagination(constructive_feedback, false)}
                                            </div>
                                        </div>
                                    </div>
                                )}
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
