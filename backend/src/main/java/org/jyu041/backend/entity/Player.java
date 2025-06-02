// backend/src/main/java/org/jyu041/backend/entity/Player.java
package org.jyu041.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

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

    // Constructors
    public Player() {
        this.elementLevels = new HashMap<>();
        this.elementExperience = new HashMap<>();
        this.treasureLevels = new HashMap<>();
        this.equippedItems = new ArrayList<>();
        initializeElements();
        initializeBaseStats();
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
        this.soulCount = 0;
        this.tianniSwordLevel = 1;
        this.hasTianniSwordMutation = false;
        this.totalEnemiesKilled = 0;
        this.totalDamageDealt = 0;
        this.totalSoulsCollected = 0;
        this.totalPlaytimeSeconds = 0;

        calculateStats();
    }

    private void initializeElements() {
        String[] elements = {"metal", "wood", "water", "fire", "earth"};
        for (String elem : elements) {
            this.elementLevels.put(elem, 0);
            this.elementExperience.put(elem, 0L);
        }
    }

    private void initializeBaseStats() {
        // Base stats at level 1
        this.baseHealth = 100;
        this.baseHealthRegen = 0.0;
        this.baseMana = 100;
        this.baseManaRegen = 10.0;
        this.baseAttack = 25;
        this.baseDefense = 0;
    }

    public void calculateStats() {
        // Calculate base stats from level and cultivation
        CultivationInfo cultivation = getCultivationInfo();

        // Health calculation: 100 + level*10 + small_breakthroughs*20 + big_breakthroughs*50
        this.baseHealth = 100 + (level * 10) + (cultivation.smallBreakthroughs * 20) + (cultivation.bigBreakthroughs * 50);

        // Mana calculation: 100 + level*10 + small_breakthroughs*50 + big_breakthroughs*100
        this.baseMana = 100 + (level * 10) + (cultivation.smallBreakthroughs * 50) + (cultivation.bigBreakthroughs * 100);

        // Mana regen scales with total mana (10% of max mana per second)
        this.baseManaRegen = this.baseMana * 0.1;

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

    public static class CultivationInfo {
        public final String name;
        public final int smallBreakthroughs;
        public final int bigBreakthroughs;

        public CultivationInfo(String name, int smallBreakthroughs, int bigBreakthroughs) {
            this.name = name;
            this.smallBreakthroughs = smallBreakthroughs;
            this.bigBreakthroughs = bigBreakthroughs;
        }
    }

    // Getters and Setters (keeping existing ones and adding new ones)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public int getLevel() { return level; }
    public void setLevel(int level) {
        this.level = level;
        calculateStats();
    }

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

    // New stat getters and setters
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

    // Base stats
    public int getBaseHealth() { return baseHealth; }
    public void setBaseHealth(int baseHealth) { this.baseHealth = baseHealth; }

    public double getBaseHealthRegen() { return baseHealthRegen; }
    public void setBaseHealthRegen(double baseHealthRegen) { this.baseHealthRegen = baseHealthRegen; }

    public int getBaseMana() { return baseMana; }
    public void setBaseMana(int baseMana) { this.baseMana = baseMana; }

    public double getBaseManaRegen() { return baseManaRegen; }
    public void setBaseManaRegen(double baseManaRegen) { this.baseManaRegen = baseManaRegen; }

    public int getBaseAttack() { return baseAttack; }
    public void setBaseAttack(int baseAttack) { this.baseAttack = baseAttack; }

    public int getBaseDefense() { return baseDefense; }
    public void setBaseDefense(int baseDefense) { this.baseDefense = baseDefense; }

    // Current stats
    public int getCurrentHealth() { return currentHealth; }
    public void setCurrentHealth(int currentHealth) { this.currentHealth = currentHealth; }

    public int getCurrentMaxHealth() { return currentMaxHealth; }
    public void setCurrentMaxHealth(int currentMaxHealth) { this.currentMaxHealth = currentMaxHealth; }

    public double getCurrentHealthRegen() { return currentHealthRegen; }
    public void setCurrentHealthRegen(double currentHealthRegen) { this.currentHealthRegen = currentHealthRegen; }

    public int getCurrentMaxMana() { return currentMaxMana; }
    public void setCurrentMaxMana(int currentMaxMana) { this.currentMaxMana = currentMaxMana; }

    public double getCurrentManaRegen() { return currentManaRegen; }
    public void setCurrentManaRegen(double currentManaRegen) { this.currentManaRegen = currentManaRegen; }

    public int getCurrentAttack() { return currentAttack; }
    public void setCurrentAttack(int currentAttack) { this.currentAttack = currentAttack; }

    public int getCurrentDefense() { return currentDefense; }
    public void setCurrentDefense(int currentDefense) { this.currentDefense = currentDefense; }

    public Map<String, Integer> getTreasureLevels() { return treasureLevels; }
    public void setTreasureLevels(Map<String, Integer> treasureLevels) { this.treasureLevels = treasureLevels; }

    public int getTianniSwordLevel() { return tianniSwordLevel; }
    public void setTianniSwordLevel(int tianniSwordLevel) { this.tianniSwordLevel = tianniSwordLevel; }

    public boolean isHasTianniSwordMutation() { return hasTianniSwordMutation; }
    public void setHasTianniSwordMutation(boolean hasTianniSwordMutation) { this.hasTianniSwordMutation = hasTianniSwordMutation; }

    public List<Map<String, Object>> getEquippedItems() { return equippedItems; }
    public void setEquippedItems(List<Map<String, Object>> equippedItems) {
        this.equippedItems = equippedItems;
        calculateStats();
    }

    public long getTotalEnemiesKilled() { return totalEnemiesKilled; }
    public void setTotalEnemiesKilled(long totalEnemiesKilled) { this.totalEnemiesKilled = totalEnemiesKilled; }

    public long getTotalDamageDealt() { return totalDamageDealt; }
    public void setTotalDamageDealt(long totalDamageDealt) { this.totalDamageDealt = totalDamageDealt; }

    public long getTotalSoulsCollected() { return totalSoulsCollected; }
    public void setTotalSoulsCollected(long totalSoulsCollected) { this.totalSoulsCollected = totalSoulsCollected; }

    public long getTotalPlaytimeSeconds() { return totalPlaytimeSeconds; }
    public void setTotalPlaytimeSeconds(long totalPlaytimeSeconds) { this.totalPlaytimeSeconds = totalPlaytimeSeconds; }
}