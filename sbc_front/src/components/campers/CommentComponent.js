import React, {useEffect, useState} from "react";
import {
    getCommentList,
    postCommentAdd,
    updateComment,
    deleteComment,
} from "../../api/camperApi";
import {useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ConfirmModal from "../../admin/components/util/ConfirmModal";

function CommentComponent() {
    const [serverData, setServerData] = useState([]); // 댓글 목록 상태
    const [commentContent, setCommentContent] = useState(""); // 댓글 입력 상태
    const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
    const [editingCommentContent, setEditingCommentContent] = useState(""); // 수정할 댓글 내용
    const {cBoardId} = useParams(); // URL에서 cBoardId 가져오기

    // 댓글 목록 가져오기
    const fetchComments = async () => {
        const data = await getCommentList(cBoardId);
        console.log("가져온 댓글 데이터:", data);
        setServerData(data.map(comment => ({
            ...comment,
            editing: false, // 각 댓글에 대해 수정 상태 추가
            editingContent: comment.cCommentContent, // 각 댓글의 수정할 내용 초기화
        })));
    };

    useEffect(() => {
        fetchComments(); // 컴포넌트가 마운트될 때 댓글 목록 가져오기
    }, [cBoardId]);

    const handleChange = (e) => {
        setCommentContent(e.target.value); // 댓글 내용 상태 업데이트
    };

    // 댓글 등록
    const handleClickAdd = async (e) => {
        e.preventDefault(); // 기본 동작 방지

        const req = {
            boardId: cBoardId,
            cCommentContent: commentContent,
        };

        try {
            const response = await postCommentAdd(req);
            if (response && response.RESULT) {
                console.log("댓글 등록 성공");
                setCommentContent(""); // 입력 필드 초기화
                fetchComments(); // 댓글 목록 갱신
            } else {
                console.error("댓글 등록 실패:", response);
            }
        } catch (error) {
            console.error("오류 발생:", error);
        }
    };


    // 댓글 수정 내용 업데이트
    const handleEditChange = (e) => {
        setEditingCommentContent(e.target.value); // 수정할 댓글 내용 상태 업데이트
    };
    const handleClickEdit = (commentId, content) => {
        setEditingCommentId(commentId); // 수정할 댓글 ID 설정
        setEditingCommentContent(content); // 수정할 댓글 내용 설정
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {

            const formData = new FormData();
            formData.append("qCommentContent", editingCommentContent);

            console.log(formData);

            const response = await updateComment(editingCommentId, formData, cBoardId);
            console.log('응답 데이터:', response); // 확인
            if (response && response.RESULT) {
                console.log('댓글 수정 성공');
                setEditingCommentId(null);
                setEditingCommentContent("");
                fetchComments(); // 데이터 확인을 위해 댓글 목록 갱신
            } else {
                console.error('댓글 수정 실패:', response);
            }
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };
    // 삭제하기 버튼 클릭 시 호출되는 함수
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentID, setCurrentID] = useState(null);

    const handleClickDelete = async (commentId) => {
        setCurrentID(commentId);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        if (currentID === null || currentID === undefined) {
            alert("삭제할 댓글 ID가 유효하지 않습니다."); // 오류 메시지
            return; // 함수 종료
        }
        try {
            await deleteComment(currentID, cBoardId);
            console.log('댓글 삭제 성공');
            fetchComments(); // 댓글 목록 갱신
        } catch (error) {
            alert("삭제 실패: " + error.message);
            console.error("삭제 중 오류 발생:", error);
        } finally {
            setModalOpen(false); // 작업 후 모달 닫기
        }
    };


    return (
        <div>
            {/* 댓글 목록 렌더링 */}
            <div>
                {serverData.length > 0 ? (
                    serverData.map((comment) => (
                        <Card key={comment.cCommentID} className="mb-3">
                            <Card.Body>
                                <Card.Title>작성자: {comment.member.memberName}</Card.Title>
                                {comment.editing ? (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSubmitEdit(comment.cCommentID);
                                    }}>
                                        <input
                                            type="text"
                                            value={comment.editingContent}
                                            onChange={(e) => handleEditChange(comment.cCommentID, e)}
                                        />
                                        <Button type="submit">수정 완료</Button>
                                        <Button type="button"
                                                onClick={() => handleClickEdit(comment.cCommentID)}>취소</Button>
                                    </form>
                                ) : (
                                    <>
                                        <Card.Text>{comment.cCommentContent}</Card.Text>
                                        <Card.Text>
                                            {new Date(comment.cCommentDate).toLocaleString("ko-KR", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: false,
                                            })}
                                        </Card.Text>
                                        <Button onClick={() => handleClickEdit(comment.cCommentID)}>수정</Button>
                                        <Button onClick={() => handleClickDelete(comment.cCommentID)}>삭제</Button>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>댓글이 없습니다.</p>
                )}
                <hr/>
                {/* 댓글 입력 폼 */}
                <div>
                    <input
                        type="text"
                        value={commentContent}
                        onChange={handleChange}
                        placeholder="내용을 입력하세요"
                        required
                    />
                    <Button onClick={handleClickAdd}>댓글 등록</Button>
                </div>
                <hr/>
                <ConfirmModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="삭제 확인"
                    message="정말 삭제하시겠습니까?"
                />
            </div>
        </div>
    );
}

export default CommentComponent;
