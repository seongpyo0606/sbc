import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HowToComePage = () => {
    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 표시할 div
        const options = {
            center: new window.kakao.maps.LatLng(37.4596073613407, 126.860634891294), // 중심 좌표
            level: 3, // 확대 레벨
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(container, options);

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(37.4596073613407, 126.860634891294); // 마커 위치
        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
        });

        // 마커를 지도에 표시
        marker.setMap(map);
    }, []);

    return (
        <Container fluid className="p-4">
            <Row className="mb-4">
                <Col>
                    <h2>찾아오시는 길</h2>
                    <hr />
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Card className="text-center">
                        <Card.Body>
                            <div id="map" style={{ width: '100%', height: '400px' }} />
                            <ul className="list-unstyled mt-3">
                                <li>
                                    <h4>Suspension Bridge 캠핑장</h4>
                                </li>
                                <li>
                                    <i className="bi bi-geo-alt-fill" /> 주소: 경기 광명시 밤일안로42번길 69 (하안동)
                                </li>
                                <li>
                                    <i className="bi bi-house-door-fill" /> Tel: 031-1111-7777 &nbsp;
                                    <i className="bi bi-telephone-fill" /> 010-3113-13315 ㅣ 상담시간: 09:00 ~ 18:00
                                </li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>대중교통 안내</h3>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>
                                <i className="bi bi-train-front" /> 지하철 1호선 <span>+</span> <i className="bi bi-bus-front" /> 버스
                            </Card.Title>
                            <Card.Text>
                                1. 지하철 1호선을 타고 광명역에서 하차합니다.<br />
                                2. 광명역에서 버스 22번 또는 17번을 탑니다.<br />
                                3. 하안3단지 정류장에서 하차합니다.<br />
                                4. 하차 후 도보로 약 5분 정도 걸어오시면 도착합니다.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>
                                <i className="bi bi-train-front" /> 지하철 7호선 <span>+</span> <i className="bi bi-bus-front" /> 버스
                            </Card.Title>
                            <Card.Text>
                                1. 지하철 7호선을 타고 철산역에서 하차합니다.<br />
                                2. 철산역에서 버스 12번 또는 2번을 탑니다.<br />
                                3. 하안3단지 정류장에서 하차합니다.<br />
                                4. 하차 후 도보로 약 5분 정도 걸어오시면 도착합니다.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title><i className="bi bi-bus-front" /> 버스</Card.Title>
                            <Card.Text>
                                1. 서울 시내에서 광명시로 가는 버스 27번을 탑니다.<br />
                                2. 하안4단지 정류장에서 하차합니다.<br />
                                3. 하차 후 도보로 약 7분 정도 걸어오시면 도착합니다.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title><i className="bi bi-car-front" /> 자가용</Card.Title>
                            <Card.Text>
                                내비게이션에 "광명시 밤일안로 42번길 69"를 입력하시고 와주세요.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HowToComePage;
