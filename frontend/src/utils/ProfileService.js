import API from './API';

const ProfileService = {
    setUserBasicInfo: ({ name, feedback_style }) => {
        const requestData = {
            name: name,
            feedback_style: feedback_style,
        };
        return API.put(`profiles/user/set/basic-info/`, requestData)
            .then((response) => {
                if (response.status === 200) {
                }
                return response.data;
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    throw new Error('기본 정보를 업데이트하는 동안 오류가 발생했습니다.');
                } else if (error.response) {
                    throw new Error('서버 오류가 발생했습니다.');
                } else {
                    throw new Error(error.message);
                }
            });
    },
    setUserProfileInfo: (formData) => {
        return API.post('profiles/user/set/profile-image/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                if (response.status === 200) {
                }
                return response.data;
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    throw new Error('프로필 이미지를 업데이트하는 동안 오류가 발생했습니다.');
                } else if (error.response) {
                    throw new Error('서버 오류가 발생했습니다.');
                } else {
                    throw new Error(error.message);
                }
            });
    },

    fetchWorkStyles: () => {
        return API.get(`profiles/workstyles/`)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    },

    setUserWorkStyles: (workStyles) => {
        const requestData = {
            work_styles: workStyles,
        };

        return API.put(`profiles/user/set/work-style/`, requestData)
            .then((response) => {
                if (response.status === 200) {
                }
                return response.data;
            })
            .catch((error) => {
                throw error;
            });
    },

    fetchInterests: () => {
        return API.get(`/profiles/interests/`)
            .then((response) => response.data)
            .catch((error) => {
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
                }
                return response.data;
            })
            .catch((error) => {
                throw error;
            });
    },

    fetchUserProfile: () => {
        return API.get(`/profiles/user/current`)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    },

    fetchFriendProfile: (username) => {
        return API.get(`/profiles/user/view/${username}`)
            .then((response) => {
                if (response.status === 200) {
                    const profileData = response.data;
                    profileData.remaining_time = profileData.remaining_time || 0;

                    return profileData;
                }
                throw new Error('프로필 정보를 불러오는 동안 오류가 발생했습니다.');
            })
            .catch((error) => {
                throw error;
            });
    },

    getFriendsList: () => {
        return API.get(`/profiles/user/friends/`)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    },

    fetchLongQuestions: (username) => {
        return API.get(`/profiles/user/view/long-questions/${username}`)
            .then((response) => {
                if (response.status === 200) {
                }
                return response.data;
            })
            .catch((error) => {
                throw error;
            });
    },

    fetchFriends: (username) => {
        return API.get(`/profiles/user/view/friends/${username}`)
            .then((response) => {
                if (response.status === 200) {
                }
                return response.data;
            })
            .catch((error) => {
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
            throw error;
        }
    },
    followUser: (friend_name) => {
        // 서버에 팔로우 요청을 보냄
        return API.post(`/profiles/user/follow/`, { friend_name })
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    },

    unfollowUser: (friend_name) => {
        // 서버에 언팔로우 요청을 보냄
        return API.post(`/profiles/user/unfollow/`, { friend_name })
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    },

    // s3 접근하는 Service
    getSignedImageUrl: (imagePath) => {
        return API.get(`/profiles/user/get-signed-url/${encodeURIComponent(imagePath)}/`)
            .then((response) => {
                if (response.status === 200) {
                    return response.data.signed_url;
                }
                throw new Error('Failed to fetch signed URL.');
            })
            .catch((error) => {
                throw error;
            });
    },
    //  프로필 한줄소개 작성
    updateBio: async (bio) => {
        try {
            const response = await API.put(`/profiles/user/set/bio/`, { bio });

            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default ProfileService;
