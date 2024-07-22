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
        <div className="flex flex-col items-center mt-56 lg:mt-40 md:mt-32 sm:mt-24">
            <h1
                className="absolute top-7 left-9 text-[#4053ff] text-5xl font-extrabold cursor-pointer lg:text-4xl lg:top-5 lg:left-5 md:text-3xl sm:text-2xl"
                onClick={logoHandler}
            >
                .WORKLOG
            </h1>

            <h2 className="absolute top-7 right-9 text-3xl font-bold mb-5 lg:text-2xl lg:top-5 lg:right-5 md:text-xl sm:text-lg">
                기본 프로필 등록
            </h2>
            <div className="absolute top-24 left-20 lg:top-20 lg:left-16 md:top-16 md:left-12 sm:top-12 sm:left-8">
                <button type="button" onClick={handleBackClick} className="bg-transparent hover:bg-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-15 h-12 lg:w-12 lg:h-10 md:w-10 md:h-8 sm:w-8 sm:h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
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
            <p className="text-[#4053ff] text-4xl font-semibold mb-24 lg:text-3xl md:text-2xl sm:text-xl">
                스스로 생각하기에 본인의 업무 스타일은 어떤 이미지가 돋보이나요?
            </p>
            <div className="absolute mt-24 -ml-[350px] flex flex-col w-full max-w-[700px] h-6 lg:mt-20 lg:-ml-[250px] md:mt-16 md:-ml-[200px] sm:mt-12 sm:-ml-[150px]">
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
                <span className="text-[#9b8f8f] text-lg font-medium absolute ml-8 mt-1 lg:text-base md:text-sm sm:text-xs">
                    키워드는 최대 3개까지 선택해주세요. 제한없이 수정이 가능하니 편하게 골라주세요!
                </span>
            </div>
            <div className="relative flex flex-wrap justify-center gap-2.5 my-24 w-[120%] max-w-[850px] h-[550px] lg:my-20 lg:w-full md:my-16 sm:my-12">
                {keywords.map((keyword) => (
                    <button
                        key={keyword}
                        className={`px-5 py-2.5 h-[50px] flex-shrink-0 rounded-full text-3xl font-bold 
                            ${
                                selectedKeywords.includes(keyword)
                                    ? 'bg-[#4053ff] text-white'
                                    : 'bg-[#ccd1ff] text-white'
                            } lg:text-2xl md:text-xl sm:text-lg`}
                        onClick={() => handleKeywordClick(keyword)}
                    >
                        {keywordIcons[keyword]}
                        
                    </button>
                ))}
            </div>
            <div className="mb-5 lg:bottom-20 lg:right-20 md:bottom-16 md:right-16 sm:bottom-12 sm:right-12">
                <button
                    className="w-[148px] h-[49px] rounded-[15px] bg-[#4053ff] text-white text-2xl font-bold cursor-pointer 
                        lg:w-[120px] lg:h-[40px] lg:text-xl md:w-[100px] md:h-[35px] md:text-lg sm:w-[80px] sm:h-[30px] sm:text-base"
                    type="button"
                    onClick={handleNextClick}
                >
                    NEXT
                </button>
            </div>
        </div>
    );
}

export default Signup3;
