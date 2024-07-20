import React from 'react';
import styles from './Login.module.css';
import AdminService from '../../utils/AdminService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [loginInfo, setLoginInfo] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const loginChangeHandler = (e) => {
        setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            localStorage.removeItem('authToken');
        }
    }, []);

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            await AdminService.login({
                username: loginInfo.username,
                password: loginInfo.password,
            });
            navigate('/my-profile');
        } catch (error) {
            setError(error.message);
        }
    };

    const logoHandler = () => {
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1} onClick={logoHandler}>
                .WORKLOG
            </h1>
            <h2 className={styles.h2}>LOGIN</h2>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <form className={styles.login} onSubmit={loginHandler}>
                <span className={styles.span}>아이디</span>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="아이디를 입력하세요"
                    name="username"
                    value={loginInfo.username}
                    onChange={loginChangeHandler}
                />
                <span className={styles.span}>비밀번호</span>
                <input
                    className={styles.input}
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    name="password"
                    value={loginInfo.password}
                    onChange={loginChangeHandler}
                />
                <button className={styles.button} type="submit">
                    로그인
                </button>
            </form>
        </div>
    );
}

export default Login;
