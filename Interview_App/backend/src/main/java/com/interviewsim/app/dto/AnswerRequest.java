package com.interviewsim.app.dto;

import jakarta.validation.constraints.NotNull;

public record AnswerRequest(
        @NotNull Long questionId,
        @NotNull String userAnswer
) {
}
