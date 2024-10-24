import { Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading . . .</div>

const reviewRouter = () => {
    return[
        {
            path: "*",
            element : <Navigate replace to="notice"/>
        },
    ]
}

export default reviewRouter;