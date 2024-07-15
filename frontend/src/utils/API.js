import axios from 'axios';

const baseURL = 'http://ec2-43-202-115-16.ap-northeast-2.compute.amazonaws.com/';

// Axios 인스턴스 생성
const API = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios 요청 전에 회원 / 비회원 확인
API.interceptors.request.use(
    async (config) => {
        // 회원 로직
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        // CSRF 토큰 추가
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
