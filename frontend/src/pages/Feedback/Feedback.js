import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import FeedbackService from '../../utils/FeedbackService';
import styles from './Feedback.module.css';
import ProgressBar from '../../components/ProgressBar/ProgressBar';

const requiredAnswersCount = [3, 3, 3]; // Number of required answers per page

const Feedback = () => {
    const { pageNum, username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const pageIndex = parseInt(pageNum, 10) - 1;
    const [profileData, setProfileData] = useState(null);
    const [questionsTemplate, setQuestionsTemplate] = useState([]);
    const [answers, setAnswers] = useState({});
    const [scores, setScores] = useState({ D: 0, I: 0, S: 0, C: 0 });

    useEffect(() => {
        ProfileService.fetchFriendProfile(username)
            .then((data) => setProfileData(data))
            .catch((error) => console.error('Error fetching profile data:', error));

        FeedbackService.fetchQuestions()
            .then((questions) => setQuestionsTemplate(questions))
            .catch((error) => console.error('Error fetching questions:', error));
    }, [username]);

    const handleAnswerChange = (question, option, value) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = { ...prevAnswers };
            if (!updatedAnswers[question]) updatedAnswers[question] = {};
            const previousValue = updatedAnswers[question][option] || 0;
            const newValue = previousValue === value ? 0 : value;
            updatedAnswers[question][option] = newValue;

            setScores((prevScores) => {
                const updatedScores = { ...prevScores };
                updatedScores[option] += newValue - previousValue;
                return updatedScores;
            });

            return updatedAnswers;
        });
    };

    const handleNextPage = () => {
        const currentAnswersCount = Object.keys(answers).reduce((sum, question) => {
            return sum + Object.keys(answers[question]).length;
        }, 0);

        if (currentAnswersCount < requiredAnswersCount[pageIndex]) {
            alert('모든 문항에 답해주세요.');
            return;
        }

        if (pageIndex < questionsTemplate.length - 1) {
            navigate(`/feedback/${pageIndex + 2}/${username}`, {
                state: { ...location.state, answers, scores },
            });
        } else {
            localStorage.setItem('scores', JSON.stringify(scores));
            navigate(`/feedback/long/${username}`, {
                state: { ...location.state, answers, scores },
            });
        }
    };

    if (!profileData || questionsTemplate.length === 0) {
        return <div className={styles.feedbackContainer}></div>;
    }

    const currentPageQuestions = questionsTemplate[pageIndex].map((q) => ({
        ...q,
        question: q.question.replace('OO', profileData.name + '님'),
    }));

    const progress = 20 + (pageIndex + 1) * 20; // Progress 계산

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className={styles.feedbackContainer}>
            <div className={styles.feedbackPage}>
                <ProgressBar progress={progress} /> {/* ProgressBar 추가 */}
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
                <div className={styles.pageIndicator}>{parseInt(pageNum) + 1}/5</div>
                <div className={styles.instructions}>
                    <div>각 항목에 대해서 1~4점 중 가장 {profileData.name}님과 가까운 것을 체크해주세요.</div>
                    <div className={styles.fontinstructions}>
                        * 1: 매우 아니다, 2: 아닌 편이다, 3: 그런 편이다, 4: 매우 그렇다
                    </div>
                </div>
                {currentPageQuestions.map((q, index) => (
                    <div key={index} className={styles.question}>
                        <p>{q.question}</p>
                        {q.options.map((option, idx) => (
                            <div key={idx} className={styles.optionGroup}>
                                <div className={styles.options}>
                                    {String.fromCharCode(65 + idx)}. {option.label}
                                </div>
                                <div className={styles.scores}>
                                    {[1, 2, 3, 4].map((score) => (
                                        <button
                                            key={score}
                                            className={`${styles.scoreButton} ${
                                                answers[q.question]?.[option.value] === score ? styles.selected : ''
                                            }`}
                                            onClick={() => handleAnswerChange(q.question, option.value, score)}
                                        >
                                            <span>{score}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div className={styles.feedbackNextContainer}>
                    <div className={styles.feedbackNextButton}>
                        <button onClick={handleNextPage}>Next</button>
                    </div>
                    <div className={styles.feedbackNextSvg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="49" viewBox="0 0 50 49" fill="none">
                            <path
                                d="M25.0314 27.1023L7.97165 47.9208C6.79252 49.3597 4.88585 49.3597 3.71927 47.9208L0.884345 44.4613C-0.294782 43.0223 -0.294782 40.6956 0.884345 39.2719L12.9767 24.5153L0.884345 9.75867C-0.294782 8.31974 -0.294782 5.99297 0.884345 4.56935L3.70672 1.07919C4.88585 -0.359731 6.79252 -0.359731 7.95911 1.07919L25.0188 21.8977C26.2105 23.3366 26.2105 25.6634 25.0314 27.1023ZM49.1157 21.8977L32.0559 1.07919C30.8768 -0.359731 28.9701 -0.359731 27.8036 1.07919L24.9686 4.53874C23.7895 5.97766 23.7895 8.30444 24.9686 9.72805L37.061 24.4847L24.9686 39.2413C23.7895 40.6803 23.7895 43.007 24.9686 44.4306L27.8036 47.8902C28.9827 49.3291 30.8894 49.3291 32.0559 47.8902L49.1157 27.0717C50.2948 25.6634 50.2948 23.3366 49.1157 21.8977Z"
                                fill="#4053FF"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
