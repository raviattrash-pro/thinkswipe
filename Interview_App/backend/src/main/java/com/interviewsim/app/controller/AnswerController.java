package com.interviewsim.app.controller;

import com.interviewsim.app.dto.AnswerRequest;
import com.interviewsim.app.dto.AnswerResponse;
import com.interviewsim.app.service.AnswerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/answer")
public class AnswerController {

    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @PostMapping
    public AnswerResponse submitAnswer(@Valid @RequestBody AnswerRequest request) {
        return answerService.evaluateAnswer(request);
    }
}
