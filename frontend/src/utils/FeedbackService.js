import API from './API';

const FeedbackService = {
    fetchQuestions: () => {
        return API.get('/profiles/short-questions/')
            .then((response) => {
                const apiData = response.data;
                let transformedQuestions = [];

                apiData.forEach((questionData, index) => {
                    let transformedSet = [];
                    const question = {
                        question: questionData.question,
                        options: [
                            { label: questionData.answer1, value: 'D' },
                            { label: questionData.answer2, value: 'I' },
                            { label: questionData.answer3, value: 'S' },
                            { label: questionData.answer4, value: 'C' },
                        ],
                    };

                    transformedSet.push(question);
                    transformedQuestions.push(transformedSet);
                });

                return transformedQuestions;
            })
            .catch((error) => {
                console.error('질문을 불러오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },
    submitAnswers: (answers) => {
        const transformedAnswers = {
            id: answers.id,
            user: answers.user,
            user_by: answers.user_by,
            work_styles: answers.work_styles,
            score: answers.score,
            question_answers: answers.question_answers,
        };

        return API.post('/feedback/answers/', transformedAnswers)
            .then((response) => response.data)
            .catch((error) => {
                console.error('답변을 제출하는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },
};

export default FeedbackService;
