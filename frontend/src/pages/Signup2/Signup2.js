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

    const [selectedGender, setSelectedGender] = useState(signUpInfo.gender || profileData.gender || '');
    const [selectedAge, setSelectedAge] = useState(signUpInfo.age || profileData.age || '');
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadMessage, setUploadMessage] = useState('');

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
    };

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
            console.error('Failed to update user info:', error);
        }
    };

    const ageOptions = [];
    for (let year = 1985; year <= 2020; year++) {
        ageOptions.push(
            <option key={year} value={year}>
                {year}
            </option>
        );
    }

    const handleAgeChange = (e) => {
        setSelectedAge(e.target.value);
    };

    const handleGenderClick = (gender) => {
        setSignUpInfo({ ...signUpInfo, gender });
        setSelectedGender(gender);
    };

    const logoHandler = () => {
        navigate('/');
    };
    const handleBackClick = () => {
        console.log(signUpInfo);
        AdminService.userDelete()
            .then(() => {
                console.log('회원탈퇴가 성공됨!!');
                navigate(-1);
            })
            .catch((error) => {
                console.error('회원 탈퇴 중 오류가 발생했습니다.', error);
            });
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
                    onChange={signUpChangeHandler}
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
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                            <path
                                d="M25.0314 27.7727L7.97165 48.5912C6.79252 50.0301 4.88585 50.0301 3.71927 48.5912L0.884345 45.1317C-0.294782 43.6927 -0.294782 41.366 0.884345 39.9424L12.9767 25.1857L0.884345 10.4291C-0.294782 8.99015 -0.294782 6.66338 0.884345 5.23976L3.70672 1.7496C4.88585 0.310679 6.79252 0.310679 7.95911 1.7496L25.0188 22.5681C26.2105 24.007 26.2105 26.3338 25.0314 27.7727ZM49.1157 22.5681L32.0559 1.7496C30.8768 0.310679 28.9701 0.310679 27.8036 1.7496L24.9686 5.20915C23.7895 6.64807 23.7895 8.97485 24.9686 10.3985L37.061 25.1551L24.9686 39.9117C23.7895 41.3507 23.7895 43.6774 24.9686 45.1011L27.8036 48.5606C28.9827 49.9995 30.8894 49.9995 32.0559 48.5606L49.1157 27.7421C50.2948 26.3338 50.2948 24.007 49.1157 22.5681Z"
                                fill="#4053FF"
                            />
                        </svg>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Signup2;
