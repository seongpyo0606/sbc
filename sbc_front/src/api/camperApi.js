import axios from "axios";
import { getCookie } from "../util/cookieUtil";
//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";

export const prefix = `${API_SERVER_HOST}/api/campers`;

//상세페이지
export const getOne = async (cBoardId) => {
  const res = await axios.get(`${prefix}/${cBoardId}`);
  return res.data;
};

//목록페이지
export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: { page: page, size: size },
  });
  return res.data;
};

//검색 조회
export const getSearchList = async (searchParam) => {
  const { page, size, searchType, searchText } = searchParam;
  const res = await axios.get(`${prefix}/search`, {
    params: { page: page, size: size, type: searchType, keyword: searchText },
  });
  return res.data;
};

//추가
export const postAdd = async (formData) => {
  const header = {
    headers: { "Content-Type": "multipart/form-data" },
  };

  const res = await axios.post(`${prefix}/`, formData, header);

  console.log(res);
  return res.data;
};

//삭제
export const deleteOne = async (cBoardId) => {
  const res = await axios.delete(`${prefix}/${cBoardId}`);
  return res.data;
};

// 수정
// API 호출을 위한 putOne 함수
export const putOne = async (cBoardId, formdata) => {
  try {
    const res = await axios.put(`${prefix}/${cBoardId}`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data", // Content-Type 설정
      },
    });
    return res.data; // 응답 데이터 반환
  } catch (error) {
    console.error("수정 중 오류 발생:", error);
    throw error; // 오류를 호출자에게 전달
  }
};
// api/camperApi.js 회원정보 가져오기
export const getMemberById = async (memberId) => {
  const response = await fetch(`/api/members/${memberId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch member data");
  }
  return await response.json();
};

/* 댓글 리스트 가져오기 */
export const getCommentList = async (cBoardId) => {
  const res = await axios.get(`${prefix}/comments/${cBoardId}`);

  return await res.data;
};
export const deleteComment = async (cCommentId, cBoardId) => {
  const res = await axios.delete(`${prefix}/${cBoardId}/comments/${cCommentId}`)
  return res.data;
}
//댓글 수정
export const updateComment = async (cCommentId, cComment, cBoardId) => {
  const header = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = {
    commentId: cCommentId,
    boardId: cBoardId,
    cCommentContent: cComment
  };

  const res = await axios.put(`${prefix}/comments`, body, header);
  return res.data;
};

export const postCommentAdd = async (req) => {
  const memberInfo = JSON.parse(getCookie("memberCookie"));
  const { accessToken, refreshToken } = memberInfo;

  const header = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "X-Refresh-Token": memberInfo.refreshToken
    },
  };
  const res = await axios.post(`${prefix}/comments`, req, header);
  return await res.data;
};
