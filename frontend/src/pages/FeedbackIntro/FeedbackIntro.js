import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import keywordIcons from '../../components/KeywordIcons/KeywordIcons';
import ProgressBar from '../../components/ProgressBar/ProgressBar'; // ProgressBar import

function FeedbackIntro() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const location = useLocation();
    const { answers, scores } = location.state || {};

    useEffect(() => {
        ProfileService.fetchWorkStyles()
            .then((data) => {
                const fetchedKeywords = data.map((item) => item.name);
                setKeywords(fetchedKeywords);
            })
            .catch((error) => {
                console.error('Error fetching work styles:', error);
            });

        ProfileService.fetchFriendProfile(username)
            .then((data) => {
                setProfileData(data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });

        const storedWorkStyles = localStorage.getItem('workStyles');
        if (storedWorkStyles) {
            const parsedWorkStyles = JSON.parse(storedWorkStyles);
            const storedKeywords = parsedWorkStyles.work_styles.map((style) => style.name);
            setSelectedKeywords(storedKeywords);
        }
    }, [username]);

    const handleKeywordClick = (keyword) => {
        let newKeywords = [...selectedKeywords];
        if (newKeywords.includes(keyword)) {
            newKeywords = newKeywords.filter((kw) => kw !== keyword);
        } else {
            if (newKeywords.length < 3) {
                newKeywords.push(keyword);
            } else {
                alert('최대 3개의 키워드만 선택 가능합니다.');
            }
        }
        setSelectedKeywords(newKeywords);
    };

    const handleNextClick = () => {
        if (selectedKeywords.length === 0) {
            alert('최소 1개의 키워드를 선택해주세요.');
            return;
        }
        const selectedWorkStyles = selectedKeywords.map((keyword) => {
            const index = keywords.indexOf(keyword);
            return {
                id: index + 1,
                name: keyword,
            };
        });

        const workStyles = { work_styles: selectedWorkStyles };

        localStorage.setItem('workStyles', JSON.stringify(workStyles));
        navigate(`/feedback/1/${username}`, {
            state: { ...location.state, answers, scores },
        });
    };

    const handleBackClick = () => {
        navigate(`/friend-profile/${username}`);
    };

    return (
        <div className="w-[100%] flex flex-col items-center bg-gray-100 overflow-y-auto min-h-[90%] h-screen  mt-16">
            <div className="p-9 md:w-3/5 w-11/12 rounded-2xl bg-white flex-shrink-0 my-9 flex flex-col items-center shadow-lg relative overflow-y-auto">
                <ProgressBar progress={20} /> {/* ProgressBar 추가 */}
                <div className="absolute top- right-8 text-xl font-bold text-black bg-gray-300 p-3 rounded-lg shadow-md">
                    1/5
                </div>
                <div className="absolute top-8 left-8">
                    <button type="submit" onClick={handleBackClick} className=" cursor-pointer hover:bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="50" viewBox="0 0 24 24" fill="none">
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
                <div className="text-[#4053ff] text-3xl font-extrabold leading-normal mt-12 my-2">
                    {profileData
                        ? `${profileData.name}님의 업무 스타일은 어떤 이미지가 돋보이나요?`
                        : '스스로 생각하기에 본인의 업무 스타일은 어떤 이미지가 돋보이나요?'}
                    <div className="flex w-4/5 my-4">
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
                        <span className="text-[#9b8f8f] text-xl font-medium leading-normal ml-1">
                            키워드는 최대 3개까지 선택해주세요.
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 my-6 w-full max-w-5xl h-[20vh]">
                    {keywords.map((keyword) => (
                        <button
                            key={keyword}
                            className={`px-4 py-2 border border-gray-300 cursor-pointer transition-all duration-300 rounded-full text-lg font-semibold ${
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
                <div className="flex justify-end items-center mt-60 mb-2 w-full">
                    <button
                        className="w-36 h-12 rounded-lg bg-[#4053ff] border-none text-white text-lg font-bold cursor-pointer"
                        type="submit"
                        onClick={handleNextClick}
                    >
                        NEXT
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FeedbackIntro;
