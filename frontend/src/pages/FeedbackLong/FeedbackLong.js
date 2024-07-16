import React, { useState } from 'react';
import styles from './FeedbackLong.module.css';
import axios from 'axios';
import ProgressBar from '../../components/ProgressBar/ProgressBar'; // ProgressBar import

const FeedbackLong = () => {
    const [feedbackData, setFeedbackData] = useState({
        id: '',
        feedback_id: '',
        long_questions: {
            question1: '',
            question2: '',
            question3: '',
        },
    });

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

        axios
            .post('/api/feedback/', feedbackData)
            .then((response) => {
                console.log('Feedback submitted successfully:', response.data);

                // Success handling (e.g., redirect, show a message)
            })
            .catch((error) => {
                console.error('Error submitting feedback:', error);
                // Error handling (e.g., show error message)
            });
    };

    return (
        <div className={styles.feedbackLongcontainer}>
            <div className={styles.content}>
                <ProgressBar progress={100} /> {/* ProgressBar 추가 */}
                <div className={styles.top}>
                    <div className={styles.textbox}>
                        <h3 className={styles.text}>
                            ※해당 설문 내용은 익명으로 사용자에게 전달되며, 특정될 수 있는 정보 (회사명, 팀명) 등을 쓰지
                            않는 것을 권장드립니다.
                        </h3>
                        <div className={styles.pageIndicator}>5/5</div>
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
