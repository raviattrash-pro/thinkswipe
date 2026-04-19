package com.interviewsim.app.dto;

public record PerformanceSummary(
    String strongestCategory,
    String weakestCategory,
    int totalAttempts,
    int averageScore
) {}
