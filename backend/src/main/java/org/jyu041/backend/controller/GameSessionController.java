// backend/src/main/java/org/jyu041/backend/controller/GameSessionController.java
package org.jyu041.backend.controller;

import org.jyu041.backend.entity.GameSession;
import org.jyu041.backend.service.GameSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/game-sessions")
@CrossOrigin(origins = "*")
public class GameSessionController {

    @Autowired
    private GameSessionService gameSessionService;

    @PostMapping("/start")
    public ResponseEntity<GameSession> startGameSession(@RequestBody Map<String, Object> data) {
        try {
            String playerId = (String) data.get("playerId");
            int stageId = ((Number) data.get("stageId")).intValue();

            GameSession session = gameSessionService.startGameSession(playerId, stageId);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<GameSession> endGameSession(
            @PathVariable String sessionId,
            @RequestBody Map<String, Object> data) {
        try {
            long scoreAchieved = ((Number) data.get("scoreAchieved")).longValue();
            String endReason = (String) data.get("endReason");
            @SuppressWarnings("unchecked")
            Map<String, Object> stats = (Map<String, Object>) data.getOrDefault("stats", Map.of());

            GameSession session = gameSessionService.endGameSession(sessionId, scoreAchieved, endReason, stats);
            if (session != null) {
                return ResponseEntity.ok(session);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<GameSession>> getPlayerSessions(@PathVariable String playerId) {
        List<GameSession> sessions = gameSessionService.getPlayerSessions(playerId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/player/{playerId}/completed")
    public ResponseEntity<List<GameSession>> getPlayerCompletedSessions(@PathVariable String playerId) {
        List<GameSession> sessions = gameSessionService.getPlayerCompletedSessions(playerId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/stage/{stageId}/leaderboard")
    public ResponseEntity<List<GameSession>> getStageLeaderboard(@PathVariable int stageId) {
        List<GameSession> sessions = gameSessionService.getStageLeaderboard(stageId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<GameSession> getSessionById(@PathVariable String sessionId) {
        Optional<GameSession> session = gameSessionService.getSessionById(sessionId);
        return session.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}