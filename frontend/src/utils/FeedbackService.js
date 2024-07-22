import API from './API';

const FeedbackService = {
    fetchQuestions: () => {
        return API.get('/profiles/short-questions/')
            .then((response) => {
                const apiData = response.data;
                let transformedQuestions = Array.from({ length: 3 }, () => []);

                apiData.forEach((questionData, index) => {
                    const pageIndex = Math.floor(index / 3);
                    const question = {
                        question: questionData.question,
                        options: [
                            { label: questionData.answer1, value: 'D' },
                            { label: questionData.answer2, value: 'I' },
                            { label: questionData.answer3, value: 'S' },
                            { label: questionData.answer4, value: 'C' },
                        ],
                    };

                    transformedQuestions[pageIndex].push(question);
                });

                return transformedQuestions;
            })
            .catch((error) => {
                console.error('질문을 불러오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },
    submitAnswers: (answers) => {
        // question_answers 배열의 각 항목을 확인하고 변환
        const questionAnswers = answers.question_answers.map((item) => {
            // item의 question 필드가 객체인 경우 처리
            if (typeof item.question === 'object' && item.question !== null) {
                return {
                    question: item.question.question || '', // item.question.question으로 변환하고, 기본값 설정
                    answer: item.answer,
                };
            }
            return {
                question: item.question,
                answer: item.answer,
            };
        });

        const transformedAnswers = {
            id: answers.id,
            user: answers.user,
            user_by: answers.user_by,
            work_styles: answers.work_styles,
            score: answers.score,
            question_answers: questionAnswers,
        };

        console.log('this is my transformedAnswers : ', transformedAnswers);

        return API.post('/profiles/feedbacks/', transformedAnswers)
            .then((response) => response.data)
            .catch((error) => {
                console.error('답변을 제출하는 동안 오류가 발생했습니다.', error.response.data);
                throw error;
            });
    },

    submitQuestionAnswers: (questionAnswers) => {
        return API.post('/profiles/user/feedback-answers/', questionAnswers)
            .then((response) => response.data)
            .catch((error) => {
                console.error('질문과 답변을 제출하는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },
};

export default FeedbackService;
