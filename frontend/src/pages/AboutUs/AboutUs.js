import React, { useState, useEffect, useMemo } from 'react';
import typeData from '../../data/typeData.json';

const AboutUs = () => {
    const [discData, setDiscData] = useState({ groupDescriptions: {}, types: [] });

    useEffect(() => {
        setDiscData(typeData);
    }, []);

    const groupedData = useMemo(
        () => ({
            '주도형(Dominance)': discData.types.filter((item) =>
                ['목표 달성자', '불도저'].includes(item.disc_character)
            ),
            '사교형(Influence)': discData.types.filter((item) =>
                ['커뮤니케이터', '중재가'].includes(item.disc_character)
            ),
            '안정형(Steadiness)': discData.types.filter((item) =>
                ['프로세서', '애널리스트'].includes(item.disc_character)
            ),
            '신중형(Conscientiousness)': discData.types.filter((item) =>
                ['디테일리스트', '컨트롤 타워'].includes(item.disc_character)
            ),
        }),
        [discData.types]
    );

    const scrollToType = (typeId) => {
        const element = document.getElementById(typeId);
        if (element) {
            const yOffset = -40; // Adjust this value to control how far above the element to scroll
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    if (discData.types.length === 0) {
        return <div>Loading...</div>;
    }
    return (
        <div className="bg-gray-100 flex justify-center m-0 w-full h-full overflow-y-auto mt-16">
            <div className="p-10 w-full lg:w-4/5 rounded-3xl bg-white flex-shrink-0 mt-12 mb-12 overflow-y-auto">
                <h1 className="text-black text-6xl font-extrabold mb-4">FAQ</h1>
                <div className="w-full h-px bg-gray-400 mb-8"></div>

                {/* Q1 */}
                <div className="mb-10">
                    <p className="text-2xl font-bold text-black mb-2">Q. .WORKLOG는 어떤 서비스인가요?</p>
                    <p className="text-xl text-black ml-8">
                        <span className="text-[#4350ff] text-3xl font-extrabold">.WORKLOG</span>
                        <br />
                        <br />
                        나는 일할 때 어떤 사람일까요? 함께 일했던 사람들의 피드백을 모아, 본인의 업무 페르소나를
                        파악하고 싶은 당신께 워크로그가 찾아 왔습니다. WORKLOG는 웹 브라우저 기반의 업무 유형 알아보기
                        테스트 서비스로, 타인이 평가하는 '협업 활동에서의 나' 를 기록해 줌으로써, 본인의 실제로 팀 내의
                        모습을 객관적인 시선에서 이해할 수 있도록 도와줍니다.
                    </p>
                </div>

                {/* Q2 */}
                <div className="mb-10 mt-16">
                    <p className="text-2xl font-bold text-black mb-2">Q. 8가지 협업 유형은 어떻게 나뉘나요?</p>
                    <div className="mb-10 flex flex-wrap items-center">
                        <div className="flex flex-wrap gap-4 mb-5 justify-start w-full lg:w-1/2 ml-9">
                            {discData.types
                                .filter((item) => item.disc_character !== 'None')
                                .map((type, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 rounded-lg w-32 h-10 text-center cursor-pointer text-white font-bold duration-300 transform hover:scale-105"
                                        style={{ backgroundColor: type.color }}
                                        onClick={() => scrollToType(type.disc_character)}
                                    >
                                        {type.disc_character}
                                    </span>
                                ))}
                        </div>
                        <div
                            className="w-96 h-96 bg-center bg-no-repeat bg-cover ml-12"
                            style={{ backgroundImage: "url('/images/discImage.png')" }}
                        ></div>
                    </div>

                    <p className="text-xl text-black lg:ml-8">
                        모든 유저는 8가지의 유형으로 구분돼요. 공신력 있는 행동 유형 검사인 DISC 검사 속 설문 과정에서
                        착안된 질문들로 구성한 설문 결과 점수에 근거해요. 주도(D),사교(I),안정(C),신중(S) 네 가지 성향을
                        기준으로, 유저는 다음과 같은 8가지 세부 유형으로 구분됩니다.
                    </p>
                </div>
                {/* 그룹별 설명 */}
                {Object.entries(groupedData).map(([groupTitle, types], groupIndex) => (
                    <div key={groupIndex} className="mt-12">
                        <h2 className="text-3xl font-bold text-black mb-2">{groupTitle}</h2>
                        <p className="text-xl mt-5 text-black ml-8 mb-8">{discData.groupDescriptions[groupTitle]}</p>
                        {/* 유형별 설명 */}
                        {types.map((type, typeIndex) => (
                            <div key={typeIndex} id={type.disc_character} className="mt-12 pt-10">
                                <div className="flex flex-col flex-wrap mt-5 justify-center items-center">
                                    <div
                                        className="text-xl w-60 h-16 mb-10 rounded-lg px-5 py-2 text-center flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: type.color }}
                                    >
                                        {type.disc_character}
                                    </div>
                                    <img src={type.disc_img} alt={type.disc_character} className="w-44 h-44" />

                                    <div className="w-full lg:w-3/4 text-black text-xl leading-relaxed">
                                        <p className="mb-6">{type.description}</p>

                                        <p className="mb-4 font-bold text-[#4053FF]">
                                            <strong>강점 및 보완할 점은?</strong>
                                        </p>
                                        <p className="mb-6">
                                            <strong>이 유형의 강점은:</strong> {type.strength}
                                        </p>
                                        <p className="mb-6">
                                            <strong>상대적으로 이 유형은:</strong> {type.weakness}
                                        </p>
                                        <div className="mt-8 mb-2 font-bold text-[#4053FF]">
                                            {type.disc_character}형과 맞는 협업 유형은?
                                        </div>
                                        {type.suitable_type.map((suitableType, index) => (
                                            <div key={index} className="mb-4">
                                                <strong className="block mb-2">{suitableType.name}</strong>
                                                <div className="text-[#6B7280]">
                                                    {index === 0
                                                        ? '강점을 더 강화 시켜 주는 협업 유형'
                                                        : '상호 보완이 되는 협업 유형'}
                                                </div>
                                                <div>{suitableType.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
