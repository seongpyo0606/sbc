import {useState} from "react";
import { Button } from 'react-bootstrap';

function MemberSearchComponent({onSearch}) {
    const [type, setType] = useState('name');
    const [keyword, setKeyword] = useState('');
    const [placeholder, setPlaceholder] = useState('회원명을 입력하세요');

    const handleTypeChange = (event) => {
        const selectedType = event.target.value;

        setType(selectedType);

        switch (selectedType) {
            case 'name':
                setPlaceholder('회원명을 입력하세요');
                break;
            case 'phone':
                setPlaceholder('핸드폰 번호의 뒤 4자리를 입력하세요');
                break;
            case 'email':
                setPlaceholder('이메일을 입력하세요');
                break;
            default:
                setPlaceholder('');
        }
    };

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
            <option value="name">회원명</option>
            <option value="phone">핸드폰</option>
            <option value="email">이메일</option>
        </select>
    <input id="keyword" name="keyword" type="text" placeholder={placeholder} value={keyword}
           onChange={(e) => setKeyword(e.target.value)}
           onKeyDown={handleKeyDown}/>
    <Button onClick={handleSearch}>조회</Button>
    </div>
            {/*시간이 허락한다면 정렬 기능 구현하겠음*/}
    {/*        <div>*/ }
    {/*<select id="order" name="order" onChange={handleOrderChange}>*/}
    {/*        <option value="memberID">회원번호</option>*/}
    {/*        <option value="memberName">회원명</option>*/}
    {/*        <option value="-memberRegDate">최근 가입일</option>*/}
    {/*        <option value="memberRegDate">최초 가입일</option>*/}
    {/*    </select> */}
    {/*</div>*/}
    </>
    );
}

export default MemberSearchComponent;



