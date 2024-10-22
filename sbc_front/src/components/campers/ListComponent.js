import { useEffect, useState } from "react";
import { getList, getSearchList } from "../../api/camperApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import useCustomLogin from "../../hooks/useCustomLogin";
import { getCommentList } from "../../api/camperApi"; // 댓글 수 가져오기 위한 API import

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
    current: 0,
};

const ListComponent = () => {
    const { page, size, refresh, moveToList, moveToRead, moveToAdd } = useCustomMove();
    const { exceptionHandle } = useCustomLogin();
    const [serverData, setServerData] = useState(initState);
    const [searchType, setSearchType] = useState("title");
    const [searchText, setSearchText] = useState("");
    const [commentCounts, setCommentCounts] = useState({}); // 각 게시글의 댓글 개수 상태

    // 데이터 로딩 함수
    const loadData = async () => {
        let data;
        if (searchText) {
            const searchParam = { page, size, searchType, searchText };
            data = await getSearchList(searchParam);
        } else {
            data = await getList({ page, size });
        }

        setServerData(data);

        // 댓글 갯수 가져오기
        const counts = await Promise.all(
            data.dtoList.map(async (camperBoard) => {
                const commentsData = await getCommentList(camperBoard.cboardID);
                return { cboardID: camperBoard.cboardID, count: commentsData.length || 0 }; // 댓글이 없으면 0으로 처리
            })
        );

        // 댓글 개수 상태 업데이트
        const countsMap = counts.reduce((acc, { cboardID, count }) => {
            acc[cboardID] = count;
            return acc;
        }, {});
        setCommentCounts(countsMap); // 상태에 저장
    };

    // 초기 데이터 로딩
    useEffect(() => {
        loadData();
    }, [page, size, refresh]); // 초기 로드 시에만 호출

    const handleReadPage = (cBoardId) => {
        console.log("Selected cBoardId:", cBoardId); // cBoardId 확인
        if (!cBoardId) {
            console.error("cBoardId is undefined or invalid."); // ID가 유효하지 않을 때 처리
            return;
        }

        moveToRead(cBoardId);
    };

    const truncateTitle = (title) => {
        return title.length > 28 ? title.slice(0, 28) + "..." : title;
    };

    // 날짜 포맷팅
    const formatDate = (date) => {
        if (!date) return ""; // date가 null인 경우 빈 문자열 반환
        const localDate = new Date(date);
        const yyyy = localDate.getFullYear();
        const MM = String(localDate.getMonth() + 1).padStart(2, '0');
        const dd = String(localDate.getDate()).padStart(2, '0');

        return `${yyyy}-${MM}-${dd}`;
    };

    const handleSearch = () => {
        loadData(); // 검색 실행
    };

    return (
        <div className="container mt-5">
            <table className="table table-bordered table-hover">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    <th>작성일</th>
                </tr>
                </thead>
                <tbody>
                {serverData.dtoList.length > 0 ? (
                    serverData.dtoList.map((camperBoard) => (
                        <tr
                            key={camperBoard.cboardID}
                            onClick={() => handleReadPage(camperBoard.cboardID)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{camperBoard.cboardID}</td>
                            <td>
                                <span className="badge bg-warning me-2" style={{ display: "inline-block" }}>
                                    {camperBoard.cboardCategory}
                                </span>
                                <span style={{ display: "inline-block" }}>
                                    {truncateTitle(camperBoard.cboardTitle)}
                                </span>
                                {camperBoard.cboardAttachment && (
                                    <img
                                        src="/path/to/attachment-icon.png"
                                        alt="첨부파일 아이콘"
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            marginLeft: "5px",
                                            display: "inline-block",
                                        }}
                                    />
                                )}
                                <span style={{ display: "inline-block", marginLeft: "5px", color: "red" }}>
                                    [{commentCounts[camperBoard.cboardID] || 0}]
                                </span>
                            </td>
                            <td>{camperBoard.membername}</td>
                            <td>{camperBoard.cboardViews}</td>
                            <td>
                                {formatDate(new Date(camperBoard.cboardDate))}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">게시물이 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="d-flex mb-3 align-items-center">
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="form-select me-2"
                    style={{ width: '150px' }} // 드롭다운 크기 조정
                >
                    <option value="title">제목 검색</option>
                    <option value="content">내용 검색</option>
                </select>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="form-control me-2"
                    placeholder="검색어 입력"
                    style={{ width: '250px' }} // 입력창 크기 조정
                />
                <button
                    className="btn btn-primary"
                    onClick={handleSearch} // 검색 실행
                >
                    검색
                </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="mx-auto">
                    <PageComponent serverData={serverData} movePage={moveToList} />
                </div>
                <button className="btn btn-primary" onClick={() => moveToAdd()}>
                    등록
                </button>
            </div>
        </div>
    );
};

export default ListComponent;
