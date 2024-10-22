package com.sbcamping.user.camper.controller;

import com.sbcamping.common.util.CustomFileUtil;
import com.sbcamping.domain.CamperBoard;
import com.sbcamping.user.camper.dto.*;
import com.sbcamping.user.camper.service.CamperService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/campers")
public class CamperController {
    private final CamperService camperService;
    private final CustomFileUtil fileUtil;

    /**
     * 게시판 리스트 출력
     *
     * @param 페이징 정보
     */
    @GetMapping("/list")
    public PageResponseDTO<CamperBoardDTO> list(
            PageRequestDTO pageRequestDTO
    ) {
        return camperService.list(pageRequestDTO);
    }

    /**
     * 게시판 상세 페이지
     *
     * @param 게시판 id
     */
    @GetMapping("/{id}")
    public CamperBoard get(
            @PathVariable Long id
    ) {
        return camperService.get(id);
    }

    /**
     * 게시판 수정
     *
     * @param 게시판 id, 수정 정보
     */
    @PutMapping("/{id}")
    public void  modify(
            @PathVariable Long id, CamperBoardDTO camperBoardDTO) {
        MultipartFile file = camperBoardDTO.getFile();
        String uploadFileName = fileUtil.saveFile(file);
        camperBoardDTO.setCBoardAttachment(uploadFileName);

        camperBoardDTO.setCBoardID(id);
        camperService.modify(camperBoardDTO);
    }

    /**
     * 게시판 등록
     *
     * @param 게시판 내용
     */
    @PostMapping("/")
    public Map<String, Long> register(CamperBoardDTO camperBoardDTO) {
        log.info("컨트롤러 오니?");
        log.info("가ㅏ:", camperBoardDTO);
        MultipartFile file = camperBoardDTO.getFile();
        String uploadFileName = fileUtil.saveFile(file);
        camperBoardDTO.setCBoardAttachment(uploadFileName);

        Long id = camperService.register(camperBoardDTO);
        return Map.of("RESULT", id);
    }

    /**
     * 게시판 삭제
     *
     * @param 게시판 id
     */
    @DeleteMapping("/{cBoardId}")
    public void remove(
            @PathVariable Long cBoardId
    ) {
        camperService.remove(cBoardId);
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
        return fileUtil.getFile(fileName);
    }

    /**
     * 게시판 검색
     *
     * @param 게시판 id
     */
    @GetMapping("/search")
    public PageResponseDTO<CamperBoardDTO> search(
            PageRequestDTO pageRequestDTO,
            @RequestParam(defaultValue = "title", required = false) String type,
            @RequestParam(required = false) String keyword) {
        return camperService.search(pageRequestDTO, type, keyword);
    }

    /**
     * 댓글 목록
     *
     * @param 댓글 id
     */
    @GetMapping("/comments/{boardId}")
    public List<CamperBoardCommentResDTO> commentList(
            @PathVariable("boardId") Long boardId
    ) {
        return camperService.getCommentList(boardId);
    }

    /**
     * 댓글 등록
     *
     * @param
     */
    @PutMapping("/comments")
    public Map<String, Long> registerComment(
            @RequestHeader(name = "Authorization") String auth,
            @RequestHeader("X-Refresh-Token") String refreshToken,
            @RequestBody CamperBoardCommentDTO dto
    ) {
        log.info("dto : {}", dto.toString());
        Long commentId = camperService.registerComment(auth, refreshToken, dto);
        return Map.of("RESULT", commentId);
    }

    /**
     * 댓글 수정
     *
     * @param
     */
    @PatchMapping("/comments")
    public Map<String, String> updateComment(
            @RequestBody CamperBoardCommentDTO dto
    ) {
        camperService.modifyComment(dto);
        return Map.of("RESULT", "SUCCESS");
    }

    /**
     * 댓글 삭제
     *
     * @param
     */
    @DeleteMapping("/{cBoardId}/comment/{cCommentId}")
    @Transactional
    public Map<String, String> removeComment(
            @PathVariable("cCommentId") Long cCommentId,
            @PathVariable("cBoardId") Long cBoardId) {
        camperService.removeComment(cCommentId, cBoardId);
        return Map.of("RESULT", "SUCCESS");

    }
}
