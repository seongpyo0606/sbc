import React, {useState} from "react";
import { Button } from 'react-bootstrap';

const BoardSearchComponent = ({onSearch}) => {
    const [type, setType] = useState('title');
    const [keyword, setKeyword] = useState('');

    const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        setType(selectedType);
    }

    const handleSearch = () => {
        onSearch(type, keyword); // 검색 함수 호출
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch(); // 엔터 키 눌렀을 때 검색 실행
        }
    };

    return (
        <>
            <div>
                <select id="type" name="type" value={type} onChange={handleTypeChange}>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                </select>
                <input id="keyword" name="keyword" type="text" placeholder='검색어를 입력해주세요' value={keyword}
                       onChange={(e) => setKeyword(e.target.value)}
                       onKeyDown={handleKeyDown}/>
                <Button onClick={handleSearch}>검색</Button>
            </div>
        </>
    );
}

export default BoardSearchComponent;