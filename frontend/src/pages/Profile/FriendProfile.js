import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import WorkStyle from '../../components/Profile/WorkStyle';
import Feedback from '../../components/Profile/Feedback';
import typeData from '../../data/typeData.json';

function FriendProfile() {
    const [isLoading, setIsLoading] = useState(true);
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    // DISC
    const [DISCData, setDISCData] = useState(null);
    const [DISCData2, setDISCData2] = useState(null);
    const [DISCCharacter, setDISCCharacter] = useState(null);
    const [DISCCharacter2, setDISCCharacter2] = useState(null);
    const [DISCCharacterValue, setDISCCharacterValue] = useState('');
    const [DISCCharacterValue2, setDISCCharacterValue2] = useState('');
    // Friend Data
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoggedIn, setisLoggedIn] = useState(!!localStorage.getItem('authToken'));

    // GPT
    const [positiveFeedback, setPositiveFeedback] = useState({});
    const [constructiveFeedback, setConstructiveFeedback] = useState({});
    // 아코디언
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(true);
    const [isCharacterOpen, setIsCharacterOpen] = useState(true);
    const [isAIOpen, setIsAIOpen] = useState(true);
    const navigate = useNavigate();

    //남은 시간
    const [remainingTime, setRemainingTime] = useState(null);
    //피드백을 다시 남길 수 있는 상태 (시간 제한 풀린 상태)
    const [canLeaveFeedback, setCanLeaveFeedback] = useState(false);

    const toggleFeedbackOpen = () => {
        setIsFeedbackOpen(!isFeedbackOpen);
    };

    const toggleCharacterOpen = () => {
        setIsCharacterOpen(!isCharacterOpen);
    };

    const toggleAIOpen = () => {
        setIsAIOpen(!isAIOpen);
    };

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('authToken');
            setisLoggedIn(!!authToken);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await ProfileService.fetchFriendProfile(username);
                setProfileData(profileData);
                setIsFollowing(profileData.is_following);

                if (isLoggedIn) {
                    const myData = await ProfileService.fetchUserProfile();

                    if (profileData.username === myData.username) {
                        navigate('/my-profile');
                    }
                }

                // 초기 남은 시간 설정
                if (isLoggedIn) {
                    setCanLeaveFeedback(profileData.can_leave_feedback);
                    setRemainingTime(profileData.remaining_time);
                } else {
                    setCanLeaveFeedback(true);
                }

                if (profileData.profile_image && profileData.profile_image.image) {
                    const signedUrl = await ProfileService.getSignedImageUrl(profileData.profile_image.image);
                    setImageUrl(signedUrl);
                }

                const parsedPersonality =
                    profileData && profileData.gpt_summarized_personality
                        ? typeof profileData.gpt_summarized_personality === 'string'
                            ? JSON.parse(profileData.gpt_summarized_personality)
                            : profileData.gpt_summarized_personality
                        : {};

                setPositiveFeedback(parsedPersonality.positive_feedback);
                setConstructiveFeedback(parsedPersonality.constructive_feedback);

                const discCharacterData = profileData.disc_character;
                if (discCharacterData) {
                    const sortedCharacters = Object.entries(discCharacterData).sort((a, b) => b[1] - a[1]);
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

                    const discData = typeData.types.find((item) => item.disc_character === discCharacter1);
                    if (discData) {
                        setDISCData(discData);
                    } else {
                        console.error('DISC character not found:', discCharacter1, profileData.disc_character);
                    }

                    const discData2 = typeData.types.find((item) => item.disc_character === discCharacter2);
                    if (discData) {
                        setDISCData2(discData2);
                    } else {
                        console.error('DISC character not found:', discCharacter2, profileData.disc_character);
                    }
                }
            } catch (error) {
                console.error('프로필 정보를 불러오는 동안 오류가 발생했습니다.', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [username]);

    // 남은 시간을 실시간으로 업데이트하는 useEffect
    useEffect(() => {
        if (isLoggedIn) {
            let timer;
            if (remainingTime && remainingTime > 0) {
                timer = setInterval(() => {
                    setRemainingTime((prevTime) => {
                        if (prevTime <= 1) {
                            clearInterval(timer);
                            setCanLeaveFeedback(true);
                            return 0;
                        }
                        return prevTime - 1;
                    });
                }, 10000);
            }

            return () => {
                if (timer) clearInterval(timer);
            };
        }
    }, [remainingTime]);

    // 남은 시간을 포맷팅하는 함수
    const formatRemainingTime = (seconds) => {
        if (!seconds || seconds <= 0) return '지금 바로 협업 피드백을 남겨 보세요!';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}시간 ${minutes}분`;
    };

    const handleFeedbackClick = () => {
        if (canLeaveFeedback) {
            if (localStorage.getItem('workStyles')) {
                localStorage.removeItem('workStyles');
            }
            navigate(`/feedback/intro/${username}`);
        } else {
            alert(` ${formatRemainingTime(remainingTime)} 후에 다시 협업 평가를 남길 수 있어요!`);
        }
    };
    const getFeedbackMessage = () => {
        if (canLeaveFeedback) {
            return '지금 바로 협업 평가를 남겨보세요!';
        }
    };

    const handleFollowClick = async () => {
        if (!isLoggedIn) {
            alert('로그인이 필요한 기능입니다.');
            return;
        }

        try {
            let updatedFollowingStatus;
            if (isFollowing) {
                await ProfileService.unfollowUser(username);
                updatedFollowingStatus = false;
            } else {
                await ProfileService.followUser(username);
                updatedFollowingStatus = true;
            }
            setIsFollowing(updatedFollowingStatus);
            console.log('Updated following state:', updatedFollowingStatus);
        } catch (error) {
            console.error('팔로우/팔로우 취소 중 오류가 발생했습니다.', error);
        }
    };

    return (
        <div className="w-full bg-[#f6f6f6] min-h-screen py-6 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-5xl mx-auto">
                <ProfileHeader
                    profileData={profileData}
                    DISCCharacter={DISCCharacter}
                    discTypeColors={typeData.types.reduce((acc, item) => {
                        acc[item.disc_character] = item.color;
                        return acc;
                    }, {})}
                    imageUrl={imageUrl}
                    handleFollowClick={handleFollowClick}
                    isFollowing={isFollowing}
                    isMyProfile={false}
                    remainingTime={formatRemainingTime(remainingTime)}
                    canLeaveFeedback={canLeaveFeedback}
                    feedbackMessage={getFeedbackMessage()}
                    handleFeedbackClick={handleFeedbackClick}
                />
                <WorkStyle profileData={profileData} isMyProfile={false} />
                <Feedback
                    profileData={profileData}
                    positiveFeedback={positiveFeedback}
                    constructiveFeedback={constructiveFeedback}
                    DISCData={DISCData}
                    DISCData2={DISCData2}
                    DISCCharacter={DISCCharacter}
                    DISCCharacter2={DISCCharacter2}
                    DISCCharacterValue={DISCCharacterValue}
                    DISCCharacterValue2={DISCCharacterValue2}
                    isFeedbackOpen={isFeedbackOpen}
                    isCharacterOpen={isCharacterOpen}
                    isAIOpen={isAIOpen}
                    toggleFeedbackOpen={toggleFeedbackOpen}
                    toggleCharacterOpen={toggleCharacterOpen}
                    toggleAIOpen={toggleAIOpen}
                />
            </div>
        </div>
    );
}

export default FriendProfile;
