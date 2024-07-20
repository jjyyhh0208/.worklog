import React, { useRef } from 'react';
import styles from './AboutUs.module.css';

const AboutUs = () => {
    const dominanceRef = useRef(null);
    const dominanceRef1 = useRef(null);
    const influenceRef = useRef(null);
    const influenceRef1 = useRef(null);
    const steadinessRef = useRef(null);
    const steadinessRef1 = useRef(null);
    const conscientiousnessRef = useRef(null);
    const conscientiousnessRef1 = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={styles.aboutUsBody}>
            <div className={styles.aboutContainer}>
                <h1 className={styles.title}>FAQ</h1>
                <div className={styles.grayLine}></div>
                <div className={styles.question}>
                    <p className={styles.questionTitle}>Q. .WORKLOG는 어떤 서비스인가요?</p>
                    <p className={styles.answer_1}>
                        <span className={styles.worklog}>.WORKLOG</span>
                        <br />
                        <br />
                        함께 일했던 사람들의 피드백을 모아, 자기 자신의 업무 상황 속 페르소나를 한층 더 이해해 보는 건
                        어떨까요? .WORKLOG는 웹 브라우저 기반의 서비스로, 협업으로 일하는 모두를 위한 일종의 자기이해
                        서비스예요. 타인이 평가하는 '협업 활동에서의 나' 를 기록해 줌으로써, 본인이 실제로 팀 내의
                        모습을 객관적인 시선에서 이해할 수 있도록 도와준답니다.
                    </p>
                </div>
                <div className={styles.question}>
                    <p className={styles.questionTitle}>Q. 8가지 협업 유형은 어떻게 나뉘나요?</p>
                    <div className={styles.answer_2}>
                        <div className={styles.leftAnswer}>
                            <div className={styles.types_1}>
                                <span
                                    className={styles.type}
                                    style={{ backgroundColor: '#FF5473' }}
                                    onClick={() => scrollToSection(dominanceRef)}
                                >
                                    목표 달성자
                                </span>
                                <span
                                    className={styles.type}
                                    style={{ backgroundColor: '#FF4B40' }}
                                    onClick={() => scrollToSection(dominanceRef1)}
                                >
                                    불도저
                                </span>
                                <span
                                    className={styles.type}
                                    style={{ backgroundColor: '#FFC554' }}
                                    onClick={() => scrollToSection(influenceRef)}
                                >
                                    커뮤니케이터
                                </span>
                                <span
                                    className={styles.type}
                                    style={{ backgroundColor: '#92604B' }}
                                    onClick={() => scrollToSection(influenceRef1)}
                                >
                                    중재가
                                </span>
                            </div>
                            <div className={styles.types_2}>
                                <span
                                    className={styles.type}
                                    style={{ backgroundColor: '#1E74D9' }}
                                    onClick={() => scrollToSection(steadinessRef)}
                                >
                                    프로세서
                                </span>
                                <span
                                    className={styles.type}
                                    style={{ backgroundColor: '#7D40FF' }}
                                    onClick={() => scrollToSection(steadinessRef1)}
                                >
                                    애널리스트
                                </span>
                                <span
                                    className={styles.type}
                                    style={{ backgroundColor: '#55B807' }}
                                    onClick={() => scrollToSection(conscientiousnessRef)}
                                >
                                    디테일리스트
                                </span>
                                <span
                                    className={styles.type}
                                    style={{ backgroundColor: '#00B680' }}
                                    onClick={() => scrollToSection(conscientiousnessRef1)}
                                >
                                    컨트롤 타워
                                </span>
                            </div>
                            <p className={styles.discDescription}>
                                모든 유저는 8가지의 유형으로 구분돼요. 공신력 있는 행동 유형 검사인 DISC 검사 속 설문
                                과정에서 착안된 질문들로 구성한 설문 결과 점수에 근거해요.
                                주도(D),사교(I),안정(C),신중(S) 네 가지 성향을 기준으로, 유저는 다음과 같은 8가지 세부
                                유형으로 구분 된답니다.
                            </p>
                        </div>
                        <div className={styles.rightAnswer}></div>
                    </div>

                    <h2 className={styles.subtitle}>주도형(Dominance)</h2>
                    <p className={styles.answer_1}>
                        주도형(Dominance)은 외향적이고 업무 중심적인 성향이 결합된 행동 유형으로, 강한 자아와
                        목표지향적인 특성을 지니고 있으며, 도전과 추진력으로 동기부여를 받아요. 매사에 자신감이 넘치고
                        감정에 솔직하며, 빠른 의사결정과 현실주의적 사고가 장점이에요. 또한 결정을 내리기 전에 이미 일의
                        방향과 해결책을 직관으로 알고 있다는 게 특징이에요.
                    </p>
                    <div className={styles.typeCards}>
                        <div className={styles.typeCard} style={{ backgroundColor: '#FF5473' }} ref={dominanceRef}>
                            목표 달성자
                        </div>
                        <div className={styles.typeDescription}>
                            <p>
                                분석적이고 논리적인 사고를 하는 유형이에요. 모든 일을 철저하고 완벽하게 처리하며 중대한
                                일도 단시간에 마칠 수 있어요. 또한 눈에 보이는 결과를 얻어내려고 노력하는 유형입니다.
                                혼자 일하는 것을 선호하며 대인관계보다는 사실이나 결과에 초점을 두는 편입니다.
                            </p>
                            <div className={styles.typeQuestion}>
                                <strong>강점 및 보완할 점은?</strong>
                            </div>
                            <strong>• 이 유형의 강점은:</strong> 문제 해결 능력이 뛰어나며, 분석적인 사고를 거치며,
                            효율성을 중시해요. 체계적이고 논리적인 의사결정을 할 수 있어요.
                            <br />
                            <strong>• 상대적으로 이 유형은:</strong> 융통성 있는 결정을 내리기 어려워하며, 가끔
                            의사소통에서 타인에게 불편한 감정을 줄 수 있는 여지가 있어요. 때로는 사실과 논리에
                            집중하느라 동료의 상황과 입장을 간과할 수 있어요.
                            <strong>목표 달성자형과 잘 맞는 협업 유형은?</strong>
                        </div>
                        <strong>• 강점 강화: 불도저형</strong>
                        <p>
                            목표 달성자형과 불도저형이 함께 일하면, 목표 달성자의 빠른 기획력과 불도저형의 추진력이
                            결합되어 일을 신속하게 진행하면서 완벽한 결과물을 만들어낼 수 있습니다.
                        </p>
                        <br />
                        <strong>• 상호 보완이 되는 협업 유형은?: 프로세서형</strong>
                        <p>
                            목표 달성자형은 미묘한 의사소통 기술이나 타인의 감정을 직관적으로 포착하는 능력이 부족해요.
                            프로세서형과 목표 달성자형, 이 둘의 협업은 목표 달성자가 때로는 놓칠 수 있는 팀원의 감정과
                            협력의 중요성을 프로세서형이 보완해줍니다. 예를 들어, 목표 달성자가 프로젝트 마감일을
                            엄격하게 지킬 때, 프로세서형은 팀원들의 사기를 유지시키고 지원을 제공함으로써 프로젝트가
                            원활하게 진행되도록 도와주기 때문에 상호보완이 될 수 있어요.
                        </p>
                    </div>
                </div>
                <div className={styles.typeCards}>
                    <div className={styles.typeCard} style={{ backgroundColor: '#FF4B40' }} ref={dominanceRef1}>
                        불도저
                    </div>
                    <div className={styles.typeDescription}>
                        <p>
                            주도형의 단도직입적인 성향과 사교형의 재미를 추구하는 성향이 결합된 유형입니다. 도전적인
                            과제를 추구하며 사람들에게 강한 영향력을 미치고, 목표를 달성할 수 있도록 동기를 자극하는
                            유형입니다. 자기 주도적이며, 적극적이고 활기찬 이미지를 가진 사람이 많아요.
                        </p>
                        <div className={styles.typeQuestion}>
                            <strong>강점 및 보완할 점은?</strong>
                        </div>
                        <strong>• 이 유형의 강점은:</strong> 직관력이 뛰어나며, 리더십이 좋아 팀의 방향을 이끌어 주기도
                        해요. 또한, 결단력이 있어 주도적이고 적극적으로 팀에서 긍정적 영향을 미쳐요.
                        <br />
                        <strong>• 상대적으로 이 유형은:</strong> 기회주의적인 선택을 할 수도 있다는 우려와 함께, 결과를
                        가시적으로 내는 것을 중시하느라 과정을 간과하거나 성급한 결단을 내릴 지도 몰라요.
                        <div className={styles.typeQuestion}>
                            <strong>불도저형과 맞는 협업 유형은?</strong>
                        </div>
                        <strong>• 강점 강화: 목표 달성자형</strong>
                        <p>
                            불도저형의 추진력과 목표 달성자의 체계적인 문제 해결 능력이 결합되면 더욱 강력한 성과를
                            도출할 수 있어요. 목표 달성자는 불도저형의 결단력에 전략적 분석을 더해, 빠르고도 효과적인
                            성과를 만들어냅니다.
                        </p>
                        <br />
                        <strong>• 상호 보완이 되는 협업 유형은?: 애널리스트형</strong>
                        <p>
                            불도저형은 즉각적인 행동과 결단을 중시하는 반면, 애널리스트형은 신중하고 세심한 분석을 통해
                            의사결정을 내려요. 이 둘의 협업은 불도저형이 놓칠 수 있는 세부 사항을 애널리스트형이
                            보완해줍니다. 예를 들어, 불도저형이 새로운 시장 진출을 빠르게 결정할 때, 애널리스트형은 해당
                            시장의 세부 데이터를 분석해 리스크를 줄이는 데 도움을 줍니다.
                        </p>
                    </div>
                </div>
                <h2 className={styles.subtitle}>사교형(Influence)</h2>
                <p className={styles.answer_1}>
                    사교형(Influence)은 외향적이며 사람 중심의 성향을 가진 유형으로, 긍정적이고 유머 감각이 뛰어난
                    사람들이 많아요. 또한 멀티태스킹을 선호하여, 여러 가지 일을 동시에 처리할 수 있는 편이에요. 그러나
                    지나치게 체계적인 환경은 이들의 창의성과 동기를 억누를 수 있으니 이를 유의해야 해요.
                </p>
                <div className={styles.typeCards}>
                    <div className={styles.typeCard} style={{ backgroundColor: '#FFC554' }} ref={influenceRef}>
                        커뮤니케이터
                    </div>
                    <div className={styles.typeDescription}>
                        <p>
                            적극적이고 사교적인 성격으로, 일을 추진하는 데 열정이 가득한 편이에요. 새로운 아이디어를
                            내는 것을 즐기며, 문제를 해결에 능숙한 편이에요. 다양한 유형의 사람으로부터 존경과 칭찬을
                            받습니다. 주어진 업무에 도전의식을 가지고 성공으로 이끈답니다.
                        </p>
                        <div className={styles.typeQuestion}>
                            <strong>강점 및 보완할 점?</strong>
                        </div>
                        <strong>• 이 유형의 강점은:</strong> 리더십이 있으며 창의적인 접근을 쉽게 떠올리는 편이에요.
                        갈등 관리 능력이 뛰어난 편이며 설득적으로 문제 해결에 접근해내는 역량이 있어요.
                        <br />
                        <strong>• 상대적으로 이 유형은:</strong> 인내하기보다는 문제 해결을 추진력 있게 목표하느라
                        충동적이거나 지나친 낙관을 함께 가지고 있을 수도 있어요.
                        <div className={styles.typeQuestion}>
                            <strong>커뮤니케이터형과 맞는 협업 유형은?</strong>
                        </div>
                        <strong>• 강점 강화: 중재자형</strong>
                        <p>
                            커뮤니케이터형과 중재자형의 협업은 창의성과 사교성을 극대화할 수 있어요. 중재자형의 사교성과
                            공감 능력이 커뮤니케이터형의 아이디어와 결합되어 서로를 격려하는 분위기에서 팀원들 간의
                            협력이 잘 이루어집니다.
                        </p>
                        <br />
                        <strong>• 상호 보완이 되는 협업 유형은?: 디테일리스트형</strong>
                        <p>
                            커뮤니케이터형은 큰 그림만 그리는 경우가 많아 세부 사항을 간과할 수 있어요. 이때,
                            디테일리스트형은 체계적이고 신중한 접근으로 커뮤니케이터형의 창의적 아이디어를 실현 가능하게
                            만들어 주는 조력자가 되어 줄 수 있어요.
                        </p>
                    </div>
                </div>
                <div className={styles.typeCards}>
                    <div className={styles.typeCard} style={{ backgroundColor: '#92604B' }} ref={influenceRef1}>
                        중재자
                        <div className={styles.typeDescription}>
                            <p>
                                사람들과 잘 어울리고, 친구를 사귀는 것을 좋아해요. 협력을 중요시하며, 따뜻한 성격을
                                가지고 있어요. 좋은 경청자라서 많은 사람들이 그에게 다가오고, 억지로 자기 생각을 다른
                                사람에게 주입하려 하지 않아요.
                            </p>
                            <div className={styles.typeQuestion}>
                                <strong>강점 및 보완할 점은?</strong>
                            </div>
                            <strong>• 이 유형의 강점은?:</strong> 사교적인 성격에 뛰어난 공감 능력과 배려심이 눈에 띄는
                            이 유형은 높은 커뮤니케이션 능력을 가졌어요.
                            <br />
                            <strong>• 상대적으로 이 유형은:</strong> 갈등이 발생했을 때 회피하려는 경향이 있을 수도
                            있어요. 또한 자기 주장을 끝까지 주장하고 어필하는 것에 어려움을 겪기도 해요.
                            <div className={styles.typeQuestion}>
                                <strong>중재자형과 맞는 협업 유형은?</strong>
                            </div>
                            <strong>• 강점 강화: 프로세서형</strong>
                            <p>
                                프로세서형과 협업하면 두 유형 모두 협력을 중요시하기 때문에 구성원 중심의 안정적인
                                조직을 만들 수 있어요. 긍정적인 에너지와 서로를 격려하는 분위기 속에서 이상적인 협력이
                                이루어져요.
                            </p>
                            <br />
                            <strong>• 상호 보완이 되는 협업 유형은?: 디테일리스트형</strong>
                            <p>
                                중재자형은 체계적인 절차를 제공하고 퀄리티를 중시하는 사람들과 함께 일하는 것이 좋아요.
                                또한 압박감이 심한 상황에서는 결단력이 떨어질 수 있기 때문에, 디테일리스트형처럼
                                주도적인 역할을 맡아줄 사람이 필요해요. 예를 들어, 중재자형이 팀 내 갈등 상황에서
                                중립적인 입장을 취할 때, 디테일리스트형은 명확한 지침을 제공해 갈등을 해결해줄 수
                                있습니다 .
                            </p>
                        </div>
                    </div>
                    <h2 className={styles.subtitle}>안정형(Steadiness)</h2>
                    <p className={styles.answer_1}>
                        안정형(Steadiness)은 내향적이며 사람 중심적인 성향으로, 조직과 규율에 충실한 사람들이 많아요.
                        변화에 적응하는 시간이 필요하며 다른 방식대로 일하자고 하면 힘들어하기도 해요. 사람들 간의
                        조화를 추구하며, 진심으로 서로를 격려하는 업무 환경에서 진가를 발휘한답니다.
                    </p>
                    <div className={styles.typeCards}>
                        <div className={styles.typeCard} style={{ backgroundColor: '#1E74D9' }} ref={steadinessRef}>
                            프로세서
                        </div>
                        <div className={styles.typeDescription}>
                            <p>
                                친절하고 협력적인 성격으로, 자신보다 타인을 우선시해요. 책임감이 강하며, 안정성을
                                중시해요. 또한 다른 사람을 지지하고 그들의 아이디어를 응원해요. 한계가 뚜렷하지 않으면
                                무언가를 결정하는데 어려움을 겪으며 평화주의적인 사람이 되고자 해요.
                            </p>
                            <div className={styles.typeQuestion}>
                                <strong>강점 및 보완할 점은?</strong>
                            </div>
                            <strong>• 이 유형의 강점은?:</strong> 배려심이 깊고 친절하며 인내심이 뛰어나요. 타인과의
                            관계를 섬세하게 챙기며 팀워크를 살려주는 역할이 되어 주기도 해요.
                            <br />
                            <strong>• 이 유형은 상대적으로:</strong> 비능률적인 선택을 하거나 의존적인 의사결정에 치우칠
                            여지가 존재해요.
                            <div className={styles.typeQuestion}>
                                <strong>프로세서형과 잘 맞는 협업 유형은?</strong>
                            </div>
                            <strong>• 강점 강화: 애널리스트형</strong>
                            <p>
                                애널리스트형과 협업하면 프로세서형의 협력적 성향이 더욱 강화돼요. 애널리스트형과
                                프로세서형은 평화롭고 조화로운 분위기를 추구하기 때문에 더욱 안정적인 업무 환경을 만들
                                수 있어요.
                            </p>
                            <br />
                            <strong>• 상호 보완이 되는 협업 유형은?: 목표 달성자형</strong>
                            <p>
                                프로세서형은 안정적인 환경을 선호하고 남을 먼저 생각하기에 일의 진행 속도가 느린
                                편이에요. 그러므로 효율적이고 분석적인 목표 달성자형과 협업함으로써 더 체계적이고 빠르게
                                일을 처리하여 업무 효율을 높여줘요.
                            </p>
                        </div>
                    </div>
                    <div className={styles.typeCards}>
                        <div className={styles.typeCard} style={{ backgroundColor: '#7D40FF' }} ref={steadinessRef1}>
                            애널리스트
                        </div>
                        <div className={styles.typeDescription}>
                            <p>
                                신중하고 체계적인 성격으로, 모든 일을 계획적으로 처리해요. 어떤 일을 결정할 때 정확한
                                사실이나 수치가 필요하며, 빠른 결정을 내려야 하거나 자신의 결정이 타인에게 영향을 미치는
                                상황에서 강한 스트레스를 받아요.
                            </p>
                            <div className={styles.typeQuestion}>
                                <strong>강점 및 보완할 점은?</strong>
                            </div>
                            <strong>• 이 유형의 강점은?:</strong> 계획적인 일정 관리 및 업무 프로세스 관리에 뛰어나며
                            높은 조직력을 가진 유형이에요. 동시에 겸손함을 겸하고 있어요.
                            <strong>• 이 유형은 상대적으로:</strong> 의견 및 감정 표현을 하기 어려워하기도 하고, 이로
                            인해 갈등을 회피하려는 경향이 보이기도 해요.
                            <div className={styles.typeQuestion}>
                                <strong>애널리스트형과 잘 맞는 협업 유형은?</strong>
                            </div>
                            <strong>• 강점 강화: 프로세서형</strong>
                            <p>
                                조용하고 친밀한 환경을 선호하는 애널리스트형은 프로세서형과 협업하면 프로세서형의
                                배려심과 협력적 성향이 애널리스트형의 업무 처리에 큰 도움이 돼요.
                            </p>
                            <br />
                            <strong>• 상호 보완이 되는 협업 유형은?: 불도저형이에요.</strong>
                            <p>
                                애널리스트형은 급격한 혁신보다는 예측 가능한 상황과 기존의 방법론을 선호해요. 그러므로
                                추진력이 부족할 수 있는데, 결단력 있는 불도저형과의 협업을 통해 일을 효율적으로 처리할
                                수 있어요. 불도저형은 애널리스트형의 신중함과 체계적인 접근을 보완하여 프로젝트를
                                성공으로 이끌어요.
                            </p>
                        </div>
                    </div>
                    <h2 className={styles.subtitle}>신중형(Conscientiousness)</h2>
                    <p className={styles.answer_1}>
                        신중형(Conscientiousness)은 내향적이며 업무 중심의 성향을 지닌 사람들로, 과묵하고 이성적인
                        편이에요. 완벽주의 성향이 강해 자신이 수행하는 작업에 대한 비판을 두려워하며, 자기 자신과 타인에
                        대한 기대가 높은 편입니다. 혼자 일하는 것을 선호하며, 논리성에 기초하기에 결정을 천천히 내리는
                        것을 선호해요.
                    </p>
                    <div className={styles.typeCards}>
                        <div
                            className={styles.typeCard}
                            style={{ backgroundColor: '#55B807' }}
                            ref={conscientiousnessRef}
                        >
                            디테일리스트
                        </div>
                        <div className={styles.typeDescription}>
                            <p>
                                신중하고 정확하며 업무상황뿐만 아니라 개인적인 생활에서도 규칙과 단계를 따르는 경향이
                                있어요. 논쟁을 방지하기 위해 조심하며 갑작스러운 변화를 싫어합니다. 사람을 좋아하지만
                                아주 친밀한 몇몇 사람들과 지내는 것을 선호하는 편이에요. 정확한 사실과 수치를 토대로
                                신중하게 결정을 내리는 편입니다.
                            </p>
                            <div className={styles.typeQuestion}>
                                <strong>강점 및 보완할 점은?</strong>
                            </div>
                            <strong>• 이 유형의 강점은?:</strong> 책임감, 꼼꼼함, 원칙 준수
                            <br />
                            <strong>• 이 유형은 상대적으로:</strong> 지도력은 다소 부족한 편이며, 미래를 보고
                            추진해나가기 보다는 과거 지향적으로 과거를 추적해서 신중하게 결정을 내리려고 합니다. 따라서
                            갑작스러운 위기 대처 능력은 낮을 수 있어요.
                            <div className={styles.typeQuestion}>
                                <strong>디테일리스트형과 맞는 협업 유형은?</strong>
                            </div>
                            <strong>• 강점 강화: 컨트롤 타워형</strong>
                            <p>
                                컨트롤 타워형과 협업하면 디테일리스트형의 분석적인 사고가 더욱 강화됩니다. 컨트롤
                                타워형의 분석력과 계획성이 디테일리스트형의 정확한 업무 수행을 도와줍니다.
                            </p>
                            <br />
                            <strong>• 상호보완이 되는 협업 유형은?: 커뮤니케이터형</strong>
                            <p>
                                디테일리스트형은 세부사항에 얽매이지 않고 큰 그림을 볼 수 있는 커뮤니케이터형의 도움을
                                받으면 시너지가 있어요. 과제의 수행에 초점을 맞추는 성향이 긍정적인 에너지를 불어넣고
                                격려와 피드백을 제공하는 커뮤니케이터형과 만난다면 만족스러운 결과를 도출해낼 수 있을
                                거에요.
                            </p>
                        </div>
                    </div>
                    <div className={styles.typeCards}>
                        <div
                            className={styles.typeCard}
                            style={{ backgroundColor: '#00B680' }}
                            ref={conscientiousnessRef1}
                        >
                            컨트롤 타워
                        </div>
                        <div className={styles.typeDescription}>
                            <p>
                                분석적이고 계획적인 성격으로, 논리적인 유형입니다. 높은 지성에 단호하고 빠른 대응력을
                                갖추고 있으며 문제를 해결할 수 있는 가능한 한 모든 수단을 다 이용하는 편이에요. 혼자
                                일하기를 좋아하고 간섭받는 것을 꺼려하는 편이에요.
                            </p>
                            <div className={styles.typeQuestion}>
                                <strong>강점 및 보완할 점은?</strong>
                            </div>
                            <strong>• 이 유형의 강점은?:</strong> 완벽주의 기질이 있기 때문에 뛰어난 계획성과 분석력을
                            가지고 논리적인 업무 진행을 착착 이어 나가요. 성실성도 갖췄기 때문에 꼼꼼하게 업무 진행을
                            이어나가는 것에 뛰어난 편이에요.
                            <br />
                            <strong>• 이 유형은 상대적으로:</strong> 무뚝뚝하거나 지나치게 비판적인 시각에서 협업 상황을
                            바라볼 수도 있어요. 조금 더 인간미를 챙기는 것이 필요할 거 같은 유형이에요.
                            <div className={styles.typeQuestion}>
                                <strong>컨트롤 타워형과 맞는 협업 유형은?</strong>
                            </div>
                            <strong>• 강점 강화: 디테일리스트형</strong>
                            <p>
                                세부사항과 정확성에 몰두한다는 점에서 유사한 유형인 디테일리스트형과 협업하면 컨트롤
                                타워형의 분석력이 더욱 강화 돼요. 디테일리스트형의 꼼꼼함이 컨트롤 타워형의 전략적
                                접근에 기여하여 완벽한 결과물을 만들어 낼 수 있어요.
                            </p>
                            <br />
                            <strong>• 상호보완이 되는 협업 유형은?: 중재가형</strong>
                            <p>
                                컨트롤 타워형은 재능 있는 계획가이지만 협력을 이끌어내는 인적 요소를 간과할 수 있어요.
                                이로 인해 개인적인 관계에서 무심해질 수 있으나 관계지향적인 중재가형과 협업한다면 이러한
                                점을 보완할 수 있답니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
