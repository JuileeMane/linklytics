package com.linklytics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "click_events", indexes = {
    @Index(name = "idx_click_events_link_id", columnList = "link_id"),
    @Index(name = "idx_click_events_clicked_at", columnList = "clickedAt"),
    @Index(name = "idx_click_events_device", columnList = "deviceType"),
    @Index(name = "idx_click_events_browser", columnList = "browser"),
    @Index(name = "idx_click_events_os", columnList = "operatingSystem")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "link_id", nullable = false)
    private Link link;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime clickedAt;

    @Column(length = 64)
    private String visitorHash;

    @Column(length = 500)
    private String userAgent;

    @Column(length = 50)
    private String browser;

    @Column(length = 50)
    private String operatingSystem;

    @Column(length = 30)
    private String deviceType;

    @Column(length = 255)
    private String referrer;

    @Column(length = 50)
    private String country;
}
