package com.sbcamping.admin.site.repository;


import com.sbcamping.domain.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface SiteRepository extends JpaRepository<Site,Long> {
}
