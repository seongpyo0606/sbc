import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const Loading = <Spinner animation="border"/>
const QnaList = lazy(()=> import("../components/qna/ListComponent"))
const QnaRead = lazy(()=> import("../components/qna/ReadComponent"))
const QnaAdd = lazy(() => import("../components/qna/AddComponent"))
const QnaModify = lazy(()=>import("../components/qna/ModifyComponent"))

const qnaRouter = () => {
    return[
        {
            path: "",
            element : <Navigate replace to="list"/>
        },
        {
            path: "list",
            element : <Suspense fallback={Loading}><QnaList/></Suspense>,

        },
        {
            path: "add",
            element: <Suspense fallback={Loading}><QnaAdd/></Suspense>
        },
        {
            path: "read/:qbID",
            element: <Suspense fallback={Loading}><QnaRead/></Suspense> 
        },
        {
            path: "modify/:qbID",
            element: <Suspense fallback={Loading}><QnaModify/></Suspense> 
        }
    ]
}

export default qnaRouter;