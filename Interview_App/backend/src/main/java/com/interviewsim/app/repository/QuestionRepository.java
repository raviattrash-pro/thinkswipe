package com.interviewsim.app.repository;

import com.interviewsim.app.model.Question;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByCategoryAndDifficulty(String category, String difficulty);

    // Search by title or category (case-insensitive)
    List<Question> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(String title, String category);

    // Company filter
    List<Question> findByCompanyContainingIgnoreCase(String company);

    // Paginated feed
    @Query("SELECT q FROM Question q ORDER BY q.id")
    List<Question> findPaged(Pageable pageable);

    // Questions ordered by average score (lowest = hardest/most problematic)
    @Query("SELECT q FROM Question q WHERE q.attemptCount > 0 ORDER BY (q.totalScore * 1.0 / q.attemptCount) ASC")
    List<Question> findByLowestAverageScore(Pageable pageable);

    // Title + company search
    @Query("SELECT q FROM Question q WHERE LOWER(q.title) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(q.category) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(q.company) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Question> searchAll(@Param("q") String query);
}
