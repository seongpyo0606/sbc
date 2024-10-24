import { useState, useEffect } from "react";
import { getOne, putOne } from "../../api/camperApi";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const ModifyComponent = ({ cBoardId }) => {
    const initState = {
        cBoardId: '',
        member: {
            memberID: '',
        },
        cBoardCategory: '',
        cBoardTitle: '',
        cBoardContent: '',
        cBoardViews: 0,
        cBoardAttachment: '', // 단일 첨부파일로 수정
        file: null
    };

    const [cboard, setCboard] = useState({ ...initState });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getOne(cBoardId).then((data) => {
            if (data) {
                // 여기서 반환된 데이터의 구조에 맞게 상태를 설정
                setCboard({
                    ...initState,
                    cBoardId: data.cboardID, // cboardId 추가
                    member: data.member, // 작성자 정보
                    cBoardCategory: data.cboardCategory,
                    cBoardTitle: data.cboardTitle,
                    cBoardContent: data.cboardContent,
                    cBoardViews: data.cboardViews,
                    cBoardAttachment: data.cboardAttachment, // 단일 첨부파일
                    file: null
                });
                console.log('-------------------------', data);
            } else {
                console.log("데이터가 없습니다.");
            }
        });
    }, [cBoardId]);

    const handleClickModify = async () => {
        try {
            const formData = new FormData();
            formData.append("cBoardId", cboard.cBoardId);
            formData.append("member", cboard.member.memberID);
            formData.append("cBoardCategory", cboard.cBoardCategory);
            formData.append("cBoardTitle", cboard.cBoardTitle);
            formData.append("cBoardContent", cboard.cBoardContent);
            formData.append("cBoardViews", cboard.cBoardViews);
            formData.append("cBoardAttachment", cboard.cBoardAttachment);
            if (cboard.file != null) {
                formData.append("file", cboard.file);
            }
            // 수정데이터 확인
            console.log('cboardId:', formData.get('cBoardId'), 'memberId:', formData.get("member"), 'views:', formData.get("cBoardViews"));

            // API 요청
            const response = await putOne(cBoardId, formData);
            console.log('수정 성공:', response);
            navigate(-1);
        } catch (error) {
            // 오류 처리 개선
            if (error.response) {
                console.error('수정 중 오류 발생:', error.response.data);
                setError(`수정 중 오류가 발생했습니다: ${error.response.data.message}`);
            } else {
                console.error('수정 중 오류 발생:', error.message);
                setError('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    const handleClickCancel = () => {
        navigate(`/campers/read/${cBoardId}`);
    };

    const handleChangeCboard = (e) => {
        const { name, value } = e.target;
        setCboard((prevCboard) => ({ ...prevCboard, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // 첫 번째 파일만 가져옴
        setCboard((prevCboard) => ({ ...prevCboard, file: file })); // 단일 파일 업데이트
    };

    return (
        <div className="container mt-4 p-4 border border-primary">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row mb-3">
                <label className="col-sm-2 col-form-label font-weight-bold">WRITER</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        className="form-control"
                        value={cboard.member.memberName}
                        readOnly
                    />
                </div>
            </div>

            <div className="row mb-3">
                <label className="col-sm-2 col-form-label font-weight-bold">CATEGORY</label>
                <div className="col-sm-10">
                    <select
                        className="form-select"
                        name="cBoardCategory"
                        value={cboard.cBoardCategory}
                        onChange={handleChangeCboard}
                    >
                        <option value="">카테고리를 선택하세요</option>
                        <option value="잡담">잡담</option>
                        <option value="정보">정보</option>
                    </select>
                </div>
            </div>

            <div className="row mb-3">
                <label className="col-sm-2 col-form-label font-weight-bold">TITLE</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        className="form-control"
                        name="cBoardTitle"
                        value={cboard.cBoardTitle}
                        onChange={handleChangeCboard}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <label className="col-sm-2 col-form-label font-weight-bold">CONTENT</label>
                <div className="col-sm-10">
                    <textarea
                        name="cBoardContent"
                        className="form-control"
                        value={cboard.cBoardContent}
                        onChange={handleChangeCboard}
                        rows="4"
                    />
                </div>
            </div>

            <div className="row mb-3">
                <label className="col-sm-2 col-form-label font-weight-bold">ATTACHMENT</label>
                <div className="col-sm-10">
                    <input
                        type="file"
                        className="form-control"
                        name="cBoardAttachment"
                        onChange={handleFileChange} // 단일 파일만 선택 가능
                    />
                </div>
            </div>

            <div className="d-flex justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={handleClickModify}
                >
                    수정
                </button>
                <button
                    type="button"
                    className="btn btn-secondary mx-2"
                    onClick={handleClickCancel}
                >
                    삭제
                </button>
            </div>
        </div>
    );
};

export default ModifyComponent;
