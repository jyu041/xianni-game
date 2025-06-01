// backend/src/main/java/org/jyu041/backend/repository/PlayerRepository.java
package org.jyu041.backend.repository;

import org.jyu041.backend.entity.Player;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends MongoRepository<Player, String> {

    Optional<Player> findByPlayerName(String playerName);

    List<Player> findAllByOrderByLastPlayedDesc();

    List<Player> findAllByOrderByLevelDesc();

    @Query("{ 'level' : { $gte: ?0, $lte: ?1 } }")
    List<Player> findPlayersByLevelRange(int minLevel, int maxLevel);

    @Query("{ 'currentStage' : ?0 }")
    List<Player> findPlayersByCurrentStage(int stage);

    // Removed countByDifficulty as Player doesn't have difficulty property
    // If we need this in the future, we can add difficulty to Player entity

    // Count players by primary element instead
    long countByPrimaryElement(String primaryElement);
}