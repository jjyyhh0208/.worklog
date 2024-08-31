import React from 'react';
import typeData from '../../data/typeData.json';

const DISCInfo = ({ DISCData, DISCData2, DISCCharacter, DISCCharacter2, DISCCharacterValue, DISCCharacterValue2 }) => {
    const discTypeColors = typeData.types.reduce((acc, item) => {
        acc[item.disc_character] = item.color;
        return acc;
    }, {});

    return (
        <div className="bg-white rounded-[50px] shadow-md mb-5 p-8 md:p-16 relative">
            <div className="flex flex-wrap flex-col justify-center items-center text-center w-full mt-8">
                <div className="items-center justify-center flex flex-col">
                    <div className="flex justify-center items-center space-x-8">
                        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 border border-gray-200 w-72 transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded">
                                1위
                            </div>
                            <div
                                className="w-48 h-[60px] rounded-[20px] flex items-center justify-center text-white text-2xl font-bold mt-5"
                                style={{ backgroundColor: discTypeColors[DISCCharacter] }}
                            >
                                {DISCData?.disc_character}
                            </div>
                            <img
                                src={DISCData?.disc_img}
                                alt={DISCData?.disc_character}
                                className="w-44 h-44 mb-4 mt-4 rounded-full"
                            />
                            <div className="text-center max-w-xs text-gray-700 font-semibold">
                                {DISCCharacterValue}% 유저들의 선택
                            </div>
                        </div>

                        <div className="hidden md:flex flex-col items-center bg-white shadow-lg rounded-lg p-6 border border-gray-200 w-72 transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded">
                                2위
                            </div>
                            <div
                                className="w-48 h-[60px] rounded-[20px] flex items-center justify-center text-white text-2xl font-bold mt-5"
                                style={{ backgroundColor: discTypeColors[DISCCharacter2] }}
                            >
                                {DISCData2?.disc_character}
                            </div>
                            <img
                                src={DISCData2?.disc_img}
                                alt={DISCData2?.disc_character}
                                className="w-44 h-44 mb-4 mt-4 rounded-full"
                            />
                            <div className="text-center max-w-xs text-gray-700 font-semibold">
                                {DISCCharacterValue2}% 유저들의 선택
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-2xl md:text-3xl font-bold mb-4">{DISCData?.disc_character}는..</div>
                <div className=" w-full md:w-[80%] text-xl mt-5">
                    <p>{DISCData?.description}</p>
                    <div className="font-semibold mt-8 mb-3">
                        <strong className="mt-8 mb-2 font-bold text-[#4053FF]">강점 및 보완할 점은?</strong>
                    </div>
                    <strong>이 유형의 강점은:</strong> {DISCData?.strength}
                    <br />
                    <strong>상대적으로 이 유형은:</strong> {DISCData?.weakness}
                    <div className="font-semibold mt-16 mb-3">
                        <strong className="mt-16 mb-2 font-bold text-[#4053FF]">
                            {DISCData?.disc_character}와 맞는 협업 유형은?
                        </strong>
                    </div>
                    {DISCData?.suitable_type.map((type, index) => (
                        <div key={index}>
                            <strong className="mt-12 mb-2 font-semibold text-[#4053FF]">{type.name}</strong>
                            <p>{type.description}</p>
                            <br />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DISCInfo;
