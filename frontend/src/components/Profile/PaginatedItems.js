import React, { useEffect, useState } from 'react';
import animalNicknames from '../../data/animalNicknames.json';

const PaginatedItems = ({ items, currentPage, itemsPerPage }) => {
    const [shuffledNames, setShuffledNames] = useState([]);

    useEffect(() => {
        // 이름 목록을 섞습니다
        const shuffled = [...animalNicknames.animals].sort(() => 0.5 - Math.random());
        setShuffledNames(shuffled);
    }, [currentPage]);

    const offset = currentPage * itemsPerPage;
    const currentPageItems = items.slice(offset, offset + itemsPerPage);

    return currentPageItems.map((item, index) => {
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

export default PaginatedItems;
