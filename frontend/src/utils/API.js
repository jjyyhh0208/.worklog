import axios from 'axios';

// Axios 인스턴스 생성
const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Django 서버의 기본 URL
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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
