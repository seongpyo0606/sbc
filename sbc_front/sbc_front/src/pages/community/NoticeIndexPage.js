import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import CommunityMenu from "../../layouts/CommunityMenu";
import ListComponent from "../../admin/components/notice/ListComponent";

const NoticeIndexPage = () =>{
    return(
        <BasicLayout>
            <CommunityMenu/>
            <div>
                <div> <ListComponent/> </div>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default NoticeIndexPage;