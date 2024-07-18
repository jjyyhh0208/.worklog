import API from './API';

const ProfileService = {
    setUserBasicInfo: (userData) => {
        const requestData = {
            name: userData.name,
            age: userData.age,
            gender: userData.gender === 'None' ? null : userData.gender,
        };

        return API.put('/profiles/user/set/basic-info/', requestData)
            .then((response) => {
                if (response.status === 200) {
                    console.log('사용자 기본 정보가 성공적으로 업데이트되었습니다.');
                }
                return response.data;
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    console.log(error.response);
                    throw new Error('기본 정보를 업데이트하는 동안 오류가 발생했습니다.');
                } else if (error.response) {
                    throw new Error('서버 오류가 발생했습니다.');
                } else {
                    throw new Error(error.message);
                }
            });
    },

    fetchWorkStyles: () => {
        return API.get(`/profiles/workstyles/`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('업무 스타일을 불러오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },

    setUserWorkStyles: (workStyles) => {
        const requestData = {
            work_styles: workStyles,
        };

        return API.put(`/profiles/user/set/work-style/`, requestData)
            .then((response) => {
                if (response.status === 200) {
                    console.log('사용자의 업무 스타일이 성공적으로 업데이트되었습니다.');
                }
                return response.data;
            })
            .catch((error) => {
                console.error('업무 스타일을 업데이트하는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },

    fetchInterests: () => {
        return API.get(`/profiles/interests/`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('관심 분야를 불러오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },

    setUserInterest: (interests) => {
        const requestData = {
            interests: interests,
        };

        return API.put(`/profiles/user/set/interest/`, requestData)
            .then((response) => {
                if (response.status === 200) {
                    console.log('사용자의 관심 분야가 성공적으로 업데이트되었습니다.');
                }
                return response.data;
            })
            .catch((error) => {
                console.error('관심 분야를 업데이트하는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },

    fetchUserProfile: () => {
        return API.get(`/profiles/user/current`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('사용자 프로필을 불러오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },

    getUserProfileLink: (username) => {
        return `${window.location.origin}/my-profile/${username}`;
    },

    fetchFriendProfile: (username) => {
        return API.get(`/profiles/user/view/${username}`)
            .then((response) => {
                if (response.status === 200) {
                    return response.data;
                }
                throw new Error('프로필 정보를 불러오는 동안 오류가 발생했습니다.');
            })
            .catch((error) => {
                console.error('프로필 정보를 가져오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },

    fetchLongQuestions: (username) => {
        return API.get(`/profiles/user/view/long-questions/${username}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log('사용자의 서술형 질문을 성공적으로 가져왔습니다.');
                }
                return response.data;
            })
            .catch((error) => {
                console.error('사용자의 서술형 질문을 가져오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },

    fetchFriends: (username) => {
        return API.get(`/profiles/user/view/friends/${username}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log('사용자의 친구 목록을 성공적으로 가져왔습니다.');
                }
                return response.data;
            })
            .catch((error) => {
                console.error('사용자의 친구 목록을 가져오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },
    fetchSearchResults: async (query) => {
        try {
            const response = await API.get('/profiles/user/search', {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching search results:', error);
            throw error;
        }
    },
    followUser: (username) => {
        return API.post(`/profiles/user/follow/`, { username })
            .then((response) => response.data)
            .catch((error) => {
                console.error('팔로우하는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },

    unfollowUser: (username) => {
        return API.post(`/profiles/user/unfollow/`, { username })
            .then((response) => response.data)
            .catch((error) => {
                console.error('팔로우 취소하는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },
};

export default ProfileService;
