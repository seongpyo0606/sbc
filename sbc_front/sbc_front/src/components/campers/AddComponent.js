import { useState, useEffect } from "react";
import { postAdd } from "../../api/camperApi"; // 회원 정보를 가져오는 API 제거
import useCustomMove from "../../hooks/useCustomMove";
import {useSelector} from "react-redux";

const AddComponent = () => {
    const loginState = useSelector((state) => state.loginSlice)

    // 초기 상태 설정
    const initState = {
        member: {
            memberId: loginState.member.memberId
        },
        cBoardCategory: '',
        cBoardTitle: '',
        cBoardContent: '',
        file: null
    }

    const [cboard, setCboard] = useState({ ...initState });
    //
    // useEffect(() => {
    //     const currentDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd 형식
    //     setCboard((prev) => ({ ...prev, cBoardDate: currentDate }));
    // }, []);

    const { moveToList } = useCustomMove();

    // 파일 첨부하면 저장하는 메소드
    const handleFileChange = (e) => {
        const fileParam = e.target.files[0]; // 선택한 파일 하나만 가져옴
        if (fileParam) {
            setCboard((prev) => ({
                ...prev,
                file: fileParam // 단일 파일 업데이트
            }));
        }
    };

    // input 입력시 저장 메소드
    const handleChangeTodo = (e) => {
        const { name, value } = e.target;
        setCboard((prev) => ({ ...prev, [name]: value }));
    };

    // 등록 버튼 눌렀을 때 메소드
    const handleClickAdd = async () => {
        const formData = new FormData();
        formData.append("cBoardTitle", cboard.cBoardTitle);
        formData.append("cBoardCategory", cboard.cBoardCategory);
        formData.append("cBoardContent", cboard.cBoardContent);
        formData.append("member", cboard.member.memberId); // 객체로 변환해서 전송
        if(cboard.file != null){
            formData.append("file", cboard.file);
        }

        console.log('보내기 전 데이터 : ', formData);

        await postAdd(formData)
            .then(result => {
                console.log("등록 서버 응답:", result);
                moveToList(); // 등록 완료 후 campers/list 페이지로 이동
            })
            .catch(e => {
                console.error("API 호출 오류:", e);
            });
    };

    return (
        <div className="border border-primary mt-4 p-4">
            <div className="mb-3">
                {/* 나머지 필드들 */}
                <div className="row mb-2">
                    <label className="col-sm-2 col-form-label">카테고리</label>
                    <div className="col-sm-10">
                        <select
                            className="form-select"
                            name="cBoardCategory"
                            value={cboard.cBoardCategory}
                            onChange={handleChangeTodo}
                        >
                            <option>카테고리를 선택하세요</option>
                            <option value="잡담">잡담</option>
                            <option value="정보">정보</option>
                        </select>
                    </div>
                </div>

                {/* 제목, 첨부파일, 내용 등 추가 필드 */}
                {/* 제목 */}
                <div className="row mb-2">
                    <label className="col-sm-2 col-form-label">제목</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            name="cBoardTitle"
                            type="text"
                            value={cboard.cBoardTitle}
                            onChange={handleChangeTodo}
                        />
                    </div>
                </div>

                {/* 첨부파일 */}
                <div className="row mb-2">
                    <label className="col-sm-2 col-form-label">첨부파일</label>
                    <div className="col-sm-10">
                        <input
                            type="file"
                            className="form-control"
                            name="cBoardAttachment"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* 내용 */}
                <div className="row mb-2">
                    <label className="col-sm-2 col-form-label">내용</label>
                    <div className="col-sm-10">
                        <textarea
                            className="form-control"
                            name="cBoardContent"
                            value={cboard.cBoardContent}
                            onChange={handleChangeTodo}
                            rows="4"
                        />
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleClickAdd}
                >
                    등록
                </button>
            </div>
        </div>
    );
};

export default AddComponent;
