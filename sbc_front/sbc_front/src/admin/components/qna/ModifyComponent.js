import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getOne, putOne } from "../../api/qnaApi";
import defaultImage from "../../../images/default.jpg";

const initState = {
    qBoardTitle: '',
    qBoardContent: '',
    file: null,
    qBoardAttachment: ''
};

function ModifyComponent(props) {
    const { qbID } = useParams();
    const navigate = useNavigate();
    const [qna, setQna] = useState(initState);
    const uploadRef = useRef();
    const [showDeleteButton, setShowDeleteButton] = useState(true); // 버튼 표시 상태

    useEffect(() => {
        const fetchData = async () => {
            const data = await getOne(qbID);
            console.log(data);
            // 데이터 구조 확인 후 상태 설정
            setQna({
                qBoardTitle: data.qboardTitle || '',
                qBoardContent: data.qboardContent || '',
                qBoardAttachment: data.qboardAttachment || '',
                file: null // 파일은 처음에는 null로 설정
            });
        };
        fetchData();
    }, [qbID]);

    const handleChangeQna = (e) => {
        const { name, value } = e.target;
        setQna(prev => ({
            ...prev,
            [name]: value // 상태 업데이트
        }));
    };

    const handleFileChange = (e) => {
        setQna(prev => ({
            ...prev,
            file: e.target.files[0] // 파일 선택
        }));
    };

    const deleteOldImage = () => {
        setQna(prev => ({
            ...prev,
            qBoardAttachment: null, // 첨부 파일 초기화
            file: null // 파일도 초기화 (기존 이미지 삭제)
        }));
        setShowDeleteButton(false); // 버튼 숨기기
        console.log(qna);
    };

    const handleClickModify = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("qBoardTitle", qna.qBoardTitle);
        formData.append("qBoardContent", qna.qBoardContent);

        // 파일 처리
        if (qna.file) {
            formData.append("file", qna.file); // 새로운 파일이 있을 경우 추가
        } else {
            // 현재 첨부 파일 상태 처리
            if (qna.qBoardAttachment === null) {
                formData.append("qBoardAttachment", null); // 기존 파일 삭제 시 null로 설정
            } else {
                formData.append("qBoardAttachment", qna.qBoardAttachment); // 기존 첨부 파일 유지
            }
        }

        try {
            await putOne(qbID, formData);
            alert("게시글 수정 완료");
            navigate(`/admin/qnas/read/${qbID}`);
        } catch (error) {
            alert(error.message);
            console.error("Error uploading:", error);
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700">제목</label>
                    <input
                        name="qBoardTitle"
                        type="text"
                        value={qna.qBoardTitle} // qna의 상태를 직접 사용
                        onChange={handleChangeQna}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">내용</label>
                    <textarea
                        name="qBoardContent"
                        value={qna.qBoardContent} // qna의 상태를 직접 사용
                        onChange={handleChangeQna}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="5"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">이미지 첨부</label>
                    <input
                        type="file"
                        ref={uploadRef}
                        name="file"
                        onChange={handleFileChange} // 파일 선택 시 호출
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">이미지</label>
                    {showDeleteButton && (
                        <div>
                            <button type="button" onClick={deleteOldImage}>X</button>
                            <img
                                src={qna.qBoardAttachment ? `http://localhost:8080/admin/qnas/view/${qna.qBoardAttachment}` : defaultImage}
                                alt="게시물 첨부 이미지"
                                className="rounded-lg"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultImage; // 기본 이미지 경로
                                }}
                            /> </div>
                    )}

                </div>
                <div className="text-right space-x-2">
                    <button
                        onClick={handleClickModify}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        수정
                    </button>
                </div>
            </div>
        </>
    );
}

export default ModifyComponent;
