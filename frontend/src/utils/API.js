import axios from 'axios';

// const baseURL = 'http://127.0.0.1:8000/';
const baseURL = process.env.REACT_APP_BASE_URL;
// CSRF 토큰을 가져오는 함수

function getCsrfToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return '';
}
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
