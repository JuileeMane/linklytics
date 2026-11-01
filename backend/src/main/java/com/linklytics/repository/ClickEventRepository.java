package com.linklytics.repository;

import com.linklytics.entity.ClickEvent;
import com.linklytics.entity.Link;
import com.linklytics.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {

    List<ClickEvent> findAllByLinkOrderByClickedAtDesc(Link link, Pageable pageable);

    long countByLink(Link link);

    @Query("SELECT COUNT(DISTINCT c.visitorHash) FROM ClickEvent c WHERE c.link = :link")
    long countDistinctVisitorsByLink(@Param("link") Link link);

    @Query("SELECT COUNT(DISTINCT c.visitorHash) FROM ClickEvent c WHERE c.link.user = :user")
    long countDistinctVisitorsByUser(@Param("user") User user);

    @Query("SELECT COUNT(DISTINCT c.visitorHash) FROM ClickEvent c")
    long countDistinctVisitorsPlatform();

    // Link-specific analytics
    @Query("SELECT c.browser, COUNT(c) FROM ClickEvent c WHERE c.link = :link GROUP BY c.browser ORDER BY COUNT(c) DESC")
    List<Object[]> countByBrowserForLink(@Param("link") Link link);

    @Query("SELECT c.operatingSystem, COUNT(c) FROM ClickEvent c WHERE c.link = :link GROUP BY c.operatingSystem ORDER BY COUNT(c) DESC")
    List<Object[]> countByOsForLink(@Param("link") Link link);

    @Query("SELECT c.deviceType, COUNT(c) FROM ClickEvent c WHERE c.link = :link GROUP BY c.deviceType ORDER BY COUNT(c) DESC")
    List<Object[]> countByDeviceForLink(@Param("link") Link link);

    @Query("SELECT c.referrer, COUNT(c) FROM ClickEvent c WHERE c.link = :link GROUP BY c.referrer ORDER BY COUNT(c) DESC")
    List<Object[]> countByReferrerForLink(@Param("link") Link link);

    // User dashboard aggregate analytics
    @Query("SELECT c.browser, COUNT(c) FROM ClickEvent c WHERE c.link.user = :user GROUP BY c.browser ORDER BY COUNT(c) DESC")
    List<Object[]> countByBrowserForUser(@Param("user") User user);

    @Query("SELECT c.operatingSystem, COUNT(c) FROM ClickEvent c WHERE c.link.user = :user GROUP BY c.operatingSystem ORDER BY COUNT(c) DESC")
    List<Object[]> countByOsForUser(@Param("user") User user);

    @Query("SELECT c.deviceType, COUNT(c) FROM ClickEvent c WHERE c.link.user = :user GROUP BY c.deviceType ORDER BY COUNT(c) DESC")
    List<Object[]> countByDeviceForUser(@Param("user") User user);

    @Query("SELECT c.referrer, COUNT(c) FROM ClickEvent c WHERE c.link.user = :user GROUP BY c.referrer ORDER BY COUNT(c) DESC")
    List<Object[]> countByReferrerForUser(@Param("user") User user);

    // Recent clicks for user
    @Query("SELECT c FROM ClickEvent c WHERE c.link.user = :user ORDER BY c.clickedAt DESC")
    List<ClickEvent> findRecentClicksByUser(@Param("user") User user, Pageable pageable);

    // Timeframe clicks for user
    @Query("SELECT c FROM ClickEvent c WHERE c.link.user = :user AND c.clickedAt >= :since ORDER BY c.clickedAt ASC")
    List<ClickEvent> findClicksByUserSince(@Param("user") User user, @Param("since") LocalDateTime since);

    // Timeframe clicks for specific link
    @Query("SELECT c FROM ClickEvent c WHERE c.link = :link AND c.clickedAt >= :since ORDER BY c.clickedAt ASC")
    List<ClickEvent> findClicksByLinkSince(@Param("link") Link link, @Param("since") LocalDateTime since);

    // Platform-wide recent clicks
    List<ClickEvent> findTop20ByOrderByClickedAtDesc();
}
