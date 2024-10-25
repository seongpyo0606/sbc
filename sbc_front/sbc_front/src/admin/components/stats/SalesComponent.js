import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import SearchComponent from "./SearchComponent";

const SalesComponent = ({ salesStats, loading, error, dateType, selectedYear, selectedMonth, onSearch }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', { 
            style: 'currency', 
            currency: 'KRW', 
            maximumFractionDigits: 0 
        }).format(amount).replace('₩', '') + '원';
    };

    const formatDate = (year, month, day) => {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const renderTableContent = () => {
        if (loading) return <tr><td colSpan="7">Loading...</td></tr>;
        if (error) return <tr><td colSpan="7">Error: {error}</td></tr>;
        if (!salesStats || !salesStats.stats || salesStats.stats.length === 0) {
            return <tr><td colSpan="7">해당 기간에 데이터가 존재하지 않습니다.</td></tr>;
        }

        const totalStats = salesStats.totalStats || {};
        
        const renderRows = () => {
            if (dateType === 'year') {
                return salesStats.stats.map((stat, index) => {
                    const monthStr = `${selectedYear}-${String(index + 1).padStart(2, '0')}`;
                    return (
                        <tr key={monthStr}>
                            <td>{monthStr}</td>
                            <td>{stat.completedCount + stat.scheduledCount}</td>
                            <td>{formatCurrency(stat.completedAmount + stat.scheduledAmount)}</td>
                            <td>{stat.completedCount}</td>
                            <td>{formatCurrency(stat.completedAmount)}</td>
                            <td>{stat.scheduledCount}</td>
                            <td>{formatCurrency(stat.scheduledAmount)}</td>
                        </tr>
                    );
                });
            } else if (dateType === 'month') {
                const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
                return Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateStr = formatDate(selectedYear, selectedMonth, day);
                    const stat = salesStats.stats.find(s => s.resDate === dateStr) || {
                        completedCount: 0, completedAmount: 0,
                        scheduledCount: 0, scheduledAmount: 0
                    };
                    return (
                        <tr key={dateStr}>
                            <td>{dateStr}</td>
                            <td>{stat.completedCount + stat.scheduledCount}</td>
                            <td>{formatCurrency(stat.completedAmount + stat.scheduledAmount)}</td>
                            <td>{stat.completedCount}</td>
                            <td>{formatCurrency(stat.completedAmount)}</td>
                            <td>{stat.scheduledCount}</td>
                            <td>{formatCurrency(stat.scheduledAmount)}</td>
                        </tr>
                    );
                });
            } else if (dateType === 'day') {
                // 일간 조회 코드 추가
                return salesStats.stats
                    .filter(stat => stat.completedCount > 0 || stat.scheduledCount > 0 || 
                                    stat.completedAmount > 0 || stat.scheduledAmount > 0)
                    .map(stat => {
                        const dateStr = stat.resDate; // 이미 'YYYY-MM-DD' 형식으로 가정
                        return (
                            <tr key={dateStr}>
                                <td>{dateStr}</td>
                                <td>{stat.completedCount + stat.scheduledCount}</td>
                                <td>{formatCurrency(stat.completedAmount + stat.scheduledAmount)}</td>
                                <td>{stat.completedCount}</td>
                                <td>{formatCurrency(stat.completedAmount)}</td>
                                <td>{stat.scheduledCount}</td>
                                <td>{formatCurrency(stat.scheduledAmount)}</td>
                            </tr>
                        );
                    });
            }
        };

        return (
            <>
                <tr style={{ fontWeight: 'bold' }}>
                    <td>합계</td>
                    <td>{totalStats.totalCompletedCount + totalStats.totalScheduledCount}</td>
                    <td>{formatCurrency(totalStats.totalCompletedAmount + totalStats.totalScheduledAmount)}</td>
                    <td>{totalStats.totalCompletedCount}</td>
                    <td>{formatCurrency(totalStats.totalCompletedAmount)}</td>
                    <td>{totalStats.totalScheduledCount}</td>
                    <td>{formatCurrency(totalStats.totalScheduledAmount)}</td>
                </tr>
                {renderRows()}
            </>
        );
    };

    return (
        <>
            <SearchComponent onSearch={onSearch} />
            <hr/>
            <Table bordered>
                <thead>
                <tr>
                    <th rowSpan="2">날짜</th>
                    <th colSpan="2">실매출</th>
                    <th colSpan="2">이용완료</th>
                    <th colSpan="2">이용예정</th>
                </tr>
                <tr>
                    <th>예약건수</th>
                    <th>금액</th>
                    <th>예약건수</th>
                    <th>금액</th>
                    <th>예약건수</th>
                    <th>금액</th>
                </tr>
                </thead>
                <tbody>
                {renderTableContent()}
                </tbody>
            </Table>
        </>
    );
};

export default SalesComponent;
