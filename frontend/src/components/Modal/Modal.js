import React, { useEffect } from 'react';

const Modal = ({ show, handleClose, children }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(handleClose, 1500);
            return () => clearTimeout(timer);
        }
    }, [show, handleClose]);

    return (
        show && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-[#4053ff] text-white p-8 md:p-12 rounded-lg text-center font-semibold text-lg md:text-xl">
                    {children}
                </div>
            </div>
        )
    );
};

export default Modal;
