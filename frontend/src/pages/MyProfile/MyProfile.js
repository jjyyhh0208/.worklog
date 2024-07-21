import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyProfile.module.css';
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
        return <div className={styles.profileContainer}>Loading...</div>;
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

    const handleSlackShare = () => {
        if (!profileData || !profileData.username) {
            alert('프로필 데이터를 불러오는데 문제가 발생했습니다. 페이지를 새로고침하고 다시 시도해주세요.');
            return;
        }

        let profileLink = ProfileService.getUserProfileLink(profileData.username);
        if (!profileLink.startsWith('http')) {
            profileLink = 'https://' + profileLink;
        }
        const text = `${profileData.name}님의 프로필을 확인해보세요: ${profileLink}`;

        // 더블 인코딩 적용
        const encodedUrl = encodeURIComponent(encodeURIComponent(profileLink));
        const encodedText = encodeURIComponent(text);

        const slackShareUrl = `https://slack.com/share/url?url=${encodedUrl}&text=${encodedText}`;

        // 새 창에서 Slack 공유 페이지 열기
        window.open(slackShareUrl, '_blank', 'noopener,noreferrer');
    };

    const handleKeywordEdit = () => {
        navigate('/signup/3', { state: { isEditing: true, profileData } });
    };

    const handleProfileEdit = () => {
        navigate('/signup/2', { state: { isEditing: true, profileData } });
    };

    return (
        <div className={styles.profileContainer}>
            <React.Fragment>
                <div className={styles.profileContent}>
                    <div className={styles.profileHeader}>
                        <div className={styles.mainProfile}>
                            <img
                                src={imageUrl || '/images/basicProfile.png'}
                                alt="Profile"
                                className={styles.profileImage}
                            />
                            <div className={styles.profileDetails}>
                                <div className={styles.basicDetails}>
                                    <h1>{profileData?.username}</h1>
                                    <div className={styles.detailsContainer}>
                                        <div className={styles.detailLabel}>나이</div>
                                        <div className={styles.detailValue}>{profileData?.old}</div>
                                    </div>
                                    <div className={styles.detailsContainer}>
                                        <div className={styles.detailLabel}>성별</div>
                                        <div className={styles.detailValue}>{profileData?.gender}</div>
                                    </div>
                                    <div className={styles.detailsContainer}>
                                        <div className={styles.detailLabel}>ID</div>
                                        <div className={styles.detailValue}>{profileData?.username}</div>
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
                            <div className={styles.socialLinks}>
                                <a href="#" onClick={handleCopyLink}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 40 40"
                                        fill="none"
                                    >
                                        <path
                                            d="M33.75 25H31.25C30.9185 25 30.6005 25.1317 30.3661 25.3661C30.1317 25.6005 30 25.9185 30 26.25V35H5V10H16.25C16.5815 10 16.8995 9.8683 17.1339 9.63388C17.3683 9.39946 17.5 9.08152 17.5 8.75V6.25C17.5 5.91848 17.3683 5.60054 17.1339 5.36612C16.8995 5.1317 16.5815 5 16.25 5H3.75C2.75544 5 1.80161 5.39509 1.09835 6.09835C0.395088 6.80161 0 7.75544 0 8.75L0 36.25C0 37.2446 0.395088 38.1984 1.09835 38.9016C1.80161 39.6049 2.75544 40 3.75 40H31.25C32.2446 40 33.1984 39.6049 33.9016 38.9016C34.6049 38.1984 35 37.2446 35 36.25V26.25C35 25.9185 34.8683 25.6005 34.6339 25.3661C34.3995 25.1317 34.0815 25 33.75 25ZM38.125 0H28.125C26.4555 0 25.6211 2.02422 26.7969 3.20312L29.5883 5.99453L10.5469 25.0289C10.3721 25.2031 10.2334 25.4101 10.1387 25.638C10.0441 25.8659 9.9954 26.1103 9.9954 26.357C9.9954 26.6038 10.0441 26.8482 10.1387 27.0761C10.2334 27.304 10.3721 27.511 10.5469 27.6852L12.318 29.4531C12.4922 29.6279 12.6991 29.7666 12.9271 29.8613C13.155 29.9559 13.3993 30.0046 13.6461 30.0046C13.8929 30.0046 14.1372 29.9559 14.3651 29.8613C14.593 29.7666 14.8 29.6279 14.9742 29.4531L34.0062 10.4156L36.7969 13.2031C37.9688 14.375 40 13.5547 40 11.875V1.875C40 1.37772 39.8025 0.900805 39.4508 0.549175C39.0992 0.197544 38.6223 0 38.125 0Z"
                                            fill="black"
                                        />
                                    </svg>
                                </a>
                                <KakaoShareButton />
                                <a href="#" onClick={handleInstagramShare}>
                                    <img src="/images/instagram.png" alt="Instagram" width="40" height="40" />
                                </a>
                                <a href="#" onClick={handleSlackShare}>
                                    <img src="/images/slack.png" alt="Slack" width="60" height="30" />
                                </a>
                            </div>
                            <button className={styles.profileEditButton} onClick={handleProfileEdit}>
                                프로필 수정
                            </button>
                        </div>
                    </div>
                    <div className={styles.sectionsContainer}>
                        <div className={styles.section}>
                            <h2>내가 추구하는 업무 스타일</h2>
                            <hr className={styles.divider} />
                            <div className={styles.stylesContainer}>
                                {profileData?.work_styles.map((style) => (
                                    <span key={style.id} className={styles.styleTagMe}>
                                        {keywordIcons[style.name]}
                                        {style.name}
                                    </span>
                                ))}
                            </div>

                            <h2>타인이 바라보는 업무 스타일</h2>
                            <hr className={styles.divider} />
                            {profileData?.feedback_count >= 3 ? (
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
                            <h2>내가 관심 있는 업종/직군 분야는?</h2>
                            <hr className={styles.divider} />
                            <div className={styles.stylesContainer}>
                                {profileData?.interests &&
                                    profileData.interests.map((interest) => (
                                        <span key={interest.id} className={styles.interestTag}>
                                            {interest.name}
                                        </span>
                                    ))}
                            </div>
                            <button className={styles.keywordEditButton} onClick={handleKeywordEdit}>
                                키워드 수정
                            </button>
                        </div>

                        <div className={styles.section}>
                            <h2>타인이 평가하는 나</h2>
                            <div className={styles.feedbackCount}>답변수: {profileData?.feedback_count}</div>
                            <hr className={styles.divider} />
                            {profileData?.feedback_count >= 3 ? (
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
                                        {profileData && DISCData ? (
                                            <div
                                                className={styles.typeCard}
                                                style={{ backgroundColor: discTypeColors[profileData.disc_character] }}
                                            >
                                                {DISCData.disc_character}
                                            </div>
                                        ) : (
                                            <div className={styles.typeCard}>데이터 로딩 중...</div>
                                        )}
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
                                            <p>팀원들은 나의 협업 성향에 대해 다음과 같이 느꼈어요!</p>
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

export default MyProfile;
