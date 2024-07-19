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
    const [profileData, setProfileData] = useState(location.state?.profileData || null);
    const [myprofileData, setMyProfileData] = useState();
    const [feedbackData, setFeedbackData] = useState({
        long_questions: {
            question1: '',
            question2: '',
            question3: '',
        },
    });

    useEffect(() => {
        if (!profileData) {
            ProfileService.fetchFriendProfile(username)
                .then((data) => setProfileData(data))
                .catch((error) => console.error('Error fetching profile data:', error));
        }
    }, [username, profileData]);

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

        if (!profileData) {
            console.error('Profile data is missing');
            return;
        }
        const workStylesData = (JSON.parse(localStorage.getItem('workStyles')) || { work_styles: [] }).work_styles;
        const scores = JSON.parse(localStorage.getItem('scores')) || { D: 0, I: 0, S: 0, C: 0 };

        const finalFeedbackData = {
            id: profileData.id,
            user: profileData.username,
            user_by: myprofileData.username,
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

    return (
        <div className={styles.feedbackLongcontainer}>
            <div className={styles.content}>
                <ProgressBar progress={100} />
                <div className={styles.pageIndicator}>5/5</div> {/* ProgressBar 추가 */}
                <div className={styles.top}>
                    <div className={styles.textbox}>
                        <h3 className={styles.text}>
                            ※해당 설문 내용은 익명으로 사용자에게 전달되며, 특정될 수 있는 정보 (회사명, 팀명) 등을 쓰지
                            않는 것을 권장드립니다.
                        </h3>
                    </div>
                </div>
                <div className={styles.qnabox}>
                    <div className={styles.questions}>협업 경험에서 좋았던 점은 무엇이었나요?</div>
                    <div className={styles.answers}>
                        <textarea
                            placeholder="자유롭게 답변해주세요"
                            value={feedbackData.long_questions.question1}
                            onChange={(event) => handleInputChange(event, 'question1')}
                        />
                    </div>
                    <div className={styles.questions}>협업 경험에서 아쉬웠던 점은 무엇이었나요?</div>
                    <div className={styles.answers}>
                        <textarea
                            placeholder="자유롭게 답변해주세요"
                            value={feedbackData.long_questions.question2}
                            onChange={(event) => handleInputChange(event, 'question2')}
                        />
                    </div>
                    <div className={styles.questions}>마지막으로 하고 싶은 말을 적어주세요!</div>
                    <div className={styles.answers}>
                        <textarea
                            placeholder="자유롭게 하고 싶은 말을 적어주세요!"
                            value={feedbackData.long_questions.question3}
                            onChange={(event) => handleInputChange(event, 'question3')}
                        />
                    </div>
                </div>
                <button className={styles.submitButton} onClick={handleFormSubmit}>
                    완료
                </button>
            </div>
        </div>
    );
};

export default FeedbackLong;
