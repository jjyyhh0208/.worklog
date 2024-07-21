import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './FeedbackLong.module.css';
import ProgressBar from '../../components/ProgressBar/ProgressBar'; // ProgressBar import
import FeedbackService from '../../utils/FeedbackService';
import ProfileService from '../../utils/ProfileService';

const FeedbackLong = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const { username } = useParams();
    const location = useLocation();
    const { answers, scores } = location.state || {};
    const [profileData, setProfileData] = useState(null);
    const [myprofileData, setMyProfileData] = useState();
    const [feedbackData, setFeedbackData] = useState({
        long_questions: {
            question1: '',
            question2: '',
            question3: '',
        },
    });

    useEffect(() => {
        ProfileService.fetchFriendProfile(username)
            .then((data) => setProfileData(data))
            .catch((error) => console.error('Error fetching profile data:', error));
    }, [username]);

    useEffect(() => {
        if (isLoggedIn) {
            ProfileService.fetchUserProfile()
                .then((data) => setMyProfileData(data))
                .catch((error) => console.error('Error fetching profile data:', error));
        }
    }, [myprofileData]);

    const handleInputChange = (event, question) => {
        const { value } = event.target;
        setFeedbackData((prevData) => ({
            ...prevData,
            long_questions: {
                ...prevData.long_questions,
                [question]: value,
            },
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const { question1, question2, question3 } = feedbackData.long_questions;

        if (!question1 || !question2 || !question3) {
            alert('모든 문항에 답해주세요.');
            return;
        }

        if (!profileData) {
            console.error('프로필을 불러오는 데에 실패했습니다.');
            return;
        }
        const workStylesData = (JSON.parse(localStorage.getItem('workStyles')) || { work_styles: [] }).work_styles;
        const scores = JSON.parse(localStorage.getItem('scores')) || { D: 0, I: 0, S: 0, C: 0 };

        const finalFeedbackData = {
            id: profileData.id,
            user: profileData.username,
            user_by: myprofileData?.username || '',
            work_styles: workStylesData,
            score: {
                d_score: scores.D,
                i_score: scores.I,
                s_score: scores.S,
                c_score: scores.C,
            },
            question_answers: [
                {
                    question: { long_question: '협업 경험에서 좋았던 점은 무엇이었나요?' },
                    answer: feedbackData.long_questions.question1,
                },
                {
                    question: { long_question: '협업 경험에서 아쉬웠던 점은 무엇이었나요?' },
                    answer: feedbackData.long_questions.question2,
                },
                {
                    question: { long_question: '마지막으로 하고 싶은 말을 적어주세요!' },
                    answer: feedbackData.long_questions.question3,
                },
            ],
        };

        FeedbackService.submitAnswers(finalFeedbackData)
            .then(() => navigate(`/friend-profile/${username}`))
            .catch((error) => console.error('Error submitting feedback:', error));
    };

    const handleBackClick = () => {
        navigate(`/feedback/3/${username}`, {
            state: { ...location.state, answers, scores },
        });
    };

    return (
        <div className={styles.feedbackLongcontainer}>
            <div className={styles.content}>
                <ProgressBar progress={100} />
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
                <div className={styles.pageIndicator}>5/5</div> {/* ProgressBar 추가 */}
                <div className={styles.instructions}>
                    <div>
                        마지막으로 {profileData ? `${profileData.name}` : '유저'}님에게 하고 싶은 말을 자유롭게
                        써주세요.
                    </div>
                    <div className={styles.fontinstructions}>
                        * 해당 설문 내용은 익명으로 사용자에게 전달되며, 특정될 수 있는 정보 (회사명, 팀명) 등을 쓰지
                        않는 것을 권장드립니다.
                    </div>
                </div>
                <div className={styles.qnabox}>
                    <div className={styles.questions}>협업 경험에서 좋았던 점은 무엇이었나요?</div>
                    <div className={styles.answers}>
                        <textarea
                            placeholder="회의 때의 모습, 준비성, 아이스브레이킹, 역량, 커뮤니케이션 방법 등 다양한 측면에서 자유롭게 의견을 남겨 주세요. 따뜻한 피드백을 기다립니다."
                            value={feedbackData.long_questions.question1}
                            onChange={(event) => handleInputChange(event, 'question1')}
                        />
                    </div>
                    <div className={styles.questions}>협업 경험에서 아쉬웠던 점은 무엇이었나요?</div>
                    <div className={styles.answers}>
                        <textarea
                            placeholder="회의 때의 모습, 준비성, 아이스브레이킹, 역량, 커뮤니케이션 방법 등 다양한 측면에서 자유롭게 의견을 남겨 주세요. 따뜻한 피드백을 기다립니다."
                            value={feedbackData.long_questions.question2}
                            onChange={(event) => handleInputChange(event, 'question2')}
                        />
                    </div>
                    <div className={styles.questions}>마지막으로 하고 싶은 말을 적어주세요!</div>
                    <div className={styles.answers}>
                        <textarea
                            placeholder="자유롭게 하고 싶은 말을 적어주세요! 없을 시 '없음'을 기재해주세요."
                            value={feedbackData.long_questions.question3}
                            onChange={(event) => handleInputChange(event, 'question3')}
                        />
                    </div>
                </div>
                <div className={styles.submitButtonContainer}>
                    <button className={styles.submitButton} onClick={handleFormSubmit}>
                        완료
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackLong;
