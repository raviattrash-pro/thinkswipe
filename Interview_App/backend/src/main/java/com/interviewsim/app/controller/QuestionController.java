package com.interviewsim.app.controller;

import com.interviewsim.app.dto.QuestionResponse;
import com.interviewsim.app.service.QuestionService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/feed")
    public List<QuestionResponse> getFeed() {
        return questionService.getFeed();
    }

    @org.springframework.web.bind.annotation.PostMapping("/{id}/like")
    public void likeQuestion(@org.springframework.web.bind.annotation.PathVariable Long id) {
        questionService.likeQuestion(id);
    }

    @GetMapping("/performance/summary")
    public com.interviewsim.app.dto.PerformanceSummary getPerformanceSummary() {
        return questionService.getPerformanceSummary();
    }
}
