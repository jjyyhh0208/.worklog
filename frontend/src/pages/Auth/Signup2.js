import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';
import AdminService from '../../utils/AdminService';
import API from '../../utils/API';

function Signup2({ signUpInfo, setSignUpInfo }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;
    const profileData = location.state?.profileData || {};
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploadMessage, setUploadMessage] = useState('');
    const [isActive, setActive] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileData = await ProfileService.fetchUserProfile();
                setSignUpInfo({
                    ...signUpInfo,
                    name: userProfileData.name,
                    age: userProfileData.age,
                    gender: userProfileData.gender,
                    style: userProfileData.style,
                });
                setSelectedAge(userProfileData.age);
                setSelectedGender(userProfileData.gender);
                setSelectedStyle(userProfileData.style);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [isEditing]);

    useEffect(() => {
        if (isEditing) {
            setSignUpInfo(profileData);
        }
        fetchProfileImage();
    }, [isEditing, profileData, setSignUpInfo]);

    const fetchProfileImage = async () => {
        try {
            const profileData = await ProfileService.fetchUserProfile();
            if (profileData.profile_image && profileData.profile_image.image) {
                const signedUrl = await ProfileService.getSignedImageUrl(profileData.profile_image.image);
                setImageUrl(signedUrl);
            }
        } catch (error) {
            console.error('Error fetching profile image:', error);
        }
    };

    const signUpChangeHandler = (e) => {
        setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
        setFile(file);
        setImageUrl(URL.createObjectURL(file));
    };

    // Profile Image 설정
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        setImageUrl(URL.createObjectURL(file));
        setFileName(file.name);
    };

    const handleDrop = (event) => {
        event.preventDefault();

        const file = event.dataTransfer.files[0];
        setFile(file);
        setImageUrl(URL.createObjectURL(file));
        setFileName(file.name);
        setActive(false);
    };

    const handleDragStart = () => setActive(true);
    const handleDragEnd = () => setActive(false);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleImageUpload = async () => {
        if (!file) {
            setUploadMessage('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            await API.post('/profiles/user/set/profile-image/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadMessage('Image uploaded successfully');
            await fetchProfileImage();
        } catch (error) {
            setUploadMessage(
                error.response ? `Failed to upload image: ${error.response.data}` : 'Failed to upload image'
            );
        }
    };

    const handleNextClick = async (e) => {
        e.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                await API.post('/profiles/user/set/profile-image/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setUploadMessage('Image uploaded successfully');
                await fetchProfileImage();
            } catch (error) {
                setUploadMessage(
                    error.response ? `Failed to upload image: ${error.response.data}` : 'Failed to upload image'
                );
                console.error('Failed to update user info:', error);
            }
        }

        try {
            await ProfileService.setUserBasicInfo({
                name: signUpInfo.name === null ? signUpInfo.username : signUpInfo.name,
                age: selectedAge,
                gender: signUpInfo.gender === 'None' ? null : signUpInfo.gender,
                style: selectedStyle,
            });

            if (isEditing) {
                navigate('/my-profile');
            } else {
                navigate('/signup/3');
            }
        } catch (error) {
            setUploadMessage('Failed to update user info');
            console.error('Failed to update user info:', error);
        }
    };

    const ageOptions = [];
    for (let year = 1960; year <= 2020; year++) {
        ageOptions.push(
            <option key={year} value={year}>
                {year}
            </option>
        );
    }

    const handleInputChange = (e) => {
        setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
    };

    const handleAgeChange = (e) => {
        setSelectedAge(e.target.value);
        setSignUpInfo({ ...signUpInfo, age: e.target.value });
    };

    const handleGenderClick = (gender) => {
        setSignUpInfo({ ...signUpInfo, gender });
        setSelectedGender(gender);
    };

    const handleStyleClick = (style) => {
        setSignUpInfo({ ...signUpInfo, style });
        setSelectedStyle(style);
    };

    const logoHandler = () => {
        navigate('/');
    };

    const handleBackClick = () => {
        if (!isEditing) {
            // 수정 중이 아닐때는 유저 삭제
            AdminService.userDelete()
                .then(() => {
                    navigate(-1);
                    // authToken은 signup1에 도착 후 삭제 (속도 이슈)
                })
                .catch((error) => {
                    console.error('회원 탈퇴 중 오류가 발생했습니다.', error);
                });
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="w-full flex flex-col items-center p-5 md:w-4/5 max-w-2xl mx-auto">
            <h1 className="text-[#4053ff] text-4xl font-extrabold cursor-pointer mb-5" onClick={logoHandler}>
                .WORKLOG
            </h1>

            <div className="w-full border border-gray-300 rounded-lg p-5 relative">
                <h2 className="text-black text-2xl font-bold text-center mb-5">기본프로필 등록</h2>
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
                <form className="flex flex-col items-center w-full">
                    <span className="w-full text-base font-bold mb-1">이름</span>
                    <input
                        className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="사용할 닉네임을 입력해주세요."
                        name="name"
                        value={signUpInfo.name}
                        onChange={handleInputChange}
                    />
                    <span className="w-full text-base font-bold mb-1">출생연도</span>
                    <select
                        className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedAge}
                        onChange={handleAgeChange}
                    >
                        <option value="">출생연도를 선택하세요</option>
                        {ageOptions}
                    </select>
                    <span className="w-full text-base font-bold mb-1">성별</span>
                    <div className="flex justify-between w-full mb-5">
                        {['M', 'F', 'N'].map((gender) => (
                            <button
                                key={gender}
                                type="button"
                                className={`w-[32%] py-2 rounded-md text-sm font-bold transition-colors duration-200 ${
                                    selectedGender === gender
                                        ? 'bg-[#4053ff] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => handleGenderClick(gender)}
                            >
                                {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'None'}
                            </button>
                        ))}
                    </div>
                    <span className="w-full text-base font-bold mb-1">선호하는 피드백 스타일</span>
                    <div className="flex justify-around w-full mb-5">
                        {['hard', 'soft'].map((style) => (
                            <button
                                key={style}
                                type="button"
                                className={`w-[40%] py-2 rounded-md text-sm font-bold transition-colors duration-200 ${
                                    selectedStyle === style
                                        ? 'bg-[#4053ff] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => handleStyleClick(style)}
                            >
                                {style === 'hard'
                                    ? '솔직한 피드백'
                                    : style === 'soft'
                                    ? '배려있는 피드백'
                                    : '솔직한 피드백'}
                            </button>
                        ))}
                    </div>
                    <span className="w-full text-base font-bold mb-1">프로필 이미지</span>
                    <label
                        className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
                            isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onDragEnter={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragEnd}
                        onDrop={handleDrop}
                    >
                        <input type="file" className="hidden" onChange={handleFileChange} />
                        {!file ? (
                            <>
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    ></path>
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">클릭 혹은 파일을 이곳에 드롭하세요.</p>
                                <p className="text-xs text-gray-500">파일당 최대 3MB</p>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <img
                                    src={imageUrl}
                                    alt="Profile"
                                    className="max-w-full max-h-full object-cover rounded"
                                />
                            </div>
                        )}
                    </label>
                    {fileName && <p className="mt-2 text-sm text-gray-500">{fileName}</p>}
                    <div className="w-full flex justify-center mt-8">
                        <button
                            className="w-full py-2 px-4 bg-[#4053ff] text-white rounded-md text-xl cursor-pointer hover:bg-[#3442cc] transition-colors duration-200"
                            type="button"
                            onClick={handleNextClick}
                        >
                            {isEditing ? '수정 완료' : 'NEXT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup2;
