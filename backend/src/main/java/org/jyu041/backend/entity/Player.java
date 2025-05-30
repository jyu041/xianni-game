// backend/src/main/java/org/jyu041/backend/entity/Player.java
package org.jyu041.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "players")
public class Player {
    @Id
    private String id;
    private String playerName;
    private int level;
    private long experience;
    private long gold;
    private long gems;
    private String difficulty;
    private String cultivation;
    private String element;
    private LocalDateTime createdAt;
    private LocalDateTime lastPlayed;
    private long playtime;
    private int currentStage;
    private List<Integer> unlockedStages;
    private List<String> inventory;
    private Map<String, Object> equipment;
    private List<String> skills;
    private List<String> achievements;

    // Constructors
    public Player() {}

    public Player(String playerName, String difficulty, String cultivation, String element) {
        this.playerName = playerName;
        this.level = 1;
        this.experience = 0;
        this.gold = 100;
        this.gems = 0;
        this.difficulty = difficulty;
        this.cultivation = cultivation;
        this.element = element;
        this.createdAt = LocalDateTime.now();
        this.lastPlayed = LocalDateTime.now();
        this.playtime = 0;
        this.currentStage = 1;
        this.unlockedStages = List.of(1);
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public long getExperience() { return experience; }
    public void setExperience(long experience) { this.experience = experience; }

    public long getGold() { return gold; }
    public void setGold(long gold) { this.gold = gold; }

    public long getGems() { return gems; }
    public void setGems(long gems) { this.gems = gems; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getCultivation() { return cultivation; }
    public void setCultivation(String cultivation) { this.cultivation = cultivation; }

    public String getElement() { return element; }
    public void setElement(String element) { this.element = element; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastPlayed() { return lastPlayed; }
    public void setLastPlayed(LocalDateTime lastPlayed) { this.lastPlayed = lastPlayed; }

    public long getPlaytime() { return playtime; }
    public void setPlaytime(long playtime) { this.playtime = playtime; }

    public int getCurrentStage() { return currentStage; }
    public void setCurrentStage(int currentStage) { this.currentStage = currentStage; }

    public List<Integer> getUnlockedStages() { return unlockedStages; }
    public void setUnlockedStages(List<Integer> unlockedStages) { this.unlockedStages = unlockedStages; }

    public List<String> getInventory() { return inventory; }
    public void setInventory(List<String> inventory) { this.inventory = inventory; }

    public Map<String, Object> getEquipment() { return equipment; }
    public void setEquipment(Map<String, Object> equipment) { this.equipment = equipment; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<String> getAchievements() { return achievements; }
    public void setAchievements(List<String> achievements) { this.achievements = achievements; }
}