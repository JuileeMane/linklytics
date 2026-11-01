package com.linklytics.repository;

import com.linklytics.entity.Campaign;
import com.linklytics.entity.Folder;
import com.linklytics.entity.Link;
import com.linklytics.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LinkRepository extends JpaRepository<Link, Long>, JpaSpecificationExecutor<Link> {

    Optional<Link> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    Optional<Link> findByIdAndUser(Long id, User user);

    List<Link> findAllByUserOrderByCreatedAtDesc(User user);

    long countByUser(User user);

    long countByUserAndActiveTrueAndArchivedFalse(User user);

    long countByUserAndArchivedTrue(User user);

    @Query("SELECT COALESCE(SUM(l.clickCount), 0) FROM Link l WHERE l.user = :user")
    long sumClicksByUser(@Param("user") User user);

    @Query("SELECT COALESCE(SUM(l.clickCount), 0) FROM Link l")
    long sumAllClicks();

    List<Link> findTop5ByUserOrderByClickCountDesc(User user);

    List<Link> findTop10ByOrderByClickCountDesc();

    List<Link> findByCampaign(Campaign campaign);

    long countByCampaign(Campaign campaign);

    @Query("SELECT COALESCE(SUM(l.clickCount), 0) FROM Link l WHERE l.campaign = :campaign")
    long sumClicksByCampaign(@Param("campaign") Campaign campaign);

    long countByFolder(Folder folder);

    long countByActiveTrue();

    long countByActiveFalse();
}
