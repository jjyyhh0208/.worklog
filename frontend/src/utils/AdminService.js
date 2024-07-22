import API from './API';
import axios from 'axios';

const AdminService = {
    registerUser: (userData) => {
        const requestData = {
            username: userData.username,
            password1: userData.password1,
            password2: userData.password2,
        };

        return API.post('/profiles/auth/registration/', requestData)
            .then((response) => {
                if (response.status === 201) {
                    // Typically, registration would return a 201 status code
                    console.log('사용자가 성공적으로 등록되었습니다.');
                }
                return response.data; // Return the response data for further use if needed
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    if (error.response.data.username) {
                        throw new Error('유효하지 않은 사용자입니다.');
                    }
                    if (error.response.data.password1) {
                        throw new Error('비밀번호는 영어나 특수문자를 포함하여 8자 이상으로 만들어주세요.');
                    }
                    if (error.response.data.non_field_errors) {
                        throw new Error('입력한 비밀번호가 일치하지 않습니다.');
                    }
                } else if (error.response) {
                    throw new Error('서버 오류가 발생했습니다.');
                } else {
                    throw new Error(error.message);
                }
            });
    },

    checkUserName: (userName) => {
        return API.post('/profiles/auth/check-username/', { username: userName }) // Pass the username as an object
            .then((response) => {
                return response.data; // Return response data for further use
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    throw new Error('아이디는 3자 이상 30자 이하로 설정해주세요.');
                } else {
                    throw new Error(error.message);
                }
            });
    },

    login: (userData) => {
        const requestData = {
            username: userData.username,
            password: userData.password,
        };

        return API.post('/profiles/auth/login/', requestData)
            .then((response) => {
                if (response.status === 200) {
                    const token = response.data.key;
                    localStorage.setItem('authToken', token);
                }
                return response.data; // Return response data for further use
            })
            .catch((error) => {
                let errorMessage = '로그인 처리 중 오류가 발생했습니다.';
                if (error.response && error.response.data) {
                    if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data.errors && error.response.data.errors.non_field_errors) {
                        errorMessage = error.response.data.errors.non_field_errors[0];
                    } else {
                        errorMessage = '로그인에 실패했습니다. 입력 정보를 확인해주세요.';
                    }
                } else if (error.response) {
                    errorMessage = '서버 오류가 발생했습니다.';
                }
                throw new Error(errorMessage);
            });
    },

    logout: () => {
        return API.post('/profiles/auth/logout/')
            .then((response) => {
                if (response.status === 200) {
                    console.log('사용자가 성공적으로 로그아웃하였습니다.');
                    localStorage.removeItem('authToken');
                }
                return response.data; // Return response data for further use
            })
            .catch((error) => {
                throw new Error('로그아웃 중 오류가 발생했습니다: ' + error.message);
            });
    },

    userDelete: async () => {
        try {
            const response = await API.delete('/profiles/auth/delete/');

            if (response.status === 204) {
                console.log('성공적으로 회원 탈퇴가 이루어졌습니다.');
                return true;
            } else {
                throw new Error('예상치 못한 응답 상태: ' + response.status);
            }
        } catch (error) {
            throw new Error('회원 탈퇴 중 오류가 발생했습니다: ' + error.message);
        }
    },
    loginKakao: async (code) => {
        const config = {
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.REACT_APP_KAKAO_CLIENT_ID,
                redirect_uri: `${window.location.origin}/profiles/auth/kakao/callback`,
                code: code,
            }),
        };

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error('Error during Kakao login:', error);
            throw error;
        }
    },

    sendKakaoTokenToDjango: async (kakaoData) => {
        try {
            const response = await axios.post('profiles/api/kakao-login/', kakaoData);
            return response.data;
        } catch (error) {
            console.error('Error sending Kakao token to Django:', error);
            throw error;
        }
    },

    handleKakaoLogin: async (code) => {
        try {
            const kakaoData = await AdminService.loginKakao(code);
            const result = await AdminService.sendKakaoTokenToDjango(kakaoData);
            console.log(kakaoData);
            console.log(result);

            localStorage.setItem('authToken', result.token);

            return result;
        } catch (error) {
            console.error('Login failed:', error);
            console.log(error);
            throw error;
        }
    },
};

export default AdminService;
