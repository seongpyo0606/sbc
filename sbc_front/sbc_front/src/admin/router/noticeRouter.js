import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";
//공지사항페이지 경로를 세부 설정해주는 noticeRouter
const Loading = <div>Loading...</div>;
const NoticeRead = lazy(() => import("../pages/notice/ReadPage"))
const NoticeList = lazy(() => import("../pages/notice/ListPage"));
const NoticeModify = lazy(() => import("../pages/notice/ModifyPage"));
const NoticeAdd = lazy(() => import("../pages/notice/AddPage"));
const noticeRouter=()=>{
    return [
        { //공지사항 내용 페이지 라우팅  :nid를 넣음으로 브라우저에서 특정한 번호를 조회하는데 사용함
            path: "read/:nid",
            element: <Suspense fallback={Loading}><NoticeRead/></Suspense>
        },
        { //공지사항 목록 페이지 라우팅
            path: "list",
            element: <Suspense fallback={Loading}><NoticeList/></Suspense>
        },
        {//list로 리다이렉션
            path: "",
            element: <Navigate replace to="list"/>

        },
        { //공지사항  수정 페이지 라우팅
            path: "update/:nid",
            element: <Suspense fallback={Loading}><NoticeModify/></Suspense>
        },
        { //공지사항  작성 페이지 라우팅
            path: "add",
            element: <Suspense fallback={Loading}><NoticeAdd/></Suspense>
        }
]
}
export default noticeRouter