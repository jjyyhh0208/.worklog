//signup2

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
    const [selectedGender, setSelectedGender] = useState(location.state?.gender || '');
    const [selectedAge, setSelectedAge] = useState(location.state?.age || '');
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
                    name: userProfileData.name || location.state?.name || '',
                    age: userProfileData.age || location.state?.age || '',
                    gender: userProfileData.gender || location.state?.gender || '',
                });
                setSelectedAge(userProfileData.age || location.state?.age || '');
                setSelectedGender(userProfileData.gender || location.state?.gender || '');
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

        const formData = new FormData();
        formData.append('name', signUpInfo.name === null ? signUpInfo.username : signUpInfo.name);
        formData.append('age', selectedAge);
        formData.append('gender', signUpInfo.gender === 'None' ? '' : signUpInfo.gender);
        if (file) {
            formData.append('image', file);
        }

        try {
            await ProfileService.setUserBasicInfo(formData);

            if (isEditing) {
                navigate('/my-profile');
            } else {
                navigate('/signup/3', {
                    state: {
                        name: signUpInfo.name,
                        age: selectedAge,
                        gender: signUpInfo.gender,
                    },
                });
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

    const logoHandler = () => {
        navigate('/');
    };

    const handleBackClick = () => {
        console.log('회원탈퇴');
        AdminService.userDelete()
            .then(() => {
                navigate(-1);
                localStorage.removeItem('authToken');
            })
            .catch((error) => {
                console.error('회원 탈퇴 중 오류가 발생했습니다.', error);
            });
    };

    return (
        <div className="flex flex-col items-center mt-56 md:mt-40 sm:mt-24">
            <h1
                className="absolute top-7 left-9 text-[#4053ff] text-5xl font-extrabold cursor-pointer sm:text-4xl sm:top-5 sm:left-5"
                onClick={logoHandler}
            >
                .WORKLOG
            </h1>

            <h2 className="text-3xl font-bold mb-24 sm:text-2xl sm:mb-16">기본프로필 등록</h2>
            <div className="absolute -left-20 top-24 sm:-left-10 sm:top-20">
                <button type="submit" onClick={handleBackClick} className="bg-transparent hover:bg-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="60"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="sm:w-12 sm:h-10"
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
            <form className="flex flex-col items-center gap-2.5">
                <span className="text-2xl font-bold self-start sm:text-xl">이름</span>
                <input
                    className="w-[440px] h-[90px] px-2.5 rounded-lg border-2 border-[#4053ff] bg-white mb-5 text-xl sm:w-[300px] sm:h-[60px] sm:text-base"
                    type="text"
                    placeholder="사용할 닉네임을 입력해주세요."
                    name="name"
                    value={signUpInfo.name}
                    onChange={handleInputChange}
                />
                <span className="text-2xl font-bold self-start sm:text-xl">출생연도</span>
                <select
                    className="w-[440px] h-[90px] px-2.5 rounded-lg border-2 border-[#4053ff] bg-white mb-5 text-xl sm:w-[300px] sm:h-[60px] sm:text-base"
                    value={selectedAge}
                    onChange={handleAgeChange}
                >
                    <option value="">출생연도를 선택하세요</option>
                    {ageOptions}
                </select>
                <span className="text-2xl font-bold self-start sm:text-xl">성별</span>
                <div className="flex gap-2.5 mb-5">
                    {['M', 'F', 'N'].map((gender) => (
                        <button
                            key={gender}
                            type="button"
                            className={`w-[138px] h-[59px] rounded-lg text-2xl font-semibold 
                                ${
                                    selectedGender === gender ? 'bg-[#4053ff] text-white' : 'bg-[#d9d9d9] text-black'
                                } sm:w-[100px] sm:h-[40px] sm:text-lg`}
                            onClick={() => handleGenderClick(gender)}
                        >
                            {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'None'}
                        </button>
                    ))}
                </div>
                <span className="text-2xl font-bold self-start sm:text-xl">프로필 이미지</span>
                <label
                    className={`flex flex-col items-center justify-center gap-2.5 w-full p-[70px] border-3 border-dashed rounded-md bg-white cursor-pointer 
                        ${isActive ? 'bg-[#efeef3] border-black' : 'border-[#eee] hover:border-black'} 
                        sm:p-[40px]`}
                    onDragEnter={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragEnd}
                    onDrop={handleDrop}
                >
                    <input type="file" className="hidden" onChange={handleFileChange} />
                    {!file && (
                        <>
                            <svg
                                className="w-24 h-24 pointer-events-none sm:w-16 sm:h-16"
                                x="0px"
                                y="0px"
                                viewBox="0 0 24 24"
                            >
                                <path fill="transparent" d="M0,0h24v24H0V0z" />
                                <path
                                    fill="#000"
                                    d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19  c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"
                                />
                            </svg>
                            <p className="font-medium text-lg mt-5 mb-2.5 sm:text-base">
                                클릭 혹은 파일을 이곳에 드롭하세요.
                            </p>
                            <p className="text-sm sm:text-xs">파일당 최대 3MB</p>
                        </>
                    )}
                    {file && (
                        <div className="flex flex-col items-center">
                            <img
                                src={imageUrl}
                                alt="Profile"
                                className="max-h-[200px] max-w-[200px] sm:max-h-[150px] sm:max-w-[150px]"
                            />
                            <div className="mt-5 text-xl sm:text-base">{fileName}</div>
                        </div>
                    )}
                </label>

                <div className="">
                    <button
                        className="w-[148px] h-[49px] rounded-[15px] bg-[#4053ff] text-white text-2xl font-bold absolute left-1/2 transform -translate-x-1/2 cursor-pointer sm:w-[120px] sm:h-[40px] sm:text-xl"
                        type="button"
                        onClick={handleNextClick}
                    >
                        {isEditing ? '수정 완료' : 'NEXT'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Signup2;
