// backend/src/main/java/org/jyu041/backend/entity/GameSession.java
package org.jyu041.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "game_sessions")
public class GameSession {
    @Id
    private String id;
    private String playerId;
    private int stageId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private long duration; // in seconds
    private long scoreAchieved;
    private long experienceGained;
    private long goldGained;
    private Map<String, Object> stats; // kills, damage dealt, etc.
    private boolean completed;
    private String endReason; // "completed", "died", "quit"

    // Constructors
    public GameSession() {}

    public GameSession(String playerId, int stageId) {
        this.playerId = playerId;
        this.stageId = stageId;
        this.startTime = LocalDateTime.now();
        this.completed = false;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }

    public int getStageId() { return stageId; }
    public void setStageId(int stageId) { this.stageId = stageId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public long getDuration() { return duration; }
    public void setDuration(long duration) { this.duration = duration; }

    public long getScoreAchieved() { return scoreAchieved; }
    public void setScoreAchieved(long scoreAchieved) { this.scoreAchieved = scoreAchieved; }

    public long getExperienceGained() { return experienceGained; }
    public void setExperienceGained(long experienceGained) { this.experienceGained = experienceGained; }

    public long getGoldGained() { return goldGained; }
    public void setGoldGained(long goldGained) { this.goldGained = goldGained; }

    public Map<String, Object> getStats() { return stats; }
    public void setStats(Map<String, Object> stats) { this.stats = stats; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public String getEndReason() { return endReason; }
    public void setEndReason(String endReason) { this.endReason = endReason; }
}