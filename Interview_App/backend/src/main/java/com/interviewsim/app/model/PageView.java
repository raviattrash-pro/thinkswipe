package com.interviewsim.app.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "page_views")
public class PageView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String visitorId;

    @Column(length = 20)
    private String platform; // MOBILE, DESKTOP

    @Column
    private Integer questionsAttempted = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime sessionStart = LocalDateTime.now();

    @Column
    private LocalDateTime lastSeen = LocalDateTime.now();

    // --- Gamification ---
    @Column(nullable = false)
    private Integer xp = 0;

    @Column(nullable = false)
    private Integer streak = 0;

    @Column
    private LocalDate lastAttemptDate; // for streak calculation

    public PageView() {}

    public PageView(String visitorId, String platform) {
        this.visitorId = visitorId;
        this.platform = platform;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVisitorId() { return visitorId; }
    public void setVisitorId(String visitorId) { this.visitorId = visitorId; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public Integer getQuestionsAttempted() { return questionsAttempted; }
    public void setQuestionsAttempted(Integer questionsAttempted) { this.questionsAttempted = questionsAttempted; }

    public LocalDateTime getSessionStart() { return sessionStart; }
    public void setSessionStart(LocalDateTime sessionStart) { this.sessionStart = sessionStart; }

    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }

    public Integer getXp() { return xp; }
    public void setXp(Integer xp) { this.xp = xp; }

    public Integer getStreak() { return streak; }
    public void setStreak(Integer streak) { this.streak = streak; }

    public LocalDate getLastAttemptDate() { return lastAttemptDate; }
    public void setLastAttemptDate(LocalDate lastAttemptDate) { this.lastAttemptDate = lastAttemptDate; }
}
