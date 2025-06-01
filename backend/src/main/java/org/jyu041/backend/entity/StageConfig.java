// backend/src/main/java/org/jyu041/backend/entity/StageConfig.java
package org.jyu041.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "stage_configs")
public class StageConfig {
    @Id
    private String id;
    private int stageId;
    private String name;
    private String description;
    private String difficulty;
    private String boss;
    private String enemies;
    private String background;
    private int minLevel;
    private List<String> rewards;
    private Map<String, Object> enemySpawns;
    private Map<String, Object> stageSettings;

    // New element system
    private String stageElement; // "metal", "wood", "water", "fire", "earth", "neutral"
    private int elementLevel; // 0-100, element strength of the stage
    private Map<String, Double> elementBuffs; // Buffs when player element counters stage
    private Map<String, Double> elementDebuffs; // Debuffs when stage element counters player
    private Map<String, Double> backfireEffects; // When player is 3+ levels below stage

    // Constructors
    public StageConfig() {}

    public StageConfig(int stageId, String name, String description, String difficulty, String boss) {
        this.stageId = stageId;
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.boss = boss;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public int getStageId() { return stageId; }
    public void setStageId(int stageId) { this.stageId = stageId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getBoss() { return boss; }
    public void setBoss(String boss) { this.boss = boss; }

    public String getEnemies() { return enemies; }
    public void setEnemies(String enemies) { this.enemies = enemies; }

    public String getBackground() { return background; }
    public void setBackground(String background) { this.background = background; }

    public int getMinLevel() { return minLevel; }
    public void setMinLevel(int minLevel) { this.minLevel = minLevel; }

    public List<String> getRewards() { return rewards; }
    public void setRewards(List<String> rewards) { this.rewards = rewards; }

    public Map<String, Object> getEnemySpawns() { return enemySpawns; }
    public void setEnemySpawns(Map<String, Object> enemySpawns) { this.enemySpawns = enemySpawns; }

    public Map<String, Object> getStageSettings() { return stageSettings; }
    public void setStageSettings(Map<String, Object> stageSettings) { this.stageSettings = stageSettings; }

    // New getters and setters
    public String getStageElement() { return stageElement; }
    public void setStageElement(String stageElement) { this.stageElement = stageElement; }

    public int getElementLevel() { return elementLevel; }
    public void setElementLevel(int elementLevel) { this.elementLevel = elementLevel; }

    public Map<String, Double> getElementBuffs() { return elementBuffs; }
    public void setElementBuffs(Map<String, Double> elementBuffs) { this.elementBuffs = elementBuffs; }

    public Map<String, Double> getElementDebuffs() { return elementDebuffs; }
    public void setElementDebuffs(Map<String, Double> elementDebuffs) { this.elementDebuffs = elementDebuffs; }

    public Map<String, Double> getBackfireEffects() { return backfireEffects; }
    public void setBackfireEffects(Map<String, Double> backfireEffects) { this.backfireEffects = backfireEffects; }
}