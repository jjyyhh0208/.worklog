import API from './API';

const AdminService = {
    registerUser: (userData) => {
        const requestData = {
            username: userData.username,
            password1: userData.password1,
            password2: userData.password2,
        };

        return API.post('/profiles/auth/registration/', requestData)
            .then((response) => {
                if (response.status === 204) {
                    console.log('사용자가 성공적으로 등록되었습니다.');
                }
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
        return API.post('/profiles/auth/check-username/', userName)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw new Error('아이디는 3자 이상 30자 이하로 설정해주세요.');
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
                    console.log('사용자가 성공적으로 로그인하였습니다.');
                    const token = response.data.key;
                    localStorage.setItem('authToken', token);
                }
            })
            .catch((error) => {
                console.error('로그인 요청 실패:', error);

                if (error.response && error.response.data) {
                    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
                } else if (error.response) {
                    throw new Error('서버 오류가 발생했습니다.');
                } else {
                    throw new Error(error.message);
                }
            });
    },

    logout: () => {
        return API.post('/profiles/auth/logout/')
            .then((response) => {
                if (response.status === 200) {
                    // 성공코드 200
                    console.log('사용자가 성공적으로 로그아웃하였습니다.');
                    localStorage.removeItem('authToken'); // Remove the token from local storage
                }
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    },

    userDelete: () => {
        return API.delete('/profiles/auth/delete/')
            .then((response) => {
                console.log('API 응답:', response);

                if (response.status === 200) {
                    // 성공코드 200
                    console.log('성공적으로 회원 탈퇴가 이루어졌습니다.');
                    localStorage.removeItem('authToken'); // Remove the token from local storage
                }
                return response.data;
            })
            .catch((error) => {
                console.error('회원 탈퇴 중 오류가 발생했습니다.', error);
                console.error('오류 응답:', error.response);
                console.error('오류 메시지:', error.message);
            });
    },
};

export default AdminService;
