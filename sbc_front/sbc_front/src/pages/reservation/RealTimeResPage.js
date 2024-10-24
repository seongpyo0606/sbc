import React, {useState} from "react";
import campingImg from "../../images/campingimg.png"
import MonthComponent from "../../components/campingRes/MonthComponent";
import useCustomLogin from "../../hooks/useCustomLogin";

const RealTimeResPage = () => {

    // 로그인 여부 확인
    const {isLogin, moveToLoginReturn} = useCustomLogin()
    if (!isLogin) {
        return moveToLoginReturn()
    }

    return (
        <div>
            <div style={{marginBottom: "20px"}}><h3>구역지도</h3></div>
            <div style={{
                marginBottom: "30px"
            }}>
                <img style={{}} src={campingImg} alt="안나와 왜"/>
            </div>

            <div>
                <MonthComponent></MonthComponent>
            </div>
        </div>
    );
};

export default RealTimeResPage;
