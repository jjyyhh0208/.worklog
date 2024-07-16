import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './OnBoarding2.module.css';

const OnBoarding2 = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleDotClick = (page) => {
        navigate(`/on-boarding/${page}`);
    };

    const handleContainerClick = () => {
        navigate('/on-boarding/3');
    };

    const getDotClassName = (page) => {
        return location.pathname === `/on-boarding/${page}` ? styles.dotBlue : styles.dotGray;
    };

    return (
        <div className={styles.container} onClick={handleContainerClick}>
            <h1 className={styles.h1}>.WORKLOG</h1>
            <div className={styles.dotBox}>
                <div
                    className={getDotClassName(1)}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(1);
                    }}
                ></div>
                <div
                    className={getDotClassName(2)}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(2);
                    }}
                ></div>
                <div
                    className={getDotClassName(3)}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(3);
                    }}
                ></div>
            </div>
            <div className={styles.descriptionContainer}>
                <span className={styles.description}>
                    내가 생각하는 팀원의 업무 스타일은?
                    <br />
                </span>
                <span className={styles.descriptionBold}>직관적이고 답하기 쉬운 설문지 구성</span>
            </div>
            <div className={styles.mainImageContainer}>
                <div className={styles.mainImage} />
            </div>
        </div>
    );
};

export default OnBoarding2;
