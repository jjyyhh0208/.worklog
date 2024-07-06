import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Main.module.css';

function Main() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setIsLoggedIn(true);
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/signup/1');
    };

    const handleGuestClick = () => {
        navigate('/search');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>.WORKLOG</h1>
            <h3 className={styles.h3}>타인이 바라 보는 나의 업무 성향을 파악하고 협업 스킬셋을 관리해보세요!</h3>
            <div className={styles.buttons}>
                <button className={styles.button} onClick={handleLoginClick}>
                    로그인
                </button>
                <button className={styles.button} onClick={handleSignUpClick}>
                    회원가입
                </button>
                <button className={styles.button} onClick={handleGuestClick}>
                    비회원으로 평가하기
                </button>
            </div>
        </div>
    );
}

export default Main;
