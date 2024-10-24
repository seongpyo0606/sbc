import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../css/common.css';
import {Link} from 'react-router-dom';
//{children}속성을 활용하여 컴포넌트 내부에 다른 컴포넌트를 적용시킬 수 있음
const BasicLayout = ({ children }) => {

  const logout = () => {
    const now = new Date();
    const currentTime = now.toLocaleString();
    alert(currentTime + " 관리자 로그아웃");

    window.location.href = "http://localhost:3000/"
  }

  return (
      // 가장 외곽을 묶는 기본 빈태그
      <>
        {/*부트스트랩 메뉴 컴포넌트*/}
        <Navbar bg="white" data-bs-theme="light">
          <Container>
            <Navbar.Brand href="/admin" id="logo">LOGO</Navbar.Brand>
            <div id="">
              <Nav className="justify-content-end">
                <Nav.Link onClick={logout}>로그아웃</Nav.Link>
              </Nav>
              <Nav className="justify-content-end">
                <NavDropdown href="/admin/site" title="구역 관리">
                  <NavDropdown.Item as={Link} to="/admin/site">구역 관리</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="캠핑장 예약 관리">
                  <NavDropdown.Item as={Link} to="/admin/res/total">전체 예약 리스트</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/res/datesite">날짜/구역별 예약 현황</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="회원 관리">
                  <NavDropdown.Item href="/admin/member">전체 회원 리스트</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/member/inactivelist">휴면 회원 리스트</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="커뮤니티 관리">
                  <NavDropdown.Item as={Link} to="/admin/notices/list">공지사항</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/qnas">문의 게시판</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/campers">캠퍼 게시판</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/reviews">리뷰 게시판</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="통계 관리">
                  <NavDropdown.Item href="/admin/stats">예약 매출 통계</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/stats/customer">고객 통계</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </div>

          </Container>
        </Navbar>

        <main id="mainwrap">
          <Container>
            {children}
          </Container>
        </main>
      </>
  );
};

export default BasicLayout;
