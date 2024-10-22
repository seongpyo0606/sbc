package com.sbcamping.user.camper.service;


import com.sbcamping.domain.CamperBoard;
import com.sbcamping.user.camper.dto.*;

import java.util.List;


public interface CamperService {

    Long register(CamperBoardDTO camperBoardDTO);

    CamperBoard get(Long cBoardId);

    void modify(CamperBoardDTO camperBoardDTO);

    void remove(Long cBoardId);


    PageResponseDTO<CamperBoardDTO> list(PageRequestDTO pageRequestDTO);

    PageResponseDTO<CamperBoardDTO> search(
            PageRequestDTO requestDTO, String type, String keyword
    );

    List<CamperBoardCommentResDTO> getCommentList(Long boardId);

    Long registerComment(String auth, String refreshToken, CamperBoardCommentDTO dto);

    void modifyComment(CamperBoardCommentDTO dto);

    void removeComment(Long cCommentId, Long cBoardId);
}
