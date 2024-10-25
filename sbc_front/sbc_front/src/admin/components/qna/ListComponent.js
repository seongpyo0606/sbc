import useCustomMove from '../../../hooks/useCustomMove';
import React, {useCallback, useEffect, useState} from 'react';
import { getCommentList, getList, searchBoard } from '../../api/qnaApi';
import BootstrapPagination from "../util/BootstrapPagination";
import BoardSearchComponent from "../util/BoardSearchComponent";
import Table from "react-bootstrap/Table";
import { Button } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0
};

function ListComponent(props) {
    const { page, size } = useCustomMove();
    const [serverData, setServerData] = useState(initState);
    const [commentCounts, setCommentCounts] = useState({}); // 각 게시글의 댓글 개수 상태
    const [searchParams, setSearchParams] = useState({ type: 'name', keyword: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 게시물 리스트 가져오기
                const data = searchParams.keyword
                    ? await searchBoard(searchParams.type, searchParams.keyword, { page, size })
                    : await getList({ page, size });

                console.log(data);
                setServerData(data);

                // 댓글 갯수 가져오기
                const commentCounts = await Promise.all(
                    data.dtoList.map(async (qb) => {
                        const commentsData = await getCommentList(qb.qboardID); // qbID를 사용
                        console.log(`게시글 ID: ${qb.qboardID}의 댓글 수: ${commentsData.length}`);
                        return { qbID: qb.qboardID, count: commentsData.length || 0 }; // 댓글이 없으면 0으로 처리
                    })
                );

                // 댓글 개수 상태 업데이트
                const countsMap = commentCounts.reduce((acc, { qbID, count }) => {
                    acc[qbID] = count;
                    return acc;
                }, {});
                setCommentCounts(countsMap); // 상태에 저장

                console.log(`댓글 갯수:`, countsMap);

            } catch (error) {
                console.error('API 호출 중 오류 발생:', error);
            }
        };
        fetchData();
    }, [page, size, searchParams]);

    // 페이지네이션
    const totalPages = serverData.totalPage; // 총 페이지 수

    const handlePageChange = (newPage) => {
        // 페이지 변경 시, API 호출 등 필요한 작업 수행
    };

    const handleSearch = (type, keyword) => {
        setSearchParams({ type, keyword }); // 검색 파라미터 설정
    };

    const navigate = useNavigate();

    const handleAddClick = () => {
        navigate('/admin/qnas/add'); // 공지 등록 페이지 경로로 이동
    };

    const handleReadClick = (qbID) => {
        navigate(`/admin/qnas/read/${qbID}`)
    }

    // 날짜 포맷팅
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const dd = String(date.getDate()).padStart(2, '0');

        return `${yyyy}${MM}${dd}`;
    };

    return (
        <div>
            <Table bordered hover responsive className="text-sm">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    <th>답변상태</th>
                </tr>
                </thead>
                <tbody>
                {serverData.dtoList.map(qb =>
                    <tr key={qb.qboardID}>
                        {qb.member.memberRole === "ROLE_ADMIN" ? (
                            <td>
                                <p style={{
                                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                                    color: 'red',
                                    borderRadius: '5px',
                                    display: 'inline-block',
                                    fontWeight: 'bold',
                                    border: 'red 1px solid',
                                }}>공지</p>
                            </td>
                        ) : (
                            <td>{qb.qboardID}</td>
                        )}
                        <td onClick={()=> handleReadClick(qb.qboardID)}>{qb.qboardTitle} <span style={{fontWeight: 'bold', color:'red'}}>{commentCounts[qb.qboardID] >0 ? `[${commentCounts[qb.qboardID]}]`: ''}</span></td>
                        <td>{qb.member.memberName}</td>
                        <td>{formatDate(new Date(qb.qboardDate))}</td>
                        <td>{qb.qboardViews}</td>
                        <td>{qb.qboardAsked.trim().toUpperCase() === "Y" ? "미답변" : "답변완료"}</td>
                    </tr>
                )}
                </tbody>
            </Table>
            <Button onClick={handleAddClick}>글쓰기</Button>

            <BootstrapPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <BoardSearchComponent onSearch={handleSearch} />
        </div>
    );
}

export default ListComponent;
