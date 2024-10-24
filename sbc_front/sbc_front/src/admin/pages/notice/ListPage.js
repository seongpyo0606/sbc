
import React from 'react';
import ListComponent from '../../components/notice/ListComponent';

const ListPage = () => {
    return (
        <div>
            <a href={"/admin/notices/list"} style={{textDecoration: 'none', color: 'black'}}>
                <h1>공지사항 게시판</h1>
            </a>
            <ListComponent/>
        </div>
    );
};

export default ListPage;
