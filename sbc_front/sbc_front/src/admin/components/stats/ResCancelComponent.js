import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import SearchComponent from "./SearchComponent";
import { fetchCancelStats } from "../../api/statsApi";

const ResCancelComponent = () => {
    const [cancelStats, setCancelStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({
        dateType: 'day',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        siteId: null
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', { 
            style: 'currency', 
            currency: 'KRW', 
            maximumFractionDigits: 0 
        }).format(amount).replace('₩', '') + '원';
    };

    const onSearch = async (newSearchParams) => {
        setSearchParams(newSearchParams);
        setLoading(true);
        try {
            const data = await fetchCancelStats(newSearchParams);
            setCancelStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        onSearch(searchParams);
    }, []);

    const renderTableContent = () => {
        if (loading) return <tr><td colSpan="3">Loading...</td></tr>;
        if (error) return <tr><td colSpan="3">Error: {error}</td></tr>;
        if (!cancelStats || !cancelStats.stats || cancelStats.stats.length === 0) {
            return <tr><td colSpan="3">해당 기간에 데이터가 존재하지 않습니다.</td></tr>;
        }
        
        let totalCancelCount = 0;
        let totalCancelAmount = 0;

        // 먼저 합계를 계산합니다
        cancelStats.stats.forEach(stat => {
            totalCancelCount += stat.cancelCount;
            totalCancelAmount += stat.cancelAmount;
        });

        // 합계 행을 먼저 생성합니다
        const rows = [
            <tr key="total" style={{fontWeight: 'bold'}}>
                <td>합계</td>
                <td>{totalCancelCount}</td>
                <td>{formatCurrency(totalCancelAmount)}</td>
            </tr>
        ];

        // 그 다음 데이터 행들을 추가합니다
        cancelStats.stats.forEach((stat, index) => {
            let displayDate = stat.resCancelDate;
            if (searchParams.dateType === 'year') {
                displayDate = displayDate.substring(0, 7);
            }
            rows.push(
                <tr key={index + 1}>  
                    <td>{displayDate}</td>
                    <td>{stat.cancelCount}</td>
                    <td>{formatCurrency(stat.cancelAmount)}</td>
                </tr>
            );
        });

        return rows;
    };

    return (
        <>
            <SearchComponent onSearch={onSearch}/>
            <hr/>
            <Table bordered>
                <thead>
                    <tr>
                        <th>예약 취소 날짜</th>
                        <th>취소건수</th>
                        <th>취소 금액</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableContent()}
                </tbody>
            </Table>
        </>
    );
};

export default ResCancelComponent;
