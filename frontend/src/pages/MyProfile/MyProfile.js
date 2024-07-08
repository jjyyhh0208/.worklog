import React from 'react';
import AdminService from '../../utils/AdminService';

function MyProfile() {
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
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
}

export default MyProfile;
