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
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

    // GPT
    const [positiveFeedback, setPositiveFeedback] = useState(null);
    const [constructiveFeedback, setConstructiveFeedback] = useState(null);
    // 아코디언
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(true);
    const [isCharacterOpen, setIsCharacterOpen] = useState(true);
    const [isAIOpen, setIsAIOpen] = useState(true);
    const navigate = useNavigate();

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
            setIsAuthenticated(!!authToken);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await ProfileService.fetchFriendProfile(username);
                setProfileData(profileData);
                setIsFollowing(profileData.is_following);

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

    const handleFollowClick = async () => {
        if (!isAuthenticated) {
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

    const handleFeedbackClick = () => {
        if (localStorage.getItem('workStyles')) {
            localStorage.removeItem('workStyles');
        }
        navigate(`/feedback/intro/${username}`);
    };

    if (isLoading) {
        return <div className="[w-100%] bg-[#f6f6f6] h-[1000px] min-h-screen flex items-center justify-center"></div>;
    }

    console.log(positiveFeedback);

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
                    handleFeedbackClick={handleFeedbackClick}
                    isFollowing={isFollowing}
                    isMyProfile={false}
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
