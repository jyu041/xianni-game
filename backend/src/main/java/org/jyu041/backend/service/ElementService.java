// backend/src/main/java/org/jyu041/backend/service/ElementService.java
package org.jyu041.backend.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class ElementService {

    // Element relationships
    private final Map<String, String> elementCounters = new HashMap<>();
    private final Map<String, String> elementNames = new HashMap<>();
    private final Map<String, String> elementColors = new HashMap<>();
    private final Map<String, String> elementDescriptions = new HashMap<>();

    public ElementService() {
        initializeElementSystem();
    }

    private void initializeElementSystem() {
        // Element counter relationships
        elementCounters.put("metal", "wood");  // 金克木
        elementCounters.put("wood", "earth");  // 木克土
        elementCounters.put("earth", "water"); // 土克水
        elementCounters.put("water", "fire");  // 水克火
        elementCounters.put("fire", "metal");  // 火克金

        // Element names in Chinese
        elementNames.put("metal", "金");
        elementNames.put("wood", "木");
        elementNames.put("water", "水");
        elementNames.put("fire", "火");
        elementNames.put("earth", "土");

        // Element colors
        elementColors.put("metal", "#8B5CF6");  // 赛博蓝紫
        elementColors.put("wood", "#22C55E");   // 沼泽绿
        elementColors.put("water", "#0EA5E9");  // 深海蓝
        elementColors.put("fire", "#DC2626");   // 暗黑红
        elementColors.put("earth", "#F59E0B");  // 橙黄

        // Element descriptions
        elementDescriptions.put("metal", "锋锐断生机，万刃摧古木");
        elementDescriptions.put("wood", "根须裂山岳，腐土化尘烟");
        elementDescriptions.put("earth", "尘掩千江浪，沙葬深海怒");
        elementDescriptions.put("water", "寒渊熄焚天，雨落烬成灰");
        elementDescriptions.put("fire", "熔锋铸天命，烈炎炼道兵");
    }

    /**
     * Calculate element interaction effects between player and stage
     */
    public ElementInteraction calculateElementInteraction(String playerElement, int playerLevel,
                                                          String stageElement, int stageLevel) {
        ElementInteraction interaction = new ElementInteraction();

        if (stageElement == null || stageElement.equals("neutral")) {
            return interaction; // No interaction with neutral stages
        }

        String playerCounters = elementCounters.get(playerElement);
        String stageCounters = elementCounters.get(stageElement);

        if (playerCounters != null && playerCounters.equals(stageElement)) {
            // Player element counters stage element
            if (playerLevel >= stageLevel) {
                // Normal advantage
                interaction.setDamageMultiplier(1.25);
                interaction.setDamageReduction(0.15);
                interaction.setManaEfficiency(0.85);
                interaction.setEffectType("advantage");
            } else if (playerLevel < stageLevel - 2) {
                // Backfire - player is 3+ levels below
                interaction.setDamageMultiplier(1.0);
                interaction.setDamageReduction(0.0);
                interaction.setManaEfficiency(1.5);
                interaction.setHealthCostOnSkill(true);
                interaction.setEffectType("backfire");
            } else {
                // Weak advantage
                interaction.setDamageMultiplier(1.1);
                interaction.setDamageReduction(0.05);
                interaction.setManaEfficiency(0.95);
                interaction.setEffectType("weak_advantage");
            }
        } else if (stageCounters != null && stageCounters.equals(playerElement)) {
            // Stage element counters player element
            if (stageLevel >= playerLevel) {
                // Disadvantage
                interaction.setDamageMultiplier(0.8);
                interaction.setDamageReduction(-0.15);
                interaction.setManaEfficiency(1.2);
                interaction.setEffectType("disadvantage");
            }
        }

        return interaction;
    }

    /**
     * Calculate element experience gain
     */
    public Map<String, Long> calculateElementExperienceGain(String primaryElement, long baseExperience) {
        Map<String, Long> experienceGain = new HashMap<>();
        String[] elements = {"metal", "wood", "water", "fire", "earth"};

        for (String element : elements) {
            if (element.equals(primaryElement)) {
                experienceGain.put(element, baseExperience);
            } else {
                experienceGain.put(element, baseExperience / 5); // 20% for non-primary
            }
        }

        return experienceGain;
    }

    /**
     * Calculate element level from experience
     */
    public int calculateElementLevel(long experience) {
        // Each level requires 1000 experience, max level 100
        return Math.min(100, (int)(experience / 1000));
    }

    /**
     * Calculate required experience for next level
     */
    public long getRequiredExperienceForLevel(int level) {
        return level * 1000L;
    }

    /**
     * Get passive bonus for element level
     */
    public double getElementPassiveBonus(String element, int level, boolean isPrimary) {
        double baseBonus = getBaseElementBonus(element, level);
        return isPrimary ? baseBonus : baseBonus * 0.1; // 10% for non-primary
    }

    private double getBaseElementBonus(String element, int level) {
        double percentage = level / 100.0; // 0 to 1.0

        switch (element) {
            case "metal":
                return percentage * 1.0; // 0-100% more external resources
            case "wood":
                return percentage * 0.25; // 0-25% health regeneration based on missing health
            case "water":
                return percentage * 0.25; // 0-25% mana per second
            case "fire":
                return percentage * 0.25; // 0-25% damage increase
            case "earth":
                return percentage * 0.25; // 0-25% damage reduction
            default:
                return 0.0;
        }
    }

    /**
     * Check if player has "大元素使" achievement
     */
    public boolean hasGreatElementMasterAchievement(Map<String, Integer> elementLevels) {
        return elementLevels.values().stream().allMatch(level -> level >= 100);
    }

    // Getters for element data
    public String getElementName(String element) { return elementNames.get(element); }
    public String getElementColor(String element) { return elementColors.get(element); }
    public String getElementDescription(String element) { return elementDescriptions.get(element); }
    public String getElementCounter(String element) { return elementCounters.get(element); }

    /**
     * Inner class for element interaction results
     */
    public static class ElementInteraction {
        private double damageMultiplier = 1.0;
        private double damageReduction = 0.0;
        private double manaEfficiency = 1.0;
        private boolean healthCostOnSkill = false;
        private String effectType = "neutral";

        // Getters and setters
        public double getDamageMultiplier() { return damageMultiplier; }
        public void setDamageMultiplier(double damageMultiplier) { this.damageMultiplier = damageMultiplier; }

        public double getDamageReduction() { return damageReduction; }
        public void setDamageReduction(double damageReduction) { this.damageReduction = damageReduction; }

        public double getManaEfficiency() { return manaEfficiency; }
        public void setManaEfficiency(double manaEfficiency) { this.manaEfficiency = manaEfficiency; }

        public boolean isHealthCostOnSkill() { return healthCostOnSkill; }
        public void setHealthCostOnSkill(boolean healthCostOnSkill) { this.healthCostOnSkill = healthCostOnSkill; }

        public String getEffectType() { return effectType; }
        public void setEffectType(String effectType) { this.effectType = effectType; }
    }
}