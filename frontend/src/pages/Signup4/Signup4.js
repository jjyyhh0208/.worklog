import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import AdminService from '../../utils/AdminService';

function Signup4({ signUpInfo, setSignUpInfo }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;
    const profileData = location.state?.profileData || {};
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [interestKeywords, setInterestKeywords] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const interestsData = await ProfileService.fetchInterests();
                const fetchedInterests = interestsData.map((item) => item.name);
                setInterestKeywords(fetchedInterests);

                if (isEditing) {
                    const userProfileData = await ProfileService.fetchUserProfile();
                    const fetchedInterests = userProfileData.interests.map((item) => item.name) || [];
                    setSelectedInterests(fetchedInterests);
                    updateSignUpInfo(fetchedInterests);
                } else {
                    // Load from local storage if available
                    const storedInterests = localStorage.getItem('selectedInterests');
                    if (storedInterests) {
                        const parsedInterests = JSON.parse(storedInterests);
                        setSelectedInterests(parsedInterests);
                        updateSignUpInfo(parsedInterests);
                    }
                }

                setSignUpInfo((prevState) => ({
                    ...prevState,
                    name: location.state?.name || prevState.name,
                    age: location.state?.age || prevState.age,
                    gender: location.state?.gender || prevState.gender,
                    work_style: location.state?.selectedKeywords || prevState.work_style,
                }));
            } catch (error) {}
        };

        fetchData();
    }, [isEditing, location.state, setSignUpInfo]);

    const updateSignUpInfo = (interests) => {
        setSignUpInfo({
            ...signUpInfo,
            interests: {
                keyword1: interests[0] || '',
                keyword2: interests[1] || '',
                keyword3: interests[2] || '',
            },
        });
    };

    const handleKeywordClick = (keyword) => {
        let newInterests = [...selectedInterests];
        if (newInterests.includes(keyword)) {
            newInterests = newInterests.filter((kw) => kw !== keyword);
        } else {
            if (newInterests.length < 3) {
                newInterests.push(keyword);
            } else {
                alert('최대 3개의 키워드만 선택 가능합니다.');
                return;
            }
        }
        setSelectedInterests(newInterests);
        updateSignUpInfo(newInterests);

        // Save to local storage
        localStorage.setItem('selectedInterests', JSON.stringify(newInterests));
    };

    const handleCompleteClick = () => {
        if (selectedInterests.length === 0) {
            alert('최소 1개의 키워드를 선택해주세요.');
            return;
        }
        const selectedInterestIds = selectedInterests
            .map((interest) => {
                const foundInterest = interestKeywords.find((kw) => kw === interest);
                return foundInterest ? interestKeywords.indexOf(foundInterest) + 1 : null;
            })
            .filter((id) => id !== null);

        ProfileService.setUserInterest(selectedInterestIds)
            .then(() => {
                // Clear local storage after successful completion
                localStorage.removeItem('selectedInterests');
                localStorage.removeItem('selectedWorkStyles');

                if (isEditing) {
                    navigate('/my-profile', {
                        state: {
                            isEditing,
                            profileData: { ...signUpInfo, interests: selectedInterests },
                            selectedInterests,
                            selectedKeywords: location.state?.selectedKeywords || [],
                            name: signUpInfo.name,
                            age: signUpInfo.age,
                            gender: signUpInfo.gender,
                        },
                    });
                } else {
                    // Clear local storage after successful completion
                    localStorage.removeItem('selectedInterests');
                    localStorage.removeItem('selectedWorkStyles');
                    navigate('/on-boarding/1', {
                        state: {
                            profileData: { ...signUpInfo, interests: selectedInterests },
                            selectedInterests,
                            selectedKeywords: location.state?.selectedKeywords || [],
                            name: signUpInfo.name,
                            age: signUpInfo.age,
                            gender: signUpInfo.gender,
                        },
                    });
                }
            })
            .catch((error) => {});
    };

    const logoHandler = () => {
        if (!isEditing) {
            signUpInfo.username = '';
            signUpInfo.password1 = '';
            signUpInfo.password2 = '';
            signUpInfo.name = '';
            signUpInfo.gender = '';
            signUpInfo.age = '';

            AdminService.userDelete()
                .then(() => {
                    navigate('/', { state: { selectedInterests } });
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('selectedInterests');
                    localStorage.removeItem('selectedWorkStyles');
                })
                .catch((error) => {});
        } else {
            navigate('/my-profile', { state: { selectedInterests } });
        }
    };

    const handleBackClick = () => {
        navigate(-1, {
            state: {
                name: signUpInfo.name,
                age: signUpInfo.age,
                gender: signUpInfo.gender,
                selectedKeywords: location.state?.selectedKeywords || [],
                selectedInterests: selectedInterests,
            },
        });
    };

    return (
        <div className="w-full flex flex-col items-center p-5 md:w-4/5 max-w-2xl mx-auto">
            <h1 className="text-[#4053ff] text-4xl font-extrabold cursor-pointer mb-5" onClick={logoHandler}>
                .WORKLOG
            </h1>

            <div className="w-full border border-gray-300 rounded-lg p-5 relative">
                <h2 className="text-black text-2xl font-bold text-center mb-5">기본 프로필 등록</h2>
                <div className="absolute top-5 left-5">
                    <button type="button" onClick={handleBackClick} className="focus:outline-none hover:bg-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M15.5 19l-7-7 7-7"
                                stroke="#4053ff"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                <p className="text-[#4053ff] text-xl font-semibold mb-4">관심있는 업종/직군 분야를 골라 주세요.</p>
                <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
                        <g clipPath="url(#clip0_231_547)">
                            <path
                                d="M12.5 1.06104C5.81265 1.06104 0.390625 6.48501 0.390625 13.1704C0.390625 19.8597 5.81265 25.2798 12.5 25.2798C19.1874 25.2798 24.6094 19.8597 24.6094 13.1704C24.6094 6.48501 19.1874 1.06104 12.5 1.06104ZM12.5 6.43213C13.6326 6.43213 14.5508 7.35029 14.5508 8.48291C14.5508 9.61553 13.6326 10.5337 12.5 10.5337C11.3674 10.5337 10.4492 9.61553 10.4492 8.48291C10.4492 7.35029 11.3674 6.43213 12.5 6.43213ZM15.2344 18.8345C15.2344 19.1581 14.972 19.4204 14.6484 19.4204H10.3516C10.028 19.4204 9.76562 19.1581 9.76562 18.8345V17.6626C9.76562 17.339 10.028 17.0767 10.3516 17.0767H10.9375V13.9517H10.3516C10.028 13.9517 9.76562 13.6893 9.76562 13.3657V12.1938C9.76562 11.8703 10.028 11.6079 10.3516 11.6079H13.4766C13.8001 11.6079 14.0625 11.8703 14.0625 12.1938V17.0767H14.6484C14.972 17.0767 15.2344 17.339 15.2344 17.6626V18.8345Z"
                                fill="#29A02D"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_231_547">
                                <rect width="25" height="25" fill="white" transform="translate(0 0.67041)" />
                            </clipPath>
                        </defs>
                    </svg>
                    <span className="text-gray-600 text-sm ml-2">
                        키워드는 최대 3개까지 선택해주세요. 제한없이 수정이 가능하니 편하게 골라주세요!
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {interestKeywords.map((keyword) => (
                        <button
                            key={keyword}
                            className={`px-4 py-2 min-h-12 min-w-20 rounded-full text-sm font-semibold m-1 ${
                                selectedInterests.includes(keyword)
                                    ? 'bg-[#4053ff] text-white'
                                    : 'bg-gray-300 text-white hover:bg-[#ccd1ff] hover:text-white'
                            }`}
                            onClick={() => handleKeywordClick(keyword)}
                        >
                            {keyword}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        className="w-32 py-2 bg-[#4053ff] text-white rounded-md text-lg font-bold cursor-pointer"
                        type="button"
                        onClick={handleCompleteClick}
                    >
                        {isEditing ? '수정 완료' : '가입 완료'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup4;
