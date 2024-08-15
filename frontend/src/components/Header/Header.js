import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminService from '../../utils/AdminService';
import ProfileService from '../../utils/ProfileService';

function Header({ isLoggedIn }) {
    const [profileData, setProfileData] = useState(null);
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
        setShowModal(true);
    };

    const confirmDeleteAccount = () => {
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
        return location.pathname === path ? 'text-[#4053ff]' : 'text-gray-500';
    };

    return (
        <header className="fixed top-0 left-0 right-0 w-full p-3.5 h-16 bg-white flex justify-between items-center shadow-md z-50">
            <div className="flex items-center">
                <Link to="/">
                    <h1 className="text-[#4053ff] text-2xl font-extrabold hover:cursor-pointer mr-6">.WORKLOG</h1>
                </Link>
                <nav className="flex">
                    {isLoggedIn ? (
                        <>
                            <Link
                                to="/my-profile"
                                className={`flex items-center ${isActive(
                                    '/my-profile'
                                )} text-gray-500 py-2 text-sm font-bold hover:bg-transparent hover:text-[#0453FF]`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 30 28"
                                    fill="none"
                                    className="ml-1 md:ml-2 w-5 h-5"
                                >
                                    <path
                                        d="M15 0.666504L0 12.0951H3.75V27.3332H11.25V19.7141H18.75V27.3332H26.25V11.9808L30 12.0951L15 0.666504Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <div className="ml-2 hidden sm:block">내 프로필</div>
                            </Link>
                            <Link
                                to={`/list/${profileData?.username}`}
                                className={`flex items-center ${isActive(
                                    `/list/${profileData?.username}`
                                )} text-gray-500 px-2 py-2 text-sm font-bold hover:bg-transparent hover:text-[#0453FF]`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 25 23"
                                    fill="none"
                                    className="ml-1 md:ml-2 w-5 h-5"
                                >
                                    <path
                                        d="M0 0.388672V3.57694H25V0.388672H0ZM0 9.85783V13.0461H25V9.85783H0ZM0 19.4226V22.6109H25V19.4226H0Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <div className="ml-2 hidden sm:block">둘러보기</div>
                            </Link>
                        </>
                    ) : (
                        <div></div>
                    )}
                    <Link
                        to="/about-us"
                        className={`flex items-center ${isActive(
                            '/about-us'
                        )} text-gray-500 px-1 py-2 text-sm font-bold hover:bg-transparent hover:text-[#0453FF]`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 30 31"
                            fill="none"
                            className="ml-1 md:ml-2 w-5 h-5"
                        >
                            <path
                                d="M30 21.5938V1.90625C30 1.12695 29.2835 0.5 28.3929 0.5H6.42857C2.87946 0.5 0 3.01953 0 6.125V24.875C0 27.9805 2.87946 30.5 6.42857 30.5H28.3929C29.2835 30.5 30 29.873 30 29.0938V28.1562C30 27.7168 29.7656 27.3184 29.404 27.0605C29.1228 26.1582 29.1228 23.5859 29.404 22.6836C29.7656 22.4316 30 22.0332 30 21.5938ZM8.57143 8.35156C8.57143 8.1582 8.75223 8 8.97321 8H23.1696C23.3906 8 23.5714 8.1582 23.5714 8.35156V9.52344C23.5714 9.7168 23.3906 9.875 23.1696 9.875H8.97321C8.75223 9.875 8.57143 9.7168 8.57143 9.52344V8.35156ZM8.57143 12.1016C8.57143 11.9082 8.75223 11.75 8.97321 11.75H23.1696C23.3906 11.75 23.5714 11.9082 23.5714 12.1016V13.2734C23.5714 13.4668 23.3906 13.625 23.1696 13.625H8.97321C8.75223 13.625 8.57143 13.4668 8.57143 13.2734V12.1016ZM25.5402 26.75H6.42857C5.2433 26.75 4.28571 25.9121 4.28571 24.875C4.28571 23.8438 5.25 23 6.42857 23H25.5402C25.4129 24.002 25.4129 25.748 25.5402 26.75Z"
                                fill="currentColor"
                            />
                        </svg>
                        <div className="ml-2 hidden sm:block">가이드북</div>
                    </Link>
                </nav>
            </div>
            <div className="relative flex items-center gap-2">
                {isLoggedIn ? (
                    <>
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center bg-[#4053ff] text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base font-medium hover:bg-[#3442cc] transition-colors duration-300 whitespace-nowrap"
                        >
                            <i className="fas fa-user m-1 fa-sm text-sm sm:text-md"></i>
                            <span className="text-sm sm:text-md ml-1">{profileData?.name}님</span>
                        </button>

                        <div
                            className={`absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg flex-col ${
                                showMenu ? 'flex' : 'hidden'
                            }`}
                            style={{ minWidth: '110px' }}
                        >
                            <button
                                onClick={onLogoutClick}
                                className="bg-white text-[#4053ff] text-700 px-4 py-2 text-center text-md font-medium hover:bg-gray-100 transition-colors duration-300 rounded-lg min-w-[100px] flex-grow whitespace-nowrap"
                            >
                                로그아웃
                            </button>
                            <button
                                onClick={onDeleteAccountClick}
                                className="bg-white text-[#4053ff] text-700 px-4 py-2 text-center text-md font-medium hover:bg-gray-100 transition-colors duration-300 rounded-lg min-w-[100px] flex-grow whitespace-nowrap"
                            >
                                회원탈퇴
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            to="/signup/1"
                            className="text-gray-500 py-2 text-sm font-bold hover:bg-transparent hover:text-[#0453FF] flex items-center"
                        >
                            <i className="fas fa-user mr-2 fa-lg"></i> {/* User plus icon for Sign Up */}
                            <span className="hidden sm:block">회원가입</span>
                        </Link>
                        <Link
                            to="/login"
                            className="text-gray-500 px-2 py-2 text-sm font-bold hover:bg-transparent hover:text-[#0453FF] flex items-center"
                        >
                            <i className="fas fa-sign-in-alt mr-2 fa-lg"></i> {/* Sign-in icon for Log In */}
                            <span className="hidden sm:block">로그인</span>
                        </Link>
                    </>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-center">회원탈퇴</h2>
                        <img className="mx-auto" src="images/discImg3.jpeg" width={100} height={100}></img>
                        <p className="text-center">.WORKLOG에서 탈퇴하시겠습니까?</p>
                        <p className="mb-4 text-center">탈퇴시 피드백 복구가 불가합니다.</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 transition-transform duration-200 hover:bg-gray-400"
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                className="bg-red-500 text-white px-4 py-2 rounded transition-transform duration-200 hover:bg-red-600"
                            >
                                탈퇴하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
