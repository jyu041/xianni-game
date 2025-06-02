// backend/src/main/java/org/jyu041/backend/service/PlayerService.java
package org.jyu041.backend.service;

import org.jyu041.backend.entity.Player;
import org.jyu041.backend.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private ElementService elementService;

    @Autowired
    private EquipmentService equipmentService;

    public List<Player> getAllPlayers() {
        return playerRepository.findAllByOrderByLastPlayedDesc();
    }

    public Optional<Player> getPlayerById(String id) {
        return playerRepository.findById(id);
    }

    public Optional<Player> getPlayerByName(String playerName) {
        return playerRepository.findByPlayerName(playerName);
    }

    public Player createPlayer(String playerName, String element) {
        Player player = new Player(playerName, element);
        return playerRepository.save(player);
    }

    public Player updatePlayer(Player player) {
        player.setLastPlayed(LocalDateTime.now());
        player.calculateStats(); // Recalculate stats when updating
        return playerRepository.save(player);
    }

    public void deletePlayer(String id) {
        playerRepository.deleteById(id);
    }

    public Player addExperience(String playerId, long experience) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setExperience(player.getExperience() + experience);

            // Check for level up
            int newLevel = calculateLevelFromExperience(player.getExperience());
            if (newLevel > player.getLevel()) {
                player.setLevel(newLevel);
            }

            return playerRepository.save(player);
        }
        return null;
    }

    public Player addGold(String playerId, long gold) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setGold(player.getGold() + gold);
            return playerRepository.save(player);
        }
        return null;
    }

    public Player addGems(String playerId, long gems) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setGems(player.getGems() + gems);
            return playerRepository.save(player);
        }
        return null;
    }

    public Player unlockStage(String playerId, int stageId) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            List<Integer> unlockedStages = new ArrayList<>(player.getUnlockedStages());
            if (!unlockedStages.contains(stageId)) {
                unlockedStages.add(stageId);
                player.setUnlockedStages(unlockedStages);
                return playerRepository.save(player);
            }
        }
        return null;
    }

    // New equipment methods
    public Player equipItem(String playerId, String itemId) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            Map<String, Object> item = equipmentService.getEquipmentById(itemId);

            if (item != null) {
                // Check level requirement
                int levelReq = (Integer) item.get("levelRequirement");
                if (player.getLevel() < levelReq) {
                    return null; // Not high enough level
                }

                List<Map<String, Object>> equipped = player.getEquippedItems();
                if (equipped == null) {
                    equipped = new ArrayList<>();
                }

                // Check if already equipped
                boolean alreadyEquipped = equipped.stream()
                        .anyMatch(equippedItem -> itemId.equals(equippedItem.get("id")));

                if (!alreadyEquipped) {
                    // Create equipped item entry
                    Map<String, Object> equippedItem = new HashMap<>(item);
                    equippedItem.put("equippedAt", System.currentTimeMillis());
                    equipped.add(equippedItem);

                    player.setEquippedItems(equipped);
                    return playerRepository.save(player);
                }
            }
        }
        return null;
    }

    public Player unequipItem(String playerId, String itemId) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            List<Map<String, Object>> equipped = player.getEquippedItems();

            if (equipped != null) {
                equipped.removeIf(item -> itemId.equals(item.get("id")));
                player.setEquippedItems(equipped);
                return playerRepository.save(player);
            }
        }
        return null;
    }

    public Player updateCurrentStage(String playerId, int stageId) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setCurrentStage(stageId);
            return playerRepository.save(player);
        }
        return null;
    }

    public Player updatePlaytime(String playerId, long additionalSeconds) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setTotalPlaytimeSeconds(player.getTotalPlaytimeSeconds() + additionalSeconds);
            player.setPlaytime(player.getPlaytime() + additionalSeconds);
            return playerRepository.save(player);
        }
        return null;
    }

    public Player updateLastPlayed(String playerId) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setLastPlayed(LocalDateTime.now());
            return playerRepository.save(player);
        }
        return null;
    }

    /**
     * Add element experience and update levels
     */
    public Player addElementExperience(String playerId, Map<String, Long> elementExperience) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            Map<String, Long> currentExp = player.getElementExperience();
            Map<String, Integer> currentLevels = player.getElementLevels();

            boolean levelChanged = false;
            for (Map.Entry<String, Long> entry : elementExperience.entrySet()) {
                String element = entry.getKey();
                Long expGain = entry.getValue();

                // Add experience
                Long newExp = currentExp.getOrDefault(element, 0L) + expGain;
                currentExp.put(element, newExp);

                // Check for level up
                int newLevel = elementService.calculateElementLevel(newExp);
                int oldLevel = currentLevels.getOrDefault(element, 0);

                if (newLevel > oldLevel) {
                    currentLevels.put(element, newLevel);
                    levelChanged = true;
                }
            }

            player.setElementExperience(currentExp);
            player.setElementLevels(currentLevels);

            // Check for 大元素使 achievement
            if (levelChanged && elementService.hasGreatElementMasterAchievement(currentLevels)) {
                List<String> achievements = new ArrayList<>(player.getAchievements() != null ? player.getAchievements() : new ArrayList<>());
                if (!achievements.contains("大元素使")) {
                    achievements.add("大元素使");
                    player.setAchievements(achievements);

                    // Check for Tianni Sword mutation unlock
                    if (player.getTianniSwordLevel() >= 10) {
                        player.setHasTianniSwordMutation(true);
                    }
                }
            }

            return playerRepository.save(player);
        }
        return null;
    }

    /**
     * Update primary element
     */
    public Player updatePrimaryElement(String playerId, String primaryElement) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setPrimaryElement(primaryElement);
            return playerRepository.save(player);
        }
        return null;
    }

    /**
     * Update treasure levels
     */
    public Player updateTreasureLevel(String playerId, String treasureName, int level) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            Map<String, Integer> treasureLevels = player.getTreasureLevels();
            if (treasureLevels == null) {
                treasureLevels = new HashMap<>();
            }
            treasureLevels.put(treasureName, level);
            player.setTreasureLevels(treasureLevels);
            return playerRepository.save(player);
        }
        return null;
    }

    /**
     * Upgrade Tianni Sword
     */
    public Player upgradeTianniSword(String playerId) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            int currentLevel = player.getTianniSwordLevel();

            if (currentLevel < 10) {
                player.setTianniSwordLevel(currentLevel + 1);

                // Check for mutation unlock at level 10
                if (currentLevel + 1 == 10 && elementService.hasGreatElementMasterAchievement(player.getElementLevels())) {
                    player.setHasTianniSwordMutation(true);
                }

                return playerRepository.save(player);
            }
        }
        return null;
    }

    /**
     * Add mana
     */
    public Player addMana(String playerId, int mana) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            int newMana = Math.min(player.getCurrentMaxMana(), player.getMana() + mana);
            player.setMana(newMana);
            return playerRepository.save(player);
        }
        return null;
    }

    /**
     * Use mana
     */
    public Player useMana(String playerId, int manaCost) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            if (player.getMana() >= manaCost) {
                player.setMana(player.getMana() - manaCost);
                return playerRepository.save(player);
            }
        }
        return null;
    }

    /**
     * Update game statistics
     */
    public Player updateGameStats(String playerId, long enemiesKilled, long damageDealt, long soulsCollected) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setTotalEnemiesKilled(player.getTotalEnemiesKilled() + enemiesKilled);
            player.setTotalDamageDealt(player.getTotalDamageDealt() + damageDealt);
            player.setTotalSoulsCollected(player.getTotalSoulsCollected() + soulsCollected);
            return playerRepository.save(player);
        }
        return null;
    }

    public Player completeStage(String playerId, int stageId, long score, long experience, long gold) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();

            // Add rewards
            player.setExperience(player.getExperience() + experience);
            player.setGold(player.getGold() + gold);

            // Add element experience based on primary element
            Map<String, Long> elementExpGain = elementService.calculateElementExperienceGain(
                    player.getPrimaryElement(), experience
            );
            addElementExperience(playerId, elementExpGain);

            // Check for level up
            int newLevel = calculateLevelFromExperience(player.getExperience());
            if (newLevel > player.getLevel()) {
                player.setLevel(newLevel);
            }

            // Unlock next stage
            List<Integer> unlockedStages = new ArrayList<>(player.getUnlockedStages());
            int nextStage = stageId + 1;
            if (!unlockedStages.contains(nextStage)) {
                unlockedStages.add(nextStage);
                player.setUnlockedStages(unlockedStages);
            }

            // Update current stage to next stage
            player.setCurrentStage(nextStage);

            // Update playtime
            player.setLastPlayed(LocalDateTime.now());

            return playerRepository.save(player);
        }
        return null;
    }

    private int calculateLevelFromExperience(long experience) {
        // Simple formula: level = sqrt(experience / 100) + 1
        return (int) Math.sqrt(experience / 100.0) + 1;
    }

    public long getRequiredExperienceForLevel(int level) {
        // Reverse of the level formula
        return (long) Math.pow(level - 1, 2) * 100;
    }
}