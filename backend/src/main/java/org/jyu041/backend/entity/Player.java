// backend/src/main/java/org/jyu041/backend/entity/Player.java
package org.jyu041.backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Document(collection = "players")
@Data
@NoArgsConstructor
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

    // New cultivation and combat stats system
    private String primaryElement; // "metal", "wood", "water", "fire", "earth"
    private Map<String, Integer> elementLevels; // Each element 0-100
    private Map<String, Long> elementExperience; // Experience per element
    private int mana; // Spiritual energy
    private int maxMana;
    private long soulCount; // Total souls collected

    // Base stats (calculated from level/cultivation)
    private int baseHealth;
    private double baseHealthRegen; // per second
    private int baseMana;
    private double baseManaRegen; // per second
    private int baseAttack;
    private int baseDefense;

    // Current stats (base + equipment bonuses)
    private int currentHealth;
    private int currentMaxHealth;
    private double currentHealthRegen;
    private int currentMaxMana;
    private double currentManaRegen;
    private int currentAttack;
    private int currentDefense;

    // Equipment system
    private Map<String, Integer> treasureLevels; // 法宝 levels
    private int tianniSwordLevel; // 天逆剑 level (1-10, with special 11th level)
    private boolean hasTianniSwordMutation; // Special 11th level unlock
    private List<Map<String, Object>> equippedItems; // New equipment system

    // Game statistics
    private long totalEnemiesKilled;
    private long totalDamageDealt;
    private long totalSoulsCollected;
    private long totalPlaytimeSeconds;

    public Player(String playerName, String element) {
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
        this.soulCount = 0;
        this.tianniSwordLevel = 1;
        this.hasTianniSwordMutation = false;
        this.totalEnemiesKilled = 0;
        this.totalDamageDealt = 0;
        this.totalSoulsCollected = 0;
        this.totalPlaytimeSeconds = 0;

        initializeCollections();
        initializeBaseStats();
        calculateStats();
    }

    private void initializeCollections() {
        this.elementLevels = new HashMap<>();
        this.elementExperience = new HashMap<>();
        this.treasureLevels = new HashMap<>();
        this.equippedItems = new ArrayList<>();

        String[] elements = {"metal", "wood", "water", "fire", "earth"};
        for (String elem : elements) {
            this.elementLevels.put(elem, 0);
            this.elementExperience.put(elem, 0L);
        }
    }

    private void initializeBaseStats() {
        // Base stats at level 1
        this.baseHealth = 100;
        this.baseHealthRegen = 0.0; // No base health regen as specified
        this.baseMana = 100;
        this.baseManaRegen = 10.0; // Will be recalculated based on total mana
        this.baseAttack = 25;
        this.baseDefense = 0;
    }

    // Custom setter for level that triggers stat recalculation
    public void setLevel(int level) {
        this.level = level;
        calculateStats();
    }

    public void setEquippedItems(List<Map<String, Object>> equippedItems) {
        this.equippedItems = equippedItems;
        calculateStats();
    }

    public void calculateStats() {
        // Calculate base stats from level and cultivation
        CultivationInfo cultivation = getCultivationInfo();

        // Health calculation: 100 + level*10 + small_breakthroughs*20 + big_breakthroughs*50
        this.baseHealth = 100 + (level * 10) + (cultivation.smallBreakthroughs * 20) + (cultivation.bigBreakthroughs * 50);

        // Mana calculation: 100 + level*10 + small_breakthroughs*50 + big_breakthroughs*100
        this.baseMana = 100 + (level * 10) + (cultivation.smallBreakthroughs * 50) + (cultivation.bigBreakthroughs * 100);

        // Mana regen scales with total mana (more balanced: 5% of max mana per second)
        this.baseManaRegen = this.baseMana * 0.05;

        // Attack calculation: 25 + level*5 + small_breakthroughs*10 + big_breakthroughs*25
        this.baseAttack = 25 + (level * 5) + (cultivation.smallBreakthroughs * 10) + (cultivation.bigBreakthroughs * 25);

        // Defense calculation: 0 + level*1 + small_breakthroughs*2 + big_breakthroughs*5
        this.baseDefense = 0 + (level * 1) + (cultivation.smallBreakthroughs * 2) + (cultivation.bigBreakthroughs * 5);

        // Apply equipment bonuses
        applyEquipmentBonuses();

        // Set current health and mana if not set
        if (this.currentHealth <= 0) {
            this.currentHealth = this.currentMaxHealth;
        }
        if (this.mana <= 0) {
            this.mana = this.currentMaxMana;
        }
    }

    private void applyEquipmentBonuses() {
        // Start with base stats
        this.currentMaxHealth = this.baseHealth;
        this.currentHealthRegen = this.baseHealthRegen;
        this.currentMaxMana = this.baseMana;
        this.currentManaRegen = this.baseManaRegen;
        this.currentAttack = this.baseAttack;
        this.currentDefense = this.baseDefense;

        // Apply equipment percentage bonuses
        if (equippedItems != null) {
            for (Map<String, Object> item : equippedItems) {
                Map<String, Object> stats = (Map<String, Object>) item.get("stats");
                if (stats != null) {
                    // Health bonuses
                    if (stats.containsKey("healthPercent")) {
                        double bonus = ((Number) stats.get("healthPercent")).doubleValue() / 100.0;
                        this.currentMaxHealth += (int)(this.baseHealth * bonus);
                    }

                    // Health regen bonuses
                    if (stats.containsKey("healthRegenPercent")) {
                        double bonus = ((Number) stats.get("healthRegenPercent")).doubleValue() / 100.0;
                        this.currentHealthRegen += this.baseHealthRegen * bonus;
                    }

                    // Mana bonuses
                    if (stats.containsKey("manaPercent")) {
                        double bonus = ((Number) stats.get("manaPercent")).doubleValue() / 100.0;
                        this.currentMaxMana += (int)(this.baseMana * bonus);
                    }

                    // Mana regen bonuses
                    if (stats.containsKey("manaRegenPercent")) {
                        double bonus = ((Number) stats.get("manaRegenPercent")).doubleValue() / 100.0;
                        this.currentManaRegen += this.baseManaRegen * bonus;
                    }

                    // Attack bonuses
                    if (stats.containsKey("attackPercent")) {
                        double bonus = ((Number) stats.get("attackPercent")).doubleValue() / 100.0;
                        this.currentAttack += (int)(this.baseAttack * bonus);
                    }

                    // Defense bonuses
                    if (stats.containsKey("defensePercent")) {
                        double bonus = ((Number) stats.get("defensePercent")).doubleValue() / 100.0;
                        this.currentDefense += (int)(this.baseDefense * bonus);
                    }
                }
            }
        }
    }

    public CultivationInfo getCultivationInfo() {
        if (level <= 15) {
            // 凝气期 (1-15层)
            String[] chineseNumbers = {"", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五"};
            return new CultivationInfo("凝气" + chineseNumbers[level] + "层", 0, level <= 15 ? 0 : 1);
        }

        // Calculate stage and phase for post-凝气 levels
        int adjustedLevel = level - 15; // Levels after 凝气
        int stageIndex = (adjustedLevel - 1) / 20; // Which major stage (筑基, 结丹, etc.)
        int phaseInStage = ((adjustedLevel - 1) % 20) / 5; // Which phase within stage (初期, 中期, 后期, 大圆满)

        String[] stages = {"筑基", "结丹", "元婴", "化神", "婴变", "问鼎", "阴虚", "阳实"};
        String[] phases = {"初期", "中期", "后期", "大圆满"};

        String stageName = stages[Math.min(stageIndex, stages.length - 1)];
        String phaseName = phases[phaseInStage];

        // Calculate breakthroughs
        int smallBreakthroughs = (adjustedLevel - 1) / 5; // Every 5 levels after 凝气
        int bigBreakthroughs = 1 + stageIndex; // 凝气->筑基 + major stage transitions

        return new CultivationInfo(stageName + phaseName, smallBreakthroughs, bigBreakthroughs);
    }

    @Data
    @AllArgsConstructor
    public static class CultivationInfo {
        public final String name;
        public final int smallBreakthroughs;
        public final int bigBreakthroughs;
    }
}