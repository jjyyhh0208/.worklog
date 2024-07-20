import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Error.module.css';

function Error() {
    return (
        <div className={styles.errorContainer}>
            <h1 className={styles.errorCode}>404</h1>
            <h2 className={styles.errorMessage}>페이지를 찾을 수 없습니다</h2>
            <p className={styles.errorDescription}>
                죄송합니다. 요청하신 페이지를 찾을 수 없습니다. 주소를 잘못 입력하셨거나 페이지가 삭제되었을 수
                있습니다.
            </p>
            <Link to="/" className={styles.homeButton}>
                홈으로 돌아가기
            </Link>
        </div>
    );
}

export default Error;
