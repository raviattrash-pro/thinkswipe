package com.interviewsim.app.service;

import com.interviewsim.app.dto.AnswerRequest;
import com.interviewsim.app.dto.AnswerResponse;
import com.interviewsim.app.model.Attempt;
import com.interviewsim.app.model.Question;
import com.interviewsim.app.repository.AttemptRepository;
import com.interviewsim.app.repository.QuestionRepository;
import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AnswerService {

    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;

    public AnswerService(QuestionRepository questionRepository, AttemptRepository attemptRepository) {
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
    }

    public AnswerResponse evaluateAnswer(AnswerRequest request) {
        Question question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

        String normalizedAnswer = request.userAnswer().trim();
        int answerLength = normalizedAnswer.length();
        int score;
        String feedback;

        if (answerLength == 0) {
            score = 0;
            feedback = "Time's up! You didn't provide an answer.";
        } else if ("MCQ".equalsIgnoreCase(question.getType())) {
            // Strict binary scoring for MCQs
            boolean isCorrect = normalizedAnswer.equalsIgnoreCase(question.getReferenceAnswer().trim());
            score = isCorrect ? 10 : 1;
            feedback = isCorrect 
                ? "Correct! You identified the right answer among the options." 
                : "Incorrect. The selected option doesn't match the expected answer.";
        } else {
            // Scoring for TEXT, CODE, and BUG
            int baseScore = answerLength > 30 ? 6 : 4;
            int bonus = containsStructuredThinking(normalizedAnswer) ? 1 : 0;
            int referenceCoverageBonus = computeReferenceCoverageBonus(normalizedAnswer, question.getReferenceAnswer());
            int randomVariation = ThreadLocalRandom.current().nextInt(-1, 3);
            score = Math.max(1, Math.min(10, baseScore + bonus + referenceCoverageBonus + randomVariation));
            
            if ("CODE".equalsIgnoreCase(question.getType()) || "BUG".equalsIgnoreCase(question.getType())) {
                feedback = buildTechnicalFeedback(normalizedAnswer, score);
            } else {
                feedback = buildFeedback(question.getCategory(), normalizedAnswer, answerLength, score);
            }
        }

        attemptRepository.save(new Attempt(
                question.getId(), 
                normalizedAnswer, 
                score, 
                feedback, 
                question.getCategory(), 
                question.getDifficulty()
        ));

        return new AnswerResponse(score, feedback, question.getReferenceAnswer());
    }

    private boolean containsStructuredThinking(String answer) {
        String lowerCaseAnswer = answer.toLowerCase();
        return lowerCaseAnswer.contains("because")
                || lowerCaseAnswer.contains("tradeoff")
                || lowerCaseAnswer.contains("example")
                || lowerCaseAnswer.contains("approach");
    }

    private String buildTechnicalFeedback(String answer, int score) {
        if (score >= 8) {
            return "Excellent technical precision! You accurately identified the core logic or bug and explained it clearly.";
        } else if (score >= 5) {
            return "Good observation. You identified some key aspects of the code, but try to be more precise about the root cause or result.";
        } else {
            return "Technical questions require precision. Review the reference code to understand the specific subtle behavior.";
        }
    }

    private String buildFeedback(String category, String answer, int answerLength, int score) {
        if (answerLength <= 30) {
            return "Add more depth and structure to your response.\nMention a clear approach and one concrete example.";
        }

        if ("System Design".equalsIgnoreCase(category) && score >= 7) {
            return "Strong high-level framing with good product sense.\nPush it further by naming scaling tradeoffs and failure handling explicitly.";
        }

        if ("HR".equalsIgnoreCase(category) && score >= 7) {
            return "Your answer feels thoughtful and relevant.\nMake it even better by tying it to measurable impact.";
        }

        if (score >= 7) {
            return "Solid answer with good detail and momentum.\nTighten the structure so the interviewer can follow your reasoning faster.";
        }

        return "You are on the right track and the core idea is visible.\nAdd a clearer step-by-step explanation and highlight why your choice is effective.";
    }

    private int computeReferenceCoverageBonus(String candidateAnswer, String referenceAnswer) {
        Set<String> referenceKeywords = extractKeywords(referenceAnswer);
        if (referenceKeywords.isEmpty()) {
            return 0;
        }

        Set<String> candidateKeywords = extractKeywords(candidateAnswer);
        long overlap = referenceKeywords.stream()
                .filter(candidateKeywords::contains)
                .count();
        double coverage = (double) overlap / referenceKeywords.size();

        if (coverage >= 0.5) {
            return 2;
        }
        if (coverage >= 0.25) {
            return 1;
        }
        return 0;
    }

    private Set<String> extractKeywords(String text) {
        return Arrays.stream(text.toLowerCase().split("[^a-z0-9]+"))
                .filter(token -> token.length() >= 5)
                .filter(token -> !Set.of("their", "there", "about", "which", "would", "should", "could").contains(token))
                .collect(Collectors.toSet());
    }
}
