// KakaoShareButton.js
import React from 'react';
import styles from './KakaoShareButton.module.css'; // 스타일 모듈 가져오기

const KakaoShareButton = () => {
    const shareToKakao = () => {
        window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '.WORKLOG: 일하는 모두를 위한 서비스',
                description: '다른 사람은 나를 어떻게 보고 있을까요? 지금 업무성향을 체크하러 가봐요!',
                imageUrl: 'https://dot-worklog.com/images/logo.png',
                link: {
                    mobileWebUrl: 'https://dot-worklog',
                    webUrl: 'https://dot-worklog',
                },
            },
            buttons: [
                {
                    title: '웹으로 보기',
                    link: {
                        mobileWebUrl: 'https://dot-worklog',
                        webUrl: 'https://dot-worklog',
                    },
                },
            ],
        });
    };

    return (
        <a
            href="#"
            className={styles.kakaoShareButton}
            onClick={(e) => {
                e.preventDefault();
                shareToKakao();
            }}
        >
            <img src="/images/kakao.png" alt="Kakao" width="40" height="40" className={styles.kakaoShareImg} />
        </a>
    );
};

export default KakaoShareButton;
