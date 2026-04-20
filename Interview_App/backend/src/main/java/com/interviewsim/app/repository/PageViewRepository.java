package com.interviewsim.app.repository;

import com.interviewsim.app.model.PageView;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PageViewRepository extends JpaRepository<PageView, Long> {
    Optional<PageView> findTopByVisitorIdOrderByLastSeenDesc(String visitorId);

    @Query("SELECT COUNT(DISTINCT p.visitorId) FROM PageView p")
    long countDistinctVisitors();

    @Query("SELECT p.platform, COUNT(p) FROM PageView p GROUP BY p.platform")
    List<Object[]> countByPlatform();

    List<PageView> findAllByOrderByLastSeenDesc();

    // Leaderboard: top N by XP
    @Query("SELECT p FROM PageView p WHERE p.xp > 0 ORDER BY p.xp DESC")
    List<PageView> findTopByXp(Pageable pageable);

    // Retention: visitors seen after a given date who first visited before it
    @Query("SELECT COUNT(DISTINCT p.visitorId) FROM PageView p WHERE p.lastSeen >= :since")
    long countActiveAfter(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(DISTINCT p.visitorId) FROM PageView p WHERE p.sessionStart <= :before")
    long countVisitorsBefore(@Param("before") LocalDateTime before);

    // Streak helpers
    Optional<PageView> findByVisitorId(String visitorId);
}
