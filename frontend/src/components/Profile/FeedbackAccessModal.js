import React, { useState } from 'react';

function FeedbackAccessModal({ isOpen, onClose, onAccessGranted, correctCode }) {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (accessCode === correctCode) {
            localStorage.setItem('correctCode', correctCode);
            onAccessGranted();
        } else {
            setError('올바르지 않은 코드입니다. 다시 시도해주세요.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-12 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">피드백 접근 코드를 입력해주세요.</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="border p-2 w-full mb-4"
                        placeholder="접근 코드"
                    />
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            확인
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FeedbackAccessModal;
