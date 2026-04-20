package com.interviewsim.app.controller;

import com.interviewsim.app.dto.QuestionResponse;
import com.interviewsim.app.service.QuestionService;
import java.util.List;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // --- Existing ---
    @GetMapping("/feed")
    public List<QuestionResponse> getFeed(@RequestParam(defaultValue = "0") int page) {
        return questionService.getFeed(page);
    }

    @PostMapping("/{id}/like")
    public void likeQuestion(@PathVariable Long id) {
        questionService.likeQuestion(id);
    }

    @GetMapping("/performance/summary")
    public com.interviewsim.app.dto.PerformanceSummary getPerformanceSummary() {
        return questionService.getPerformanceSummary();
    }

    @GetMapping("/search")
    public List<QuestionResponse> searchQuestions(@RequestParam String q) {
        return questionService.searchQuestions(q);
    }

    // --- Daily Challenge ---
    @GetMapping("/daily")
    public QuestionResponse getDailyChallenge() {
        return questionService.getDailyChallenge();
    }

    // --- Company Filter ---
    @GetMapping("/company/{company}")
    public List<QuestionResponse> getByCompany(@PathVariable String company) {
        return questionService.getByCompany(company);
    }

    // --- Skip tracking ---
    @PostMapping("/{id}/skip")
    public void skipQuestion(@PathVariable Long id,
                             @RequestHeader(value = "X-Visitor-Id", required = false) String visitorId) {
        questionService.recordSkip(id, visitorId);
    }

    // --- Question Quality Analytics (admin) ---
    @GetMapping("/analytics")
    public List<Map<String, Object>> getQuestionAnalytics(
            @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (!"admin123".equals(token)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return questionService.getQuestionAnalytics();
    }

    // --- Bulk Import (admin) ---
    @PostMapping(value = "/bulk-import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> bulkImport(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (!"admin123".equals(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        return ResponseEntity.ok(questionService.bulkImport(file));
    }

    // --- JDoodle Code Execution Proxy ---
    @PostMapping("/execute-code")
    public ResponseEntity<Map<String, Object>> executeCode(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(questionService.executeCode(
                payload.getOrDefault("script", ""),
                payload.getOrDefault("language", "java"),
                payload.getOrDefault("versionIndex", "4")
        ));
    }
}
