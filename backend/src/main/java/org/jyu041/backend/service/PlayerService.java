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

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    public List<Player> getAllPlayers() {
        return playerRepository.findAllByOrderByLastPlayedDesc();
    }

    public Optional<Player> getPlayerById(String id) {
        return playerRepository.findById(id);
    }

    public Optional<Player> getPlayerByName(String playerName) {
        return playerRepository.findByPlayerName(playerName);
    }

    public Player createPlayer(String playerName, String difficulty, String cultivation, String element) {
        Player player = new Player(playerName, difficulty, cultivation, element);
        return playerRepository.save(player);
    }

    public Player updatePlayer(Player player) {
        player.setLastPlayed(LocalDateTime.now());
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

    public Player updateCurrentStage(String playerId, int stageId) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setCurrentStage(stageId);
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