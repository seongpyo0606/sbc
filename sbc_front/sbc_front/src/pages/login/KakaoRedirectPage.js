import {useNavigate, useSearchParams} from "react-router-dom";
import {retry} from "@reduxjs/toolkit/query";
import BasicLayout from "../../layouts/BasicLayout";
import {useEffect} from "react";
import {getKakaoAccessToken, getMemberWithAccessToken} from "../../api/memberApi";

const KakaoRedirectPage = () => {

    const [searchParams] = useSearchParams();
    const authCode = searchParams.get("code");
    const navigate = useNavigate();

    useEffect(() => {
        getKakaoAccessToken(authCode).then(accessToken => {
            console.log(accessToken)
            getMemberWithAccessToken(accessToken).then(data => {
                console.log('kakao : ', data)
                console.log(data[1])
                if(data[2] === null){
                    const memberEmail = data[1];
                    navigate(`/join/input?memberEmail=${memberEmail}`);
                } else{
                    navigate(`/`)
                }
            })
        });
    }, [authCode])

    return (
        <BasicLayout>
            <div>
                Kakao Login Redirect Page
                <div>{authCode}</div>
            </div>
        </BasicLayout>
    );
}

export default KakaoRedirectPage;