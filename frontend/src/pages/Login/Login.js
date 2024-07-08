import React from 'react';
import styles from './Login.module.css';
import AdminService from '../../utils/AdminService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [loginInfo, setLoginInfo] = useState({ id: '', password: '' });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const loginChangeHandler = (e) => {
        setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            await AdminService.login({
                username: loginInfo.id,
                password: loginInfo.password,
            });
            navigate('/my-profile');
        } catch (error) {
            console.error(error);
            setError(error);
            alert(`${error.message}`);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>.WORKLOG</h1>
            <h2 className={styles.h2}>LOGIN</h2>
            <form className={styles.login} onSubmit={loginHandler}>
                <span className={styles.span}>아이디</span>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="아이디를 입력하세요"
                    name="id"
                    value={loginInfo.id}
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
                </button>{' '}
                {/* button이 form 내에 있어야 함 */}
            </form>
        </div>
    );
}

export default Login;
