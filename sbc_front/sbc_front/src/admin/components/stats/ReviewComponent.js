import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SearchComponent from "./SearchComponent";
import { fetchReviewStats } from "../../api/statsApi";

const ReviewComponent = () => {
    const [reviewData, setReviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchReviewStats(params);
            console.log('Fetched data:', data);
            
            if (data && Array.isArray(data.stats) && data.stats.length > 0) {
                const transformedData = data.stats.map(item => ({
                    date: item.date,
                    clean: item.cleanCount,
                    price: item.priceCount,
                    facility: item.facilityCount,
                    photo: item.photoCount,
                    silence: item.silenceCount,
                    kind: item.kindCount,
                    view: item.viewCount
                }));
                setReviewData(transformedData);
            } else {
                setReviewData([]);
                console.log('No stats data available');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData({
            dateType: 'month',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            siteId: null
        });
    }, []);

    const onSearch = (searchParams) => {
        fetchData(searchParams);
    };

    const renderChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviewData.length > 0 ? reviewData : [{ date: 'No Data' }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clean" fill="#8884d8" name="청결" />
                <Bar dataKey="price" fill="#82ca9d" name="가성비" />
                <Bar dataKey="facility" fill="#ffc658" name="시설" />
                <Bar dataKey="photo" fill="#ff8042" name="사진" />
                <Bar dataKey="silence" fill="#a4de6c" name="조용" />
                <Bar dataKey="kind" fill="#d0ed57" name="친절" />
                <Bar dataKey="view" fill="#8dd1e1" name="풍경" />
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <SearchComponent onSearch={onSearch}/>
            <div>
                <h3>태그별 통계</h3>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    renderChart()
                )}
            </div>
            <div>
                {reviewData.length === 0 && !loading && !error && (
                    <div>No data available</div>
                )}
            </div>
            <div>
                시간이 허락된다면 추가하고 싶은 내용 : 태그별 선호 구역, 태그별 고객분석
            </div>
        </>
    );
}

export default ReviewComponent;
