import axios from 'axios';

const baseURL1 = 'http://localhost:8000/';
const baseURL2 = 'http://127.0.0.1:8000/';

// Axios 인스턴스 생성
const API = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios 요청 전에 회원 / 비회원 확인
API.interceptors.request.use(
    async (config) => {
        // baseURL 설정
        const currentURL = window.location.origin;
        if (currentURL.includes('localhost')) {
            config.baseURL = baseURL1;
        } else if (currentURL.includes('127.0.0.1')) {
            config.baseURL = baseURL2;
        }

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
