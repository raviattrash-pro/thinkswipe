package com.interviewsim.app.repository;

import com.interviewsim.app.model.Attempt;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

    @Query("SELECT a.category FROM Attempt a GROUP BY a.category ORDER BY AVG(a.score) ASC")
    List<String> findWeakestCategories(Pageable pageable);

    @Query("SELECT a.category FROM Attempt a GROUP BY a.category ORDER BY AVG(a.score) DESC")
    List<String> findStrongestCategories(Pageable pageable);

    @Query("SELECT a.score FROM Attempt a ORDER BY a.id DESC")
    List<Integer> findRecentScores(Pageable pageable);
}
