import useCustomMove from '../../../hooks/useCustomMove';
import React, {useEffect, useState} from 'react';
import {getInactiveList, searchMember} from '../../api/A_memberApi';
import MemberSearchComponent from '../util/MemberSearchComponent';
import BootstrapPagination from "../util/BootstrapPagination";
import Table from 'react-bootstrap/Table';

const initState = {
    dtoList:[],
    pageNumList:[],
    pageRequestDTO : null,
    prev : false,
    next: false,
    totalCount: 0,
    prevPage : 0,
    nextPage : 0,
    totalPage : 0,
    current : 0
}

function InactiveListComponent() {
    
    const {page, size} = useCustomMove()
    const [serverData, setServerData] = useState(initState)
    const [searchParams, setSearchParams] = useState({ type: 'name', keyword: ''});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = searchParams.keyword
                    ? await searchMember(searchParams.type, searchParams.keyword, { page, size })
                    : await getInactiveList({ page, size });

                console.log(data);
                setServerData(data);
            } catch (error) {
                console.error('API 호출 중 오류 발생:', error);
            }
        };

        fetchData();
    }, [page, size, searchParams]);

    const handleSearch = (type, keyword) => {
        setSearchParams({ type, keyword}); // 검색 파라미터 설정
    };

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = serverData.totalPage; // 총 페이지 수

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // 데이터 요청 등 필요한 작업 수행
    };

    // 날짜 포맷팅
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const dd = String(date.getDate()).padStart(2, '0');

        return `${yyyy}${MM}${dd}`;
    };

    return (
        <div>
            <div>
            <p>휴면 회원 리스트 </p> 
                <MemberSearchComponent onSearch={handleSearch}/>
            </div>
           <Table bordered hover responsive className="text-sm">
            <tr>
                <th>회원번호</th>
                <th>이메일</th>
                <th>이름</th>
                <th>핸드폰 번호</th>
                <th>성별</th>
                <th>생년월일</th>
                <th>지역</th>
                <th>가입일</th>
            </tr>
            {serverData.dtoList.map(member =>
                <tr key={member.memberID}>
                    <td>{member.memberID}</td>
                    <td>{member.memberEmail}</td>
                    <td>{member.memberName}</td>
                    <td>{member.memberPhone}</td>
                    <td>{member.memberGender}</td>
                    <td>{member.memberBirth}</td>
                    <td>{member.memberLocal}</td>
                    <td>{formatDate(new Date(member.memberRegDate))}</td>
                </tr>
            )}
           </Table>
            <BootstrapPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default InactiveListComponent;