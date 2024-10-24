import BasicLayout from '../layouts/BasicLayout';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import '../css/mainPage.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {useNavigate} from "react-router-dom";

const MainPage = () => {

    const navigate = useNavigate();

    return(
        <BasicLayout>

            {/* 메인 사진 */}
            <Carousel>
                <Carousel.Item>
                    <div id='slider1'>
                        <div className='wrapText'>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue 
                            mollis interdum.</p>
                        </div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div id='slider2'>
                        <div className='wrapText'>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>

            {/* 중간 퀵메뉴*/}
            <ButtonGroup aria-label="Basic example" className='quickmenuwrap'>
                <Button variant="light" onClick={()=>navigate('/res/realtime')}>실시간 예약</Button>
                <Button variant="light" onClick={()=>navigate('/mypage/res')}>예약 확인</Button>
                <Button variant="light" onClick={()=>navigate('/res/info')}>이용 요금 안내</Button>
                <Button variant="light" onClick={()=>navigate('/camping/guide')}>시설안내도</Button>
                <Button variant="light" onClick={()=>navigate('/camping/how')}>찾아오시는 길</Button>
            </ButtonGroup>

            {/* 서스펜션 브릿지 캠핑장 커뮤니티 */}
            <div className='text-center m-5'>
                <div>
                    <h3>서스펜션 브릿지 캠핑장 커뮤니티</h3>
                </div>
                <div className='m-4'>
                    <h5>SUSPENSION BRIDGE CAMPING</h5>
                </div>
            </div>

            {/* 공지사항 */}
            <div id='communitywrap' className='m-5'>
                <div id='noticewrap' className='p-2'>
                    공지사항
                </div>
                <div id='guidebox' className='p-2'>
                    <div id='guidewrap' className='m-1'>
                        시설안내
                    </div>
                    <div id='qnawrap' className='m-1'>
                        문의 및 안내전화
                    </div>
                </div>
            </div>

            {/* 리뷰게시판? */}
            <div className='reviewwrap mt-5 mb-5'>
                <div className='m-5'>
                    리뷰 게시판 사진 ???????????????????????????
                </div>
            </div>
        </BasicLayout>
    );
}

export default MainPage;