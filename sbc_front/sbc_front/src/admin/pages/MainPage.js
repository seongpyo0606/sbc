import BasicLayout from '../layouts/BasicLayout';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import '../css/mainPage.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const MainPage = () => {
    return(
        <BasicLayout>


            {/* 메인컨텐츠 2 */}
            <div id='communitywrap' className='m-5'>
            <div id='guidebox' className='p-2'>
                    <div id='guidewrap' className='m-1'>
                        캘린더 예약 현황
                    </div>
                
                </div>
                <div id='guidebox' className='p-2'>
                    <div id='guidewrap' className='m-1'>
                        매출 통계
                    </div>
                
                </div>
            </div>

        </BasicLayout>
    );
}

export default MainPage;