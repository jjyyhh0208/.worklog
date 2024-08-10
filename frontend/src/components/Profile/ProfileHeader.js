import React from 'react';
import KakaoShareButton from '../../components/Kakao/KakaoShareButton';

const ProfileHeader = ({
    profileData,
    DISCCharacter,
    discTypeColors,
    handleCopyLink,
    handleInstagramShare,
    handleProfileEdit,
    imageUrl,
    isMyProfile,
    isFollowing,
    handleFollowClick,
    handleFeedbackClick,
    bio,
    isEditingBio,
    onBioChange,
    onBioEditToggle,
    onBioBackToggle,
}) => {
    return (
        <div className="bg-white rounded-[50px] shadow-md p-4 sm:p-6 md:p-8 mb-8 w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <img
                    src={imageUrl || '/images/basicProfile.png'}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-gray-200"
                />
                <div className="text-center md:text-left w-[50%] flex-grow">
                    <h1 className="text-2xl sm:text-3xl font-bold w-20">{profileData?.name}</h1>
                    <p className="text-lg sm:text-xl text-gray-600 mt-1">@{profileData?.username}</p>
                    {isEditingBio ? (
                        <div className="mt-2 md:flex-row">
                            <input
                                type="text"
                                value={bio}
                                onChange={onBioChange}
                                className="w-[70%] p-2 text-s border rounded mr-2"
                                placeholder="한 줄 소개를 입력하세요"
                            />
                            <button
                                onClick={onBioEditToggle}
                                className="bg-blue-500 text-white text-xs px-4 py-2 rounded mr-2 "
                            >
                                저장
                            </button>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <p className="text-gray-700 ">{bio || '한 줄 소개를 입력하세요!'}</p>
                            {isMyProfile && (
                                <button onClick={onBioEditToggle} className="text-blue-500 mt-1">
                                    {bio ? '수정' : '추가'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-4 md:mt-0 self-center md:self-start flex justify-end w-full">
                    {profileData && (
                        <div
                            className="w-[200px] h-[50px] rounded-[10px] flex items-center justify-center text-white text-2xl font-semibold"
                            style={{
                                backgroundColor: discTypeColors[DISCCharacter] || discTypeColors.None,
                            }}
                        >
                            {DISCCharacter || (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 mx-auto m-5 opacity-50"
                                    viewBox="0 0 164 187"
                                    fill="none"
                                >
                                    <path
                                        d="M145.592 81.5315H136.856V55.3249C136.856 24.8234 112.033 0 81.5315 0C51.03 0 26.2066 24.8234 26.2066 55.3249V81.5315H17.471C7.82557 81.5315 0 89.3571 0 99.0025V168.887C0 178.532 7.82557 186.358 17.471 186.358H145.592C155.237 186.358 163.063 178.532 163.063 168.887V99.0025C163.063 89.3571 155.237 81.5315 145.592 81.5315ZM107.738 81.5315H55.3249V55.3249C55.3249 40.8749 67.0815 29.1184 81.5315 29.1184C95.9815 29.1184 107.738 40.8749 107.738 55.3249V81.5315Z"
                                        fill="black"
                                        fillOpacity="0.25"
                                    />
                                </svg>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 md:mt-4">
                {isMyProfile ? (
                    <>
                        <div className="flex gap-3 mb-4 sm:mb-0">
                            <button
                                onClick={handleCopyLink}
                                className="w-10 h-10 bg-white shadow-md rounded-full hover:bg-gray-200 transition duration-300 flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                            </button>
                            <div className="w-10 h-10 bg-white shadow-md rounded-full hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                                <KakaoShareButton username={profileData?.username} />
                            </div>
                            <button
                                onClick={handleInstagramShare}
                                className="w-10 h-10 bg-white shadow-md rounded-full hover:bg-gray-200 transition duration-300 flex items-center justify-center"
                            >
                                <img src="/images/instagram.png" alt="Instagram" className="w-6 h-6" />
                            </button>
                        </div>
                        <button
                            onClick={handleProfileEdit}
                            className="w-40 h-[50px] bg-[#9b8f8f] text-white text-xl font-bold rounded-[10px]"
                        >
                            프로필 수정
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`mr-5 px-6 py-2 h-12 w-44 text-xl font-bold rounded-[20px] ${
                                isFollowing ? 'bg-gray-500' : 'bg-[#4053ff]'
                            } text-white`}
                            onClick={handleFollowClick}
                        >
                            {isFollowing ? '친구 등록취소' : '친구 등록하기'}
                        </button>
                        <button
                            className="mr-5 px-6 py-2 h-12 w-44 bg-[#f8bd23] text-white text-lg font-bold rounded-[20px] hover:bg-opacity-90 transition duration-300"
                            onClick={handleFeedbackClick}
                        >
                            협업 평가 작성
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;
