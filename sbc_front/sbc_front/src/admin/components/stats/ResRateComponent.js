import SearchComponent from "./SearchComponent";

const ResRateComponent = () => {
    const wrapperStyle = {
        width: '100%',
        height: '400px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    return (
        <>
            <SearchComponent/>
            <hr/>
            <div className={"graphWrapper"} style={wrapperStyle} >
                예약률 graph
            </div>
            <h3>목록 (총 00건)</h3>
            <div className={"listWrapper"} style={wrapperStyle} >
                <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc'}}>
                    <thead>
                    <tr>
                        <th rowSpan={2}>날짜</th>
                        <th colSpan={2}>실매출</th>
                        <th colSpan={2}>이용완료</th>
                        <th colSpan={2}>이용예정</th>
                    </tr>
                    <tr>
                        <th>예약건수</th>
                        <th>금액</th>
                        <th>예약건수</th>
                        <th>금액</th>
                        <th>예약건수</th>
                        <th>금액</th>
                    </tr>
                    <tr>
                        <th>합계</th>
                        <th>20</th>
                        <th>100,000,000원</th>
                        <th>10</th>
                        <th>50,000,000원</th>
                        <th>10</th>
                        <th>50,000,000원</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>2023.10.10</td>
                        <td>0</td>
                        <td>0원</td>
                        <td>0</td>
                        <td>0원</td>
                        <td>0</td>
                        <td>0원</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ResRateComponent;