package com.interviewsim.app.controller;

import com.interviewsim.app.model.PageView;
import com.interviewsim.app.repository.PageViewRepository;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    private final PageViewRepository pageViewRepository;

    public LeaderboardController(PageViewRepository pageViewRepository) {
        this.pageViewRepository = pageViewRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getLeaderboard() {
        return pageViewRepository.findTopByXp(PageRequest.of(0, 20)).stream()
                .map(pv -> {
                    Map<String, Object> map = new HashMap<>();
                    String vid = pv.getVisitorId();
                    // Anonymize visitor ID to first 8 chars
                    map.put("visitorId", vid != null && vid.length() > 8 ? vid.substring(0, 8) : vid);
                    map.put("xp", pv.getXp());
                    map.put("streak", pv.getStreak());
                    return map;
                }).collect(Collectors.toList());
    }

    @PostMapping("/update")
    public void updateProgress(@RequestHeader("X-Visitor-Id") String visitorId,
                                @RequestBody Map<String, Integer> payload) {
        pageViewRepository.findByVisitorId(visitorId).ifPresent(pv -> {
            int score = payload.getOrDefault("score", 0);
            pv.setXp(pv.getXp() + score);
            
            // Streak logic
            LocalDate today = LocalDate.now();
            if (pv.getLastAttemptDate() == null) {
                pv.setStreak(1);
            } else if (pv.getLastAttemptDate().equals(today.minusDays(1))) {
                pv.setStreak(pv.getStreak() + 1);
            } else if (!pv.getLastAttemptDate().equals(today)) {
                pv.setStreak(1);
            }
            pv.setLastAttemptDate(today);
            
            pageViewRepository.save(pv);
        });
    }
}
