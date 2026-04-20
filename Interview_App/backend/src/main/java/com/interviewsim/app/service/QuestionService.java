package com.interviewsim.app.service;

import com.interviewsim.app.dto.QuestionResponse;
import com.interviewsim.app.model.Attempt;
import com.interviewsim.app.model.Question;
import com.interviewsim.app.repository.AttemptRepository;
import com.interviewsim.app.repository.QuestionRepository;
import com.interviewsim.app.repository.PageViewRepository;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;
    private final PageViewRepository pageViewRepository;
    private final RestTemplate restTemplate;

    @Value("${jdoodle.client-id}")
    private String jdoodleClientId;

    @Value("${jdoodle.client-secret}")
    private String jdoodleClientSecret;

    public QuestionService(QuestionRepository questionRepository, 
                           AttemptRepository attemptRepository,
                           PageViewRepository pageViewRepository,
                           RestTemplate restTemplate) {
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.pageViewRepository = pageViewRepository;
        this.restTemplate = restTemplate;
    }

    public List<QuestionResponse> getFeed(int page) {
        // For simple local testing, we still use the dopamine logic for page 0
        // and just plain pagination for subsequent pages
        if (page == 0) {
            return getDopamineFeed();
        }
        
        return questionRepository.findAll(PageRequest.of(page, 20)).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Original dopamine logic moved to separate method
    private List<QuestionResponse> getDopamineFeed() {
        String targetDifficulty = "Medium";
        List<Integer> recentScores = attemptRepository.findRecentScores(PageRequest.of(0, 5));

        if (recentScores.size() < 1) {
            targetDifficulty = "Easy";
        } else {
            double avg = recentScores.stream().mapToInt(Integer::intValue).average().orElse(5.0);
            if (avg >= 7.5) targetDifficulty = "Hard";
            else if (avg <= 4.0) targetDifficulty = "Easy";
        }

        List<String> weakCategories = attemptRepository.findWeakestCategories(PageRequest.of(0, 1));
        String weakestCategory = weakCategories.isEmpty() ? null : weakCategories.get(0);

        List<Question> recommended = new ArrayList<>();
        if (weakestCategory != null) {
            recommended.addAll(questionRepository.findByCategoryAndDifficulty(weakestCategory, targetDifficulty));
        }

        if (recommended.size() < 15) {
            List<Question> byDifficulty = questionRepository.findByDifficulty(targetDifficulty);
            for (Question q : byDifficulty) {
                if (recommended.size() >= 25) break;
                if (!recommended.contains(q)) recommended.add(q);
            }
        }

        if (recommended.isEmpty()) recommended.addAll(questionRepository.findAll());
        Collections.shuffle(recommended);

        List<Question> easy   = recommended.stream().filter(q -> "Easy".equalsIgnoreCase(q.getDifficulty())).collect(Collectors.toList());
        List<Question> medium = recommended.stream().filter(q -> "Medium".equalsIgnoreCase(q.getDifficulty())).collect(Collectors.toList());
        List<Question> hard   = recommended.stream().filter(q -> "Hard".equalsIgnoreCase(q.getDifficulty())).collect(Collectors.toList());

        List<Question> easyMcqs    = easy.stream().filter(q -> "MCQ".equalsIgnoreCase(q.getType())).collect(Collectors.toList());
        List<Question> easyNonMcqs = easy.stream().filter(q -> !"MCQ".equalsIgnoreCase(q.getType())).collect(Collectors.toList());

        List<Question> sorted = new ArrayList<>();
        int warmupCount = 0;
        for (Question q : easyMcqs) { if (warmupCount >= 3) break; sorted.add(q); warmupCount++; }
        for (Question q : easyNonMcqs) { if (warmupCount >= 3) break; sorted.add(q); warmupCount++; }

        List<Question> remaining = recommended.stream().filter(q -> !sorted.contains(q)).collect(Collectors.toList());
        Collections.shuffle(remaining);

        List<Question> remEasy   = remaining.stream().filter(q -> "Easy".equalsIgnoreCase(q.getDifficulty())).collect(Collectors.toList());
        List<Question> remMedium = remaining.stream().filter(q -> "Medium".equalsIgnoreCase(q.getDifficulty())).collect(Collectors.toList());
        List<Question> remHard   = remaining.stream().filter(q -> "Hard".equalsIgnoreCase(q.getDifficulty())).collect(Collectors.toList());

        int[] pattern = {0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1};
        int[] ptrs = {0, 0, 0};
        List<List<Question>> buckets = Arrays.asList(remEasy, remMedium, remHard);

        for (int p : pattern) {
            if (sorted.size() >= 20) break;
            List<Question> bucket = buckets.get(p);
            if (ptrs[p] < bucket.size()) { sorted.add(bucket.get(ptrs[p])); ptrs[p]++; }
        }

        for (int b = 0; b < 3; b++) {
            List<Question> bucket = buckets.get(b);
            for (int i = ptrs[b]; i < bucket.size(); i++) {
                if (sorted.size() >= 20) break;
                if (!sorted.contains(bucket.get(i))) sorted.add(bucket.get(i));
            }
        }

        return enforceTopicVariety(sorted).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public QuestionResponse getDailyChallenge() {
        // Deterministic selection based on day
        long daySeed = LocalDate.now().toEpochDay();
        List<Question> all = questionRepository.findAll();
        if (all.isEmpty()) return null;
        int index = (int) (daySeed % all.size());
        return mapToResponse(all.get(index));
    }

    public List<QuestionResponse> getByCompany(String company) {
        return questionRepository.findByCompanyContainingIgnoreCase(company).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void recordSkip(Long id, String visitorId) {
        questionRepository.findById(id).ifPresent(q -> {
            q.setSkipCount(q.getSkipCount() + 1);
            questionRepository.save(q);
            
            // Log as a skipped attempt
            Attempt skip = new Attempt();
            skip.setQuestionId(id);
            skip.setVisitorId(visitorId);
            skip.setUserAnswer("N/A (Skipped)"); // Fix: Satisfy non-null constraint
            skip.setScore(0);
            skip.setFeedback("Skipped");
            skip.setSkipped(true);
            skip.setCategory(q.getCategory());
            skip.setDifficulty(q.getDifficulty());
            attemptRepository.save(skip);
        });
    }

    public List<Map<String, Object>> getQuestionAnalytics() {
        return questionRepository.findAll().stream().map(q -> {
            Map<String, Object> stats = new HashMap<>();
            stats.put("id", q.getId());
            stats.put("title", q.getTitle());
            stats.put("category", q.getCategory());
            stats.put("difficulty", q.getDifficulty());
            stats.put("attempts", q.getAttemptCount());
            stats.put("skips", q.getSkipCount());
            stats.put("avgScore", q.getAverageScore());
            stats.put("skipRate", q.getAttemptCount() + q.getSkipCount() == 0 ? 0 : 
                    Math.round((double) q.getSkipCount() / (q.getAttemptCount() + q.getSkipCount()) * 100));
            return stats;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> bulkImport(MultipartFile file) {
        int imported = 0;
        int errors = 0;
        try (Reader reader = new InputStreamReader(file.getInputStream())) {
            CSVParser parser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());
            for (CSVRecord record : parser) {
                try {
                    Question q = new Question();
                    q.setTitle(record.get("title"));
                    q.setCategory(record.get("category"));
                    q.setDifficulty(record.get("difficulty"));
                    q.setType(record.get("type"));
                    q.setOptions(record.get("options"));
                    q.setReferenceAnswer(record.get("answer"));
                    if (record.isMapped("company")) q.setCompany(record.get("company"));
                    questionRepository.save(q);
                    imported++;
                } catch (Exception e) { errors++; }
            }
        } catch (Exception e) { return Map.of("error", e.getMessage()); }
        return Map.of("status", "success", "imported", imported, "errors", errors);
    }

    public Map<String, Object> executeCode(String script, String language, String versionIndex) {
        Map<String, Object> body = new HashMap<>();
        body.put("clientId", jdoodleClientId);
        body.put("clientSecret", jdoodleClientSecret);
        body.put("script", script);
        body.put("language", language);
        body.put("versionIndex", versionIndex);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            return restTemplate.postForObject("https://api.jdoodle.com/v1/execute", entity, Map.class);
        } catch (Exception e) {
            return Map.of("output", "Execution failed: " + e.getMessage(), "statusCode", 500);
        }
    }

    private QuestionResponse mapToResponse(Question q) {
        return new QuestionResponse(
                q.getId(), q.getTitle(), q.getCategory(),
                q.getDifficulty(), q.getType(), q.getOptions(), 
                q.getExplanation(), q.getCompany()
        );
    }

    private List<Question> enforceTopicVariety(List<Question> questions) {
        if (questions.size() <= 1) return questions;
        List<Question> result = new ArrayList<>();
        List<Question> pool = new ArrayList<>(questions);
        while (!pool.isEmpty()) {
            String lastCat = result.isEmpty() ? null : result.get(result.size() - 1).getCategory();
            Question picked = null;
            for (Question q : pool) { if (!q.getCategory().equals(lastCat)) { picked = q; break; } }
            if (picked == null) picked = pool.get(0);
            result.add(picked);
            pool.remove(picked);
        }
        return result;
    }

    public List<QuestionResponse> searchQuestions(String query) {
        return questionRepository.searchAll(query).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void likeQuestion(Long id) {
        questionRepository.findById(id).ifPresent(q -> {
            q.setLikeCount(q.getLikeCount() + 1);
            questionRepository.save(q);
        });
    }

    public com.interviewsim.app.dto.PerformanceSummary getPerformanceSummary() {
        List<String> weak = attemptRepository.findWeakestCategories(PageRequest.of(0, 1));
        List<String> strong = attemptRepository.findStrongestCategories(PageRequest.of(0, 1));
        List<Attempt> all = attemptRepository.findAll();
        int total = all.size();
        int avg = total == 0 ? 0 : (int) all.stream().mapToInt(a -> a.getScore()).filter(s -> s > 0).average().orElse(0);
        return new com.interviewsim.app.dto.PerformanceSummary(
            strong.isEmpty() ? "N/A" : strong.get(0),
            weak.isEmpty() ? "N/A" : weak.get(0),
            total, avg
        );
    }
}
