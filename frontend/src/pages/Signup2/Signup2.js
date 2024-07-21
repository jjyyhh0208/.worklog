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
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedAge, setSelectedAge] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileData = await ProfileService.fetchUserProfile();
                setSignUpInfo({
                    ...signUpInfo,
                    name: userProfileData.name,
                    age: userProfileData.age,
                    gender: userProfileData.gender,
                });
                setSelectedAge(userProfileData.age);
                setSelectedGender(userProfileData.gender);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [isEditing]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
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

    const logoHandler = () => {
        localStorage.removeItem('authToken');
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
            localStorage.removeItem('authToken');
            navigate(-1);
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
                <div className={styles.imageUpload}>
                    <input type="file" className={styles.inputImage} onChange={handleFileChange} />
                    <div className={styles.imageContainer}>
                        {imageUrl && <img src={imageUrl} alt="Profile" className={styles.profileImage} />}
                        <button type="button" onClick={handleImageUpload}>
                            Upload
                        </button>
                        {uploadMessage && <p>{uploadMessage}</p>}
                    </div>
                </div>
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
