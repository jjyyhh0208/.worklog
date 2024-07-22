// Modal.js
import React, { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ show, handleClose, children }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(handleClose, 1500);
            return () => clearTimeout(timer);
        }
    }, [show, handleClose]);

    return (
        show && (
            <div className={styles.modalBackdrop}>
                <div className={styles.modalContent}>{children}</div>
            </div>
        )
    );
};

export default Modal;
