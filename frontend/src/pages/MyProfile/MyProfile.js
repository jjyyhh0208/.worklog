import React, { useState, useEffect } from 'react';
import AdminService from '../../utils/AdminService';
import ProfileService from '../../utils/ProfileService';

function MyProfile() {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        ProfileService.fetchUserProfile()
            .then((data) => {
                setProfileData(data);
            })
            .catch((error) => {
                console.error('프로필 정보를 불러오는 동안 오류가 발생했습니다.', error);
            });
    }, []);

    const handleLogout = () => {
        AdminService.logout()
            .then(() => {
                window.location.href = '/';
            })
            .catch((error) => {
                console.error('로그아웃 중 오류가 발생했습니다.', error);
            });
    };

    return (
        <div>
            <h2>단순 버전 - 내 프로필 페이지</h2>
            {profileData ? (
                <div>
                    <p>이름: {profileData.name}</p>
                    <p>성별: {profileData.gender}</p>
                    <p>나이: {profileData.age}</p>
                    <p>업무 스타일:</p>
                    <ul>
                        {profileData.work_styles.map((style) => (
                            <li key={style.id}>{style.name}</li>
                        ))}
                    </ul>
                    <p>관심사:</p>
                    <ul>
                        {profileData.interests.map((interest) => (
                            <li key={interest.id}>{interest.name}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>프로필 정보를 불러오는 중입니다...</p>
            )}
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
}

export default MyProfile;
