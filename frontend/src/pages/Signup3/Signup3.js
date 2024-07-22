import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import keywordIcons from '../../components/KeywordIcons/KeywordIcons';

function Signup3({ signUpInfo, setSignUpInfo }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;
    const profileData = location.state?.profileData || {};
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const workStylesData = await ProfileService.fetchWorkStyles();
                const fetchedKeywords = workStylesData.map((item) => item.name);
                setKeywords(fetchedKeywords);

                if (isEditing) {
                    const userProfileData = await ProfileService.fetchUserProfile();
                    const fetchedKeywords = userProfileData.work_styles.map((item) => item.name) || [];
                    console.log(fetchedKeywords);
                    setSelectedKeywords(fetchedKeywords);
                    setSignUpInfo({
                        ...signUpInfo,
                        work_style: {
                            keyword1: fetchedKeywords[0] || '',
                            keyword2: fetchedKeywords[1] || '',
                            keyword3: fetchedKeywords[2] || '',
                        },
                    });
                } else {
                    // Load from local storage if available
                    const storedKeywords = localStorage.getItem('selectedWorkStyles');
                    if (storedKeywords) {
                        const parsedKeywords = JSON.parse(storedKeywords);
                        setSelectedKeywords(parsedKeywords);
                        updateSignUpInfo(parsedKeywords);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [isEditing]);

    const updateSignUpInfo = (keywords) => {
        setSignUpInfo({
            ...signUpInfo,
            work_style: {
                keyword1: keywords[0] || '',
                keyword2: keywords[1] || '',
                keyword3: keywords[2] || '',
            },
        });
    };

    const handleKeywordClick = (keyword) => {
        let newKeywords = [...selectedKeywords];
        if (newKeywords.includes(keyword)) {
            newKeywords = newKeywords.filter((kw) => kw !== keyword);
        } else {
            if (newKeywords.length < 3) {
                newKeywords.push(keyword);
            } else {
                alert('최대 3개의 키워드만 선택 가능합니다.');
                return;
            }
        }
        setSelectedKeywords(newKeywords);
        updateSignUpInfo(newKeywords);

        // Save to local storage
        localStorage.setItem('selectedWorkStyles', JSON.stringify(newKeywords));
    };

    const handleNextClick = () => {
        if (selectedKeywords.length === 0) {
            alert('최소 1개의 키워드를 선택해주세요.');
            return;
        }
        const selectedKeywordIds = selectedKeywords.map((keyword) => {
            const foundKeyword = keywords.find((kw) => kw === keyword);
            return foundKeyword ? keywords.indexOf(foundKeyword) + 1 : null;
        });

        ProfileService.setUserWorkStyles(selectedKeywordIds)
            .then(() => {
                navigate('/signup/4', {
                    state: { isEditing, profileData: { ...signUpInfo, work_styles: selectedKeywords } },
                });
            })
            .catch((error) => {
                console.error('Error setting user work styles:', error);
            });
    };

    const logoHandler = () => {
        if (!isEditing) {
            navigate('/');
        } else {
            navigate('/my-profile');
        }
    };

    const handleBackClick = () => {
        navigate(-1);
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
                <p className="text-[#4053ff] text-xl font-semibold mb-4">
                    스스로 생각하기에 본인의 업무 스타일은 어떤 이미지가 돋보이나요?
                </p>
                <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 25 26" fill="none">
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
                    {keywords.map((keyword) => (
                        <button
                            key={keyword}
                            className={`px-4 py-2  min-h-11 rounded-full text-sm font-semibold m-1 ${
                                selectedKeywords.includes(keyword)
                                    ? 'bg-[#4053ff] text-white'
                                    : 'bg-gray-300 text-[#4053ff] hover:bg-[#ccd1ff] hover:text-white'
                            }`}
                            onClick={() => handleKeywordClick(keyword)}
                        >
                            {keywordIcons[keyword]}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        className="w-32 py-2 bg-[#4053ff] text-white rounded-md text-lg font-bold cursor-pointer"
                        type="button"
                        onClick={handleNextClick}
                    >
                        NEXT
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup3;
