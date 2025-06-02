// backend/src/main/java/org/jyu041/backend/controller/EquipmentController.java
package org.jyu041.backend.controller;

import org.jyu041.backend.service.EquipmentService;
import org.jyu041.backend.service.PlayerService;
import org.jyu041.backend.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @Autowired
    private PlayerService playerService;

    @GetMapping("/available")
    public ResponseEntity<List<Map<String, Object>>> getAvailableEquipment() {
        List<Map<String, Object>> equipment = equipmentService.getAvailableEquipment();
        return ResponseEntity.ok(equipment);
    }

    @PostMapping("/player/{playerId}/equip")
    public ResponseEntity<Player> equipItem(
            @PathVariable String playerId,
            @RequestBody Map<String, Object> request) {
        try {
            String itemId = (String) request.get("itemId");
            Player player = playerService.equipItem(playerId, itemId);

            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/player/{playerId}/unequip")
    public ResponseEntity<Player> unequipItem(
            @PathVariable String playerId,
            @RequestBody Map<String, Object> request) {
        try {
            String itemId = (String) request.get("itemId");
            Player player = playerService.unequipItem(playerId, itemId);

            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/player/{playerId}/stats")
    public ResponseEntity<Map<String, Object>> getPlayerStats(@PathVariable String playerId) {
        try {
            Player player = playerService.getPlayerById(playerId).orElse(null);
            if (player == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> stats = Map.of(
                    "cultivation", player.getCultivationInfo().name,
                    "level", player.getLevel(),
                    "baseStats", Map.of(
                            "health", player.getBaseHealth(),
                            "healthRegen", player.getBaseHealthRegen(),
                            "mana", player.getBaseMana(),
                            "manaRegen", player.getBaseManaRegen(),
                            "attack", player.getBaseAttack(),
                            "defense", player.getBaseDefense()
                    ),
                    "currentStats", Map.of(
                            "health", player.getCurrentMaxHealth(),
                            "healthRegen", player.getCurrentHealthRegen(),
                            "mana", player.getCurrentMaxMana(),
                            "manaRegen", player.getCurrentManaRegen(),
                            "attack", player.getCurrentAttack(),
                            "defense", player.getCurrentDefense()
                    ),
                    "equippedItems", player.getEquippedItems()
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}