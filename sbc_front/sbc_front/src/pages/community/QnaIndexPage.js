import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import CommunityMenu from "../../layouts/CommunityMenu";
import ListComponent from "../../admin/components/qna/ListComponent";

const QnaIndexPage = () =>{
    return(
        <BasicLayout>
            <CommunityMenu/>
            <div>
                <div>
                    <br></br>
                    <h3>이거 테스트로 List Component만 따와서 넣은거라서</h3>
                    <h3>글 클릭하면 admin 게시판으로 넘어감</h3>
                    <br></br>
                </div>
                <div> <ListComponent/> </div>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default QnaIndexPage;