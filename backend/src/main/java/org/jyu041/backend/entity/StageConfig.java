// backend/src/main/java/org/jyu041/backend/entity/StageConfig.java
package org.jyu041.backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "stage_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    // Convenience constructor for basic stage creation
    public StageConfig(int stageId, String name, String description, String difficulty, String boss) {
        this.stageId = stageId;
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.boss = boss;
    }
}