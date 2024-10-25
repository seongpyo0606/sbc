

import React, { useState, useEffect } from 'react';
import {getAllNotices} from "../../api/NoticeApi"; // API 모듈에서 함수 가져오기
import { useNavigate } from 'react-router-dom';
import {getPagination} from "item-pagination";
import {useSelector} from "react-redux";    //서버 사이드 렌더링에서 사용하기위해 권한정보를 받아오는


const ListComponent = () => {
    // useNavigate 훅을 사용하여 페이지 이동에 필요한 함수 생성
    const navigate = useNavigate();

    //현재 로그인중인 사용자의 정보를 받아오는 변수
    const loginState = useSelector((state) => state.loginSlice)

    // 공지사항 전체 정보 목록을 저장하는 변수
    const [notices, setNotices] = useState([]);

    // 날짜형식 변환 함수  이걸로 날짜를 감싸주면 형변환 됨
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}년 ${mm}월 ${dd}일`;
    };


    // '글쓰기' 버튼 클릭 시 호출되는 함수: 공지 등록 페이지로 이동
    const handleAddClick = () => {
        navigate('/admin/notices/add'); // 공지 등록 페이지 경로로 이동
    };

    // 제목 클릭 시 상세보기 페이지로 이동하는 함수
    const handleTitleClick = (id) => {
        console.log("상세 페이지로 이동할 ID:", id);

        navigate(`/admin/notices/read/${id}`); // 상세보기 페이지 경로로 이동

    };

    // 입력 검증 시 발생한 에러 메시지를 저장하는 변수
    const [error, setError] = useState('');

    //현재 페이지 설정 상태변수
    const [currentPage, setCurrentPage] = useState(1); // 페이지 상태를 1로 초기화
    const itemsPerPage = 15; // 페이지당 항목 수
    // 전체 페이지 수 계산
    const totalPages = Math.ceil(notices.length / itemsPerPage);

    //현재 페이지 변경 함수
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 데이터 불러오는 비동기 함수
    const settingNotices = async () => {
        try {
            //변수 data에 getAllNotices의 Responce.data를 할당
            const data = await getAllNotices();
            //set 생성자(변수)
            setNotices(data);
        } catch (err) {
            console.error('Notice 데이터를 불러오는데 실패했습니다:', err);
            setError('Notice 데이터를 불러오는데 실패했습니다.');
        }
    };

    //useEffect를 사용하여 컴포넌트를 부를 때 최신데이터를 부르는 함수
    useEffect(()=>{
        settingNotices();
    },[]);


    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-gray-400">
            <h2 className="text-2xl font-bold mb-4">목 록</h2>

            {/* 공지사항 목록을 보여주는 테이블 */}
            <table className="min-w-full bg-white">
                <thead className="bg-gray-400">
                <tr>
                    {/* 테이블 헤더 */}
                    <th className="w-1/6 px-4 py-2 border-b-2 border-gray-300 text-left">NO</th>
                    <th className="w-1/2 px-4 py-2 border-b-2 border-l border-gray-300 text-left">제목</th>
                    <th className="w-1/6 px-4 py-2 border-b-2 border-l border-gray-300 text-left">작성일</th>
                    <th className="w-1/6 px-4 py-2 border-b-2 border-l border-gray-300 text-left">조회수</th>
                </tr>
                </thead>
                {/* 공지사항 데이터를 테이블 행으로 출력 */}
                <tbody>
                {getPagination(notices,15,currentPage)
                    .map((notice) => (
                    <tr key={notice.nboardId} className="hover:bg-gray-100">
                        <td className="w-1/6 border-t border-gray-300 px-4 py-2 text-left">{notice.nboardId}</td>
                        <td
                            className="w-1/2 border-t border-l border-gray-300 px-4 py-2 text-left text-blue-500 cursor-pointer hover:underline"
                            onClick={() => handleTitleClick(notice.nboardId)} // 제목 클릭 시 호출되는 함수
                        >
                            {notice.nboardTitle}
                        </td>
                        <td className="w-1/6 border-t border-l border-gray-300 px-4 py-2 text-left">
                            {formatDate(notice.nboardDate)}
                        </td>
                        <td className="w-1/6 border-t border-l border-gray-300 px-4 py-2 text-left">{notice.nboardViews}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="mt-4 text-center">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    &lt;
                </button>

                {[...Array(totalPages).keys()].map((page) => (
                    <button
                        key={page + 1}
                        onClick={() => handlePageClick(page + 1)}
                        className={`px-4 py-2 mx-1 ${currentPage === page + 1 ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded hover:bg-blue-700`}
                    >
                        {page + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    &gt;
                </button>
            </div>
            {/* 글쓰기 버튼 - 관리자 권한일 때만 표시 */}
            {loginState.member?.memberRole === 'ROLE_ADMIN' && (
                <div className="mt-4 text-right">
                    <button
                        onClick={handleAddClick}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                        공지 쓰기
                    </button>
                </div>
            )}
        </div>
    );
};


export default ListComponent;
