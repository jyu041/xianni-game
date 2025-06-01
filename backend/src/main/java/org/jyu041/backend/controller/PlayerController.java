// backend/src/main/java/org/jyu041/backend/controller/PlayerController.java
package org.jyu041.backend.controller;

import org.jyu041.backend.entity.Player;
import org.jyu041.backend.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/saves")
@CrossOrigin(origins = "*")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> players = playerService.getAllPlayers();
        return ResponseEntity.ok(players);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable String id) {
        Optional<Player> player = playerService.getPlayerById(id);
        return player.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Map<String, Object> playerData) {
        try {
            String playerName = (String) playerData.get("playerName");
            String element = (String) playerData.get("element");

            if (playerName == null || playerName.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Check if player name already exists
            if (playerService.getPlayerByName(playerName).isPresent()) {
                return ResponseEntity.badRequest().build();
            }

            Player player = playerService.createPlayer(playerName, element);
            return ResponseEntity.ok(player);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<Player> playerOpt = playerService.getPlayerById(id);
        if (playerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Player player = playerOpt.get();

        // Update fields if present
        if (updates.containsKey("experience")) {
            player.setExperience(((Number) updates.get("experience")).longValue());
        }
        if (updates.containsKey("gold")) {
            player.setGold(((Number) updates.get("gold")).longValue());
        }
        if (updates.containsKey("gems")) {
            player.setGems(((Number) updates.get("gems")).longValue());
        }
        if (updates.containsKey("currentStage")) {
            player.setCurrentStage(((Number) updates.get("currentStage")).intValue());
        }
        if (updates.containsKey("playtime")) {
            player.setPlaytime(((Number) updates.get("playtime")).longValue());
        }

        Player updatedPlayer = playerService.updatePlayer(player);
        return ResponseEntity.ok(updatedPlayer);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Player> patchPlayer(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        return updatePlayer(id, updates);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable String id) {
        if (playerService.getPlayerById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/experience")
    public ResponseEntity<Player> addExperience(@PathVariable String id, @RequestBody Map<String, Object> data) {
        try {
            long experience = ((Number) data.get("experience")).longValue();
            Player player = playerService.addExperience(id, experience);
            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/gold")
    public ResponseEntity<Player> addGold(@PathVariable String id, @RequestBody Map<String, Object> data) {
        try {
            long gold = ((Number) data.get("gold")).longValue();
            Player player = playerService.addGold(id, gold);
            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/gems")
    public ResponseEntity<Player> addGems(@PathVariable String id, @RequestBody Map<String, Object> data) {
        try {
            long gems = ((Number) data.get("gems")).longValue();
            Player player = playerService.addGems(id, gems);
            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/unlock-stage")
    public ResponseEntity<Player> unlockStage(@PathVariable String id, @RequestBody Map<String, Object> data) {
        try {
            int stageId = ((Number) data.get("stageId")).intValue();
            Player player = playerService.unlockStage(id, stageId);
            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/complete-stage")
    public ResponseEntity<Player> completeStage(@PathVariable String id, @RequestBody Map<String, Object> data) {
        try {
            int stageId = ((Number) data.get("stageId")).intValue();
            long score = ((Number) data.getOrDefault("score", 0)).longValue();
            long experience = ((Number) data.getOrDefault("experience", 0)).longValue();
            long gold = ((Number) data.getOrDefault("gold", 0)).longValue();

            Player player = playerService.completeStage(id, stageId, score, experience, gold);
            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}