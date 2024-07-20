import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './FriendProfile.module.css';
import ProfileService from '../../utils/ProfileService';
import DataService from '../../utils/DataService';
import keywordIcons from '../../components/KeywordIcons/KeywordIcons';

function FriendProfile() {
    const discTypeColors = {
        '목표 달성자': '#FF5473',
        디테일리스트: '#55B807',
        중재가: '#92604B',
        '컨트롤 타워': '#00B680',
        불도저: '#FF4B40',
        애널리스트: '#7D40FF',
        커뮤니케이터: '#FFC554',
        프로세서: '#1E74D9',
    };

    const { username } = useParams();
    const [DISCData, setDISCData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
    const [showWarning, setShowWarning] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('authToken');
            setIsAuthenticated(!!authToken);
            setShowWarning(!authToken);
        };

        checkAuth();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await ProfileService.fetchFriendProfile(username);
                profileData.old = 2025 - profileData.age; // 나이 계산
                profileData.gender =
                    profileData.gender === 'F' ? 'Female' : profileData.gender === 'M' ? 'Male' : 'None';
                setProfileData(profileData);
                setIsFollowing(profileData.is_following);

                if (profileData.disc_character !== 'None') {
                    const discData = await DataService.fetchDISCData(profileData.disc_character);
                    setDISCData(discData);
                }
            } catch (error) {
                console.error('프로필 정보를 불러오는 동안 오류가 발생했습니다.', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    const handleFollowClick = async () => {
        try {
            if (isFollowing) {
                // 언팔하기
                await ProfileService.unfollowUser(username);
                setIsFollowing(false);
            } else {
                // 팔로우하기
                await ProfileService.followUser(username);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('팔로우/팔로우 취소 중 오류가 발생했습니다.', error);
            if (!isAuthenticated && showWarning) {
                alert('로그인이 필요한 페이지입니다.');
                setShowWarning(false);
                // setRedirect(true);
            }
        }
    };

    const handleFeedbackClick = () => {
        navigate(`/feedback/intro/${username}`);
    };

    if (loading) {
        // 여기에 랜더링 후 변경 페이지 쓰기
        return <div className={styles.profileContainer}></div>;
    }

    if (!profileData) {
        return <div className={styles.profileContainer}></div>;
    }

    return (
        <div className={styles.profileContainer}>
            <React.Fragment>
                <div className={styles.profileContent}>
                    <div className={styles.profileHeader}>
                        <div className={styles.mainProfile}>
                            <img
                                src={profileData.profileImage || '/images/basicProfile.png'}
                                alt="Profile"
                                className={styles.profileImage}
                            />
                            <div className={styles.profileDetails}>
                                <div className={styles.basicDetails}>
                                    <h1>{profileData.name}</h1>
                                    <div className={styles.detailsContainer}>
                                        <div className={styles.detailLabel}>나이</div>
                                        <div className={styles.detailValue}>{profileData.old}</div>
                                    </div>
                                    <div className={styles.detailsContainer}>
                                        <div className={styles.detailLabel}>성별</div>
                                        <div className={styles.detailValue}>{profileData.gender}</div>
                                    </div>
                                    <div className={styles.detailsContainer}>
                                        <div className={styles.detailLabel}>ID</div>
                                        <div className={styles.detailValue}>{profileData.username}</div>
                                    </div>
                                </div>
                                <div className={styles.basicDetails}>
                                    {profileData &&
                                        (profileData.disc_character === 'None' ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="164"
                                                height="187"
                                                viewBox="0 0 164 187"
                                                fill="none"
                                                className={styles.defaultDiscSvg}
                                            >
                                                <path
                                                    d="M145.592 81.5315H136.856V55.3249C136.856 24.8234 112.033 0 81.5315 0C51.03 0 26.2066 24.8234 26.2066 55.3249V81.5315H17.471C7.82557 81.5315 0 89.3571 0 99.0025V168.887C0 178.532 7.82557 186.358 17.471 186.358H145.592C155.237 186.358 163.063 178.532 163.063 168.887V99.0025C163.063 89.3571 155.237 81.5315 145.592 81.5315ZM107.738 81.5315H55.3249V55.3249C55.3249 40.8749 67.0815 29.1184 81.5315 29.1184C95.9815 29.1184 107.738 40.8749 107.738 55.3249V81.5315Z"
                                                    fill="black"
                                                    fillOpacity="0.25"
                                                />
                                            </svg>
                                        ) : (
                                            <div
                                                className={styles.profileDisc}
                                                style={{
                                                    backgroundColor:
                                                        discTypeColors[profileData.disc_character] ||
                                                        discTypeColors.None,
                                                }}
                                            >
                                                {profileData.disc_character}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightHeader}>
                            <button
                                className={isFollowing ? styles.unfollowButton : styles.followButton}
                                onClick={handleFollowClick}
                            >
                                {isFollowing ? '팔로우 취소' : '팔로우'}
                            </button>
                            <button className={styles.feedbackButton} onClick={handleFeedbackClick}>
                                협업 평가 작성
                            </button>
                        </div>
                    </div>
                    <div className={styles.sectionsContainer}>
                        <div className={styles.section}>
                            <h2>{profileData.name}님이 추구하는 업무 스타일</h2>
                            <hr className={styles.divider} />
                            <div className={styles.stylesContainer}>
                                {profileData.work_styles.map((style) => (
                                    <span key={style.id} className={styles.styleTagMe}>
                                        {keywordIcons[style.name]}
                                        {style.name}
                                    </span>
                                ))}
                            </div>

                            <h2>타인이 바라보는 업무 스타일</h2>
                            <hr className={styles.divider} />
                            {profileData.feedback_count >= 3 ? (
                                <>
                                    <div className={styles.stylesContainer}>
                                        {profileData.feedback_workstyles &&
                                            profileData.feedback_workstyles.map((style) => (
                                                <span key={style.id} className={styles.styleTagYou}>
                                                    {keywordIcons[style.name]}
                                                    {style.name}
                                                </span>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <div className={styles.feedbackMessage}>
                                    <div className={styles.lockIcon}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="164"
                                            height="187"
                                            viewBox="0 0 164 187"
                                            fill="none"
                                        >
                                            <path
                                                d="M145.592 81.5315H136.856V55.3249C136.856 24.8234 112.033 0 81.5315 0C51.03 0 26.2066 24.8234 26.2066 55.3249V81.5315H17.471C7.82557 81.5315 0 89.3571 0 99.0025V168.887C0 178.532 7.82557 186.358 17.471 186.358H145.592C155.237 186.358 163.063 178.532 163.063 168.887V99.0025C163.063 89.3571 155.237 81.5315 145.592 81.5315ZM107.738 81.5315H55.3249V55.3249C55.3249 40.8749 67.0815 29.1184 81.5315 29.1184C95.9815 29.1184 107.738 40.8749 107.738 55.3249V81.5315Z"
                                                fill="black"
                                                fillOpacity="0.25"
                                            />
                                        </svg>
                                    </div>
                                    <p>피드백을 좀 더 모아볼까요? 최소 3명의 응답이 모이면 응답이 공개됩니다.</p>
                                </div>
                            )}
                            <h2>{profileData.name}님이 관심 있는 업종/직군 분야는?</h2>
                            <hr className={styles.divider} />
                            <div className={styles.stylesContainer}>
                                {profileData.interests &&
                                    profileData.interests.map((interest) => (
                                        <span key={interest.id} className={styles.interestTag}>
                                            {interest.name}
                                        </span>
                                    ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2>타인이 평가하는 {profileData.name}</h2>
                            <div className={styles.feedbackCount}>답변수: {profileData.feedback_count}</div>
                            <hr className={styles.divider} />
                            {profileData.feedback_count >= 3 ? (
                                <>
                                    <div className={styles.discContainer}>
                                        {profileData.disc_scores &&
                                            Object.entries(profileData.disc_scores).map(([key, value]) => (
                                                <div key={key} className={styles.discBar}>
                                                    <span className={styles.discLabel}>{key}</span>
                                                    <div className={styles.progressBar}>
                                                        <div
                                                            className={styles.progress}
                                                            style={{ width: `${value}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={styles.score}>{value.toFixed(0)}</span>
                                                </div>
                                            ))}
                                    </div>
                                    <div className={styles.typeCards}>
                                        <div
                                            className={styles.typeCard}
                                            style={{ backgroundColor: discTypeColors[profileData.disc_character] }}
                                        >
                                            {DISCData.disc_character}
                                        </div>
                                        <div className={styles.typeDescription}>
                                            <p>{DISCData.description}</p>
                                            <div className={styles.typeQuestion}>
                                                <strong>강점 및 보완할 점은?</strong>
                                            </div>
                                            <strong>• 강점:</strong> {DISCData.strength.join(', ')}
                                            <br />
                                            <strong>• 보완할 점:</strong> {DISCData.weakness.join(', ')}
                                            <div className={styles.typeQuestion}>
                                                <strong>{DISCData.disc_character}와 맞는 협업 유형은?</strong>
                                            </div>
                                            {DISCData.suitable_type.map((type, index) => (
                                                <div key={index}>
                                                    <strong>• {type.name}:</strong>
                                                    <p>{type.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.aiContainer}>
                                        <div className={styles.aiHeader}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="34"
                                                height="50"
                                                viewBox="0 0 34 38"
                                                fill="none"
                                            >
                                                <path
                                                    d="M22.4512 38C24.1716 38 25.7487 37.0663 26.6074 35.576C27.809 33.492 28.5 31.0791 28.5 28.5C28.5 25.8192 27.7519 23.3188 26.4634 21.1805L29.6875 17.9565L30.3837 18.6527C30.8475 19.1165 31.5994 19.1165 32.0632 18.6527L32.9019 17.8125C33.3658 17.3486 33.3658 16.5968 32.9019 16.1329L28.9913 12.2223C28.5275 11.7585 27.7756 11.7585 27.3118 12.2223L26.4723 13.0618C26.0085 13.5256 26.0085 14.2775 26.4723 14.7413L27.1685 15.4375L24.2436 18.3625C23.3856 17.5186 22.423 16.7794 21.375 16.1723V4.7307L22.5603 4.72922C23.2149 4.72848 23.7455 4.19781 23.7463 3.5432L23.7493 1.18899C23.75 0.532149 23.2171 -0.000741413 22.5603 7.74325e-07L5.93973 0.0192976C5.28512 0.0200398 4.75445 0.550704 4.75371 1.20531L4.75074 3.56027C4.75 4.21711 5.28289 4.74926 5.93973 4.74852L7.125 4.74703V16.1715C2.87004 18.6363 0 23.2282 0 28.5C0 31.0791 0.690977 33.4927 1.89258 35.576C2.75203 37.0663 4.32918 38 6.04883 38H22.4512ZM8.9107 19.2546L10.6875 18.2252V4.74332L17.8125 4.73516V18.2252L19.5893 19.2546C21.4307 20.3211 22.8638 21.9064 23.7871 23.75H4.71289C5.63691 21.9064 7.06934 20.3211 8.9107 19.2546Z"
                                                    fill="#4053FF"
                                                />
                                            </svg>
                                            <h2>AI 요약</h2>
                                        </div>
                                        <div className={styles.aiSummary}>
                                            <p>
                                                팀원들은 {profileData.name}님의 협업 성향에 대해 다음과 같이 느꼈어요!
                                            </p>
                                            <div className={styles.aiFeedback}>
                                                <div className={styles.feedbackSummary}>
                                                    <p>{profileData.gpt_summarized_personality}</p>
                                                </div>
                                                <div className={styles.feedbackSummary}>
                                                    <p>{profileData.gpt_summarized_personality}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.feedbackMessage}>
                                    <div className={styles.lockIcon}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="164"
                                            height="187"
                                            viewBox="0 0 164 187"
                                            fill="none"
                                        >
                                            <path
                                                d="M145.592 81.5315H136.856V55.3249C136.856 24.8234 112.033 0 81.5315 0C51.03 0 26.2066 24.8234 26.2066 55.3249V81.5315H17.471C7.82557 81.5315 0 89.3571 0 99.0025V168.887C0 178.532 7.82557 186.358 17.471 186.358H145.592C155.237 186.358 163.063 178.532 163.063 168.887V99.0025C163.063 89.3571 155.237 81.5315 145.592 81.5315ZM107.738 81.5315H55.3249V55.3249C55.3249 40.8749 67.0815 29.1184 81.5315 29.1184C95.9815 29.1184 107.738 40.8749 107.738 55.3249V81.5315Z"
                                                fill="black"
                                                fillOpacity="0.25"
                                            />
                                        </svg>
                                    </div>
                                    <p>피드백을 좀 더 모아볼까요? 최소 3명의 응답이 모이면 응답이 공개됩니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </div>
    );
}

export default FriendProfile;
