import AddComponent from "../../components/campers/AddComponent";
import useCustomLogin from "../../hooks/useCustomLogin";

const AddPage = () => {

    // 로그인 여부 확인
    const {isLogin, moveToLoginReturn} = useCustomLogin()
    if(!isLogin){
        alert('회원만 이용할 수 있습니다.')
        return moveToLoginReturn()
    }

    return (
        <div className="container p-4">
            <div className="text-center mb-4">
                <h1 className="display-4 font-weight-bold">
                    Camper 게시판 글쓰기
                </h1>
            </div>
            <AddComponent />
        </div>
    );
}

export default AddPage;
