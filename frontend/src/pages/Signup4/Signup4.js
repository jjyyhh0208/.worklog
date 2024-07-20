import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Signup4.module.css';
import ProfileService from '../../utils/ProfileService';

function Signup4({ signUpInfo, setSignUpInfo }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;
    const profileData = location.state?.profileData || {};
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        ProfileService.fetchInterests()
            .then((data) => {
                setKeywords(data.map((item) => item.name));
            })
            .catch((error) => {
                console.error('Error fetching interests:', error);
            });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const interestsData = await ProfileService.fetchInterests();
                const fetchedKeywords = interestsData.map((item) => item.name);
                setKeywords(fetchedKeywords);

                if (isEditing) {
                    const userProfileData = await ProfileService.fetchUserProfile();
                    const fetchedKeywords = userProfileData.interests.map((item) => item.name) || [];
                    console.log(fetchedKeywords);
                    setSelectedKeywords(fetchedKeywords);
                    setSignUpInfo({
                        ...signUpInfo,
                        interests: {
                            keyword1: fetchedKeywords[0] || '',
                            keyword2: fetchedKeywords[1] || '',
                            keyword3: fetchedKeywords[2] || '',
                        },
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [isEditing]);

    // Handle keyword click to toggle selection
    const handleKeywordClick = (keyword) => {
        let newKeywords = [...selectedKeywords];
        if (newKeywords.includes(keyword)) {
            newKeywords = newKeywords.filter((kw) => kw !== keyword);
        } else {
            if (newKeywords.length < 3) {
                newKeywords.push(keyword);
            } else {
                alert('You can select up to 3 keywords only.');
            }
        }
        setSelectedKeywords(newKeywords);

        // Update selected keywords in signUpInfo
        setSignUpInfo((prevSignUpInfo) => ({
            ...prevSignUpInfo,
            interests: {
                keyword1: newKeywords[0] || '',
                keyword2: newKeywords[1] || '',
                keyword3: newKeywords[2] || '',
            },
        }));
    };

    // Handle 'Complete' button click to save selected keywords
    const handleCompleteClick = () => {
        const selectedKeywordIds = selectedKeywords
            .map((keyword) => {
                const index = keywords.indexOf(keyword);
                return index > -1 ? index + 1 : null;
            })
            .filter((id) => id !== null);

        if (selectedKeywords.length === 0) {
            alert('최소 1개의 키워드를 선택해주세요.');
            return;
        }

        // Save selected keywords and navigate accordingly
        ProfileService.setUserInterest(selectedKeywordIds)
            .then(() => {
                if (isEditing) {
                    navigate('/my-profile'); // Navigate to profile page if editing
                } else {
                    navigate('/on-boarding/1'); // Navigate to onboarding page if signing up
                }
            })
            .catch((error) => {
                console.error('Error setting user interests:', error);
            });
        console.log(signUpInfo);
    };

    const logoHandler = () => {
        navigate('/'); // Navigate to home page when logo is clicked
    };
    const handleBackClick = () => {
        console.log(signUpInfo);
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1} onClick={logoHandler}>
                .WORKLOG
            </h1>
            <h2 className={styles.h2}>기본 프로필 등록</h2>
            <div className={styles.back}>
                <button type="submit" onClick={handleBackClick} className={styles.backBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="50" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15.5 19l-7-7 7-7"
                            stroke="#4053ff"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
            <p className={styles.instruction}>관심있는 업종/직군 분야를 골라 주세요.</p>
            <div className={styles.instructionbox}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
                    <g clipPath="url(#clip0_231_547)">
                        <path
                            d="M12.5 1.06104C5.81265 1.06104 0.390625 6.48501 0.390625 13.1704C0.390625 19.8597 5.81265 25.2798 12.5 25.2798C19.1874 25.2798 24.6094 19.8597 24.6094 13.1704C24.6094 6.48501 19.1874 1.06104 12.5 1.06104ZM12.5 6.43213C13.6326 6.43213 14.5508 7.35029 14.5508 8.48291C14.5508 9.61553 13.6326 10.5337 12.5 10.5337C11.3674 10.5337 10.4492 9.61553 10.4492 8.48291C10.4492 7.35029 11.3674 6.43213 12.5 6.43213ZM15.2344 18.8345C15.2344 19.1581 14.972 19.4204 14.6484 19.4204H10.3516C10.028 19.4204 9.76562 19.1581 9.76562 18.8345V17.6626C9.76562 17.339 10.028 17.0767 10.3516 17.0767H10.9375V13.9517H10.3516C10.028 13.9517 9.76562 13.6893 9.76562 13.3657V12.1938C9.76562 11.8703 10.028 11.6079 10.3516 11.6079H13.4766C13.8001 11.6079 14.0625 11.8703 14.0625 12.1938V17.0767H14.6484C14.972 17.0767 15.2344 17.339 15.2344 17.6626V18.8345Z"
                            fill="#29A02D"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_231_547">
                            <rect width="25" height="25" fill="white" transform="translate(0 0.67041)" />
                        </clipPath>
                    </defs>
                </svg>
                <span className={styles.span}>
                    키워드는 최대 3개까지 선택해주세요. 제한없이 수정이 가능하니 편하게 골라주세요!
                </span>
            </div>
            <div className={styles.keywordsContainer}>
                {keywords.map((keyword) => (
                    <button
                        key={keyword}
                        className={`${styles.keywordButton} ${
                            selectedKeywords.includes(keyword) ? styles.selected : ''
                        }`}
                        onClick={() => handleKeywordClick(keyword)}
                    >
                        {keyword}
                    </button>
                ))}
            </div>
            <div className={styles.nextbox}>
                <button className={styles.completeBtn} type="submit" onClick={handleCompleteClick}>
                    {isEditing ? '수정 완료' : '가입 완료'} {/* Change button text based on editing mode */}
                </button>
            </div>
        </div>
    );
}

export default Signup4;
