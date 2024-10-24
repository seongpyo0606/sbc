import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import CommunityMenu from "../../components/menus/CommunityMenu";

const CamperIndexPage = () =>{
    return(
        <BasicLayout>
            <div>
                <CommunityMenu/>
            </div>
            <div><h1>캠퍼 게시판</h1></div>
            <div>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default CamperIndexPage;