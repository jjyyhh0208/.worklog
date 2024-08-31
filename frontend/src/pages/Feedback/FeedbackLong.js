import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import FeedbackService from '../../utils/FeedbackService';
import ProfileService from '../../utils/ProfileService';
import Modal from '../../components/Modal/Modal';

const FeedbackLong = () => {
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
    const [showModal, setShowModal] = useState(false);
    //남은 시간
    const [remainingTime, setRemainingTime] = useState(null);
    //피드백을 다시 남길 수 있는 상태 (시간 제한 풀린 상태)
    const [canLeaveFeedback, setCanLeaveFeedback] = useState(false);
    const [isLoggedIn, setisLoggedIn] = useState(!!localStorage.getItem('authToken'));
    // 동시 접속 등의 문제가 있는 것은 참고해주세요!
    const [accessCode, setAccessCode] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('authToken');
            setisLoggedIn(!!authToken);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                setShowModal(false);
                navigate(`/friend-profile/${username}`);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [showModal, navigate, username]);
    useEffect(() => {
        ProfileService.fetchFriendProfile(username)
            .then((data) => {
                setProfileData(data);
                setCanLeaveFeedback(data.can_leave_feedback);
                setRemainingTime(data.remaining_time);
                setAccessCode(data.access_code);
            })
            .catch((error) => console.error('Error fetching profile data:', error));
    }, [username]);

    useEffect(() => {
        if (isLoggedIn) {
            ProfileService.fetchUserProfile()
                .then((data) => setMyProfileData(data))
                .catch((error) => console.error('Error fetching profile data:', error));
        }
    }, [isLoggedIn]);

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

        // 비회원로직: 접근 코드 확인
        if (!isLoggedIn) {
            const correctCode = localStorage.getItem('correctCode') || '';
            if (correctCode !== accessCode) {
                alert('만료된 접근코드입니다. 다시 접근코드를 받아서 시도해주세요.');
                navigate(`/friend-profile/${username}`);
            }
        }
        // 회원로직: 피드백 중복 방지
        if (isLoggedIn && !canLeaveFeedback) {
            const formatRemainingTime = (seconds) => {
                if (!seconds || seconds <= 0) return '지금 바로 협업 피드백을 남겨 보세요!';
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                return `${hours}시간 ${minutes}분`;
            };

            alert(` ${formatRemainingTime(remainingTime)} 후에 다시 협업 평가를 남길 수 있어요!`);
            navigate(`/friend-profile/${username}`);
        }

        // 질문 처리
        const { question1, question2, question3 } = feedbackData.long_questions;

        if (!question1 || !question2 || !question3) {
            alert('모든 문항에 답해주세요.');
            return;
        }

        // 프로필 오류 대비
        if (!profileData) {
            alert('프로필을 불러오는 데에 실패했습니다.');
            return;
        }

        const workStylesData = (JSON.parse(localStorage.getItem('workStyles')) || { work_styles: [] }).work_styles;
        const scoresData = JSON.parse(localStorage.getItem('scores')) || { D: 0, I: 0, S: 0, C: 0 };

        const questionAnswers = [
            {
                question: { long_question: '협업 경험에서 좋았던 점은 무엇이었나요?' },
                answer: question1,
            },
            {
                question: { long_question: '협업 경험에서 아쉬웠던 점은 무엇이었나요?' },
                answer: question2,
            },
            {
                question: { long_question: '마지막으로 하고 싶은 말을 적어주세요!' },
                answer: question3,
            },
        ];

        // 피드백 데이터 객체
        const feedbackPayload = {
            id: profileData.id,
            user: profileData.username,
            user_by: myprofileData?.username || '',
            work_styles: workStylesData,
            score: {
                d_score: scoresData.D,
                i_score: scoresData.I,
                s_score: scoresData.S,
                c_score: scoresData.C,
            },
            question_answers: questionAnswers,
        };

        // 첫 번째 API 호출: 피드백 데이터 제출
        FeedbackService.submitAnswers(feedbackPayload)
            .then(() => {
                setShowModal(true);
                // 두 번째 API 호출: 질문과 답변 데이터 제출
                return FeedbackService.submitQuestionAnswers({
                    user_to: profileData.username,
                    question_answers: questionAnswers.map((qa) => ({
                        question: { long_question: qa.question.long_question },
                        answer: qa.answer,
                    })),
                });
            })
            .catch((error) => setShowModal(false));
    };

    const handleBackClick = () => {
        navigate(`/feedback/3/${username}`, {
            state: { ...location.state, answers, scores },
        });
    };

    return (
        <div className="w-[100%] flex flex-col items-center bg-gray-100 overflow-y-auto min-h-[90%] h-screen mt-16 ">
            <div className="p-9 md:w-3/5 w-11/12 rounded-2xl bg-white flex-shrink-0 my-9 flex flex-col items-center shadow-lg relative overflow-y-auto">
                <ProgressBar progress={100} /> {/* ProgressBar 추가 */}
                <div className="absolute top-8 right-6 text-lg font-bold text-black bg-gray-300 p-3 rounded-lg shadow-md">
                    5/5
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
                <div className="text-[#000000] text-2xl font-extrabold leading-normal ml-20 mr-20 mt-8 my-2">
                    <div>
                        마지막으로 {profileData ? `${profileData.name}` : '익명'}님에게 하고 싶은 말을 자유롭게
                        써주세요.
                    </div>
                    <div className="text-[#9b8f8f] text-lg leading-normal my-2">
                        * 해당 설문 내용은 익명으로 사용자에게 전달되며, 특정될 수 있는 정보 (회사명, 팀명) 등을 쓰지
                        않는 것을 권장드립니다.
                    </div>
                </div>
                <div className="w-full px-12">
                    <div className="text-[#4053ff] text-2xl font-extrabold leading-normal mt-8 my-2 text-left w-full px-8">
                        협업 경험에서 좋았던 점은 무엇이었나요?
                    </div>
                    <div className="w-full flex justify-center my-4">
                        <textarea
                            className="w-full max-w-4xl p-4 bg-gray-100 rounded-lg min-h-[120px] resize-none overflow-hidden"
                            placeholder="회의 때의 모습, 준비성, 아이스브레이킹, 역량, 커뮤니케이션 방법 등 다양한 측면에서 자유롭게 의견을 남겨 주세요. 따뜻한 피드백을 기다립니다."
                            value={feedbackData.long_questions.question1}
                            onChange={(event) => handleInputChange(event, 'question1')}
                        />
                    </div>
                    <div className="text-[#4053ff] text-2xl font-extrabold leading-normal mt-8 my-2 text-left w-full px-8">
                        협업 경험에서 아쉬웠던 점은 무엇이었나요?
                    </div>
                    <div className="w-full flex justify-center my-4">
                        <textarea
                            className="w-full max-w-4xl p-4 bg-gray-100 rounded-lg min-h-[120px] resize-none overflow-hidden"
                            placeholder="회의 때의 모습, 준비성, 아이스브레이킹, 역량, 커뮤니케이션 방법 등 다양한 측면에서 자유롭게 의견을 남겨 주세요. 따뜻한 피드백을 기다립니다."
                            value={feedbackData.long_questions.question2}
                            onChange={(event) => handleInputChange(event, 'question2')}
                        />
                    </div>
                    <div className="text-[#4053ff] text-2xl font-extrabold leading-normal mt-8 my-2 text-left w-full px-8">
                        마지막으로 하고 싶은 말을 적어주세요!
                    </div>
                    <div className="w-full flex justify-center my-4">
                        <textarea
                            className="w-full max-w-4xl p-4 bg-gray-100 rounded-lg min-h-[120px] resize-none overflow-hidden"
                            placeholder="자유롭게 하고 싶은 말을 적어주세요! 없을 시 '없음'을 기재해주세요."
                            value={feedbackData.long_questions.question3}
                            onChange={(event) => handleInputChange(event, 'question3')}
                        />
                    </div>
                </div>
                <div className="flex justify-end items-center mt-16 mb-4 w-full">
                    <button
                        className="w-36 h-12 rounded-lg bg-[#4053ff] text-white font-bold"
                        onClick={handleFormSubmit}
                    >
                        제출하기
                    </button>
                </div>
            </div>
            {showModal && <Modal />}
        </div>
    );
};

export default FeedbackLong;
