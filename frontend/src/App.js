import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main/Main';
import Signup1 from './components/Signup1/Signup1';
import Signup2 from './components/Signup2/Signup2';
import Signup3 from './components/Signup3/Signup3';
import Signup4 from './components/Signup4/Signup4';
import Login from './pages/Login/Login';
import Search from './pages/Search/Search';
import MyProfile from './pages/MyProfile/MyProfile';
import OnBoarding1 from './pages/OnBoarding1/OnBoarding1';
import OnBoarding2 from './pages/OnBoarding2/OnBoarding2';
import OnBoarding3 from './pages/OnBoarding3/OnBoarding3';
import AboutUs from './pages/AboutUs/AboutUs';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
    const [signUpInfo, setSignUpInfo] = useState({
        username: '',
        password: '',
        repassword: '',
        name: '',
        gender: '',
        age: '',
    });

    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signup/1" element={<Signup1 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
            <Route path="/signup/2" element={<Signup2 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
            <Route path="/signup/3" element={<Signup3 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
            <Route path="/signup/4" element={<Signup4 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/my-profile" element={<ProtectedRoute element={MyProfile} />} />{' '}
            <Route path="/on-boarding/1" element={<OnBoarding1 />} />
            <Route path="/on-boarding/2" element={<OnBoarding2 />} />
            <Route path="/on-boarding/3" element={<OnBoarding3 />} />
            <Route path="/about-us" element={<AboutUs />} />
        </Routes>
    );
}

export default App;
