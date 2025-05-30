// backend/src/main/java/org/jyu041/backend/repository/GameSessionRepository.java
package org.jyu041.backend.repository;

import org.jyu041.backend.entity.GameSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GameSessionRepository extends MongoRepository<GameSession, String> {

    List<GameSession> findByPlayerIdOrderByStartTimeDesc(String playerId);

    List<GameSession> findByPlayerIdAndCompletedOrderByStartTimeDesc(String playerId, boolean completed);

    List<GameSession> findByStageIdOrderByScoreAchievedDesc(int stageId);

    @Query("{ 'startTime' : { $gte: ?0, $lte: ?1 } }")
    List<GameSession> findSessionsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'playerId' : ?0, 'stageId' : ?1, 'completed' : true }")
    List<GameSession> findCompletedSessionsByPlayerAndStage(String playerId, int stageId);

    long countByPlayerIdAndCompleted(String playerId, boolean completed);
}