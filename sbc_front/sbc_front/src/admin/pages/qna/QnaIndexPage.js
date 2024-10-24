import {Outlet, useNavigate} from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import CommunityMenu from "../../components/menus/CommunityMenu";

const QnaIndexPage = () =>{

    return(
        <BasicLayout>
            <div>
            <CommunityMenu/>
            </div>
            <div><h1>문의 게시판</h1></div>
            <div>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default QnaIndexPage;