import { Navigate } from "react-router-dom";

const NoticeRouter = () => {
    return[
        {
            path: "*",
            element : <Navigate replace to="notice"/>
        },
    ]
}

export default NoticeRouter;