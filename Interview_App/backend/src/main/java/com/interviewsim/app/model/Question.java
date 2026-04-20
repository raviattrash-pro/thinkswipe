package com.interviewsim.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 240)
    private String title;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(nullable = false, length = 30)
    private String difficulty;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String referenceAnswer;

    @Column(nullable = false)
    private Long likeCount = 0L;

    @Column(nullable = false, length = 20)
    private String type = "TEXT"; // TEXT, MCQ, CODE, BUG

    @Column(columnDefinition = "TEXT")
    private String options; // Comma-separated or JSON for MCQs

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(length = 200)
    private String company; // Comma-separated: "Google,Amazon"

    @Column(nullable = false)
    private Integer skipCount = 0;

    @Column(nullable = false)
    private Integer attemptCount = 0;

    @Column(nullable = false)
    private Long totalScore = 0L;

    public Question() {
    }

    public Question(String title, String category, String difficulty, String referenceAnswer) {
        this.title = title;
        this.category = category;
        this.difficulty = difficulty;
        this.referenceAnswer = referenceAnswer;
    }

    public Question(String title, String category, String difficulty, String referenceAnswer, String company) {
        this.title = title;
        this.category = category;
        this.difficulty = difficulty;
        this.referenceAnswer = referenceAnswer;
        this.company = company;
        this.type = "TEXT";
    }

    public Question(String title, String category, String difficulty, String referenceAnswer, String type, String options, String company) {
        this.title = title;
        this.category = category;
        this.difficulty = difficulty;
        this.referenceAnswer = referenceAnswer;
        this.type = type;
        this.options = options;
        this.company = company;
    }

    public Question(String title, String category, String difficulty, String referenceAnswer, String type, String options) {
        this.title = title;
        this.category = category;
        this.difficulty = difficulty;
        this.referenceAnswer = referenceAnswer;
        this.type = type;
        this.options = options;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getReferenceAnswer() {
        return referenceAnswer;
    }

    public void setReferenceAnswer(String referenceAnswer) {
        this.referenceAnswer = referenceAnswer;
    }

    public Long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public Integer getSkipCount() { return skipCount; }
    public void setSkipCount(Integer skipCount) { this.skipCount = skipCount; }

    public Integer getAttemptCount() { return attemptCount; }
    public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }

    public Long getTotalScore() { return totalScore; }
    public void setTotalScore(Long totalScore) { this.totalScore = totalScore; }

    public double getAverageScore() {
        return attemptCount == 0 ? 0.0 : Math.round((double) totalScore / attemptCount * 10.0) / 10.0;
    }
}
