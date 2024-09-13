package com.sbcamping.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@SequenceGenerator(name = "SITE_SEQ_GEN", // 시퀀스 제너레이터 이름
        sequenceName = "SITE_SEQ", // 시퀀스 이름
        initialValue = 1, //시작값
        allocationSize = 1 // 메모리를 통해 할당할 범위 사이즈
)
@Table(name = "Site") // 실제 DB 테이블 명
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Site {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SITE_SEQ_GEN")
    @Column(name = "Site_ID", nullable = false, precision = 10)           //구역번호
    private Long siteID;

    @Column(name = "Site_Name", nullable = false, length = 10, unique = true)    //구역이름
    private String siteName;

    @Column(name = "Site_IsAvailable", nullable = false, length = 1)    // 예약 가능여부
    private char siteIsAvailable = 'N';

    @Column(name = "Site_Res_Limit", nullable = false, length = 1)      // 예약 제한
    private char siteResLimit = 'N';

    @Column(name = "Site_Weekend_Pay", nullable = false, precision = 10)   // 주말가격
    @Builder.Default    //값이 정해져 있기 떄문에 사용
    private Long siteWeekendPay = 80000L;

    @Column(name = "Site_Weekday_Pay", nullable = false, precision = 10)   // 평일가격
    @Builder.Default
    private Long siteWeekdayPay = 40000L;

    @Column(name = "Site_Min_People", nullable = false, precision = 1)     // 최소인원
    @Builder.Default
    private Long siteMinPeople = 4L;

    @Column(name = "Site_Max_People", nullable = false, precision = 1)     // 최대인원
    @Builder.Default
    private Long siteMaxPeople = 6L;


}
