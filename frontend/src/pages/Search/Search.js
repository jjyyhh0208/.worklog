import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Search.module.css';
import ProfileService from '../../utils/ProfileService';

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setNotFound(false);
    };

    const handleSearch = async () => {
        try {
            const results = await ProfileService.fetchSearchResults(searchTerm);
            if (results.length > 0) {
                setSearchResult(results[0]);
                setNotFound(false);
            } else {
                setSearchResult(null);
                setNotFound(true);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResult(null);
            setNotFound(true);
        }
    };

    const handleProfileClick = () => {
        navigate(`/friend-profile/${searchResult.id}`);
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="알고 싶은 동료의 ID를 입력하세요"
                />
                <button onClick={handleSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50" fill="none">
                        <path
                            d="M21.6787 0.0619393C9.72446 0.0619393 0 9.7864 0 21.7407C0 33.695 9.72446 43.4194 21.6787 43.4194C25.3332 43.4194 28.9256 42.5523 31.9607 40.8799C32.2038 41.1725 32.4733 41.442 32.7659 41.6851L38.9598 47.879C39.5317 48.5226 40.2291 49.0425 41.0093 49.4067C41.7894 49.771 42.6357 49.9719 43.4963 49.9973C44.3569 50.0226 45.2136 49.8718 46.0138 49.554C46.814 49.2363 47.5408 48.7584 48.1496 48.1496C48.7584 47.5408 49.2363 46.814 49.554 46.0138C49.8718 45.2136 50.0226 44.3569 49.9973 43.4963C49.9719 42.6357 49.771 41.7894 49.4067 41.0093C49.0425 40.2292 48.5226 39.5317 47.879 38.9598L41.6851 32.7659C41.3834 32.464 41.0513 32.1942 40.6941 31.9607C42.3664 28.9256 43.4194 25.3951 43.4194 21.6787C43.4194 9.72446 33.695 0 21.7407 0L21.6787 0.0619393ZM21.6787 6.25586C30.2883 6.25586 37.1635 13.1311 37.1635 21.7407C37.1635 25.8287 35.677 29.607 33.0756 32.3942C33.0136 32.4562 32.9517 32.5181 32.8897 32.58C32.5972 32.8232 32.3276 33.0927 32.0845 33.3853C29.3592 35.8628 25.6428 37.2874 21.6168 37.2874C13.0072 37.2874 6.13199 30.4122 6.13199 21.8026C6.13199 13.1931 13.0072 6.3178 21.6168 6.3178L21.6787 6.25586Z"
                            fill="black"
                        />
                    </svg>
                </button>
            </div>
            {searchResult && (
                <div className={styles.profileCard} onClick={handleProfileClick}>
                    <img
                        src={searchResult.profileImage || '/images/basicProfile.png'}
                        alt="Profile"
                        className={styles.profileImage}
                    />
                    <h2 className={styles.name}>{searchResult.name}</h2>
                    <p className={styles.username}>ID: {searchResult.username}</p>
                    <button className={styles.viewProfileButton}>프로필 보러 가기</button>
                </div>
            )}
            {notFound && (
                <div className={styles.notFoundMessage}>
                    <h3>‘{searchTerm}’를 찾을 수 없습니다.</h3>
                    <p>입력하신 아이디로 등록한 회원이 없습니다.</p>
                    <p>링크를 통해 친구 프로필을 찾거나, 다시 한 번 아이디를 확인해 주세요.</p>
                </div>
            )}
        </div>
    );
}

export default Search;
