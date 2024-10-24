import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "./css/Respage.css";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {resAdd} from "../../api/ResApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import Modal from "react-bootstrap/Modal";

const Respage = () => {

    const initState = {
        member: {
            memberId: 0,
        },
        site: {
            siteId: 0,
        },
        resUserName: '',
        resUserPhone: '',
        resPeople: 0,
        checkinDate: '',
        checkoutDate: '',
        resTotalPay: 0,
    }

    const [res, setRes] = useState({...initState});
    const location = useLocation();
    const navigate = useNavigate();
    const {exceptionHandle} = useCustomLogin()

    // location에서 받은 값들
    const {year, month, day, siteName, siteId, memberId, memberName, memberPhone, memberEmail} = location.state || {};

    // 날짜 상태 관리
    const [checkinDate, setCheckinDate] = useState('');
    const [checkoutDate, setCheckoutDate] = useState('');

    // 모달 상태 관리
    const [firstShow, firstSetShow] = useState(false);
    const [secondShow, secondSetShow] = useState(false);
    const [thirdShow, thirdSetShow] = useState(false);

    // check 상태를 동적으로 변경
    const checkRef = useRef();
    const [isChecked, setIsChecked] = useState(false);

    // 입실날짜 퇴실날짜 상태 저장
    // location의 값을 상태에 반영하는 useEffect 이렇게 하면 되는데 다른 방법으로도 해보기
    useEffect(() => {
        if (year && month && day) {
            const formattedDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
            setCheckinDate(formattedDate);

            setRes((prevState) => ({
                ...prevState, // 기존 상태 객체의 모든 속성을 복사합니다.
                member: {
                    ...prevState.member, // member의 기존 속성을 모두 복사한 후 해당하는 필드만 새값으로 덮어쓴다.
                    memberId: memberId || 0,
                },
                site: {
                    ...prevState.site,
                    siteId: siteId || 0,
                },
                checkinDate: formattedDate,
            }));
        }
    }, [year, month, day, memberId, siteId, checkinDate]);

    const handleChangeRes = (e) => {
        const {name, value} = e.target;

        const newValue = name === 'resPeople' ? parseInt(value) : value;

        // checkinDate와 checkoutDate는 별도로 처리
        if (name === "checkinDate" || name === "checkoutDate") {
            setRes((prevState) => ({
                ...prevState,
                [name]: value,
            }))
        } else {
            setRes((prevState) => ({
                ...prevState,
                [name]: newValue,
            }));
        }
    };

    // 모달 false true 함수
    const firstShowClose = () => firstSetShow(false);
    const firstHandleShow = () => firstSetShow(true);

    const secondShowClose = () => firstSetShow(false);
    const thirdShowClose = () => thirdSetShow(false);


    // 취소 버튼 클릭시 전페이지로 이동하는 함수
    const handleCancel = () => {
        navigate(-1);
    }

    // 예약 완료시 예약확인페이지로 이동함수

    // 모달 상태 변경 / 데이터 추가
    const handleClickAdd = async () => {
        const date = new Date();
        const checkinDate = new Date(res.checkinDate)
        const checkOutDate = new Date(res.checkoutDate)

        date.setHours(0,0,0,0);
        checkinDate.setHours(0,0,0,0);
        checkOutDate.setHours(0,0,0,0);


        if (date > checkinDate) {
            firstSetShow(false)
            setTimeout(() => {
                alert("입실 날짜를 다시 확인해주세요")
            }, 100)
            return;
        } else if (checkinDate > checkOutDate) {
            firstSetShow(false)
            setTimeout(() => {
                alert("퇴실 날짜를 다시 확인해주세요")
            }, 100);
            return;
        } else if (checkinDate.getTime() === checkOutDate.getTime()) {
            firstSetShow(false)
            setTimeout(() => {
                alert("입실 날짜와 퇴실 날짜가 같을수 없습니다.")
            }, 100);
            return;
        }

        resAdd(res)
            .then(result => {
                firstSetShow(false)
                secondSetShow(true);
                setRes({...initState});
            })
            .catch(error => {
                firstSetShow(false)
                thirdSetShow(true)
                exceptionHandle(error)
            })
    };

    const handleCheckChange = () => {
        if (checkRef.current) {
            // IsChecked 상태 변경
            setIsChecked(checkRef.current.checked);

            // 체크가 되면 사용자 명을 memberName으로 설정
            if (checkRef.current.checked) {
                setRes((prevState) => ({
                    ...prevState,
                    resUserName: memberName,
                    resUserPhone: memberPhone,
                }));
            } else {
                setRes((prevState) => ({
                    ...prevState,
                    resUserName: '',
                    resUserPhone: '',
                }))
            }
        }
    };

    // 연박 계산
    useEffect(() => {
        const resCheckinDate = new Date(res.checkinDate);
        const resCheckOutDate = new Date(res.checkoutDate);

        if (isNaN(resCheckinDate.getTime()) || isNaN(resCheckOutDate.getTime())) {
            setRes((prevState) => ({
                ...prevState,
                resTotalPay: 0,
            }));
            return;
        }

        const diffTime = resCheckOutDate - resCheckinDate;

        // 밀리초를 일수로 변환 (1일 = 1000ms * 60s * 60m * 24h)
        const totalDays = diffTime / (1000 * 60 * 60 * 24);

        // 주말과 평일 수 계산
        let weekendDays = 0;
        let weekdays = 0;

        for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(resCheckinDate);
            currentDate.setDate(resCheckinDate.getDate() + i);

            // 주말인지 확인 (0: 일요일, 6: 토요일)
            if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                weekendDays++;
            } else {
                weekdays++;
            }
        }

        // 최종 결제금액 계산
        const weekendRate = 80000; // 주말 요금
        const weekdayRate = 40000;  // 평일 요금

        const totalPay = (weekdays * weekdayRate) + (weekendDays * weekendRate);

        // 상태 업데이트
        setRes((prevState) => ({
            ...prevState,
            resTotalPay: totalPay < 0 ? 0 : totalPay // 총 결제금액이 0 이하일 경우 0으로 설정
        }));

    }, [res.resTotalPay, res.checkinDate, res.checkoutDate])

    return (
        <div>
            <h3>예약페이지</h3>
            <Form
                style={{
                    marginLeft: "10px",
                }}
            >
                <Form.Group as={Row} className="mb-3" controlId="siteName">
                    <Form.Label column sm="2">
                        구역이름
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" defaultValue={siteName} readOnly={true} onChange={handleChangeRes}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="memberName">
                    <Form.Label column sm="2">
                        회원명
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" name="memberName" defaultValue={memberName}
                                      onChange={handleChangeRes}/>
                        <Form.Check
                            ref={checkRef}
                            aria-label="option 1"
                            label={"회원명이 예약자랑 같습니까?"}
                            id="check"
                            style={{
                                paddingTop: "5px",
                            }}
                            onChange={handleCheckChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="memberPhone">
                    <Form.Label column sm="2">
                        회원 핸드폰번호
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" name="memberPhone" defaultValue={memberPhone}
                                      onChange={handleChangeRes}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="memberEmail">
                    <Form.Label column sm="2">
                        이메일
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" name="memberEmail" defaultValue={memberEmail}
                                      onChange={handleChangeRes}/>

                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="resName">
                    <Form.Label column sm="2">
                        예약자명
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" name="resUserName" onChange={handleChangeRes}
                                      value={res.resUserName}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="resPhone">
                    <Form.Label column sm="2">
                        예약자 핸드폰 번호
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" name="resUserPhone" onChange={handleChangeRes}
                                      value={res.resUserPhone}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="checkinDate">
                    <Form.Label column sm="2">
                        입실날짜
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="date"
                            name="checkinDate"
                            defaultValue={checkinDate}
                            onChange={handleChangeRes}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="checkoutDate">
                    <Form.Label column sm="2">
                        퇴실날짜
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="date"
                            name="checkoutDate"
                            onChange={handleChangeRes}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="people">
                    <Form.Label column sm="2">
                        입실인원
                    </Form.Label>
                    <Col sm="10">
                        <Form.Select name="resPeople" onChange={handleChangeRes} aria-label="입실 인원수">
                            <option value="">입실인원수를 선택해주세요</option>
                            <option value="1">1명</option>
                            <option value="2">2명</option>
                            <option value="3">3명</option>
                            <option value="4">4명</option>
                            <option value="5">5명</option>
                            <option value="6">6명</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="totalpay">
                    <Form.Label column sm="2">
                        결제금액
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="text"
                            name="resTotalPay"
                            value={res.resTotalPay}
                            onChange={handleChangeRes}/>
                    </Col>
                </Form.Group>
            </Form>

            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <Button variant="success" onClick={firstHandleShow}
                        style={{marginBottom: "15px", marginRight: "10px", width: "80px"}}>확인</Button>
                <Button variant="success" onClick={handleCancel} style={{marginBottom: "15px", width: "80px"}}>취소</Button>
            </div>


            <Modal
                show={firstShow}
                onHide={firstShowClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>예약</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    예약을 하시겠습니까?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClickAdd}>
                        확인
                    </Button>
                    <Button variant="secondary" onClick={firstShowClose}>
                        취소
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={secondShow}
                onHide={secondShowClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>예약성공</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    예약이 성공적으로 완료되었습니다! 소중한 시간을 예약해 주셔서 감사합니다. 예약 관련하여 추가적인 질문이나 도움이 필요하시면 언제든지 연락해 주세요. 즐거운 경험이 되시길
                    바랍니다!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCancel}>
                        확인
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={thirdShow}
                onHide={firstShowClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>예약실패</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    죄송합니다. 예약을 완료하는 데 어려움이 발생했습니다. 입력하신 정보나 조건을 다시 한번 확인해 주시기 바랍니다. 도움이 필요하시면 언제든지 문의해 주세요.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={thirdShowClose}>
                        확인
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
};

export default Respage;
