import '../css/menu.css';
import { Link, useLocation } from "react-router-dom";

const LoginMenu = () => {
    const location = useLocation();
    // 클릭한 메뉴 버튼 색깔 변경 (해당 URL이면 className에 active 추가)
    const isActive = (path) => location.pathname.startsWith(path)

    return (
        <>
            <div className='imgwrap'>
                <img src="https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073_1280.png" id="menuImg" alt="Menu" />
            </div>
            <div id='menubuttonwrap'>
                <Link to={'/login'} className={`menubutton ${isActive('/login') ? 'active' : ''}`}>로그인</Link>
                <Link to={'/findemail'} className={`menubutton ${isActive('/findemail') ? 'active' : ''}`}>이메일찾기</Link>
                <Link to={'/findpw'} className={`menubutton ${isActive('/findpw') ? 'active' : ''}`}>비밀번호찾기</Link>
                <Link to={'/join'} className={`menubutton ${isActive('/join') ? 'active' : ''}`}>회원가입</Link>
            </div>
        </>
    );
}

export default LoginMenu;