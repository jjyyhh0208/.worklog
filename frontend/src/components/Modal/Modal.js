import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ children }) => {
    return ReactDOM.createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>{children}</div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;
