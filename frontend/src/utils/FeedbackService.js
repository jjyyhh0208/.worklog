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

        return API.post('/profiles/feedbacks/', transformedAnswers)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    },

    submitQuestionAnswers: (questionAnswers) => {
        return API.post('/profiles/user/feedback-answers/', questionAnswers)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    },
};

export default FeedbackService;
