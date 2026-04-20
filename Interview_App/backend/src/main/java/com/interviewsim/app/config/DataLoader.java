package com.interviewsim.app.config;

import com.interviewsim.app.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seedData(QuestionRepository questionRepository, com.interviewsim.app.repository.AdminAccountRepository adminRepo) {
        return args -> {
            // Seed Questions
            var catalog = InterviewQuestionCatalog.build();
            long count = questionRepository.count();
            
            if (count != catalog.size()) {
                System.out.println("Detected catalog change. Re-seeding database...");
                questionRepository.deleteAllInBatch();
                questionRepository.saveAll(catalog);
                System.out.println("Successfully seeded " + catalog.size() + " questions.");
            }

            // Seed Admin
            if (adminRepo.count() == 0) {
                adminRepo.save(new com.interviewsim.app.model.AdminAccount("admin", "admin123"));
                System.out.println("Default admin account created: admin / admin123");
            }
        };
    }
}
