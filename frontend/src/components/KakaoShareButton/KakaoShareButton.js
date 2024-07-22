import React from 'react';

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
            className="flex justify-center items-center rounded-lg bg-white w-20 h-20 cursor-pointer"
            onClick={(e) => {
                e.preventDefault();
                shareToKakao();
            }}
        >
            <img src="/images/kakao.png" alt="Kakao" className="max-w-full max-h-full" />
        </a>
    );
};

export default KakaoShareButton;
