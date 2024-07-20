import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './OnBoarding1.module.css';

const OnBoarding1 = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleDotClick = (page) => {
        navigate(`/on-boarding/${page}`);
    };

    const handleContainerClick = () => {
        navigate('/on-boarding/2');
    };

    const getDotClassName = (page) => {
        return location.pathname === `/on-boarding/${page}` ? styles.dotBlue : styles.dotGray;
    };

    return (
        <div className={styles.container}>
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
                    나의 키워드, 강점, 보완할 점까지 AI와 함께
                    <br />
                    링크만 전달해도 자동으로 쌓이는
                </span>
                <span className={styles.descriptionBold}> 나의 업무 성향 분석 레포트</span>
            </div>
            <div className={styles.mainImageContainer} onClick={handleContainerClick}>
                <div className={styles.mainImage} />
            </div>
        </div>
    );
};

export default OnBoarding1;
