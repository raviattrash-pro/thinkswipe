package com.interviewsim.app.repository;

import com.interviewsim.app.model.PushSubscription;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    Optional<PushSubscription> findByVisitorId(String visitorId);
    void deleteByVisitorId(String visitorId);
}
