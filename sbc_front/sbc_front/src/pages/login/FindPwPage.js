import BasicLayout from "../../layouts/BasicLayout";
import LoginMenu from "../../layouts/LoginMenu";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../../css/login.css'
import {findpwMember} from "../../api/memberApi";

const FindPwPage = () => {

    const [member, setMembers] = useState({memberName : '', memberEmail : '', memberID : '',})
    const navigate = useNavigate();


    const handleChange = (e) => {
        setMembers({ ...member, [e.target.name]: e.target.value });
    }


    // '비밀번호 변경' 버튼 동작
    const handleSubmit = (e) => {
        if(!member.memberName){
            alert('이름을 입력해주세요')
            e.preventDefault()
            return
        } else if(member.memberName)
        if(!member.memberEmail){
            alert('이메일을 입력해주세요')
            e.preventDefault()
        } else{
            handleFindMemberByNameAndEmail(member)
        }
    }

    // 회원 조회 API 요청하기
    const handleFindMemberByNameAndEmail = async (member) => {
        try {
            const action = await findpwMember(member)
            //console.log('findpwMember 완료 :', action);
            if(!action){
                alert('회원을 찾을 수 없습니다. 이름 또는 이메일을 다시 확인해주세요.')
            } else if(action){
                const member = JSON.stringify(action)
                //console.log('member :' , member);
                navigate(`/findpw/mod?member=${member}`)
            }
        }catch (err){
            console.log('요청 오류')
            alert('회원을 찾을 수 없습니다. 이름 또는 이메일을 다시 확인해주세요.')
        }

    }



    return(
        <BasicLayout>
            <LoginMenu/>
            <div id="loginwrap">
                <div>
                    <h3>비밀번호 찾기</h3>
                </div>
                <div id="loginbox">
                    <input type="text"
                           name="memberName"
                           value={member.memberName}
                           maxLength={'10'}
                           onChange={handleChange}
                           placeholder={" 이름을 입력해주세요"}></input><br></br>
                    <input type="email"
                           name="memberEmail"
                           value={member.memberEmail}
                           maxLength={'50'}
                           required
                           onChange={handleChange}
                           placeholder={" 이메일을 입력해주세요."}></input>
                    <div>
                        <input type="submit" onClick={handleSubmit} className={"loginbutton_default"} value={"비밀번호 변경"}></input>
                    </div>
                </div>
            </div>
        </BasicLayout>
    );
}

export default FindPwPage;