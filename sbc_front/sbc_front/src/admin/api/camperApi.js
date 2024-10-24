import axios from "axios";

// 서버 주소
export const API_SERVER_HOST = 'http://localhost:8080'


export const prefix = `${API_SERVER_HOST}/admin/campers`

export const getOne = async (cbno) => {
    const res = await axios.get(`${prefix}/${cbno}`)

    return res.data
}

export const getList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/list`, {params: {page:page, size:size}})

    return res.data
}