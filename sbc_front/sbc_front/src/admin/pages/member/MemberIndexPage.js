import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import MemberMenu from "../../components/menus/MemberMenu";

const MemberIndexPage = () =>{
    return(
        <BasicLayout>
            <div>
            <MemberMenu/>
            </div>
            <div>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default MemberIndexPage;