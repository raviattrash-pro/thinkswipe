package com.interviewsim.app.repository;

import com.interviewsim.app.model.UserComment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCommentRepository extends JpaRepository<UserComment, Long> {
    List<UserComment> findByStatusOrderByCreatedAtDesc(String status);
    List<UserComment> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
