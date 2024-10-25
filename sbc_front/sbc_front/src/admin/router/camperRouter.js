import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const Loading = <Spinner animation="border"/>
const CamperList = lazy(()=> import("../components/camper/ListComponent"))
const CamperRead = lazy(()=> import("../components/camper/ReadComponent"))
const CamperAdd = lazy(() => import("../components/camper/AddComponent"))
const CamperModify = lazy(()=>import("../components/camper/ModifyComponent"))

const camperRouter = () => {
    return[
        {
            path: "",
            element : <Navigate replace to="list"/>
        },
        {
            path: "list",
            element : <Suspense fallback={Loading}><CamperList/></Suspense>,

        },
        {
            path: "add",
            element: <Suspense fallback={Loading}><CamperAdd/></Suspense>
        },
        {
            path: "read/:cbID",
            element: <Suspense fallback={Loading}><CamperRead/></Suspense>
        },
        {
            path: "modify/:cbID",
            element: <Suspense fallback={Loading}><CamperModify/></Suspense>
        }
    ]
}

export default camperRouter;