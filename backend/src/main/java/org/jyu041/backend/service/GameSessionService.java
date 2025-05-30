// backend/src/main/java/org/jyu041/backend/service/GameSessionService.java
package org.jyu041.backend.service;

import org.jyu041.backend.entity.GameSession;
import org.jyu041.backend.repository.GameSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class GameSessionService {

    @Autowired
    private GameSessionRepository gameSessionRepository;

    @Autowired
    private PlayerService playerService;

    public GameSession startGameSession(String playerId, int stageId) {
        GameSession session = new GameSession(playerId, stageId);
        return gameSessionRepository.save(session);
    }

    public GameSession endGameSession(String sessionId, long scoreAchieved, String endReason, Map<String, Object> stats) {
        Optional<GameSession> sessionOpt = gameSessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            GameSession session = sessionOpt.get();
            session.setEndTime(LocalDateTime.now());
            session.setDuration(ChronoUnit.SECONDS.between(session.getStartTime(), session.getEndTime()));
            session.setScoreAchieved(scoreAchieved);
            session.setCompleted("completed".equals(endReason));
            session.setEndReason(endReason);
            session.setStats(stats);

            // Calculate rewards
            long experienceGained = calculateExperienceReward(session.getStageId(), scoreAchieved, session.getDuration());
            long goldGained = calculateGoldReward(session.getStageId(), scoreAchieved);

            session.setExperienceGained(experienceGained);
            session.setGoldGained(goldGained);

            // Update player stats
            playerService.addExperience(session.getPlayerId(), experienceGained);
            playerService.addGold(session.getPlayerId(), goldGained);

            // Unlock next stage if completed
            if (session.isCompleted()) {
                playerService.unlockStage(session.getPlayerId(), session.getStageId() + 1);
                playerService.updateCurrentStage(session.getPlayerId(), session.getStageId() + 1);
            }

            return gameSessionRepository.save(session);
        }
        return null;
    }

    public List<GameSession> getPlayerSessions(String playerId) {
        return gameSessionRepository.findByPlayerIdOrderByStartTimeDesc(playerId);
    }

    public List<GameSession> getPlayerCompletedSessions(String playerId) {
        return gameSessionRepository.findByPlayerIdAndCompletedOrderByStartTimeDesc(playerId, true);
    }

    public List<GameSession> getStageLeaderboard(int stageId) {
        return gameSessionRepository.findByStageIdOrderByScoreAchievedDesc(stageId);
    }

    public Optional<GameSession> getSessionById(String sessionId) {
        return gameSessionRepository.findById(sessionId);
    }

    private long calculateExperienceReward(int stageId, long score, long duration) {
        // Base experience for stage completion
        long baseExp = stageId * 25;

        // Bonus for score (up to 2x multiplier)
        double scoreMultiplier = Math.min(2.0, 1.0 + (score / 10000.0));

        // Time bonus (faster completion = more exp, but with diminishing returns)
        double timeMultiplier = Math.max(1.0, Math.min(1.5, 300.0 / Math.max(duration, 60)));

        return Math.round(baseExp * scoreMultiplier * timeMultiplier);
    }

    private long calculateGoldReward(int stageId, long score) {
        // Base gold for stage
        long baseGold = stageId * 50;

        // Score bonus
        long scoreBonus = score / 100;

        return baseGold + scoreBonus;
    }
}