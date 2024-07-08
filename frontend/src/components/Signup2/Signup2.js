import React, { useState } from 'react';
import styles from './Signup2.module.css';
import AdminService from '../../utils/AdminService';
import { useNavigate } from 'react-router-dom';

function Signup2({ signUpInfo, setSignUpInfo }) {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [selectedGender, setSelectedGender] = useState(signUpInfo.gender);

    const signUpChangeHandler = (e) => {
        setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
    };

    const handleSignUpClick = () => {
        navigate('/signup/3');
    };

    const handleGenderClick = (gender) => {
        setSignUpInfo({ ...signUpInfo, gender });
        setSelectedGender(gender);
    };

    const signUpHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await AdminService.signUp('POST', signUpInfo);
            if (res.message === 'User created') {
                alert('가입 성공! 다음 단계로 이동합니다.');
                handleSignUpClick(); // 성공 시 페이지 이동
            } else {
                setError('가입 실패 : ' + (res.message || '알 수 없는 오류'));
                alert(error);
            }
        } catch (err) {
            setError('서버 연결 실패');
            alert(error);
        }
    };
    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>.WORKLOG</h1>
            <h2 className={styles.h2}>기본프로필 등록</h2>
            <form className={styles.signUp} onSubmit={signUpHandler}>
                <div className={styles.idbox}></div>
                <span className={styles.span}>이름</span>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="사용할 닉네임을 입력해주세요."
                    name="name"
                    value={signUpInfo.name}
                    onChange={signUpChangeHandler}
                />
                <span className={styles.span}>나이</span>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="만 나이 기준으로 입력해주세요"
                    name="age"
                    value={signUpInfo.age}
                    onChange={signUpChangeHandler}
                />
                <span className={styles.span}>성별</span>
                <div className={styles.genderButtons}>
                    <button
                        type="button"
                        className={`${styles.genderButton} ${selectedGender === '남자' ? styles.selected : ''}`}
                        onClick={() => handleGenderClick('남자')}
                    >
                        Male
                    </button>
                    <button
                        type="button"
                        className={`${styles.genderButton} ${selectedGender === '여자' ? styles.selected : ''}`}
                        onClick={() => handleGenderClick('여자')}
                    >
                        Female
                    </button>
                    <button
                        type="button"
                        className={`${styles.genderButton} ${selectedGender === 'none' ? styles.selected : ''}`}
                        onClick={() => handleGenderClick('none')}
                    >
                        None
                    </button>
                </div>
                <div className={styles.nextbox}>
                    <button className={styles.signupbtn} type="submit">
                        NEXT
                    </button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <path
                            d="M25.0314 27.7727L7.97165 48.5912C6.79252 50.0301 4.88585 50.0301 3.71927 48.5912L0.884345 45.1317C-0.294782 43.6927 -0.294782 41.366 0.884345 39.9424L12.9767 25.1857L0.884345 10.4291C-0.294782 8.99015 -0.294782 6.66338 0.884345 5.23976L3.70672 1.7496C4.88585 0.310679 6.79252 0.310679 7.95911 1.7496L25.0188 22.5681C26.2105 24.007 26.2105 26.3338 25.0314 27.7727ZM49.1157 22.5681L32.0559 1.7496C30.8768 0.310679 28.9701 0.310679 27.8036 1.7496L24.9686 5.20915C23.7895 6.64807 23.7895 8.97485 24.9686 10.3985L37.061 25.1551L24.9686 39.9117C23.7895 41.3507 23.7895 43.6774 24.9686 45.1011L27.8036 48.5606C28.9827 49.9995 30.8894 49.9995 32.0559 48.5606L49.1157 27.7421C50.2948 26.3338 50.2948 24.007 49.1157 22.5681Z"
                            fill="#4053FF"
                        />
                    </svg>
                </div>
            </form>
        </div>
    );
}

export default Signup2;
