import "../../css/mypage.css"
import {useSelector} from "react-redux";
import {cancelRes, getReservations} from "../../api/mypageApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import {useEffect, useState} from "react";
import useCustomMove from "../../hooks/useCustomMove";
import {useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


const initState = {
    resList: [],
}


function handleReview(resId) {

}

const MyPageResPage = () => {

    const loginState = useSelector((state) => state.loginSlice)
    const [serverData, setServerData] = useState(initState);
    const { refresh} = useCustomMove()
    const navigate = useNavigate();

    const { exceptionHandle } = useCustomLogin()
    const memberId = loginState.member.memberId;

    const [reservationId, setReservationId] = useState('');
    const [otherReason, setOtherReason] = useState('');

    // 부트스트랩 모달창 관련
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    // 모달창 닫기
    const handleClose = () => {
        setSelectedReason("")
        setShow(false);
    }
    //
    const [selectedReason, setSelectedReason] = useState("");
    const handleReasonChange = (e) => {
        const value = e.target.value;
        setSelectedReason(value);
        // 라디오 버튼 값이 '4'가 아닌 경우, 기타 사유 입력을 초기화
        if (e.target.value !== "4") {
            setOtherReason(""); // 기타 입력 초기화
        }
        setSelectedReason(e.target.value);
    };
    // 기타 사유 입력 시 처리
    const handleOtherReasonChange = (e) => {
        setOtherReason(e.target.value);
    };

    useEffect(() => {
        getReservations(memberId).then(data => {
            setServerData(data);
            console.log(serverData)
        }).catch(error => {
            console.log('오류')
            exceptionHandle(error);
        });
    }, [refresh]);


    // 예약 상세 페이지로 이동
    const handleClickResId = (e) => {
        const resId = e.target.value;
        navigate(`/mypage/res/detail?resId=${resId}`);
    };

    // 예약 취소 버튼 눌렀을 때 동작
    function handleClickCancel(resId) {
        console.log('resId :', resId);
        setReservationId(resId)
        // 모달창 열기
        handleShow()
    }


    // 예약 취소 동작
    function handleCancel() {
        // 최종 취소 사유는 '4'가 선택되면 기타 입력란 값 사용
        const reason = selectedReason === "4" ? otherReason : selectedReason;

        const isConfirmed = window.confirm('예약을 정말 취소하시겠습니까?');
        if (isConfirmed) {
            try {
                cancelRes(reservationId, reason);
                setShow(false);
                window.location.reload()
            } catch (error) {
                console.log(error);
            }
        }
    }



    return (
        <div style={{marginTop:'30px'}}>
            <h3>예약 내역</h3>
            <div className="tablewrap">
                {serverData.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>예약번호</th>
                            <th>예약일</th>
                            <th>입실일</th>
                            <th>퇴실일</th>
                            <th>결제금액</th>
                            <th>상태</th>
                            <th>비고</th>
                        </tr>
                        </thead>
                        <tbody>
                        {serverData.map((reservation) => (
                            <tr key={reservation.resId}>
                                <td><button className="resbtn" onClick={handleClickResId} value={reservation.resId}>{reservation.resId}</button></td>
                                <td>{reservation.resDate}</td>
                                <td>{reservation.checkinDate}</td>
                                <td>{reservation.checkoutDate}</td>
                                <td>{reservation.resTotalPay} 원</td>
                                <td>{reservation.resStatus}</td>
                                <td>{reservation.resStatus === '예약완료' && (
                                    <button onClick={() => handleClickCancel(reservation.resId)} className="canclebtn">예약취소</button>
                                )}
                                    {reservation.resStatus === '예약취소' && (
                                        <span>-</span>
                                    )}
                                    {reservation.resStatus === '사용완료' && (
                                        <button onClick={() => handleReview(reservation.resId)} className="reviewbtn">리뷰작성</button>
                                    )}</td>

                                {/* 예약 취소 모달창 */}
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>예약 취소</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>예약번호</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder={reservation.resId}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>입실일</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder={reservation.checkinDate}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>퇴실일</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder={reservation.checkoutDate}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>입실인원</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder={reservation.resPeople}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>결제금액</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder={reservation.resTotalPay}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="exampleForm.ControlTextarea1"
                                            >
                                                <Form.Label>취소 사유</Form.Label>
                                                <br></br>
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="1. 단순변심"
                                                    value="단순변심"
                                                    name="reason"
                                                    onChange={handleReasonChange}
                                                />
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="2. 개인사정"
                                                    value="개인사정"
                                                    name="reason"
                                                    onChange={handleReasonChange}
                                                />
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="3. 취소 후 재예약"
                                                    value="취소 후 재예약"
                                                    name="reason"
                                                    onChange={handleReasonChange}
                                                />
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="4. 기타(텍스트 입력)"
                                                    value={"4"}
                                                    name="reason"
                                                    onChange={handleReasonChange}
                                                />
                                                <Form.Control as="textarea" rows={3}
                                                              disabled={selectedReason !== "4"}
                                                              name="reason"
                                                              value={otherReason}  // 입력한 기타 사유 값 유지
                                                              onChange={handleOtherReasonChange}
                                                              placeholder="기타 사유를 입력하세요"
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={()=> handleCancel(reservation.resId)}>
                                            예약취소
                                        </Button>
                                        <Button variant="primary" onClick={handleClose}>
                                            닫기
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>예약 정보가 없습니다.</p>
                )}


            </div>
        </div>
    );
}

export default MyPageResPage;