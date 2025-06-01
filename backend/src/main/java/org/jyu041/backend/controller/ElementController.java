// backend/src/main/java/org/jyu041/backend/controller/ElementController.java
package org.jyu041.backend.controller;

import org.jyu041.backend.service.ElementService;
import org.jyu041.backend.service.PlayerService;
import org.jyu041.backend.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/elements")
@CrossOrigin(origins = "*")
public class ElementController {

    @Autowired
    private ElementService elementService;

    @Autowired
    private PlayerService playerService;

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getElementInfo() {
        Map<String, Object> elementInfo = new HashMap<>();
        String[] elements = {"metal", "wood", "water", "fire", "earth"};

        Map<String, String> names = new HashMap<>();
        Map<String, String> colors = new HashMap<>();
        Map<String, String> descriptions = new HashMap<>();
        Map<String, String> counters = new HashMap<>();

        for (String element : elements) {
            names.put(element, elementService.getElementName(element));
            colors.put(element, elementService.getElementColor(element));
            descriptions.put(element, elementService.getElementDescription(element));
            counters.put(element, elementService.getElementCounter(element));
        }

        elementInfo.put("names", names);
        elementInfo.put("colors", colors);
        elementInfo.put("descriptions", descriptions);
        elementInfo.put("counters", counters);

        return ResponseEntity.ok(elementInfo);
    }

    @PostMapping("/interaction")
    public ResponseEntity<ElementService.ElementInteraction> calculateInteraction(
            @RequestBody Map<String, Object> request) {
        try {
            String playerElement = (String) request.get("playerElement");
            Integer playerLevel = (Integer) request.get("playerLevel");
            String stageElement = (String) request.get("stageElement");
            Integer stageLevel = (Integer) request.get("stageLevel");

            ElementService.ElementInteraction interaction = elementService.calculateElementInteraction(
                    playerElement, playerLevel, stageElement, stageLevel
            );

            return ResponseEntity.ok(interaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/player/{playerId}/primary-element")
    public ResponseEntity<Player> updatePrimaryElement(
            @PathVariable String playerId,
            @RequestBody Map<String, String> request) {
        try {
            String primaryElement = request.get("primaryElement");
            Player player = playerService.updatePrimaryElement(playerId, primaryElement);

            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/player/{playerId}/experience")
    public ResponseEntity<Player> addElementExperience(
            @PathVariable String playerId,
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Long> elementExperience = (Map<String, Long>) request.get("elementExperience");

            Player player = playerService.addElementExperience(playerId, elementExperience);

            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/player/{playerId}/tianni-sword/upgrade")
    public ResponseEntity<Player> upgradeTianniSword(@PathVariable String playerId) {
        try {
            Player player = playerService.upgradeTianniSword(playerId);

            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/player/{playerId}/mana/use")
    public ResponseEntity<Player> useMana(
            @PathVariable String playerId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer manaCost = request.get("manaCost");
            Player player = playerService.useMana(playerId, manaCost);

            if (player != null) {
                return ResponseEntity.ok(player);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/player/{playerId}/passives")
    public ResponseEntity<Map<String, Double>> getPlayerPassives(@PathVariable String playerId) {
        try {
            Player player = playerService.getPlayerById(playerId).orElse(null);
            if (player == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Double> passives = new HashMap<>();
            String primaryElement = player.getPrimaryElement();
            Map<String, Integer> elementLevels = player.getElementLevels();

            String[] elements = {"metal", "wood", "water", "fire", "earth"};
            for (String element : elements) {
                int level = elementLevels.getOrDefault(element, 0);
                boolean isPrimary = element.equals(primaryElement);
                double bonus = elementService.getElementPassiveBonus(element, level, isPrimary);
                passives.put(element, bonus);
            }

            return ResponseEntity.ok(passives);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}