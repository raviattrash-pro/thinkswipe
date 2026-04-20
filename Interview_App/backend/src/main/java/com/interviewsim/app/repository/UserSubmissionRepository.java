package com.interviewsim.app.repository;

import com.interviewsim.app.model.UserSubmission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSubmissionRepository extends JpaRepository<UserSubmission, Long> {
    List<UserSubmission> findByStatusOrderByCreatedAtDesc(String status);
    List<UserSubmission> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
