import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import FeedbackService from '../../utils/FeedbackService';
import styles from './Feedback.module.css';
import ProgressBar from '../../components/ProgressBar/ProgressBar';

const Feedback = () => {
    const { pageNum, username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const pageIndex = parseInt(pageNum, 10) - 1;
    const [profileData, setProfileData] = useState(null);
    const [questionsTemplate, setQuestionsTemplate] = useState([]);
    const [answers, setAnswers] = useState(location.state?.answers || {});
    const [scores, setScores] = useState(location.state?.scores || { D: 0, I: 0, S: 0, C: 0 });

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
        const currentPageAnswers = currentPageQuestions.reduce((count, question) => {
            const questionAnswers = answers[question.question] || {};
            return count + Object.keys(questionAnswers).filter((key) => questionAnswers[key] !== 0).length;
        }, 0);

        if (currentPageAnswers < 12) {
            alert('모든 문항에 답해주세요.');
            return;
        }

        localStorage.setItem('scores', JSON.stringify(scores));

        if (pageIndex < questionsTemplate.length - 1) {
            navigate(`/feedback/${pageIndex + 2}/${username}`, {
                state: { ...location.state, answers, scores },
            });
        } else {
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
        if (pageIndex !== 0) {
            navigate(`/feedback/${pageIndex}/${username}`, {
                state: { ...location.state, answers, scores },
            });
        } else {
            navigate(`/feedback/intro/${username}`, {
                state: { ...location.state, answers, scores },
            });
        }
    };

    return (
        <div className="w-[100%] flex flex-col items-center bg-gray-100 overflow-y-auto min-h-[90%] h-screen  mt-16">
            <div className="p-9 md:w-3/5 w-11/12 rounded-2xl bg-white flex-shrink-0 my-9 flex flex-col items-center shadow-lg relative ">
                <ProgressBar progress={progress} /> {/* ProgressBar 추가 */}
                <div className="absolute top-8 right-12 text-2xl font-bold text-black bg-gray-300 p-3 rounded-lg shadow-md">
                    {parseInt(pageNum) + 1}/5
                </div>
                <div className="absolute top-12 left-8">
                    <button type="submit" onClick={handleBackClick} className=" cursor-pointer hover:bg-white">
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
                <div className="text-[#000000] text-3xl font-extrabold leading-normal mt-8 my-2">
                    <div>각 항목에 대해서 1~4점으로 {profileData.name}님에 해당되는 점수를 체크해주세요.</div>
                    <div className="text-[#9b8f8f] text-xl leading-normal my-2">
                        * 1: 매우 아니다, 2: 아닌 편이다, 3: 그런 편이다, 4: 매우 그렇다
                    </div>
                </div>
                {currentPageQuestions.map((q, index) => (
                    <div
                        key={index}
                        className="text-[#4053ff] text-3xl font-extrabold leading-normal mt-8 my-2 text-left w-full px-12"
                    >
                        <p>{q.question}</p>
                        {q.options.map((option, idx) => (
                            <div key={idx} className="flex items-center my-4">
                                <div className="flex-1 text-2xl text-gray-800">
                                    {String.fromCharCode(65 + idx)}. {option.label}
                                </div>
                                <div className="flex items-center space-x-4">
                                    {[1, 2, 3, 4].map((score) => (
                                        <button
                                            key={score}
                                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                                                answers[q.question]?.[option.value] === score
                                                    ? 'bg-[#ffa500] text-white'
                                                    : 'bg-gray-200 text-black'
                                            }`}
                                            onClick={() => handleAnswerChange(q.question, option.value, score)}
                                        >
                                            {score}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div className="flex justify-end items-center mt-16 mb-4 w-full">
                    <button
                        className="w-36 h-12 rounded-lg bg-[#4053ff] border-none text-white text-lg font-bold cursor-pointer"
                        type="submit"
                        onClick={handleNextPage}
                    >
                        NEXT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
