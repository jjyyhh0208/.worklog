import React from 'react';

const ProgressBar = ({ progress }) => {
    return (
        <div className="w-4/5 bg-gray-300 rounded-full overflow-hidden mx-auto">
            <div
                className="h-4 bg-[#4053FF] transition-width duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
