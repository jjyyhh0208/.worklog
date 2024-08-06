import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileService from '../../utils/ProfileService';

const discTypeColors = {
    '목표 달성자': '#FF5473',
    디테일리스트: '#55B807',
    중재가: '#92604B',
    '컨트롤 타워': '#00B680',
    불도저: '#FF4B40',
    애널리스트: '#7D40FF',
    커뮤니케이터: '#FFC554',
    프로세서: '#1E74D9',
    None: '#a7a7a76f', // 'None'을 위한 회색 추가
};

function List() {
    const { username } = useParams();
    const [friends, setFriends] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        ProfileService.fetchUserProfile()
            .then((data) => {
                setProfileData(data);
                return ProfileService.fetchFriends(data.username);
            })
            .then(async (friendsData) => {
                const friendsWithImages = await Promise.all(
                    friendsData.map(async (friend) => {
                        if (friend.profile_image) {
                            try {
                                const imageUrl = await ProfileService.getSignedImageUrl(friend.profile_image.image);
                                return { ...friend, profileImage: imageUrl };
                            } catch (error) {
                                console.error('Error fetching signed URL:', error);
                                return friend;
                            }
                        } else {
                            return friend;
                        }
                    })
                );
                setFriends(friendsWithImages);
            })
            .catch((error) => {
                console.error('오류가 발생했습니다.', error);
            });
    }, []);

    const handleEvaluationClick = (username) => {
        navigate(`/friend-profile/${username}`);
    };

    const handleSearchClick = () => {
        navigate('/search');
    };

    return (
        <div className="w-full bg-[#ffffff] min-h-screen p-4 sm:p-8 md:p-12 lg:p-8  mt-16">
            <div className="flex justify-between items-center pt-7 w-full max-w-[1000px] mx-auto">
                <h1 className="text-[#4053ff] text-xl sm:text-2xl font-bold">내가 팔로우한 프로필</h1>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="52"
                    height="53"
                    viewBox="0 0 52 53"
                    fill="none"
                    onClick={handleSearchClick}
                    className="cursor-pointer"
                >
                    <path
                        d="M47.6017 5.54817C46.0417 3.7715 43.7233 2.6665 41.1667 2.6665C38.74 2.6665 36.53 3.66317 34.9483 5.28817C34.0383 6.21984 33.345 7.3465 32.9333 8.60317C32.6517 9.46984 32.5 10.3798 32.5 11.3332C32.5 12.9582 32.955 14.4965 33.7567 15.7965C34.19 16.5332 34.7533 17.2048 35.4033 17.7682C36.92 19.1548 38.935 19.9998 41.1667 19.9998C42.12 19.9998 43.03 19.8482 43.875 19.5448C45.8683 18.9165 47.5367 17.5515 48.5767 15.7965C49.0317 15.0598 49.3783 14.2148 49.5733 13.3482C49.7467 12.6982 49.8333 12.0265 49.8333 11.3332C49.8333 9.12317 48.9883 7.0865 47.6017 5.54817ZM44.395 12.9148H42.7917V14.6048C42.7917 15.4932 42.055 16.2298 41.1667 16.2298C40.2783 16.2298 39.5417 15.4932 39.5417 14.6048V12.9148H37.9383C37.05 12.9148 36.3133 12.1782 36.3133 11.2898C36.3133 10.4015 37.05 9.66484 37.9383 9.66484H39.5417V8.1265C39.5417 7.23817 40.2783 6.5015 41.1667 6.5015C42.055 6.5015 42.7917 7.23817 42.7917 8.1265V9.66484H44.395C45.2833 9.66484 46.02 10.4015 46.02 11.2898C46.02 12.1782 45.305 12.9148 44.395 12.9148Z"
                        fill="#4053FF"
                    />
                    <path
                        d="M47.6667 26.5002C47.6667 23.6618 47.125 20.9318 46.1067 18.4402C45.435 18.9168 44.6767 19.2852 43.875 19.5452C43.6367 19.6318 43.3984 19.6968 43.1384 19.7618C43.9617 21.8418 44.4167 24.1168 44.4167 26.5002C44.4167 31.5268 42.38 36.0985 39.0867 39.4352C38.4584 38.6335 37.6567 37.8968 36.7034 37.2685C30.8317 33.3252 21.2117 33.3252 15.2967 37.2685C14.3434 37.8968 13.5634 38.6335 12.9134 39.4352C9.62004 36.0985 7.58337 31.5268 7.58337 26.5002C7.58337 16.3385 15.8384 8.0835 26 8.0835C28.3617 8.0835 30.6367 8.5385 32.7167 9.36183C32.7817 9.10183 32.8467 8.8635 32.9334 8.6035C33.1934 7.80183 33.5617 7.06516 34.06 6.3935C31.5684 5.37516 28.8384 4.8335 26 4.8335C14.0617 4.8335 4.33337 14.5618 4.33337 26.5002C4.33337 32.7835 7.04171 38.4385 11.3317 42.4035C11.3317 42.4252 11.3317 42.4252 11.31 42.4468C11.5267 42.6635 11.7867 42.8368 12.0034 43.0318C12.1334 43.1402 12.2417 43.2485 12.3717 43.3352C12.7617 43.6602 13.195 43.9635 13.6067 44.2668C13.7584 44.3752 13.8884 44.4618 14.04 44.5702C14.4517 44.8518 14.885 45.1118 15.34 45.3502C15.4917 45.4368 15.665 45.5452 15.8167 45.6318C16.25 45.8702 16.705 46.0868 17.1817 46.2818C17.355 46.3685 17.5284 46.4552 17.7017 46.5202C18.1784 46.7152 18.655 46.8885 19.1317 47.0402C19.305 47.1052 19.4784 47.1702 19.6517 47.2135C20.1717 47.3652 20.6917 47.4952 21.2117 47.6252C21.3634 47.6685 21.515 47.7118 21.6884 47.7335C22.295 47.8635 22.9017 47.9502 23.53 48.0152C23.6167 48.0152 23.7034 48.0368 23.79 48.0585C24.5267 48.1235 25.2634 48.1668 26 48.1668C26.7367 48.1668 27.4734 48.1235 28.1884 48.0585C28.275 48.0585 28.3617 48.0368 28.4484 48.0152C29.0767 47.9502 29.6834 47.8635 30.29 47.7335C30.4417 47.7118 30.5934 47.6468 30.7667 47.6252C31.2867 47.4952 31.8284 47.3868 32.3267 47.2135C32.5 47.1485 32.6734 47.0835 32.8467 47.0402C33.3234 46.8668 33.8217 46.7152 34.2767 46.5202C34.45 46.4552 34.6234 46.3685 34.7967 46.2818C35.2517 46.0868 35.7067 45.8702 36.1617 45.6318C36.335 45.5452 36.4867 45.4368 36.6384 45.3502C37.0717 45.0902 37.505 44.8518 37.9384 44.5702C38.09 44.4835 38.22 44.3752 38.3717 44.2668C38.805 43.9635 39.2167 43.6602 39.6067 43.3352C39.7367 43.2268 39.845 43.1185 39.975 43.0318C40.2134 42.8368 40.4517 42.6418 40.6684 42.4468C40.6684 42.4252 40.6684 42.4252 40.6467 42.4035C44.9584 38.4385 47.6667 32.7835 47.6667 26.5002Z"
                        fill="#4053FF"
                    />
                    <path
                        d="M26 15.5151C21.515 15.5151 17.875 19.1551 17.875 23.6401C17.875 28.0385 21.32 31.6135 25.8917 31.7435C25.9567 31.7435 26.0433 31.7435 26.0867 31.7435C26.13 31.7435 26.195 31.7435 26.2383 31.7435C26.26 31.7435 26.2817 31.7435 26.2817 31.7435C30.6583 31.5918 34.1033 28.0385 34.125 23.6401C34.125 19.1551 30.485 15.5151 26 15.5151Z"
                        fill="#4053FF"
                    />
                </svg>
            </div>
            <div className="bg-[#ccd1ff33] bg-opacity-20 p-4 sm:p-7 mx-auto rounded-2xl w-full max-w-[1000px]">
                <div className="flex justify-center">
                    <div
                        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${
                            friends.length < 3 ? 'sm:grid-cols-1 lg:grid-cols-2' : ''
                        }`}
                    >
                        {friends.length > 0 ? (
                            friends.map((friend) => (
                                <div
                                    key={friend.id}
                                    className="bg-white rounded-2xl shadow-md p-4 text-center w-56 h-68 relative flex flex-col items-center duration-300   transform hover:scale-105"
                                >
                                    <div
                                        className="absolute top-0 left-0 w-full text-center p-2 text-white text-xs font-bold rounded-t-2xl h-8 flex items-center justify-center"
                                        style={{
                                            backgroundColor:
                                                friend.feedback_count >= 3
                                                    ? discTypeColors[friend.disc_character]
                                                    : discTypeColors.None,
                                        }}
                                    >
                                        {friend.disc_character !== 'None' ? friend.disc_character : '\u00A0'}
                                    </div>
                                    <div className="pt-5 flex flex-col items-center mt-4">
                                        <img
                                            src={friend.profileImage || '/images/basicProfile.png'}
                                            alt={`${friend.name}'s profile`}
                                            className="rounded-full h-28 w-28 mb-1 border border-grey-300"
                                        />
                                        <h2 className="text-lg font-bold mb-2">{friend.name}</h2>
                                        <button
                                            onClick={() => handleEvaluationClick(friend.username)}
                                            className="bg-yellow-400 text-white font-bold py-2 px-3 rounded hover:bg-yellow-500"
                                        >
                                            프로필 보러가기
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="150"
                                    height="150"
                                    viewBox="0 0 252 252"
                                    fill="none"
                                >
                                    <path
                                        d="M94.5 21C66.99 21 44.625 43.365 44.625 70.875C44.625 97.86 65.73 119.7 93.24 120.645C94.08 120.54 94.92 120.54 95.55 120.645C95.76 120.645 95.865 120.645 96.075 120.645C96.18 120.645 96.18 120.645 96.285 120.645C123.165 119.7 144.27 97.86 144.375 70.875C144.375 43.365 122.01 21 94.5 21Z"
                                        fill="#D2D2D2"
                                        fillOpacity="0.82"
                                    />
                                    <path
                                        d="M147.84 148.575C118.545 129.045 70.7701 129.045 41.2651 148.575C27.9301 157.5 20.5801 169.575 20.5801 182.49C20.5801 195.405 27.9301 207.375 41.1601 216.195C55.8601 226.065 75.1801 231 94.5001 231C113.82 231 133.14 226.065 147.84 216.195C161.07 207.27 168.42 195.3 168.42 182.28C168.315 169.365 161.07 157.395 147.84 148.575Z"
                                        fill="#D2D2D2"
                                        fillOpacity="0.82"
                                    />
                                    <path
                                        d="M209.895 77.0701C211.575 97.4401 197.085 115.29 177.03 117.705C176.925 117.705 176.925 117.705 176.82 117.705H176.505C175.875 117.705 175.245 117.705 174.72 117.915C164.535 118.44 155.19 115.185 148.155 109.2C158.97 99.5401 165.165 85.0501 163.905 69.3001C163.17 60.7951 160.23 53.0251 155.82 46.4101C159.81 44.4151 164.43 43.1551 169.155 42.7351C189.735 40.9501 208.11 56.2801 209.895 77.0701Z"
                                        fill="#D2D2D2"
                                        fillOpacity="0.82"
                                    />
                                    <path
                                        d="M230.895 174.195C230.055 184.38 223.545 193.2 212.625 199.185C202.125 204.96 188.895 207.69 175.77 207.375C183.33 200.55 187.74 192.045 188.58 183.015C189.63 169.995 183.435 157.5 171.045 147.525C164.01 141.96 155.82 137.55 146.895 134.295C170.1 127.575 199.29 132.09 217.245 146.58C226.905 154.35 231.84 164.115 230.895 174.195Z"
                                        fill="#D2D2D2"
                                        fillOpacity="0.82"
                                    />
                                </svg>
                                <p className="text-black font-inter text-lg font-medium">
                                    아직 팔로우한 동료가 없습니다.
                                </p>
                                <p className="text-black font-inter text-lg font-medium">새로운 동료를 추가해보세요!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default List;
