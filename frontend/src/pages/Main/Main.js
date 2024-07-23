import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import typeData from '../../data/typeData.json';

function Main() {
    const navigate = useNavigate();
    const refs = useRef(typeData.map(() => React.createRef()));

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/signup/1');
    };

    const handleGuestClick = () => {
        navigate('/search');
    };

    const scrollToSection = (index) => {
        const offset = 100;
        const top = refs.current[index].current.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    const iconMapping = {
        '목표 달성자': 'fa-bullseye',
        불도저: 'fa-tachometer-alt',
        커뮤니케이터: 'fa-comments',
        중재가: 'fa-handshake',
        프로세서: 'fa-cogs',
        애널리스트: 'fa-chart-line',
        디테일리스트: 'fa-list-alt',
        '컨트롤 타워': 'fa-project-diagram',
    };

    const groups = typeData.map((type, index) => ({
        title: type.disc_character,
        description: type.description,
        types: [
            {
                title: type.disc_character,
                description: type.description,
                strengths: Array.isArray(type.strength) ? type.strength.join(' ') : '',
                weaknesses: Array.isArray(type.weakness) ? type.weakness.join(' ') : '',
                bestMatch: type.suitable_type?.[0]?.name ?? '',
                bestMatchDescription: type.suitable_type?.[0]?.description ?? '',
                complement: type.suitable_type?.[1]?.name ?? '',
                complementDescription: type.suitable_type?.[1]?.description ?? '',
                color: type.color,
                ref: refs.current[index],
            },
        ],
    }));

    return (
        <div className="relative flex flex-col items-center min-h-screen w-full overflow-y-auto">
            <header className="fixed top-0 left-0 right-0 w-full p-4 bg-white flex justify-between items-center shadow-md z-50">
                <h1 className="text-[#4053ff] text-2xl sm:text-3xl md:text-4xl font-extrabold">.WORKLOG</h1>
                <div className="flex space-x-4">
                    <button
                        className="text-gray-500 py-2 text-lg font-bold hover:bg-transparent hover:text-[#0453FF]"
                        onClick={handleLoginClick}
                    >
                        로그인
                    </button>
                    <button
                        className="text-gray-500 py-2 text-lg font-bold hover:bg-transparent hover:text-[#0453FF]"
                        onClick={handleSignUpClick}
                    >
                        회원가입
                    </button>
                    <button
                        className="text-gray-500 py-2 text-lg font-bold hover:bg-transparent hover:text-[#0453FF]"
                        onClick={handleGuestClick}
                    >
                        비회원으로 평가하기
                    </button>
                </div>
            </header>
            <main className="flex flex-col items-center w-full pt-20">
                <div className="carousel w-[80%] h-[40%] md:w-[90%]">
                    <Carousel
                        showArrows={true}
                        showThumbs={false}
                        infiniteLoop={true}
                        autoPlay={true}
                        interval={1800}
                        showStatus={false}
                    >
                        <div>
                            <img src="/images/mainImage1.png" alt="Sample 1" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <img src="/images/mainImage2.png" alt="Sample 2" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <img src="/images/mainImage3.png" alt="Sample 3" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <img src="/images/mainImage3.png" alt="Sample 4" className="w-full h-full object-cover" />
                        </div>
                    </Carousel>
                </div>
                <div className="w-[80%] mt-10 border border-gray-300 rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <i className="w3-jumbo w3-text-blue">&#128226;</i>
                        <span className="ml-2">공지사항</span>
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4">
                            <div className="text-gray-800 font-bold text-lg">v. 0.1 배포완료</div>
                            <div className="text-gray-600">2024-07-22</div>
                            <hr className="my-4" />
                            <div className="text-black mb-10">
                                안녕하세요, WORKLOG 운영팀입니다. <br />
                                <br />
                                익명 팀원 피드백 서비스, .WORKLOG가 드디어 출시 되었습니다. <br />
                                일하는 모두를 위한 더 나은 서비스가 되도록 하겠습니다. <br />
                                <br /> 많은 관심과 응원 부탁드립니다.
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="mt-12 mb-8 px-4 py-6 w-[100%] md:w-[80%] rounded-lg">
                <div className="text-3xl text-black leading-relaxed ">
                    <div
                        className="text-[#4053ff] text-3xl font-extrabold mb-4 inline-block pb-6 border-b border-gray-300"
                        style={{ marginBottom: '16px' }}
                    >
                        .WORKLOG<span className="text-gray-400"> : 익명 팀원 피드백 서비스 </span>
                    </div>
                    <br />
                    <span className="text-xl text-black leading-relaxed">
                        나는 일할 때 어떤 사람일까요? 함께 일했던 사람들의 피드백을 모아, 본인의 업무 페르소나를
                        파악하고 싶은 당신께 워크로그가 찾아 왔습니다! <br />
                        .WORKLOG는 웹 브라우저 기반의 서비스로, 협업으로 일하는 모두를 위한 일종의 자기이해 서비스예요.
                        <br />
                        세분화 된 설문지 문항과 AI를 활용해 타인이 평가하는 '협업 활동에서의 나' 를 체계적으로
                        분석하면서, 본인의 실제로 팀 내의 모습을 객관적인 시선에서 이해할 수 있도록 도와줍니다.
                    </span>
                </div>
            </div>
            <div className="text-2xl font-medium m-8">.WORKLOG에는 어떤 유형이 있을까요?</div>
            <div className="flex justify-center mt-4 w-[90%] rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
                    {typeData.map(
                        (type, index) =>
                            type.disc_character !== 'None' && (
                                <div
                                    key={index}
                                    className="text-center mx-2 my-1 group"
                                    onClick={() => scrollToSection(index)}
                                >
                                    <i
                                        className={`fas ${
                                            iconMapping[type.disc_character]
                                        } fa-2x w-12 h-12 mx-auto text-gray-400 group-hover:text-[#4053FF] group-hover:cursor-pointer`}
                                    ></i>
                                    <div className="text-gray-800 text-lg font-bold group-hover:text-[#4053FF] group-hover:cursor-pointer">
                                        {type.disc_character}
                                    </div>
                                </div>
                            )
                    )}
                </div>
            </div>

            {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="mt-8 scroll-mt-12 w-[90%]">
                    {group.types.map(
                        (type, typeIndex) =>
                            type.title !== 'None' && (
                                <div key={typeIndex} className="mt-10" ref={type.ref}>
                                    <div className="flex flex-wrap mt-5 justify-around">
                                        <div
                                            className="text-xl w-60 h-16 mb-10 rounded-lg px-5 py-2 text-center flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: type.color }}
                                        >
                                            {type.title}
                                        </div>
                                        <div className="w-full lg:w-3/4 text-black text-xl leading-relaxed"></div>
                                    </div>
                                </div>
                            )
                    )}
                    <p className="text-xl mt-5 text-black ml-8 mb-8">{group.description}</p>
                </div>
            ))}
        </div>
    );
}

export default Main;
