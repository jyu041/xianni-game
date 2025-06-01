// backend/src/main/java/org/jyu041/backend/entity/Player.java
package org.jyu041.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "players")
public class Player {
    @Id
    private String id;
    private String playerName;
    private int level;
    private long experience;
    private long gold;
    private long gems;
    private String element; // Player's chosen element
    private LocalDateTime createdAt;
    private LocalDateTime lastPlayed;
    private long playtime;
    private int currentStage;
    private List<Integer> unlockedStages;
    private List<String> inventory;
    private Map<String, Object> equipment;
    private List<String> skills;
    private List<String> achievements;

    // New attribute system
    private String primaryElement; // "metal", "wood", "water", "fire", "earth"
    private Map<String, Integer> elementLevels; // Each element 0-100
    private Map<String, Long> elementExperience; // Experience per element
    private int mana; // Spiritual energy
    private int maxMana;
    private long soulCount; // Total souls collected

    // Equipment system
    private Map<String, Integer> treasureLevels; // 法宝 levels
    private int tianniSwordLevel; // 天逆剑 level (1-10, with special 11th level)
    private boolean hasTianniSwordMutation; // Special 11th level unlock

    // Game statistics
    private long totalEnemiesKilled;
    private long totalDamageDealt;
    private long totalSoulsCollected;
    private long totalPlaytimeSeconds;

    // Constructors
    public Player() {
        this.elementLevels = new HashMap<>();
        this.elementExperience = new HashMap<>();
        this.treasureLevels = new HashMap<>();
        initializeElements();
    }

    public Player(String playerName, String element) {
        this();
        this.playerName = playerName;
        this.level = 1;
        this.experience = 0;
        this.gold = 100;
        this.gems = 0;
        this.element = element;
        this.primaryElement = element; // Set primary element same as chosen element
        this.createdAt = LocalDateTime.now();
        this.lastPlayed = LocalDateTime.now();
        this.playtime = 0;
        this.currentStage = 1;
        this.unlockedStages = List.of(1);
        this.mana = 100;
        this.maxMana = 100;
        this.soulCount = 0;
        this.tianniSwordLevel = 1;
        this.hasTianniSwordMutation = false;
        this.totalEnemiesKilled = 0;
        this.totalDamageDealt = 0;
        this.totalSoulsCollected = 0;
        this.totalPlaytimeSeconds = 0;
    }

    private void initializeElements() {
        String[] elements = {"metal", "wood", "water", "fire", "earth"};
        for (String elem : elements) {
            this.elementLevels.put(elem, 0);
            this.elementExperience.put(elem, 0L);
        }
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

    // New getters and setters
    public String getPrimaryElement() { return primaryElement; }
    public void setPrimaryElement(String primaryElement) { this.primaryElement = primaryElement; }

    public Map<String, Integer> getElementLevels() { return elementLevels; }
    public void setElementLevels(Map<String, Integer> elementLevels) { this.elementLevels = elementLevels; }

    public Map<String, Long> getElementExperience() { return elementExperience; }
    public void setElementExperience(Map<String, Long> elementExperience) { this.elementExperience = elementExperience; }

    public int getMana() { return mana; }
    public void setMana(int mana) { this.mana = mana; }

    public int getMaxMana() { return maxMana; }
    public void setMaxMana(int maxMana) { this.maxMana = maxMana; }

    public long getSoulCount() { return soulCount; }
    public void setSoulCount(long soulCount) { this.soulCount = soulCount; }

    public Map<String, Integer> getTreasureLevels() { return treasureLevels; }
    public void setTreasureLevels(Map<String, Integer> treasureLevels) { this.treasureLevels = treasureLevels; }

    public int getTianniSwordLevel() { return tianniSwordLevel; }
    public void setTianniSwordLevel(int tianniSwordLevel) { this.tianniSwordLevel = tianniSwordLevel; }

    public boolean isHasTianniSwordMutation() { return hasTianniSwordMutation; }
    public void setHasTianniSwordMutation(boolean hasTianniSwordMutation) { this.hasTianniSwordMutation = hasTianniSwordMutation; }

    public long getTotalEnemiesKilled() { return totalEnemiesKilled; }
    public void setTotalEnemiesKilled(long totalEnemiesKilled) { this.totalEnemiesKilled = totalEnemiesKilled; }

    public long getTotalDamageDealt() { return totalDamageDealt; }
    public void setTotalDamageDealt(long totalDamageDealt) { this.totalDamageDealt = totalDamageDealt; }

    public long getTotalSoulsCollected() { return totalSoulsCollected; }
    public void setTotalSoulsCollected(long totalSoulsCollected) { this.totalSoulsCollected = totalSoulsCollected; }

    public long getTotalPlaytimeSeconds() { return totalPlaytimeSeconds; }
    public void setTotalPlaytimeSeconds(long totalPlaytimeSeconds) { this.totalPlaytimeSeconds = totalPlaytimeSeconds; }
}