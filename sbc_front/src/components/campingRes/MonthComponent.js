import React, {useEffect, useState} from 'react';
import {Button, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import "../../pages/reservation/css/RealTimeResPage.css"
import {getSiteList} from "../../api/ResApi";
import {useSelector} from "react-redux";

// td 태그를 재사용 하고싶은데 어케할까? 흠....

const MonthComponent = () => {

    const initState = {};

    for (let i = 0; i < 10; i++) {
        initState[i]  = {
            siteID: 0,
            siteName: ''
        }
    }

    const [site, setSite] = useState(initState);

    const today = new Date();

    // 날짜 비교 변수
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const [calendar, setCalendar] = useState([])
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [direction, setDirection] = useState(null); // 방향 상태 추가

    const loginState = useSelector((state) => state.loginSlice)

    // 달력 만드는 함수 (테스트)
    // 요일
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const monthsToAdd = 2;
    const monthSum = (currentMonth + monthsToAdd - 1) % 12 + 1;

    useEffect(() => {
        getSiteList().then(data => {
            console.log(data)
            setSite(data)
        })
    }, []);

    const handleClick = (dir) => {
        setDirection(dir); // 클릭한 방향을 상태에 저장
    };

    // 다음달 , 이전달 버튼 > year , month 상태 바로 반영
    useEffect(() => {
        if (direction) { // direction 이 null 이 아닐 때만 실행
            let newYear = year;
            let newMonth = month;

            if (direction === "prev") {
                newMonth -= 1;
                if (newMonth < 1) {
                    newMonth = 12;
                    newYear -= 1;
                }
            } else if (direction === "next") {
                newMonth += 1;
                if (newMonth > 12) {
                    newMonth = 1;
                    newYear += 1;
                }
            }

            setYear(newYear);
            setMonth(newMonth);

            setDirection(null); // direction 상태 초기화
        }
    }, [direction, year, month]);

    // 날짜 비교 : 현재 날짜보다 과거인지 확인
    const isPastDate = (setYear, setMonth, setDay) => {
        if (setYear < currentYear) return true;
        if (setYear === currentYear && setMonth < currentMonth) return true;
        if (setYear === currentYear && setMonth === currentMonth && setDay < currentDay) return true;

        return false;
    }

    // 주어진 년도와 월에 따라 달력 데이터를 생성하는 함수
    const generateCalendar = (year, month) => {
        const firstDay = new Date(year, month - 1, 1).getDay(); // 첫 날의 요일
        const firstMonth = new Date(year, month, 0).getDate(); // 해당 월의 총 일수

        const weeks = [];
        let date = 1;

        for (let i = 0; i < 5; i++) { // 최대 6주
            const week = [];

            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    week.push({day: '', month: month, year: year}); // 첫 주의 공백 부분
                } else if (date > firstMonth) {
                    week.push({day: '', month: month, year: year}) // 마지막 주 빈 공간
                } else {
                    week.push({day: date, month: month, year: year});
                    date++;
                }
            }
            weeks.push(week);
        }

        return weeks;
    };

    // 다음달 year , month 상태 바로 반영
    useEffect(() => {
        const weeks = generateCalendar(year, month);

        // 마지막 주에서 빈 공간을 다음 달 날짜로 채우기
        const lastWeek = weeks[weeks.length - 1];
        const emptySpacesCount = lastWeek.filter(day => day.day === '').length;

        // 빈 칸의 수가 0보다 클 경우, 다음 달 날짜를 추가
        if (emptySpacesCount > 0) {
            // 빈 공간에 날짜를 순서대로 채우기
            let nextYear = year;
            let nextDate = 1; // 다음 달 날짜 시작
            let nextMonth = month + 1; // 다음 달 초기화

            if (nextMonth > 12) {
                nextMonth = 1; // 12월을 넘기면 1월로
                nextYear = nextYear + 1;
                console.log(nextYear)
            }

            // 빈 칸에 다음 달 날짜 채우기
            for (let i = 0; i < lastWeek.length; i++) {
                if (lastWeek[i].day === '') {
                    lastWeek[i] = {day: nextDate, month: nextMonth, year: nextYear}; // 빈 공간에 다음 달 날짜와 월 저장
                    nextDate++;
                }
            }
        }

        setCalendar(weeks);

    }, [year, month]);

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "40px",
                }}
            >
                {(year !== currentYear || currentMonth !== month) && (
                    <Button
                        variant="success"
                        className="move"
                        onClick={() => handleClick("prev")}
                    >
                        이전달
                    </Button>
                )}

                <h3 style={{display: "inline", margin: "0 30px"}}>
                    <b>
                        {year}.{month < 10 ? `0${month}` : month}
                    </b>
                </h3>

                {((year < currentYear && year !== currentYear) || month !== monthSum) && (
                    <Button
                        variant="success"
                        className="move"
                        onClick={() => handleClick("next")}
                    >
                        다음달
                    </Button>
                )}
            </div>

            <Table responsive bordered>
                <thead>
                <tr>
                    {daysOfWeek.map((day) => (
                        <th key={day}>{day}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {calendar.map((week, i) => (
                    <tr key={i}>
                        {week.map((dayInfo, j) => {
                            const isPast = isPastDate(dayInfo.year, dayInfo.month, dayInfo.day);

                            const currentDate = new Date(year, month - 1, dayInfo.day);
                            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

                            if (dayInfo.day) {
                                return (
                                    <td key={j} style={{
                                        backgroundColor: isPast ? "lightgray" : "white"
                                    }}>
                                        <div>
                                            {dayInfo.month > month || dayInfo.year > year
                                                ? `${dayInfo.month}/${dayInfo.day}`
                                                : dayInfo.day /* 빈 공간일 경우 월/일 형식으로 표시 */
                                            }
                                        </div>
                                        {isPast
                                            ? (
                                                "예약 불가"
                                            ) : (
                                                <>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[0].siteId,
                                                            siteName: site[0].siteName,
                                                        }}
                                                    >
                                                        {site[0].siteName}
                                                    </Link>

                                                    <br/>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[1].siteId,
                                                            siteName: site[1].siteName,
                                                            price: isWeekend ? 80000 : 40000,
                                                        }}
                                                    >
                                                        {site[1].siteName}
                                                    </Link>

                                                    <br/>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[2].siteId,
                                                            siteName: site[2].siteName,
                                                            price: isWeekend ? 80000 : 40000,
                                                        }}
                                                    >
                                                        {site[2].siteName}
                                                    </Link>

                                                    <br/>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[3].siteId,
                                                            siteName: site[3].siteName,
                                                            price: isWeekend ? 80000 : 40000,
                                                        }}
                                                    >
                                                        {site[3].siteName}
                                                    </Link>

                                                    <br/>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[4].siteId,
                                                            siteName: site[4].siteName,
                                                            price: isWeekend ? 80000 : 40000,
                                                        }}
                                                    >
                                                        {site[4].siteName}
                                                    </Link>

                                                    <br/>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[5].siteId,
                                                            siteName: site[5].siteName,
                                                            price: isWeekend ? 80000 : 40000,
                                                        }}
                                                    >
                                                        {site[5].siteName}
                                                    </Link>

                                                    <br/>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[6].siteId,
                                                            siteName: site[6].siteName,
                                                            price: isWeekend ? 80000 : 40000,
                                                        }}
                                                    >
                                                        {site[6].siteName}
                                                    </Link>

                                                    <br/>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[7].siteId,
                                                            siteName: site[7].siteName,
                                                            price: isWeekend ? 80000 : 40000,
                                                        }}
                                                    >
                                                        {site[7].siteName}
                                                    </Link>

                                                    <br/>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[8].siteId,
                                                            siteName: site[8].siteName,
                                                            price: isWeekend ? 80000 : 40000,
                                                        }}
                                                    >
                                                        {site[8].siteName}
                                                    </Link>

                                                    <br/>
                                                    <Link
                                                        to={`/res/respage`}
                                                        state={{
                                                            year: dayInfo.year,
                                                            month: dayInfo.month,
                                                            day: dayInfo.day,
                                                            memberId: loginState.member.memberId,
                                                            memberName: loginState.member.memberName,
                                                            memberPhone: loginState.member.memberPhone,
                                                            memberEmail: loginState.member.memberEmail,
                                                            siteId: site[9].siteId,
                                                            siteName: site[9].siteName,
                                                            price: isWeekend ? 80000 : 40000,
                                                        }}
                                                    >
                                                        {site[9].siteName}
                                                    </Link>
                                                </>
                                            )}
                                    </td>
                                );
                            } else {
                                // 공백일경우
                                return <td key={j} style={{
                                    backgroundColor: "lightgray"
                                }}></td>
                            }
                        })}
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default MonthComponent;