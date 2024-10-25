// KakaoMapComponent.js
import React, { useEffect } from 'react';

const KakaoMapComponent = ({ center, level }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=f0d99f88f3921ad9dbe9354faf390998&autoload=false'; // autoload를 false로 설정
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('kakao-map');
                const options = {
                    center: new window.kakao.maps.LatLng(center.lat, center.lng), // 위도 및 경도 설정
                    level: level,
                };
                new window.kakao.maps.Map(container, options); // 지도 생성
            });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
        };
    }, [center, level]); // center와 level이 변경될 때마다 지도 업데이트

    return (
        <div id="kakao-map" style={{ width: '100%', height: '300px', backgroundColor: '#f8f9fa' }} />
    );
};

export default KakaoMapComponent;
