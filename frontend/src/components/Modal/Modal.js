import React, { useEffect, useState } from 'react';

const Modal = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 700);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-300 text-black p-8 md:p-12 flex flex-col items-center rounded-lg text-center font-semibold text-lg md:text-xl shadow-lg">
                <div className="mb-4 text-xl text-[#4053FF] w-48">
                    <span className="inline-block text-nowrap">피드백을 제출하는 중{dots}</span>
                </div>
                <img src="/images/loading.gif" alt="Loading" className="w-24 h-24 md:w-32 md:h-32 mb-4" />
            </div>
        </div>
    );
};

export default Modal;
