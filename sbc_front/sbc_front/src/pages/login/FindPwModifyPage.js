import BasicLayout from "../../layouts/BasicLayout";
import LoginMenu from "../../layouts/LoginMenu";
import '../../css/login.css'
import {useState} from "react";
import {useLocation} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useCustomLogin from "../../hooks/useCustomLogin";
import {modifyPw} from "../../api/memberApi";
import Button from "react-bootstrap/Button";


const FindPwModifyPage = () => {
    const [validated, setValidated] = useState(false);
    // 비밀번호 검사용 변수
    const [pwd, setPwd] = useState("");
    const [isPwdValid, setIsPwdValid] = useState(true);
    const [isPwdMatch, setIsPwdMatch] = useState(true);

    const {moveToPath} = useCustomLogin()

    // 파라미터 가져오기 (memberId)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const member = JSON.parse(queryParams.get('member'));

    const [members, setMembers] = useState(
        {
            memberPw : '',
        })

    const handleChange = (event) => {
        // members 업데이트
        const {name, value} = event.target;
        setMembers((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));

        // 비밀번호 유효성 검사
        if (name === 'memberPw') {
            setPwd(event.target.value);
            const regExp = /^(?=.*[a-z])((?=.*\d)|(?=.*\W)).{10,15}$/;
            if (regExp.test(event.target.value)) {
                setIsPwdValid(true);
            } else {
                setIsPwdValid(false);
            }
        }
    }

    /* 비밀번호 재확인 */
    const handleConfirmPwd = (event) => {
        const confirmPwd = event.target.value;
        setIsPwdMatch(confirmPwd === pwd);
        if(pwd !== confirmPwd){
            setIsPwdMatch(false);
        } else {
            setIsPwdMatch(true);
        }
    }
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        setValidated(true)

        let valid = true; // 유효성 검사 결과를 추적할 변수

        // 비밀번호 재확인
        if (!isPwdMatch){
            event.preventDefault();
        }

        // 부트스트랩 동작
        if (form.checkValidity() === false || !valid) {
            event.stopPropagation();
        } else{
            // 유효성 검사를 통과했으면 API 요청
            member.memberPw = members.memberPw
            handleModPw(member)
        }
        setValidated(true);
    };

    // 유효성 검사를 모두 통과하면 동작
    const handleModPw = async (member) => {
        try {
            const action = await modifyPw(member)
            console.log('비밀번호 변경 동작', action)
            if(action.error) {
                console.log('비밀번호 변경 실패')
                alert('비밀번호 변경 실패')
            } else if(action.msg === 'success') {
                // 성공하면 가입 완료 페이지로 이동
                alert('비밀번호가 변경되었습니다')
                moveToPath('/login')
            }
        } catch (error){
            console.log('서버 요청 실패 : ', error);
        }
    }

    return(
        <BasicLayout>
            <LoginMenu/>
            <div style={{marginTop:'20px'}}>
                <h3>비밀번호 변경</h3>
            </div>
            <div className="modPwWrap">
                {/* 비밀번호 */}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>
                            비밀번호
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="password"
                                          name="memberPw"
                                          placeholder="영문소문자, 숫자, 특수문자 포함 10-15자"
                                          required
                                          id={"password"}
                                          minLength={10}
                                          pattern={"^(?=.*[a-z])((?=.*\\d)|(?=.*\\W)).{10,15}$"}
                                          onChange={handleChange}
                                          isInvalid={!isPwdValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                비밀번호를 확인해주세요.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    {/* 비밀번호 재확인 */}
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>
                            재확인
                        </Form.Label>
                        <Col sm={10} id={"pwrebox"}>
                            <Form.Control type="password"
                                          placeholder="영문소문자, 숫자, 특수문자 포함 10-15자"
                                          required
                                          id={"password_re"}
                                          minLength={10}
                                          pattern={"^(?=.*[a-z])((?=.*\\d)|(?=.*\\W)).{10,15}$"}
                                          onChange={handleConfirmPwd}
                                          isInvalid={!isPwdMatch}
                            />
                            <Form.Control.Feedback type="invalid">
                                비밀번호가 일치하지 않습니다.
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{span: 10, offset: 2}} className={"joinbuttonwrap"}>
                            <Button variant="success" className={"joinButton"} type="submit" onClick={handleSubmit}>비밀번호
                                변경</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </BasicLayout>
    )

}

export default FindPwModifyPage;