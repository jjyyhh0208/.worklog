import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import FeedbackService from '../../utils/FeedbackService';
import styles from './Feedback.module.css';

const questionsTemplate = [
    [
        {
            question: 'OO님은 팀에서 대화를 주도하는 편인가요?',
            options: [
                { label: '대화를 주도하고 의견을 제시', value: 'D' },
                { label: '다른 사람들과 잘 어울림', value: 'I' },
                { label: '필요한 경우에만 의견을 제시', value: 'S' },
                { label: '대화 주도보다는 정확한 정보 제공에 집중', value: 'C' },
            ],
        },
        {
            question: 'OO님은 업무 중 같이 일하는 상대의 다양한 상황들을 파악하려고 하나요?',
            options: [
                { label: '타인의 상황보다는 주로 목표 달성에 집중', value: 'D' },
                { label: '모든 이의 감정을 잘 파악하려고 노력', value: 'I' },
                { label: '일부 타인의 상황만을 잘 파악하고 배려', value: 'S' },
                { label: '타인의 상황에 대한 분석', value: 'C' },
            ],
        },
        {
            question: 'OO님은 목표를 달성하기 위해 세부적인 계획을 잘 세우나요?',
            options: [
                { label: '전체적인 전략 구상에 집중', value: 'D' },
                { label: '계획보다는 사람들과의 상호작용을 중시', value: 'I' },
                { label: '유연하게 상황에 맞춰 행동', value: 'S' },
                { label: '세부적인 계획 구상', value: 'C' },
            ],
        },
    ],
    [
        {
            question: 'OO님은 새로운 아이디어를 제시하는 것을 잘하나요?',
            options: [
                { label: '새로운 아이디어를 강하게 제시', value: 'D' },
                { label: '창의적인 아이디어를 제시', value: 'I' },
                { label: '기존의 아이디어 보완', value: 'S' },
                { label: '사실과 데이터에 기반한 아이디어 제시', value: 'C' },
            ],
        },
        {
            question: 'OO님은 여러가지 변수를 고려해서 대안을 생각하는 편인가요?',
            options: [
                { label: '아니요, 주로 하나의 목표에 집중', value: 'D' },
                { label: '아니요, 상황에 따라 유연하게 대응', value: 'I' },
                { label: '네, 여러 가지 상황을 고려하여 계획 구성', value: 'S' },
                { label: '네, 다양한 변수를 분석하여 대안을 마련', value: 'C' },
            ],
        },
        {
            question: 'OO님의 업무에서의 의사 결정 방식은 어떤가요?',
            options: [
                { label: '빠르게 의사 결정', value: 'D' },
                { label: '팀원들과 상의 후 결정', value: 'I' },
                { label: '신중하게 생각하고 결정', value: 'S' },
                { label: '충분한 정보를 수집한 후 결정', value: 'C' },
            ],
        },
    ],
    [
        {
            question: 'OO님의 업무에서의 성격은 어떤가요?',
            options: [
                { label: '주도적인 성격', value: 'D' },
                { label: '사교적인 성격', value: 'I' },
                { label: '여유 있는 성격', value: 'S' },
                { label: '진지하며 세심한 성격', value: 'C' },
            ],
        },
        {
            question: 'OO님의 목표 달성 스타일은 ___한 경향이 있다.',
            options: [
                { label: '결과를 중시', value: 'D' },
                { label: '사람을 중시', value: 'I' },
                { label: '팀을 중시', value: 'S' },
                { label: '세부사항을 중시', value: 'C' },
            ],
        },
        {
            question: '업무에서 OO님의 역할은 주로 무엇인가요?',
            options: [
                { label: '지시하는 역할', value: 'D' },
                { label: '영향을 미치는 역할', value: 'I' },
                { label: '신중히 계획하는 역할', value: 'S' },
                { label: '필요성을 따져 보는 역할', value: 'C' },
            ],
        },
    ],
];

const requiredAnswersCount = [11, 12, 12]; // Number of required answers per page

const Feedback = () => {
    const { pageNum } = useParams();
    const navigate = useNavigate();
    const pageIndex = parseInt(pageNum, 10) - 1;
    const [profileData, setProfileData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [scores, setScores] = useState({ D: 0, I: 0, S: 0, C: 0 });


    useEffect(() => {
        ProfileService.fetchUserProfile()
            .then((data) => {
                setProfileData(data);
            })
            .catch((error) => {
                console.error('프로필 정보를 불러오는 동안 오류가 발생했습니다.', error);
            });
    }, []);

    const handleAnswerChange = (question, option, value) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = { ...prevAnswers };
            if (!updatedAnswers[question]) {
                updatedAnswers[question] = {};
            }
            updatedAnswers[question][option] = value;
            return updatedAnswers;
        });

        setScores((prevScores) => {
            const updatedScores = { ...prevScores };
            updatedScores[option] += value - (answers[question]?.[option] || 0);
            return updatedScores;
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
            navigate(`/feedback/${pageIndex + 2}`);
        } else {
            // 논의 필요
            FeedbackService.submitAnswers({
                id: profileData.id,
                user: profileData.username,
                user_by: 'test1', // Assuming the user_by is 'test1', modify as necessary
                work_styles: [], // Fill this based on your application logic
                score: {
                    d_score: scores.D,
                    i_score: scores.I,
                    s_score: scores.S,
                    c_score: scores.C,
                },
                question_answers: [
                    {
                        question: {
                            user: null,
                            long_question: '과의 협업 경험에서 좋았던 점은 무엇이었나요?',
                        },
                        answer: '답입니다.',
                    },
                    {
                        question: {
                            user: null,
                            long_question: '과의 협업 경험에서 아쉬웠던 점은 무엇이었나요?',
                        },
                        answer: '답입니다.',
                    },
                ],
            })
                .then(() => {
                    navigate('../FeedbackLong/FeedbackLong');
                })
                .catch((error) => {
                    console.error('답변을 제출하는 동안 오류가 발생했습니다.', error);
                });
        }
    };

    if (!profileData) {
        return <p>프로필 정보를 불러오는 중입니다...</p>;
    }

    if (!questionsTemplate[pageIndex]) {
        return <p>잘못된 페이지 번호입니다.</p>;
    }

    const currentPageQuestions = questionsTemplate[pageIndex].map((q) => ({
        ...q,
        question: q.question.replace('OO', profileData.name),
    }));

    return (
        <>
            <div className={styles.feedbackContainer}>
                <div className={styles.feedbackPage}>
                    <div className={styles.pageIndicator}>{pageNum}/4</div>
                    <div className={styles.progressContainer}>
                        {questionsTemplate.map((_, index) => (
                            <div
                                key={index}
                                className={styles.progressBar}
                                style={{ backgroundColor: pageIndex >= index ? 'blue' : '#ccc', width: '300px' }}
                            ></div>
                        ))}
                    </div>
                    <p>
                        각 항목에 대해서 1~4점 중 가장 {profileData.name}과 가까운 것을 체크해주세요. <br /> **[ 1: 매우
                        아니다, 2: 아닌 편이다, 3: 그런 편이다, 4: 매우 그렇다 ]
                    </p>
                    {currentPageQuestions.map((q, index) => (
                        <div key={index} className={styles.question}>
                            <p>{q.question}</p>
                            {q.options.map((option, idx) => (
                                <div key={idx} className={styles.optionGroup}>
                                    <p>
                                        {String.fromCharCode(65 + idx)}. {option.label}
                                    </p>
                                    <div className={styles.scores}>
                                        {[1, 2, 3, 4].map((score) => (
                                            <label key={score}>
                                                <input
                                                    type="radio"
                                                    name={`${q.question}-${option.value}`}
                                                    value={score}
                                                    checked={answers[q.question]?.[option.value] === score}
                                                    onChange={(e) =>
                                                        handleAnswerChange(
                                                            q.question,
                                                            option.value,
                                                            parseInt(e.target.value, 10)
                                                        )
                                                    }
                                                />
                                                <span>{score}</span>
                                            </label>
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="50"
                                height="49"
                                viewBox="0 0 50 49"
                                fill="none"
                            >
                                <path
                                    d="M25.0314 27.1023L7.97165 47.9208C6.79252 49.3597 4.88585 49.3597 3.71927 47.9208L0.884345 44.4613C-0.294782 43.0223 -0.294782 40.6956 0.884345 39.2719L12.9767 24.5153L0.884345 9.75867C-0.294782 8.31974 -0.294782 5.99297 0.884345 4.56935L3.70672 1.07919C4.88585 -0.359731 6.79252 -0.359731 7.95911 1.07919L25.0188 21.8977C26.2105 23.3366 26.2105 25.6634 25.0314 27.1023ZM49.1157 21.8977L32.0559 1.07919C30.8768 -0.359731 28.9701 -0.359731 27.8036 1.07919L24.9686 4.53874C23.7895 5.97766 23.7895 8.30444 24.9686 9.72805L37.061 24.4847L24.9686 39.2413C23.7895 40.6803 23.7895 43.007 24.9686 44.4306L27.8036 47.8902C28.9827 49.3291 30.8894 49.3291 32.0559 47.8902L49.1157 27.0717C50.2948 25.6634 50.2948 23.3366 49.1157 21.8977Z"
                                    fill="#4053FF"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Feedback;
