import React from 'react';

const PageComponent = ({ serverData, movePage }) => {
    // 5의 배수로 페이지 번호 배열 생성
    const getPageNumbers = () => {
        const currentPage = serverData.current; // 현재 페이지
        const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1; // 현재 페이지 기준 시작 페이지
        const endPage = startPage + 4; // 시작 페이지 + 4 = 5개 표시

        // 서버에서 받아온 총 페이지 수보다 endPage를 제한
        return Array.from({ length: Math.min(5, serverData.totalPage - startPage + 1) }, (_, index) => startPage + index);
    };

    const pageNumbers = getPageNumbers();

    const handlePrevGroup = () => {
        if (serverData.current <= 5) {
            // 현재 페이지가 1~5일 때, 새로고침
            movePage({ page: 1 });
        } else {
            // 현재 페이지가 6~10일 때, 이전 그룹으로 이동
            const newStartPage = Math.max(1, Math.floor((serverData.current - 1) / 5) * 5 - 4);
            movePage({ page: newStartPage });
        }
    };

    const handleNextGroup = () => {
        // 다음 그룹으로 이동
        const newStartPage = Math.min(serverData.totalPage, Math.floor((serverData.current - 1) / 5) * 5 + 6);
        movePage({ page: newStartPage });
    };

    return (
        <div className="d-flex justify-content-center mt-4">
            {/* 이전 페이지 그룹 버튼 */}
            <button
                className="btn btn-primary mx-2"
                onClick={handlePrevGroup}
            >
                &lt;
            </button>

            {/* 페이지 번호 버튼 */}
            {pageNumbers.map(pageNum => (
                <button
                    key={pageNum}
                    className={`btn mx-2 ${serverData.current === pageNum ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => movePage({ page: pageNum })}
                >
                    {pageNum}
                </button>
            ))}

            {/* 다음 페이지 그룹 버튼 */}
            <button
                className="btn btn-primary mx-2"
                onClick={handleNextGroup}
            >
                &gt;
            </button>
        </div>
    );
}

export default PageComponent;
