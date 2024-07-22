import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import AdminService from '../../utils/AdminService';
import ProfileService from '../../utils/ProfileService';

function Header({ isLoggedIn }) {
    const [profileData, setProfileData] = useState(null);
    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);
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

    const onDeleteAccountClick = () => {
        console.log('회원탈퇴');
        //회원탈퇴 API 호출
        AdminService.userDelete()
            .then(() => {
                window.location.href = '/';
                localStorage.removeItem('authToken');
            })
            .catch((error) => {
                console.error('회원 탈퇴 중 오류가 발생했습니다.', error);
            });
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const isActive = (path) => {
        return location.pathname === path ? styles.active : '';
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-white h-auto md:h-24 w-full p-5 md:p-4 box-border">
            <Link to={profileData ? '/my-profile' : '/'}>
                <span className="text-[#4053ff] text-4xl md:text-3xl lg:text-4xl font-extrabold ml-2 md:ml-7">
                    .WORKLOG
                </span>
            </Link>
            <nav className="flex flex-col md:flex-row w-full md:w-1/2 justify-between mt-4 md:mt-0">
                <Link
                    to="/my-profile"
                    className={`flex items-center text-gray-500 text-lg md:text-2xl font-semibold text-center px-2 ${isActive(
                        '/my-profile'
                    )}`}
                >
                    내 프로필
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="28"
                        viewBox="0 0 30 28"
                        fill="none"
                        className="ml-2"
                    >
                        <path
                            d="M15 0.666504L0 12.0951H3.75V27.3332H11.25V19.7141H18.75V27.3332H26.25V11.9808L30 12.0951L15 0.666504Z"
                            fill="#4053FF"
                        />
                    </svg>
                </Link>
                <Link
                    to={`/list/${profileData?.username}`}
                    className={`flex items-center text-gray-500 text-lg md:text-2xl font-semibold text-center px-2 ${isActive(
                        `/list/${profileData?.username}`
                    )}`}
                >
                    둘러보기
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="27"
                        height="23"
                        viewBox=" 0 0 25 23"
                        fill="none"
                        className="ml-2"
                    >
                        <path
                            d="M0 0.388672V3.57694H25V0.388672H0ZM0 9.85783V13.0461H25V9.85783H0ZM0 19.4226V22.6109H25V19.4226H0Z"
                            fill="#4053FF"
                        />
                    </svg>
                </Link>
                <Link
                    to="/about-us"
                    className={`flex items-center text-gray-500 text-lg md:text-2xl font-semibold text-center px-2 ${isActive(
                        '/about-us'
                    )}`}
                >
                    가이드북
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="31"
                        viewBox="0 0 30 31"
                        fill="none"
                        className="ml-2"
                    >
                        <path
                            d="M30 21.5938V1.90625C30 1.12695 29.2835 0.5 28.3929 0.5H6.42857C2.87946 0.5 0 3.01953 0 6.125V24.875C0 27.9805 2.87946 30.5 6.42857 30.5H28.3929C29.2835 30.5 30 29.873 30 29.0938V28.1562C30 27.7168 29.7656 27.3184 29.404 27.0605C29.1228 26.1582 29.1228 23.5859 29.404 22.6836C29.7656 22.4316 30 22.0332 30 21.5938ZM8.57143 8.35156C8.57143 8.1582 8.75223 8 8.97321 8H23.1696C23.3906 8 23.5714 8.1582 23.5714 8.35156V9.52344C23.5714 9.7168 23.3906 9.875 23.1696 9.875H8.97321C8.75223 9.875 8.57143 9.7168 8.57143 9.52344V8.35156ZM8.57143 12.1016C8.57143 11.9082 8.75223 11.75 8.97321 11.75H23.1696C23.3906 11.75 23.5714 11.9082 23.5714 12.1016V13.2734C23.5714 13.4668 23.3906 13.625 23.1696 13.625H8.97321C8.75223 13.625 8.57143 13.4668 8.57143 13.2734V12.1016ZM25.5402 26.75H6.42857C5.2433 26.75 4.28571 25.9121 4.28571 24.875C4.28571 23.8438 5.25 23 6.42857 23H25.5402C25.4129 24.002 25.4129 25.748 25.5402 26.75Z"
                            fill="#4053FF"
                        />
                    </svg>
                </Link>
            </nav>
            <div className="relative flex items-center gap-2 mt-4 md:mt-0">
                {isLoggedIn ? (
                    <>
                        {profileData && <span className="font-bold">{profileData.name}님</span>}
                        <button
                            onClick={toggleMenu}
                            className="bg-[#4053ff] text-white px-5 py-2 rounded-full font-bold"
                        >
                            Menu
                        </button>
                        <div
                            className={`absolute top-full right-0 bg-white border border-gray-300 rounded-lg flex-col ${
                                showMenu ? 'flex' : 'hidden'
                            }`}
                        >
                            <button
                                onClick={onLogoutClick}
                                className="bg-white text-[#4053ff] border-none px-5 py-2 text-left font-bold hover:bg-gray-100 transition-colors duration-300"
                            >
                                로그아웃
                            </button>
                            <button
                                onClick={onDeleteAccountClick}
                                className="bg-white text-[#4053ff] border-none px-5 py-2 text-left font-bold hover:bg-gray-100 transition-colors duration-300"
                            >
                                회원탈퇴
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/signup/1" className="bg-white text-black font-bold px-5 py-2 rounded-full">
                        내 계정 만들러 가기
                    </Link>
                )}
            </div>
        </div>
    );



}

export default Header;
