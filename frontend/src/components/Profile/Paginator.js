import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import animalNicknames from '../../data/animalNicknames.json';

const PaginatedItems = ({ items, currentPage, itemsPerPage }) => {
    const offset = currentPage * itemsPerPage;
    const currentPageItems = items.slice(offset, offset + itemsPerPage);

    return currentPageItems.map((item, index) => {
        // 이름 목록을 섞습니다
        const shuffledNames = [...animalNicknames.animals].sort(() => 0.5 - Math.random());

        const anonymousName =
            offset + index < shuffledNames.length ? shuffledNames[offset + index] : `팀원 ${offset + index + 1}`;

        return (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                <strong className="text-blue-600">익명의 {anonymousName}:</strong>
                <p className="mt-2">{item}</p>
            </div>
        );
    });
};

const Paginator = ({ items, itemsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const pageCount = Math.ceil(items.length / itemsPerPage);

    return (
        <div>
            <PaginatedItems items={items} currentPage={currentPage} itemsPerPage={itemsPerPage} />
            <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination flex justify-center items-center mt-4 select-none'}
                pageClassName={'mx-1'}
                pageLinkClassName={
                    'flex items-center justify-center w-8 h-8 bg-white border rounded hover:bg-blue-100 transition-colors duration-200'
                }
                activeLinkClassName={'text-black hover:bg-blue-600 hover:text-white'}
                previousClassName={'mx-1'}
                nextClassName={'mx-1'}
                previousLinkClassName={
                    'flex items-center justify-center px-3 py-2 bg-white border rounded hover:bg-gray-200 transition-colors duration-200'
                }
                nextLinkClassName={
                    'flex items-center justify-center px-3 py-2 bg-white border rounded hover:bg-gray-200 transition-colors duration-200'
                }
                disabledClassName={'opacity-50 cursor-not-allowed'}
                breakClassName={'mx-1'}
                breakLinkClassName={
                    'flex items-center justify-center w-8 h-8 bg-white border rounded hover:bg-gray-200 transition-colors duration-200'
                }
            />
        </div>
    );
};

export default Paginator;
