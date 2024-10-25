import { useEffect, useState } from "react"
import { getOne } from "../../api/camperApi"

const initState = {
    cbno:0,
    title:'',
    category:'',
    views:0,
    writer:'',
    date:null,
    commCount : null
}


const ReadComponent = ({cbno}) => {

    const [camper, setCamper] = useState(initState)

    useEffect(() => {
        getOne(cbno).then(data => {
            console.log(data) 
            setCamper(data)
            
        })
    }, [cbno])

    // memberId -> 작성자 이름 나오게 수정해야함 ( 그리고 다시 레이아웃 생각해야 함 ㅋ 게시판 상세페이지처럼)
    return (
        <div>
            {makeDiv('번호', camper.cboardID)}
            {makeDiv('제목', `[${camper.cboardCategory}] ${camper.cboardTitle} [${camper.commCount}]`)}
            {makeDiv('작성자', camper.memberId)} 
            {makeDiv('조회수', camper.cboardViews)}

        </div>
    )
}

const makeDiv = (title, value) => 
    <div>
        <div style={{backgroundColor
                :'yellow'
            }}>
            <div>{title}</div>
            <div>{value}</div>
        </div>
    </div>

export default ReadComponent