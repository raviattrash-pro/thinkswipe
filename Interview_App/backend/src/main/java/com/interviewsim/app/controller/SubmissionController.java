package com.interviewsim.app.controller;

import com.interviewsim.app.model.UserComment;
import com.interviewsim.app.model.UserSubmission;
import com.interviewsim.app.model.PageView;
import com.interviewsim.app.repository.UserCommentRepository;
import com.interviewsim.app.repository.UserSubmissionRepository;
import com.interviewsim.app.repository.PageViewRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/submit")
public class SubmissionController {

    private final UserSubmissionRepository submissionRepo;
    private final UserCommentRepository commentRepo;
    private final PageViewRepository pageViewRepo;

    public SubmissionController(
            UserSubmissionRepository submissionRepo,
            UserCommentRepository commentRepo,
            PageViewRepository pageViewRepo) {
        this.submissionRepo = submissionRepo;
        this.commentRepo = commentRepo;
        this.pageViewRepo = pageViewRepo;
    }

    @PostMapping("/question")
    public Map<String, String> submitQuestion(
            @RequestBody UserSubmission submission,
            @RequestHeader(value = "X-Visitor-Id", required = false) String visitorId) {
        submission.setVisitorId(visitorId);
        submission.setStatus("PENDING");
        submission.setCreatedAt(LocalDateTime.now());
        submissionRepo.save(submission);

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Your question has been submitted for review! Thank you 🙌");
        return resp;
    }

    @PostMapping("/comment")
    public Map<String, String> submitComment(
            @RequestBody UserComment comment,
            @RequestHeader(value = "X-Visitor-Id", required = false) String visitorId) {
        comment.setVisitorId(visitorId);
        comment.setStatus("PENDING");
        comment.setCreatedAt(LocalDateTime.now());
        commentRepo.save(comment);

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Your comment has been submitted for review!");
        return resp;
    }

    @PostMapping("/ping")
    public Map<String, String> ping(
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-Visitor-Id", required = false) String visitorId) {
        if (visitorId == null || visitorId.isEmpty()) {
            Map<String, String> resp = new HashMap<>();
            resp.put("status", "ignored");
            return resp;
        }

        String platform = body.getOrDefault("platform", "UNKNOWN");
        String attStr = body.getOrDefault("questionsAttempted", "0");
        int attempted = 0;
        try { attempted = Integer.parseInt(attStr); } catch (NumberFormatException ignored) {}

        // Upsert: find existing or create new
        final int finalAttempted = attempted;
        PageView pv = pageViewRepo.findTopByVisitorIdOrderByLastSeenDesc(visitorId)
            .map(existing -> {
                existing.setLastSeen(LocalDateTime.now());
                existing.setQuestionsAttempted(finalAttempted);
                return existing;
            })
            .orElseGet(() -> new PageView(visitorId, platform));

        pageViewRepo.save(pv);

        Map<String, String> resp = new HashMap<>();
        resp.put("status", "ok");
        return resp;
    }
}
