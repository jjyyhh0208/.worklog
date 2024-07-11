import API from './API';

const FeedbackService = {
    fetchQuestions: () => {
        return API.get('/profiles/short-questions/')
            .then((response) => response.data)
            .catch((error) => {
                console.error('질문을 불러오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },

    submitAnswers: (answers) => {
        return API.post('/feedback/answers/', { answers })
            .then((response) => response.data)
            .catch((error) => {
                console.error('답변을 제출하는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },
};

export default FeedbackService;
