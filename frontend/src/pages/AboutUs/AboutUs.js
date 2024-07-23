import React, { useRef } from 'react';

const AboutUs = () => {
    const targetRefs = {
        '목표 달성자': useRef(null),
        불도저: useRef(null),
        커뮤니케이터: useRef(null),
        중재가: useRef(null),
        프로세서: useRef(null),
        애널리스트: useRef(null),
        디테일리스트: useRef(null),
        '컨트롤 타워': useRef(null),
    };

    const scrollToSection = (ref) => {
        const offset = 50;
        const top = ref.current.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    const groups = [
        {
            title: '주도형(Dominance)',
            description:
                '주도형(Dominance)은 외향적이고 업무 중심적인 성향이 결합된 행동 유형으로, 강한 자아와 목표지향적인 특성을 지니고 있으며, 도전과 추진력으로 동기부여를 받아요. 매사에 자신감이 넘치고 감정에 솔직하며, 빠른 의사결정과 현실주의적 사고가 장점이에요. 또한 결정을 내리기 전에 이미 일의 방향과 해결책을 직관으로 알고 있다는 게 특징이에요.',
            types: [
                {
                    ref: targetRefs['목표 달성자'],
                    color: '#FF5473',
                    title: '목표 달성자',
                    disc_img: './images/mainImage1.png',

                    description:
                        '분석적이고 논리적인 사고를 하는 유형이에요. 모든 일을 철저하고 완벽하게 처리하며 중대한 일도 단시간에 마칠 수 있어요. 또한 눈에 보이는 결과를 얻어내려고 노력하는 유형입니다. 혼자 일하는 것을 선호하며 대인관계보다는 사실이나 결과에 초점을 두는 편입니다.',
                    strengths:
                        '문제 해결 능력이 뛰어나며, 분석적인 사고를 거치며, 효율성을 중시해요. 체계적이고 논리적인 의사결정을 할 수 있어요.',
                    weaknesses:
                        '융통성 있는 결정을 내리기 어려워하며, 가끔 의사소통에서 타인에게 불편한 감정을 줄 수 있는 여지가 있어요. 때로는 사실과 논리에 집중하느라 동료의 상황과 입장을 간과할 수 있어요.',
                    bestMatch: '불도저형',
                    bestMatchDescription:
                        '목표 달성자형과 불도저형이 함께 일하면, 목표 달성자의 빠른 기획력과 불도저형의 추진력이 결합되어 일을 신속하게 진행하면서 완벽한 결과물을 만들어낼 수 있습니다.',
                    complement: '프로세서형',
                    complementDescription:
                        '목표 달성자형은 미묘한 의사소통 기술이나 타인의 감정을 직관적으로 포착하는 능력이 부족해요. 프로세서형과 목표 달성자형, 이 둘의 협업은 목표 달성자가 때로는 놓칠 수 있는 팀원의 감정과 협력의 중요성을 프로세서형이 보완해줍니다.',
                },
                {
                    ref: targetRefs['불도저'],
                    color: '#FF4B40',
                    title: '불도저',
                    description:
                        '주도형의 단도직입적인 성향과 사교형의 재미를 추구하는 성향이 결합된 유형입니다. 도전적인 과제를 추구하며 사람들에게 강한 영향력을 미치고, 목표를 달성할 수 있도록 동기를 자극하는 유형입니다. 자기 주도적이며, 적극적이고 활기찬 이미지를 가진 사람이 많아요.',
                    strengths:
                        '직관력이 뛰어나며, 리더십이 좋아 팀의 방향을 이끌어 주기도 해요. 또한, 결단력이 있어 주도적이고 적극적으로 팀에서 긍정적 영향을 미쳐요.',
                    weaknesses:
                        '기회주의적인 선택을 할 수도 있다는 우려와 함께, 결과를 가시적으로 내는 것을 중시하느라 과정을 간과하거나 성급한 결단을 내릴 지도 몰라요.',
                    bestMatch: '목표 달성자형',
                    bestMatchDescription:
                        '불도저형의 추진력과 목표 달성자의 체계적인 문제 해결 능력이 결합되면 더욱 강력한 성과를 도출할 수 있어요. 목표 달성자는 불도저형의 결단력에 전략적 분석을 더해, 빠르고도 효과적인 성과를 만들어냅니다.',
                    complement: '애널리스트형',
                    complementDescription:
                        '불도저형은 즉각적인 행동과 결단을 중시하는 반면, 애널리스트형은 신중하고 세심한 분석을 통해 의사결정을 내려요. 이 둘의 협업은 불도저형이 놓칠 수 있는 세부 사항을 애널리스트형이 보완해줍니다.',
                },
            ],
        },
        {
            title: '사교형(Influence)',
            description:
                '사교형(Influence)은 외향적이며 사람 중심의 성향을 가진 유형으로, 긍정적이고 유머 감각이 뛰어난 사람들이 많아요. 또한 멀티태스킹을 선호하여, 여러 가지 일을 동시에 처리할 수 있는 편이에요. 그러나 지나치게 체계적인 환경은 이들의 창의성과 동기를 억누를 수 있으니 이를 유의해야 해요.',
            types: [
                {
                    ref: targetRefs['커뮤니케이터'],
                    color: '#FFC554',
                    title: '커뮤니케이터',
                    description:
                        '적극적이고 사교적인 성격으로, 일을 추진하는 데 열정이 가득한 편이에요. 새로운 아이디어를 내는 것을 즐기며, 문제를 해결에 능숙한 편이에요. 다양한 유형의 사람으로부터 존경과 칭찬을 받습니다. 주어진 업무에 도전의식을 가지고 성공으로 이끈답니다.',
                    strengths:
                        '리더십이 있으며 창의적인 접근을 쉽게 떠올리는 편이에요. 갈등 관리 능력이 뛰어난 편이며 설득적으로 문제 해결에 접근해내는 역량이 있어요.',
                    weaknesses:
                        '인내하기보다는 문제 해결을 추진력 있게 목표하느라 충동적이거나 지나친 낙관을 함께 가지고 있을 수도 있어요.',
                    bestMatch: '중재가형',
                    bestMatchDescription:
                        '커뮤니케이터형과 중재가형의 협업은 창의성과 사교성을 극대화할 수 있어요. 중재가형의 사교성과 공감 능력이 커뮤니케이터형의 아이디어와 결합되어 서로를 격려하는 분위기에서 팀원들 간의 협력이 잘 이루어집니다.',
                    complement: '디테일리스트형',
                    complementDescription:
                        '커뮤니케이터형은 큰 그림만 그리는 경우가 많아 세부 사항을 간과할 수 있어요. 이때, 디테일리스트형은 체계적이고 신중한 접근으로 커뮤니케이터형의 창의적 아이디어를 실현 가능하게 만들어 주는 조력자가 되어 줄 수 있어요.',
                },
                {
                    ref: targetRefs['중재가'],
                    color: '#92604B',
                    title: '중재가',
                    description:
                        '사람들과 잘 어울리고, 친구를 사귀는 것을 좋아해요. 협력을 중요시하며, 따뜻한 성격을 가지고 있어요. 좋은 경청자라서 많은 사람들이 그에게 다가오고, 억지로 자기 생각을 다른 사람에게 주입하려 하지 않아요.',
                    strengths:
                        '사교적인 성격에 뛰어난 공감 능력과 배려심이 눈에 띄는 이 유형은 높은 커뮤니케이션 능력을 가졌어요.',
                    weaknesses:
                        '갈등이 발생했을 때 회피하려는 경향이 있을 수도 있어요. 또한 자기 주장을 끝까지 주장하고 어필하는 것에 어려움을 겪기도 해요.',
                    bestMatch: '프로세서형',
                    bestMatchDescription:
                        '프로세서형과 협업하면 두 유형 모두 협력을 중요시하기 때문에 구성원 중심의 안정적인 조직을 만들 수 있어요. 긍정적인 에너지와 서로를 격려하는 분위기 속에서 이상적인 협력이 이루어져요.',
                    complement: '디테일리스트형',
                    complementDescription:
                        '중재가형은 체계적인 절차를 제공하고 퀄리티를 중시하는 사람들과 함께 일하는 것이 좋아요. 또한 압박감이 심한 상황에서는 결단력이 떨어질 수 있기 때문에, 디테일리스트형처럼 주도적인 역할을 맡아줄 사람이 필요해요. 예를 들어, 중재가형이 팀 내 갈등 상황에서 중립적인 입장을 취할 때, 디테일리스트형은 명확한 지침을 제공해 갈등을 해결해줄 수 있습니다.',
                },
            ],
        },
        {
            title: '안정형(Steadiness)',
            description:
                '안정형(Steadiness)은 내향적이며 사람 중심적인 성향으로, 조직과 규율에 충실한 사람들이 많아요. 변화에 적응하는 시간이 필요하며 다른 방식대로 일하자고 하면 힘들어하기도 해요. 사람들 간의 조화를 추구하며, 진심으로 서로를 격려하는 업무 환경에서 진가를 발휘한답니다.',
            types: [
                {
                    ref: targetRefs['프로세서'],
                    color: '#1E74D9',
                    title: '프로세서',
                    description:
                        '친절하고 협력적인 성격으로, 자신보다 타인을 우선시해요. 책임감이 강하며, 안정성을 중시해요. 또한 다른 사람을 지지하고 그들의 아이디어를 응원해요. 한계가 뚜렷하지 않으면 무언가를 결정하는데 어려움을 겪으며 평화주의적인 사람이 되고자 해요.',
                    strengths:
                        '배려심이 깊고 친절하며 인내심이 뛰어나요. 타인과의 관계를 섬세하게 챙기며 팀워크를 살려주는 역할이 되어 주기도 해요.',
                    weaknesses: '비능률적인 선택을 하거나 의존적인 의사결정에 치우칠 여지가 존재해요.',
                    bestMatch: '애널리스트형',
                    bestMatchDescription:
                        '애널리스트형과 협업하면 프로세서형의 협력적 성향이 더욱 강화돼요. 애널리스트형과 프로세서형은 평화롭고 조화로운 분위기를 추구하기 때문에 더욱 안정적인 업무 환경을 만들 수 있어요.',
                    complement: '목표 달성자형',
                    complementDescription:
                        '프로세서형은 안정적인 환경을 선호하고 남을 먼저 생각하기에 일의 진행 속도가 느린 편이에요. 그러므로 효율적이고 분석적인 목표 달성자형과 협업함으로써 더 체계적이고 빠르게 일을 처리하여 업무 효율을 높여줘요.',
                },
                {
                    ref: targetRefs['애널리스트'],
                    color: '#7D40FF',
                    title: '애널리스트',
                    description:
                        '신중하고 체계적인 성격으로, 모든 일을 계획적으로 처리해요. 어떤 일을 결정할 때 정확한 사실이나 수치가 필요하며, 빠른 결정을 내려야 하거나 자신의 결정이 타인에게 영향을 미치는 상황에서 강한 스트레스를 받아요.',
                    strengths:
                        '계획적인 일정 관리 및 업무 프로세스 관리에 뛰어나며 높은 조직력을 가진 유형이에요. 동시에 겸손함을 겸하고 있어요.',
                    weaknesses:
                        '의견 및 감정 표현을 하기 어려워하기도 하고, 이로 인해 갈등을 회피하려는 경향이 보이기도 해요.',
                    bestMatch: '프로세서형',
                    bestMatchDescription:
                        '조용하고 친밀한 환경을 선호하는 애널리스트형은 프로세서형과 협업하면 프로세서형의 배려심과 협력적 성향이 애널리스트형의 업무 처리에 큰 도움이 돼요.',
                    complement: '불도저형',
                    complementDescription:
                        '애널리스트형은 급격한 혁신보다는 예측 가능한 상황과 기존의 방법론을 선호해요. 그러므로 추진력이 부족할 수 있는데, 결단력 있는 불도저형과의 협업을 통해 일을 효율적으로 처리할 수 있어요. 불도저형은 애널리스트형의 신중함과 체계적인 접근을 보완하여 프로젝트를 성공으로 이끌어요.',
                },
            ],
        },
        {
            title: '신중형(Conscientiousness)',
            description:
                '신중형(Conscientiousness)은 내향적이며 업무 중심의 성향을 지닌 사람들로, 과묵하고 이성적인 편이에요. 완벽주의 성향이 강해 자신이 수행하는 작업에 대한 비판을 두려워하며, 자기 자신과 타인에 대한 기대가 높은 편입니다. 혼자 일하는 것을 선호하며, 논리성에 기초하기에 결정을 천천히 내리는 것을 선호해요.',
            types: [
                {
                    ref: targetRefs['디테일리스트'],
                    color: '#55B807',
                    title: '디테일리스트',
                    description:
                        '신중하고 정확하며 업무상황뿐만 아니라 개인적인 생활에서도 규칙과 단계를 따르는 경향이 있어요. 논쟁을 방지하기 위해 조심하며 갑작스러운 변화를 싫어합니다. 사람을 좋아하지만 아주 친밀한 몇몇 사람들과 지내는 것을 선호하는 편이에요. 정확한 사실과 수치를 토대로 신중하게 결정을 내리는 편입니다.',
                    strengths: '막중한 책임이 필요한 업무에서도 꼼꼼하게 원칙을 따르면서, 책임감 있는 자세를 보여요',
                    weaknesses:
                        '도력은 다소 부족한 편이며, 미래를 보고 추진해나가기 보다는 과거 지향적으로 과거를 추적해서 신중하게 결정을 내리려고 합니다. 따라서 갑작스러운 위기 대처 능력은 낮을 수 있어요.',
                    bestMatch: '컨트롤 타워형',
                    bestMatchDescription:
                        '컨트롤 타워형과 협업하면 디테일리스트형의 분석적인 사고가 더욱 강화됩니다. 컨트롤 타워형의 분석력과 계획성이 디테일리스트형의 정확한 업무 수행을 도와줍니다.',
                    complement: '커뮤니케이터형',
                    complementDescription:
                        '디테일리스트형은 세부사항에 얽매이지 않고 큰 그림을 볼 수 있는 커뮤니케이터형의 도움을 받으면 시너지가 있어요. 과제의 수행에 초점을 맞추는 성향이 긍정적인 에너지를 불어넣고 격려와 피드백을 제공하는 커뮤니케이터형과 만난다면 만족스러운 결과를 도출해낼 수 있을 거에요.',
                },
                {
                    ref: targetRefs['컨트롤 타워'],
                    color: '#00B680',
                    title: '컨트롤 타워',
                    description:
                        '분석적이고 계획적인 성격으로, 논리적인 유형입니다. 높은 지성에 단호하고 빠른 대응력을 갖추고 있으며 문제를 해결할 수 있는 가능한 한 모든 수단을 다 이용하는 편이에요. 혼자 일하기를 좋아하고 간섭받는 것을 꺼려하는 편이에요.',
                    strengths:
                        '완벽주의 기질이 있기 때문에 뛰어난 계획성과 분석력을 가지고 논리적인 업무 진행을 착착 이어 나가요. 성실성도 갖췄기 때문에 꼼꼼하게 업무 진행을 이어나가는 것에 뛰어난 편이에요.',
                    weaknesses:
                        '무뚝뚝하거나 지나치게 비판적인 시각에서 협업 상황을 바라볼 수도 있어요. 조금 더 인간미를 챙기는 것이 필요합니다.',
                    bestMatch: '디테일리스트형',
                    bestMatchDescription:
                        '세부사항과 정확성에 몰두한다는 점에서 유사한 유형인 디테일리스트형과 협업하면 컨트롤 타워형의 분석력이 더욱 강화 돼요. 디테일리스트형의 꼼꼼함이 컨트롤 타워형의 전략적 접근에 기여하여 완벽한 결과물을 만들어 낼 수 있어요.',
                    complement: '중재가형',
                    complementDescription:
                        '컨트롤 타워형은 재능 있는 계획가이지만 협력을 이끌어내는 인적 요소를 간과할 수 있어요. 이로 인해 개인적인 관계에서 무심해질 수 있으나 관계지향적인 중재가형과 협업한다면 이러한 점을 보완할 수 있답니다.',
                },
            ],
        },
    ];

    return (
        <div className="bg-gray-100 flex justify-center m-0 w-full h-full overflow-y-auto  mt-16">
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
                        파악하고 싶은 당신께 워크로그가 찾아 왔습니다. WORKLOG는 웹 브라우저 기반의 서비스로, 협업으로
                        일하는 모두를 위한 일종의 자기이해 서비스예요. 타인이 평가하는 '협업 활동에서의 나' 를 기록해
                        줌으로써, 본인의 실제로 팀 내의 모습을 객관적인 시선에서 이해할 수 있도록 도와줍니다.
                    </p>
                </div>

                {/* Q2 */}
                <div className="mb-10  mt-16">
                    <p className="text-2xl font-bold text-black mb-2">Q. 8가지 협업 유형은 어떻게 나뉘나요?</p>
                    <div className="mb-10 flex flex-wrap items-center">
                        <div className="flex flex-wrap gap-4 mb-5 justify-start w-full lg:w-1/2 ml-9">
                            {groups
                                .flatMap((group) => group.types)
                                .map((type, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 rounded-lg w-32 h-10 text-center cursor-pointer text-white font-bold duration-300   transform hover:scale-105"
                                        style={{ backgroundColor: type.color }}
                                        onClick={() => scrollToSection(targetRefs[type.title])}
                                    >
                                        {type.title}
                                    </span>
                                ))}
                        </div>
                        <div
                            className="w-96 h-96 bg-center bg-no-repeat bg-cover ml-12"
                            style={{ backgroundImage: "url('/images/discImage.png')" }}
                        ></div>
                    </div>

                    <p className="text-xl text-black ml-8">
                        모든 유저는 8가지의 유형으로 구분돼요. 공신력 있는 행동 유형 검사인 DISC 검사 속 설문 과정에서
                        착안된 질문들로 구성한 설문 결과 점수에 근거해요. 주도(D),사교(I),안정(C),신중(S) 네 가지 성향을
                        기준으로, 유저는 다음과 같은 8가지 세부 유형으로 구분됩니다.
                    </p>
                </div>

                {/* 그룹별 설명 */}
                {groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mt-12 scroll-mt-12">
                        <h2 className="text-3xl font-bold text-black mb-2">{group.title}</h2>
                        <p className="text-xl mt-5 text-black ml-8 mb-8">{group.description}</p>

                        {/* 유형별 설명 */}
                        {group.types.map((type, typeIndex) => (
                            <div key={typeIndex} className="mt-10" ref={type.ref}>
                                <div className="flex flex-wrap mt-5 justify-around">
                                    <div
                                        className="text-xl w-60 h-16 mb-10 rounded-lg px-5 py-2 text-center flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: type.color }}
                                    >
                                        {type.title}
                                    </div>
                                    {type.disc_img}
                                    <div className="w-full lg:w-3/4 text-black text-xl leading-relaxed">
                                        <p className="mb-6">{type.description}</p>

                                        <p className="mb-4 font-bold  text-[#4053FF]">
                                            <strong>강점 및 보완할 점은?</strong>
                                        </p>
                                        <p className="mb-6">
                                            <strong>이 유형의 강점은:</strong> {type.strengths}
                                        </p>
                                        <p className="mb-6">
                                            <strong>상대적으로 이 유형은:</strong> {type.weaknesses}
                                        </p>
                                        <div className="mt-8 mb-2 font-bold text-[#4053FF]">
                                            {type.title}형과 맞는 협업 유형은?
                                        </div>
                                        <div className="block mb-2">
                                            <strong>{type.bestMatch}</strong>
                                            <div className="text-[#6B7280]"> 강점을 더 강화 시켜 주는 협업 유형</div>
                                        </div>
                                        <div>{type.bestMatchDescription}</div>
                                        <br />
                                        <div>
                                            <strong className="block mb-2">{type.complement}</strong>
                                            <div className="text-[#6B7280]"> 상호 보완이 되는 협업 유형</div>
                                        </div>
                                        <div>{type.complementDescription}</div>
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
