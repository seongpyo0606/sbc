// src/admin/pages/notice/AddPage.js

import React from 'react';
import AddComponent from '../../components/notice/AddComponent';
import {handleBackToList} from '../../components/notice/AddComponent' //목록으로 가는 함수
import {Link} from "react-router-dom";


const AddPage = () => {
    return (
        <div>
            <a href={"/admin/notices/list"} style={{textDecoration: 'none', color: 'black'}}>
                <h1>공지사항 게시판</h1>
            </a>


            <AddComponent/>
        </div>
    );
};

export default AddPage;
