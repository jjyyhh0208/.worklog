import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import AdminService from '../../utils/AdminService';
import ProfileService from '../../utils/ProfileService';

function Header({ isLoggedIn }) {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            ProfileService.fetchUserProfile()
                .then((data) => {
                    setProfileData(data);
                })
                .catch((error) => {
                    console.error('프로필 정보를 불러오는 동안 오류가 발생했습니다.', error);
                });
        }
    }, [isLoggedIn]);

    const onLogoutClick = () => {
        AdminService.logout()
            .then(() => {
                window.location.href = '/';
            })
            .catch((error) => {
                console.error('로그아웃 중 오류가 발생했습니다.', error);
            });
    };

    return (
        <div className={styles.header}>
            <Link to="/">
                <span className={styles.logo}>.WORKLOG</span>
            </Link>
            <nav className={styles.nav}>
                <Link to="/my-profile" className={styles.navItem}>
                    내 프로필
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="28" viewBox="0 0 30 28" fill="none">
                        <path
                            d="M15 0.666504L0 12.0951H3.75V27.3332H11.25V19.7141H18.75V27.3332H26.25V11.9808L30 12.0951L15 0.666504Z"
                            fill="#4053FF"
                        />
                    </svg>
                </Link>
                <Link to="/friends" className={styles.navItem}>
                    둘러보기
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="23" viewBox=" 0 25 23" fill="none">
                        <path
                            d="M0 0.388672V3.57694H25V0.388672H0ZM0 9.85783V13.0461H25V9.85783H0ZM0 19.4226V22.6109H25V19.4226H0Z"
                            fill="#4053FF"
                        />
                    </svg>
                </Link>
                <Link to="/about-us" className={styles.navItem}>
                    가이드북
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
                        <path
                            d="M30 21.5938V1.90625C30 1.12695 29.2835 0.5 28.3929 0.5H6.42857C2.87946 0.5 0 3.01953 0 6.125V24.875C0 27.9805 2.87946 30.5 6.42857 30.5H28.3929C29.2835 30.5 30 29.873 30 29.0938V28.1562C30 27.7168 29.7656 27.3184 29.404 27.0605C29.1228 26.1582 29.1228 23.5859 29.404 22.6836C29.7656 22.4316 30 22.0332 30 21.5938ZM8.57143 8.35156C8.57143 8.1582 8.75223 8 8.97321 8H23.1696C23.3906 8 23.5714 8.1582 23.5714 8.35156V9.52344C23.5714 9.7168 23.3906 9.875 23.1696 9.875H8.97321C8.75223 9.875 8.57143 9.7168 8.57143 9.52344V8.35156ZM8.57143 12.1016C8.57143 11.9082 8.75223 11.75 8.97321 11.75H23.1696C23.3906 11.75 23.5714 11.9082 23.5714 12.1016V13.2734C23.5714 13.4668 23.3906 13.625 23.1696 13.625H8.97321C8.75223 13.625 8.57143 13.4668 8.57143 13.2734V12.1016ZM25.5402 26.75H6.42857C5.2433 26.75 4.28571 25.9121 4.28571 24.875C4.28571 23.8438 5.25 23 6.42857 23H25.5402C25.4129 24.002 25.4129 25.748 25.5402 26.75Z"
                            fill="#4053FF"
                        />
                    </svg>
                </Link>
            </nav>
            <div className={styles.auth}>
                {isLoggedIn ? (
                    <>
                        {profileData ? (
                            <>
                                <span className={styles.name}>{profileData.name}님</span>
                                <button onClick={onLogoutClick} className={styles.logoutButton}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <span className={styles.name}>Loading...</span>
                        )}
                    </>
                ) : (
                    <Link to="/" className={styles.loginButton}>
                        내 계정 만들러 가기
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Header;
