import React, { useState, useEffect } from "react";
import SalesComponent from "../../components/stats/SalesComponent";
import ResRateComponent from "../../components/stats/ResRateComponent";
import ResCancelComponent from "../../components/stats/ResCancelComponent";
import { Tab, Tabs } from "react-bootstrap";
import { fetchSalesStats } from "../../api/statsApi"; // API 호출 함수를 import 해야 합니다.


const ReservationSalesPage = () => {
    const [salesStats, setSalesStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateType, setDateType] = useState('day');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    
    const handleSearch = async (searchParams) => {
        setLoading(true);
        try {
            const data = await fetchSalesStats(searchParams);
            setSalesStats(data);
            setDateType(searchParams.dateType);
            setError(null);
        } catch (err) {
            console.error('데이터를 불러오는 데 실패했습니다:', err);
            setError('데이터를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 초기 데이터 로드
        handleSearch({ dateType: 'day', startDate: new Date().toISOString().split('T')[0] });
    }, []);

    return (
        <>
            <h1>예약 매출 통계</h1>
            <nav>
                <Tabs
                    defaultActiveKey="sales"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="sales" title="매출 현황">
                    <SalesComponent 
            salesStats={salesStats}
            loading={loading}
            error={error}
            dateType={dateType}
            selectedStartDate={startDate}
            selectedEndDate={endDate}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onSearch={handleSearch}
        />
                    </Tab>
                    <Tab eventKey="rate" title="예약률 현황">
                        <ResRateComponent />
                    </Tab>
                    <Tab eventKey="cancel" title="예약취소 현황">
                        <ResCancelComponent />
                    </Tab>
                </Tabs>
            </nav>
        </>
    );
}

export default ReservationSalesPage;
