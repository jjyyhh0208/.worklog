import React, { useState, useEffect, Component } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Pages
import Main from './pages/Main/Main';
import Signup1 from './pages/Auth/Signup1';
import Signup2 from './pages/Auth/Signup2';
import Signup3 from './pages/Auth/Signup3';
import Signup4 from './pages/Auth/Signup4';
import Login from './pages/Auth/Login';

import Feedback from './pages/Feedback/Feedback';
import FeedbackLong from './pages/Feedback/FeedbackLong';
import FeedbackIntro from './pages/Feedback/FeedbackIntro';

import MyProfile from './pages/Profile/MyProfile';
import FriendProfile from './pages/Profile/FriendProfile';

import OnBoarding1 from './pages/OnBoarding/OnBoarding1';
import OnBoarding2 from './pages/OnBoarding/OnBoarding2';
import OnBoarding3 from './pages/OnBoarding/OnBoarding3';

import Search from './pages/Search/Search';
import AboutUs from './pages/AboutUs/AboutUs';
import List from './pages/List/List';

// Component
import Error from './components/Error/Error';
import LoginRedirect from './components/Kakao/LoginRedirect';
import Header from './components/Header/Header';

// Redirect Pages
import AuthRedirect from './components/Auth/AuthRedirect';
import ProtectedRoute from './components/Auth/ProtectedRoute';

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

    const isLoggedIn = () => {
        return !!localStorage.getItem('authToken');
    };

    const renderHeader = () => {
        // Header 포함 페이지 정의
        const pathsWithHeader = [
            '/',
            '/my-profile',
            '/friend-profile',
            '/about-us',
            '/search',
            '/list/:username',
            '/feedback/long/:username',
            '/feedback/intro/:username',
            '/feedback/:pageNum/:username',
            '/friend-profile/:id',
        ];

        if (location.pathname === '/') {
            return true;
        }

        return pathsWithHeader.some((path) => {
            const regexPath = new RegExp('^' + path.replace(/:[^\s/]+/g, '([^/]+)') + '$');
            return regexPath.test(location.pathname);
        });
    };

    return (
        <>
            {renderHeader() && <Header isLoggedIn={isLoggedIn()} />}
            <Routes>
                {/* 공개 라우트 */}
                <Route path="/" element={<Main />} />
                <Route path="/login/redirect" element={<LoginRedirect />} />
                <Route path="/signup/1" element={<Signup1 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
                <Route path="/signup/2" element={<Signup2 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
                <Route path="/signup/3" element={<Signup3 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
                <Route path="/signup/4" element={<Signup4 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/feedback/intro/:username" element={<FeedbackIntro />} />
                <Route path="/feedback/:pageNum/:username" element={<Feedback />} />
                <Route path="/feedback/long/:username" element={<FeedbackLong isLoggedIn={isLoggedIn} />} />
                <Route path="/on-boarding/1" element={<OnBoarding1 />} />
                <Route path="/on-boarding/2" element={<OnBoarding2 />} />
                <Route path="/on-boarding/3" element={<OnBoarding3 />} />
                <Route path="/friend-profile/:username" element={<FriendProfile />} />

                {/* 보호된 라우트 */}
                <Route path="/my-profile" element={<ProtectedRoute element={MyProfile} />} />
                <Route path="/search" element={<ProtectedRoute element={Search} />} />
                <Route path="/list/:username" element={<ProtectedRoute element={List} />} />

                {/* Error 페이지 - 모든 라우트의 맨 마지막에 위치 */}
                <Route path="*" element={<Error />} />
            </Routes>
        </>
    );
}

export default App;
