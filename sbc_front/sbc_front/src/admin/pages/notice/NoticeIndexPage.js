import React from 'react';
import {useCallback} from "react";
import BasicLayout from "../../layouts/BasicLayout";
import {Outlet} from 'react-router-dom';

import CommunityMenu from "../../components/menus/CommunityMenu";

const NoticeIndexPage = () =>{
    return(
        <BasicLayout>
            <CommunityMenu/>
            <div>
                    {/* 자식 라우트의 컴포넌트가 여기에 렌더링됩니다 */}
                    {/*아웃렛은 컴포넌트를 넣기위해 미리 만들어놓은 빈 공간 같은 곳이라고 생각하면 된다*/}
                    <Outlet/>

            </div>
        </BasicLayout>
    );
};

export default NoticeIndexPage;