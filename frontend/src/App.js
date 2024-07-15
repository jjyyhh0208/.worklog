import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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

// Redirect Pages
import AuthRedirect from './components/AuthRedirect';
import ProtectedRoute from './components/ProtectedRoute';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function App() {
    const location = useLocation();
    const [signUpInfo, setSignUpInfo] = useState({
        // ... (기존 상태 유지)
    });

    const renderHeader = () => {
        const pathsWithHeader = [
            '/my-profile',
            '/my-profile11',
            '/about-us',
            '/search',
            '/friends',
            '/feedback/long',
            '/feedback/intro',
            `/feedback/${location.pathname.split('/')[2]}`,
        ];
        return pathsWithHeader.includes(location.pathname);
    };

    const isLoggedIn = () => {
        return !!localStorage.getItem('authToken');
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
                <Route path="/feedback/intro" element={<FeedbackIntro />} />
                <Route path="/feedback/:pageNum" element={<Feedback />} />
                <Route path="/feedback/long" element={<FeedbackLong />} />
                <Route path="/on-boarding/1" element={<OnBoarding1 />} />
                <Route path="/on-boarding/2" element={<OnBoarding2 />} />
                <Route path="/on-boarding/3" element={<OnBoarding3 />} />

                {/* 보호된 라우트 */}
                <Route path="/my-profile" element={<MyProfile />} />
                {/* <Route path="/my-profile" element={<ProtectedRoute element={MyProfile} />} /> */}
            </Routes>
        </>
    );
}

export default App;
