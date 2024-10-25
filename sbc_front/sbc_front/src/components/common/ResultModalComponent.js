import React from "react";

const ResultModal = ({title, content, callbackFn}) => {
    return (
        // 모달 배경: 화면 전체를 덮고, 클릭 시 콜백 함수 호출
        <div
            className="modal fade show d-flex justify-content-center align-items-center bg-opacity-25"
            tabIndex="-1"
            style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => {
                if (callbackFn) {
                    callbackFn();  // 배경을 클릭하면 콜백 함수가 실행됩니다.
                }
            }}>

            {/* 모달 내부 박스: 화면 중앙에 위치 */}
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                <div className="modal-content">

                    {/* 모달 헤더 부분: 제목을 표시하며 부트스트랩 경고 배경을 사용 */}
                    <div className="modal-header bg-warning text-center">
                        <h5 className="modal-title w-100">{title}</h5>
                    </div>

                    {/* 모달 본문 부분: 콘텐츠를 표시 */}
                    <div className="modal-body text-center border-bottom border-warning">
                        <p className="display-6">{content}</p>
                    </div>

                    {/* 모달 푸터 부분: 닫기 버튼을 오른쪽에 배치 */}
                    <div className="modal-footer d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (callbackFn) {
                                    callbackFn();  // 닫기 버튼을 클릭하면 콜백 함수가 실행됩니다.
                                }
                            }}>
                            Close Modal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultModal;
