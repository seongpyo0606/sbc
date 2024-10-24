// 조회기간 기능 구현
// 1. 일간을 선택했을 때 최대 90일까지만 검색 (ok)
// 2. 월간, 연간을 선택했을때 input 변경 (ok)


import React, { useState } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap';

const DateSearchComponent = ({ onSearch }) => {
    const [dateType, setDateType] = useState('day');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleDateTypeChange = (event) => {
        setDateType(event.target.value);
        setStartDate('');
        setEndDate('');
    };

    const handleSearch = () => {
        onSearch({ dateType, startDate, endDate });
    };

    return (
        <Form>
            <Row className="align-items-center">
                <Col xs="auto">
                    <Form.Select value={dateType} onChange={handleDateTypeChange}>
                        <option value="day">일간</option>
                        <option value="month">월간</option>
                        <option value="year">연간</option>
                    </Form.Select>
                </Col>
                <Col xs="auto">
                    {dateType === 'day' && (
                        <>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </>
                    )}
                    {dateType === 'month' && (
                        <Form.Control
                            type="month"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    )}
                    {dateType === 'year' && (
                        <Form.Control
                            type="number"
                            placeholder="YYYY"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={new Date().getFullYear() - 2}
                            max={new Date().getFullYear()}
                        />
                    )}
                </Col>
                {dateType === 'day' && (
                    <>
                        <Col xs="auto">~</Col>
                        <Col xs="auto">
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                            />
                        </Col>
                    </>
                )}
                <Col xs="auto">
                    <Button onClick={handleSearch}>조회</Button>
                </Col>
            </Row>
        </Form>
    );
};

export default DateSearchComponent;
