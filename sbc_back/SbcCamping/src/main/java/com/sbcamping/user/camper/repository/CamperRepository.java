package com.sbcamping.user.camper.repository;

import com.sbcamping.domain.CamperBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CamperRepository extends JpaRepository<CamperBoard, Long> {
    @Query("SELECT c FROM CamperBoard c WHERE c.cBoardTitle LIKE %:keyword% OR c.cBoardContent LIKE %:keyword%")
    List<CamperBoard> findByKeyword(@Param("keyword") String keyword);

    @Query("select c from CamperBoard c order by c.cBoardID desc")
    Page<CamperBoard> orderdList(Pageable pageable);

    Page<CamperBoard> findAllBycBoardTitleContaining(String title, Pageable pageable);

    Page<CamperBoard> findAllBycBoardContentContaining(String content, Pageable pageable);

}
