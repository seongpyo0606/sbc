import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SearchComponent from "./SearchComponent";
import { fetchCustomerStats } from '../../api/statsApi';  // 새로운 API 호출 함수 불러오기

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CustomerComponent = () => {
    const [genderData, setGenderData] = useState([]);
    const [ageData, setAgeData] = useState([]);
    const [localData, setLocalData] = useState([]);
    const [totalReservationStats, setTotalReservationStats] = useState({ totalReservations: 0, averageReservationsPerDay: 0 });
    const [rebookingRate, setRebookingRate] = useState(0);
    const [mostFrequentReservationCustomer, setMostFrequentReservationCustomer] = useState(null);
    const [mostFrequentCancellationCustomer, setMostFrequentCancellationCustomer] = useState(null);
    const [startDate, setStartDate] = useState('2024-10-01');
    const [endDate, setEndDate] = useState('2024-10-31');
    const [siteId, setSiteId] = useState(null); // null을 기본 값으로 설정
    const [dateType, setDateType] = useState('month');

    const handleSearch = (searchParams) => {
        console.log('Search params received:', searchParams);
        const { dateType, startDate, endDate, siteId } = searchParams;

        // 상태 업데이트
        setDateType(dateType);
        setStartDate(startDate);
        setEndDate(endDate);
        setSiteId(siteId ? parseInt(siteId) : null); // siteId가 빈 문자열인 경우 null 처리

        // 정확한 파라미터로 API 호출
        fetchCustomerStats(startDate, endDate, dateType, siteId ? parseInt(siteId) : null)
            .then((data) => {
                // 성별 데이터 처리
                if (data.genderStats) {
                    const genderArray = Object.entries(data.genderStats).map(([key, value]) => ({
                        name: key,
                        value: value
                    }));
                    setGenderData(genderArray);
                }

                // 연령대 데이터 처리
                if (data.ageStats) {
                    const ageArray = Object.entries(data.ageStats).map(([key, value]) => ({
                        name: key,
                        value: value
                    }));
                    setAgeData(ageArray);
                }

                // 지역별 데이터 처리
                if (data.localStats) {
                    const localArray = Object.entries(data.localStats).map(([key, value]) => ({
                        name: key,
                        value: value
                    }));
                    setLocalData(localArray);
                }

                // 누적 예약 통계
                if (data.totalReservationStats) {
                    setTotalReservationStats(data.totalReservationStats);
                }

                // 재예약 고객 비율
                if (data.rebookingRate !== undefined) {
                    setRebookingRate(data.rebookingRate);
                }

                // 최다 예약 고객
                if (data.mostFrequentReservationCustomer) {
                    setMostFrequentReservationCustomer(data.mostFrequentReservationCustomer);
                }

                // 최다 취소 고객
                if (data.mostFrequentCancellationCustomer) {
                    setMostFrequentCancellationCustomer(data.mostFrequentCancellationCustomer);
                }
            })
            .catch((error) => {
                console.error('Error fetching customer stats:', error);
            });
    };

    useEffect(() => {
        // 컴포넌트가 마운트 될 때 API 호출
        fetchCustomerStats(startDate, endDate, dateType, siteId ? parseInt(siteId) : null)
            .then((data) => {
                // 성별 데이터 처리
                if (data.genderStats) {
                    const genderArray = Object.entries(data.genderStats).map(([key, value]) => ({
                        name: key,
                        value: value
                    }));
                    setGenderData(genderArray);
                }

                // 연령대 데이터 처리
                if (data.ageStats) {
                    const ageArray = Object.entries(data.ageStats).map(([key, value]) => ({
                        name: key,
                        value: value
                    }));
                    setAgeData(ageArray);
                }

                // 지역별 데이터 처리
                if (data.localStats) {
                    const localArray = Object.entries(data.localStats).map(([key, value]) => ({
                        name: key,
                        value: value
                    }));
                    setLocalData(localArray);
                }

                // 누적 예약 통계
                if (data.totalReservationStats) {
                    setTotalReservationStats(data.totalReservationStats);
                }

                // 재예약 고객 비율
                if (data.rebookingRate !== undefined) {
                    setRebookingRate(data.rebookingRate);
                }

                // 최다 예약 고객
                if (data.mostFrequentReservationCustomer) {
                    setMostFrequentReservationCustomer(data.mostFrequentReservationCustomer);
                }

                // 최다 취소 고객
                if (data.mostFrequentCancellationCustomer) {
                    setMostFrequentCancellationCustomer(data.mostFrequentCancellationCustomer);
                }
            })
            .catch((error) => {
                console.error('Error fetching customer stats on mount:', error);
            });
    }, [startDate, endDate, dateType, siteId]); // 모든 의존성 추가

    const wrapperStyle = {
        width: '100%',
        height: '400px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    return (
        <>
            {/* 검색 컴포넌트 */}
            <SearchComponent onSearch={handleSearch} />

            {/* 성별 비중 */}
            <div className={"genderAge"} style={wrapperStyle}>
                <h4>성별 비중</h4>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={genderData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 연령별 비중 */}
            <div className={"age"} style={wrapperStyle}>
                <h4>연령별 비중</h4>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={ageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 지역별 비중 */}
            <div className={"local"} style={wrapperStyle}>
                <h4>지역별 비중</h4>
                <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                        <Pie
                            data={localData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {localData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* 누적 예약 고객 분석 */}
            <div className={"analyse"} style={wrapperStyle}>
                <h4>누적 예약 고객 분석</h4>
                <fieldset>
                    <legend>총 누적 예약 고객수</legend>
                    <p>{totalReservationStats.totalReservations} (일 평균 예약 고객수: {totalReservationStats.averageReservationsPerDay ? totalReservationStats.averageReservationsPerDay.toFixed(2) : 'N/A'})</p>
                </fieldset>
                <fieldset>
                    <legend>재예약 고객 비율</legend>
                    <p>{rebookingRate ? rebookingRate.toFixed(2) : 'N/A'}%</p>
                </fieldset>
            </div>

            {/* 최다 예약/최다 취소 고객 */}
            <div className={"performance"} style={wrapperStyle}>
                <h4>최다 예약/최다 취소 고객</h4>
                <div>
                    <h5>최다 예약 고객</h5>
                    {mostFrequentReservationCustomer ? (
                        <p>고객 ID: {mostFrequentReservationCustomer.customerId}, 예약 횟수: {mostFrequentReservationCustomer.reservationCount}</p>
                    ) : (
                        <p>데이터 없음</p>
                    )}
                </div>
                <div>
                    <h5>최다 취소 고객</h5>
                    {mostFrequentCancellationCustomer ? (
                        <p>고객 ID: {mostFrequentCancellationCustomer.customerId}, 취소 횟수: {mostFrequentCancellationCustomer.cancellationCount}</p>
                    ) : (
                        <p>데이터 없음</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default CustomerComponent;
