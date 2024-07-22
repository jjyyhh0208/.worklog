import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles/global.css';

// Pages
import Main from './pages/Main/Main';
import Signup1 from './pages/Signup1/Signup1';
import Signup2 from './pages/Signup2/Signup2';
import Signup3 from './pages/Signup3/Signup3';
import Signup4 from './pages/Signup4/Signup4';
import FeedbackLong from './pages/FeedbackLong/FeedbackLong';
import FeedbackIntro from './pages/FeedbackIntro/FeedbackIntro';
import Login from './pages/Login/Login';
import Search from './pages/Search/Search';
import MyProfile from './pages/MyProfile/MyProfile';
import OnBoarding1 from './pages/OnBoarding1/OnBoarding1';
import OnBoarding2 from './pages/OnBoarding2/OnBoarding2';
import OnBoarding3 from './pages/OnBoarding3/OnBoarding3';
import AboutUs from './pages/AboutUs/AboutUs';
import Header from './components/Header/Header';
import Feedback from './pages/Feedback/Feedback';
import List from './pages/List/List';
import FriendProfile from './pages/FriendProfile/FriendProfile';
import Error from './components/Error/Error';

// Redirect Pages
import AuthRedirect from './components/AuthRedirect';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileService from './utils/ProfileService';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function App() {
    const location = useLocation();
    const [signUpInfo, setSignUpInfo] = useState({
        username: '',
        password1: '',
        password2: '',
        name: '',
        gender: '',
        age: '',
        profile_image: '',
        work_style: {
            keyword1: '',
            keyword2: '',
            keyword3: '',
        },
        interest: {
            keyword1: '',
            keyword2: '',
            keyword3: '',
        },
    });
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.REACT_APP_KAKAO_APP_KEY);
        }

        if (isLoggedIn()) {
            ProfileService.fetchUserProfile()
                .then((data) => setProfileData(data))
                .catch((error) => console.error('프로필 정보를 불러오는 동안 오류가 발생했습니다.', error));
        }
    }, []);

    const isLoggedIn = () => {
        return !!localStorage.getItem('authToken');
    };

    const renderHeader = () => {
        //Header 넣는 페이지
        const pathsWithHeader = [
            '/my-profile',
            '/friend-profile',
            '/about-us',
            '/search',
            '/list',
            '/feedback/long',
            '/feedback/intro',
            `/feedback/${location.pathname.split('/')[2]}`,
        ];
        return pathsWithHeader.some((path) => location.pathname.includes(path));
    };

    return (
        <>
            {renderHeader() && <Header isLoggedIn={isLoggedIn()} />}
            <Routes>
                {/* 공개 라우트 */}
                <Route path="/" element={<Main />} />
                <Route path="/signup/1" element={<Signup1 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
                <Route path="/signup/2" element={<Signup2 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
                <Route path="/signup/3" element={<Signup3 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
                <Route path="/signup/4" element={<Signup4 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/search" element={<Search />} />
                <Route path="/feedback/intro/:username" element={<FeedbackIntro />} />
                <Route path="/feedback/:pageNum/:username" element={<Feedback />} />
                <Route path="/feedback/long/:username" element={<FeedbackLong isLoggedIn={isLoggedIn} />} />
                <Route path="/on-boarding/1" element={<OnBoarding1 />} />
                <Route path="/on-boarding/2" element={<OnBoarding2 />} />
                <Route path="/on-boarding/3" element={<OnBoarding3 />} />
                <Route path="/friend-profile/:username" element={<FriendProfile />} />
                <Route path="/list/:username" element={<List />} />

                {/* 보호된 라우트 */}
                <Route path="/my-profile" element={<ProtectedRoute element={MyProfile} />} />

                {/* Error 페이지 - 모든 라우트의 맨 마지막에 위치 */}
                <Route path="*" element={<Error />} />
            </Routes>
        </>
    );
}

export default App;
