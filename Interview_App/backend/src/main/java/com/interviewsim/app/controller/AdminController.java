package com.interviewsim.app.controller;

import com.interviewsim.app.model.Question;
import com.interviewsim.app.model.UserComment;
import com.interviewsim.app.model.UserSubmission;
import com.interviewsim.app.repository.*;
import com.interviewsim.app.service.QuestionService;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserSubmissionRepository submissionRepo;
    private final UserCommentRepository commentRepo;
    private final PageViewRepository pageViewRepo;
    private final AttemptRepository attemptRepo;
    private final QuestionRepository questionRepo;
    private final QuestionService questionService;
    private final AdminAccountRepository adminRepo;

    public AdminController(
            UserSubmissionRepository submissionRepo,
            UserCommentRepository commentRepo,
            PageViewRepository pageViewRepo,
            AttemptRepository attemptRepo,
            QuestionRepository questionRepo,
            QuestionService questionService,
            AdminAccountRepository adminRepo) {
        this.submissionRepo = submissionRepo;
        this.commentRepo = commentRepo;
        this.pageViewRepo = pageViewRepo;
        this.attemptRepo = attemptRepo;
        this.questionRepo = questionRepo;
        this.questionService = questionService;
        this.adminRepo = adminRepo;
    }

    private void checkAuth(String token) {
        // In this simple system, the token is the password in the DB
        var admin = adminRepo.findByUsername("admin")
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Admin account missing"));
        
        if (token == null || !token.equals(admin.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        var admin = adminRepo.findByUsername(username);
        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return Map.of("success", true, "token", password);
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @RequestBody Map<String, String> body) {
        checkAuth(token);
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password cannot be empty");
        }

        var admin = adminRepo.findByUsername("admin").get();
        admin.setPassword(newPassword);
        adminRepo.save(admin);

        return Map.of("message", "Password updated successfully", "newToken", newPassword);
    }

    // --- OVERVIEW STATS ---
    @GetMapping("/stats")
    public Map<String, Object> getStats(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVisitors", pageViewRepo.countDistinctVisitors());
        stats.put("totalAttempts", attemptRepo.count());
        stats.put("totalQuestions", questionRepo.count());
        stats.put("pendingSubmissions", submissionRepo.countByStatus("PENDING"));
        stats.put("pendingComments", commentRepo.countByStatus("PENDING"));

        List<Object[]> platformStats = pageViewRepo.countByPlatform();
        Map<String, Long> platforms = new HashMap<>();
        for (Object[] row : platformStats) {
            platforms.put((String) row[0], (Long) row[1]);
        }
        stats.put("platformBreakdown", platforms);

        List<com.interviewsim.app.model.Attempt> allAttempts = attemptRepo.findAll();
        double avgScore = allAttempts.stream().filter(a -> !a.getSkipped()).mapToInt(a -> a.getScore()).average().orElse(0.0);
        stats.put("averageScore", Math.round(avgScore * 10.0) / 10.0);

        return stats;
    }

    // --- NEW PHASE 2 ANALYTICS ---

    @GetMapping("/analytics/retention")
    public Map<String, Object> getRetention(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        Map<String, Object> retention = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        
        long total = pageViewRepo.count();
        if (total == 0) return Map.of("d1", 0, "d7", 0, "d30", 0);

        retention.put("d1", calculateRetention(now.minusDays(1)));
        retention.put("d7", calculateRetention(now.minusDays(7)));
        retention.put("d30", calculateRetention(now.minusDays(30)));
        
        return retention;
    }

    private double calculateRetention(LocalDateTime since) {
        long totalBefore = pageViewRepo.countVisitorsBefore(since);
        if (totalBefore == 0) return 0.0;
        long activeAfter = pageViewRepo.countActiveAfter(since);
        return Math.min(100.0, Math.round(((double) activeAfter / totalBefore) * 1000.0) / 10.0);
    }

    @GetMapping("/analytics/funnel")
    public Map<String, Object> getFunnel(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        Map<String, Object> funnel = new HashMap<>();
        long views = pageViewRepo.count();
        long attempts = attemptRepo.count();
        long submissions = attemptRepo.countDistinctSubmitters();

        funnel.put("views", views);
        funnel.put("attempts", attempts);
        funnel.put("submissions", submissions);
        
        double attemptRate = views == 0 ? 0 : Math.round(((double) attempts / views) * 1000.0) / 10.0;
        double submitRate = attempts == 0 ? 0 : Math.round(((double) submissions / attempts) * 1000.0) / 10.0;
        
        funnel.put("attemptRate", attemptRate);
        funnel.put("submitRate", submitRate);
        
        return funnel;
    }

    @GetMapping("/analytics/popular")
    public List<Map<String, Object>> getPopularQuestions(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        List<Object[]> results = attemptRepo.findPopularQuestions(PageRequest.of(0, 10));
        return results.stream().map(row -> {
            Long qid = (Long) row[0];
            Long count = (Long) row[1];
            Map<String, Object> map = new HashMap<>();
            map.put("questionId", qid);
            map.put("count", count);
            questionRepo.findById(qid).ifPresent(q -> map.put("title", q.getTitle()));
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/analytics/questions")
    public List<Map<String, Object>> getQuestionQuality(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        return questionService.getQuestionAnalytics();
    }

    @PostMapping(value = "/questions/bulk-import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> bulkImport(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        return questionService.bulkImport(file);
    }

    // --- EXISTING ---

    @GetMapping("/submissions")
    public List<UserSubmission> getSubmissions(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        return submissionRepo.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/submissions/{id}/approve")
    public Map<String, String> approveSubmission(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        UserSubmission sub = submissionRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        Question q = new Question(
            sub.getQuestionText(),
            sub.getCategory() != null ? sub.getCategory() : "General",
            sub.getDifficulty() != null ? sub.getDifficulty() : "Medium",
            sub.getReferenceAnswer() != null ? sub.getReferenceAnswer() : "See community answer",
            sub.getType() != null ? sub.getType() : "TEXT",
            sub.getOptions()
        );
        questionRepo.save(q);

        sub.setStatus("APPROVED");
        submissionRepo.save(sub);

        return Map.of("message", "Approved and added to question bank");
    }

    @DeleteMapping("/submissions/{id}")
    public Map<String, String> deleteSubmission(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        submissionRepo.deleteById(id);
        return Map.of("message", "Submission rejected and deleted");
    }

    @GetMapping("/comments")
    public List<UserComment> getComments(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        return commentRepo.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/comments/{id}/approve")
    public Map<String, String> approveComment(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        UserComment c = commentRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        c.setStatus("APPROVED");
        commentRepo.save(c);
        return Map.of("message", "Comment approved");
    }

    @DeleteMapping("/comments/{id}")
    public Map<String, String> deleteComment(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        commentRepo.deleteById(id);
        return Map.of("message", "Comment deleted");
    }

    @GetMapping("/visitors")
    public List<com.interviewsim.app.model.PageView> getVisitors(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        checkAuth(token);
        return pageViewRepo.findAllByOrderByLastSeenDesc();
    }
}
