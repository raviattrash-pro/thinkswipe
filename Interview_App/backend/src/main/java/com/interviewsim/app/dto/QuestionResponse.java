package com.interviewsim.app.dto;

public record QuestionResponse(
    Long id, 
    String title, 
    String category, 
    String difficulty,
    String type,
    String options,
    String explanation,
    String company
) {
}
