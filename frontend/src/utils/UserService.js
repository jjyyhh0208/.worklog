import API from './API';

const UserService = {
    registerUser: (userData) => {
        const requestData = {
            username: userData.username,
            password1: userData.password1,
            password2: userData.password2,
        };

        return API.post('/profiles/auth/registration/', requestData)
            .then((response) => {
                if (response.status === 204) {
                    // 성공코드 204
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
                } else if (error.response) {
                    throw new Error('서버 오류가 발생했습니다.');
                } else {
                    throw new Error(error.message);
                }
            });
    },
    checkId: (userName) => {
        return API.post('/profiles/auth/check-username/', userName)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw new Error('아이디는 3자 이상 30자 이하로 설정해주세요.');
            });
    },
};

export default UserService;
