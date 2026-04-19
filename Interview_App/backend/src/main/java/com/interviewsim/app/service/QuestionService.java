package com.interviewsim.app.service;

import com.interviewsim.app.dto.QuestionResponse;
import com.interviewsim.app.model.Question;
import com.interviewsim.app.repository.AttemptRepository;
import com.interviewsim.app.repository.QuestionRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;

    public QuestionService(QuestionRepository questionRepository, AttemptRepository attemptRepository) {
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
    }

    public List<QuestionResponse> getFeed() {
        // 1. Identify Target Difficulty & Hook Sequence
        String targetDifficulty = "Medium";
        List<Integer> recentScores = attemptRepository.findRecentScores(PageRequest.of(0, 5));
        
        // HOOK: If brand new or start of session (last 2 scores missing)
        if (recentScores.size() < 1) {
            targetDifficulty = "Easy"; // Point 1: Guaranteed win first
        } else if (recentScores.size() < 2) {
             targetDifficulty = "Medium"; // Point 1: Slight challenge second
        } else {
            // Normal adaptive logic
            double avg = recentScores.stream().mapToInt(Integer::intValue).average().orElse(5.0);
            if (avg >= 7.5) targetDifficulty = "Hard";
            else if (avg <= 4.0) targetDifficulty = "Easy";
        }

        // 2. Identify Weakest Category
        List<String> weakCategories = attemptRepository.findWeakestCategories(PageRequest.of(0, 1));
        String weakestCategory = weakCategories.isEmpty() ? null : weakCategories.get(0);

        // 3. Assemble Recommended Feed
        List<Question> recommended = new ArrayList<>();
        
        // Priority 1: Weakest Category + Target Difficulty
        if (weakestCategory != null) {
            recommended.addAll(questionRepository.findByCategoryAndDifficulty(weakestCategory, targetDifficulty));
        }

        // Priority 2: Fill remains with Target Difficulty from other categories
        if (recommended.size() < 10) {
            List<Question> byDifficulty = questionRepository.findByDifficulty(targetDifficulty);
            for (Question q : byDifficulty) {
                if (recommended.size() >= 12) break;
                if (!recommended.contains(q)) recommended.add(q);
            }
        }

        // Priority 3: Final Fallback to anything
        if (recommended.isEmpty()) {
            recommended.addAll(questionRepository.findAll());
        }

        Collections.shuffle(recommended);

        // Point 1: MCQ will came first to enage user to less effort
        List<Question> sorted = new ArrayList<>();
        List<Question> mcqs = recommended.stream()
                .filter(q -> "MCQ".equalsIgnoreCase(q.getType()))
                .collect(Collectors.toList());
        List<Question> others = recommended.stream()
                .filter(q -> !"MCQ".equalsIgnoreCase(q.getType()))
                .collect(Collectors.toList());
        
        sorted.addAll(mcqs);
        sorted.addAll(others);

        return sorted.stream()
                .map(question -> new QuestionResponse(
                        question.getId(),
                        question.getTitle(),
                        question.getCategory(),
                        question.getDifficulty(),
                        question.getType(),
                        question.getOptions(),
                        question.getExplanation()
                ))
                .limit(15) // Page size
                .collect(Collectors.toList());
    }

    public void likeQuestion(Long id) {
        questionRepository.findById(id).ifPresent(question -> {
            question.setLikeCount(question.getLikeCount() + 1);
            questionRepository.save(question);
        });
    }

    public com.interviewsim.app.dto.PerformanceSummary getPerformanceSummary() {
        List<String> weak = attemptRepository.findWeakestCategories(PageRequest.of(0, 1));
        List<String> strong = attemptRepository.findStrongestCategories(PageRequest.of(0, 1));
        
        List<com.interviewsim.app.model.Attempt> all = attemptRepository.findAll();
        int total = all.size();
        int avg = total == 0 ? 0 : (int) all.stream().mapToInt(a -> a.getScore()).average().orElse(0);

        return new com.interviewsim.app.dto.PerformanceSummary(
            strong.isEmpty() ? "N/A" : strong.get(0),
            weak.isEmpty() ? "N/A" : weak.get(0),
            total,
            avg
        );
    }
}
