import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import WorkStyle from '../../components/Profile/WorkStyle';
import Feedback from '../../components/Profile/Feedback';
import typeData from '../../data/typeData.json';

function MyProfile() {
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [bio, setBio] = useState(''); //프로필 한줄소개
    const [tempBio, setTempBio] = useState('');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [DISCData, setDISCData] = useState(null); // DISC
    const [DISCData2, setDISCData2] = useState(null);
    const [DISCCharacter, setDISCCharacter] = useState(null);
    const [DISCCharacter2, setDISCCharacter2] = useState('');
    const [DISCCharacterValue, setDISCCharacterValue] = useState('');
    const [DISCCharacterValue2, setDISCCharacterValue2] = useState('');
    // 아코디언
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(true);
    const [isCharacterOpen, setIsCharacterOpen] = useState(true);
    const [isAIOpen, setIsAIOpen] = useState(true);
    const navigate = useNavigate();

    // GPT
    const [positiveFeedback, setPositiveFeedback] = useState(null);
    const [constructiveFeedback, setConstructiveFeedback] = useState(null);

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
        const fetchData = async () => {
            try {
                const profileData = await ProfileService.fetchUserProfile();
                setProfileData(profileData);
                setBio(profileData.bio || '');
                setTempBio(profileData.bio || '');

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
    }, []);

    if (isLoading) {
        return <div className="[w-100%] bg-[#f6f6f6] h-[1000px] min-h-screen flex items-center justify-center"></div>;
    }

    const handleCopyLink = () => {
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
    };

    const handleInstagramShare = () => {
        const profileLink = ProfileService.getUserProfileLink(profileData?.username);
        const instagramUrl = `instagram://story-camera?text=${encodeURIComponent(profileLink)}`;

        setTimeout(() => {
            window.location.href = instagramUrl;
        }, 100);

        setTimeout(() => {
            if (document.hidden) {
                return;
            }
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

    const handleProfileEdit = () => {
        navigate('/signup/2', { state: { isEditing: true, profileData } });
    };

    const handleKeywordEdit = () => {
        navigate('/signup/3', { state: { isEditing: true, profileData } });
    };

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };

    const handleBioEditToggle = () => {
        if (isEditingBio) {
            setTempBio(bio);
        }
        setIsEditingBio(!isEditingBio);
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
                    handleCopyLink={handleCopyLink}
                    handleInstagramShare={handleInstagramShare}
                    handleProfileEdit={handleProfileEdit}
                    imageUrl={imageUrl}
                    isMyProfile={true}
                    bio={bio}
                    tempBio={tempBio}
                    isEditingBio={isEditingBio}
                    onBioChange={handleBioChange}
                    onBioEditToggle={handleBioEditToggle}
                />
                <WorkStyle profileData={profileData} handleKeywordEdit={handleKeywordEdit} isMyProfile={true} />
                <Feedback
                    profileData={profileData}
                    positive_feedback={positiveFeedback}
                    constructive_feedback={constructiveFeedback}
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

export default MyProfile;
