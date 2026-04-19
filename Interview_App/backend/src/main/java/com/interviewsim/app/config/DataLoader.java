package com.interviewsim.app.config;

import com.interviewsim.app.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seedQuestions(QuestionRepository questionRepository) {
        return args -> {
            var catalog = InterviewQuestionCatalog.build();
            long count = questionRepository.count();
            
            System.out.println("DB Question Count: " + count);
            System.out.println("Catalog Size: " + catalog.size());

            if (count == catalog.size()) {
                System.out.println("Database is already up to date with the catalog.");
                return;
            }

            System.out.println("Detected catalog change. Re-seeding database...");
            questionRepository.deleteAllInBatch();
            questionRepository.saveAll(catalog);
            System.out.println("Successfully seeded " + catalog.size() + " questions.");
        };
    }
}
