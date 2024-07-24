import React from 'react';
import { Link } from 'react-router-dom';

function Error() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-5">
            <h1 className="text-[96px] md:text-[120px] text-[#4053ff] mb-0">404</h1>
            <h2 className="text-2xl md:text-3xl text-[#333] mt-0">페이지를 찾을 수 없습니다</h2>
            <p className="text-base md:text-lg text-[#666] max-w-xl my-5">
                죄송합니다. 요청하신 페이지를 찾을 수 없습니다. 주소를 잘못 입력하셨거나 페이지가 삭제되었을 수
                있습니다.
            </p>
            <Link
                to="/"
                className="inline-block px-5 py-2 bg-[#4053ff] text-white no-underline rounded-md text-lg transition duration-300 ease-in-out hover:bg-[#3042cc]"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}

export default Error;
