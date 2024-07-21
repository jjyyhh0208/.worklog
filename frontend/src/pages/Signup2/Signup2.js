//signup2

import React, { useState, useEffect } from 'react';
import styles from './Signup2.module.css';
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
            });

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
        if (!isEditing) {
            AdminService.userDelete()
                .then(() => {
                    localStorage.removeItem('authToken');
                    navigate(-1);
                })
                .catch((error) => {
                    console.error('회원 탈퇴 중 오류가 발생했습니다.', error);
                });
        } else {
            navigate(-1, {
                state: {
                    name: signUpInfo.name,
                    age: selectedAge,
                    gender: signUpInfo.gender,
                },
            });
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1} onClick={logoHandler}>
                .WORKLOG
            </h1>

            <h2 className={styles.h2}>기본프로필 등록</h2>
            <div className={styles.back}>
                <button type="submit" onClick={handleBackClick} className={styles.backBtn}>
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
            <form className={styles.signUp}>
                <div className={styles.idbox}></div>
                <span className={styles.span}>이름</span>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="사용할 닉네임을 입력해주세요."
                    name="name"
                    value={signUpInfo.name}
                    onChange={handleInputChange}
                />
                <span className={styles.span}>출생연도</span>
                <select className={styles.input} value={selectedAge} onChange={handleAgeChange}>
                    <option value="">출생연도를 선택하세요</option>
                    {ageOptions}
                </select>
                <span className={styles.span}>성별</span>
                <div className={styles.genderButtons}>
                    <button
                        type="button"
                        className={`${styles.genderButton} ${selectedGender === 'M' ? styles.selected : ''}`}
                        onClick={() => handleGenderClick('M')}
                    >
                        Male
                    </button>
                    <button
                        type="button"
                        className={`${styles.genderButton} ${selectedGender === 'F' ? styles.selected : ''}`}
                        onClick={() => handleGenderClick('F')}
                    >
                        Female
                    </button>
                    <button
                        type="button"
                        className={`${styles.genderButton} ${selectedGender === 'N' ? styles.selected : ''}`}
                        onClick={() => handleGenderClick('N')}
                    >
                        None
                    </button>
                </div>
                <span className={styles.span}>프로필 이미지</span>
                <label
                    className={`${styles.preview} ${isActive ? styles.active : ''}`}
                    onDragEnter={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragEnd}
                    onDrop={handleDrop}
                >
                    <input type="file" className={styles.file} onChange={handleFileChange} />
                    {!file && (
                        <>
                            <svg className={styles.icon} x="0px" y="0px" viewBox="0 0 24 24">
                                <path fill="transparent" d="M0,0h24v24H0V0z" />
                                <path
                                    fill="#000"
                                    d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19  c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"
                                />
                            </svg>
                            <p className={styles.preview_msg}>클릭 혹은 파일을 이곳에 드롭하세요.</p>
                            <p className={styles.preview_desc}>파일당 최대 3MB</p>
                        </>
                    )}
                    {file && (
                        <div className={styles.imagePreview}>
                            <img src={imageUrl} alt="Profile" className={styles.profileImage} />
                            <div className={styles.imagetext}>{fileName}</div>
                        </div>
                    )}
                </label>

                <div className={styles.nextbox}>
                    <div>
                        <button className={styles.nextBtn} type="button" onClick={handleNextClick}>
                            {isEditing ? '수정 완료' : 'NEXT'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Signup2;
