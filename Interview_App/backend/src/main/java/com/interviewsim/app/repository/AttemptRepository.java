package com.interviewsim.app.repository;

import com.interviewsim.app.model.Attempt;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

    @Query("SELECT a.category FROM Attempt a GROUP BY a.category ORDER BY AVG(a.score) ASC")
    List<String> findWeakestCategories(Pageable pageable);

    @Query("SELECT a.category FROM Attempt a GROUP BY a.category ORDER BY AVG(a.score) DESC")
    List<String> findStrongestCategories(Pageable pageable);

    @Query("SELECT a.score FROM Attempt a ORDER BY a.id DESC")
    List<Integer> findRecentScores(Pageable pageable);

    List<Attempt> findByQuestionId(Long questionId);

    @Query("SELECT COUNT(a) FROM Attempt a WHERE a.questionId = :qid AND a.skipped = true")
    Long countSkippedByQuestionId(@Param("qid") Long questionId);

    @Query("SELECT AVG(a.score) FROM Attempt a WHERE a.questionId = :qid AND a.skipped = false")
    Double findAverageScoreByQuestionId(@Param("qid") Long questionId);

    @Query("SELECT COUNT(a) FROM Attempt a WHERE a.questionId = :qid")
    Long countByQuestionId(@Param("qid") Long questionId);

    // For funnel analytics
    @Query("SELECT COUNT(DISTINCT a.visitorId) FROM Attempt a WHERE a.skipped = false")
    Long countDistinctSubmitters();

    // For popular questions
    @Query("SELECT a.questionId, COUNT(a) as cnt FROM Attempt a GROUP BY a.questionId ORDER BY cnt DESC")
    List<Object[]> findPopularQuestions(Pageable pageable);
}
