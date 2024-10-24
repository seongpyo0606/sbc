import '../css/menu.css';
import {Link, useLocation} from "react-router-dom"

const CommunityMenu = () => {

    const location = useLocation();
    // 클릭한 메뉴 버튼 색깔 변경 (해당 URL이면 className에 active 추가)
    const isActive = (path) => location.pathname.startsWith(path)

    return(
        <>        
        <div className='imgwrap'>
            <img src="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" id="menuImg"></img>
        </div>
        <div id='menubuttonwrap'>
          <Link to={'/notice'} className={`menubutton ${isActive('/notice') ? 'active' : ''}`}>공지사항</Link>
          <Link to={'/qna'} className={`menubutton ${isActive('#') ? 'active' : ''}`}>문의게시판</Link>
          <Link to={'/campers'} className={`menubutton ${isActive('/campers') ? 'active' : ''}`}>캠퍼게시판</Link>
          <Link to={'#'} className={`menubutton ${isActive('#') ? 'active' : ''}`}>리뷰게시판</Link>
        </div>
        </>

    );
    
}

export default CommunityMenu;