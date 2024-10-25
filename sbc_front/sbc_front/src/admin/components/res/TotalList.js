// src/components/TotalList.js

import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { getAllRes } from '../../api/ResApi';   // API 임포트
import Search from './Search'; // Search 컴포넌트 임포트
import { getPagination } from "item-pagination"; // 페이지네이션 함수 임포트

const TotalList = () => {
    // 예약 데이터를 저장하는 변수
    const [reservations, setReservations] = useState([]);

    // 에러 문구 세팅 변수
    const [error, setError] = useState('');

    // 검색어 상태 변수
    const [searchTerm, setSearchTerm] = useState('');

    // 선택된 컬럼 상태 변수, 셀렉트 값의 기본은 예약번호
    const [selectedColumn, setSelectedColumn] = useState('resId');

    // 현재 페이지 설정 상태 변수
    const [currentPage, setCurrentPage] = useState(1); // 페이지 상태를 1로 초기화
    const itemsPerPage = 15; // 페이지당 항목 수


    //정렬기능 구현을 위한 상태변수
    const [sortColumn, setSortColumn] = useState(reservations.resId);
    const [sortOrder, setSortOrder] = useState('desc'); // 디폴트는 내림차순 글 번호가 디폴트라 내림차순으로 해야 최신이 위로 올라옴


    const handleSort = (column) => {
        if (sortColumn === column) {
            // 이미 선택된 컬럼이면 정렬 순서만 변경
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            // 새로운 컬럼 선택 시 오름차순으로 시작
            setSortColumn(column);
            setSortOrder('desc');
        }
    };

    // 데이터 불러오는 비동기 함수
    const settingReservation = async () => {
        try {
            // 변수 data에 getAllRes의 Response.data를 할당
            const data = await getAllRes();
            //상태설정
            setReservations(data);
        } catch (err) {
            console.error('예약 데이터를 불러오는데 실패했습니다 TotalList 파일 settingReservation 함수:', err);
            setError('사이트 데이터를 불러오는데 실패했습니다.');
        }
    };

    // useEffect를 사용하여 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        settingReservation();
    }, []);

    // 검색어와 선택된 컬럼에 따라 필터링된 예약 데이터 할당
    const filteredReservations = reservations.filter((reservation) => {

        //검색어가 없다면 true를 반환해서 필터링 되지 않은 데이터를 출력
        if (!searchTerm) return true;

        const value = reservation[selectedColumn]?.toString().toLowerCase();
        return value?.includes(searchTerm.toLowerCase());
    });

    const sortedReservations = [...filteredReservations].sort((a, b) => {
        if (!sortColumn) return 0; // 정렬할 컬럼이 선택되지 않은 경우 원본 데이터 유지

        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        if (typeof valueA === 'string') {
            return sortOrder === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        } else {
            return sortOrder === 'asc'
                ? valueA - valueB
                : valueB - valueA;
        }
    });

    // 전체 페이지 수 계산을 필터된 데이터 기준으로 변경
    const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);

    // 페이지 변경 함수
    const handlePageClick = (pageNumber) => {
        // 페이지 번호가 유효한지 확인
        if (pageNumber < 1) pageNumber = 1;
        else if (pageNumber > totalPages) pageNumber = totalPages;

        setCurrentPage(pageNumber);
    };

    // 페이지네이션된 데이터 가져오기
    const paginatedReservations = getPagination(sortedReservations, itemsPerPage, currentPage);

    // 검색어나 선택된 컬럼이 변경될 때 현재 페이지를 1로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedColumn]);//검색어나 설정 컬럼이 바뀔 경우

    return (
        <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* 페이지 제목 */}
            <h2 className="text-2xl font-bold mb-4">예약 정보 목록</h2>

            {/* 서치 컴포넌트 (자식) */}
            <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedColumn={selectedColumn}
                setSelectedColumn={setSelectedColumn}
            />

            {/* 에러 메시지 표시 */}
            {error && <div className="text-danger mb-4">{error}</div>}

            {/* 예약 정보 테이블 */}
            <Table bordered hover responsive className="text-sm">
                <thead>
                <tr className="bg-blue-200">
                    <th onClick={() => handleSort('resId')}>예약 번호</th>
                    <th onClick={() => handleSort('resUserName')}>예약자 이름</th>
                    <th onClick={() => handleSort('resUserPhone')}>예약자 전화번호</th>
                    <th onClick={() => handleSort('resPeople')}>인원수</th>
                    <th onClick={() => handleSort('checkinDate')}>입실 날짜</th>
                    <th onClick={() => handleSort('checkoutDate')}>퇴실 날짜</th>
                    <th onClick={() => handleSort('resDate')}>예약 날짜</th>
                    <th onClick={() => handleSort('resTotalPay')}>총 결제 금액</th>
                    <th onClick={() => handleSort('cancelResDate')}>취소 날짜</th>
                    <th onClick={() => handleSort('cancelResReason')}>취소 사유</th>
                    <th onClick={() => handleSort('reservatuons.member.memberName')}>회원 이름</th>
                    <th onClick={() => handleSort('reservations.site.siteName')}>구역 이름</th>

                </tr>
                </thead>

                <tbody>
                {paginatedReservations.length > 0 ? (//필터된 값을 출력, searchTerm이 ""이면 전체출력
                    paginatedReservations.map(reservation => (
                        <tr key={reservation.resId}>
                            <td>{reservation.resId}</td>
                            <td>{reservation.resUserName}</td>
                            <td>{reservation.resUserPhone}</td>
                            <td>{reservation.resPeople}</td>
                            <td>{reservation.checkinDate}</td>
                            <td>{reservation.checkoutDate}</td>
                            <td>{reservation.resDate}</td>
                            <td>{reservation.resTotalPay} 원</td>
                            <td>{reservation.resCancelDate || 'N/A'}</td>
                            <td>{reservation.resCancelReason || 'N/A'}</td>
                            <td>{reservation.member.memberName}</td>
                            <td>{reservation.site.siteName}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="14" className="text-center">예약 데이터가 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </Table>

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
        </div>
    );
};

// 컴포넌트 내보내기
export default TotalList;
