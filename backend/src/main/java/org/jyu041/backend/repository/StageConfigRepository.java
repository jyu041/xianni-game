// backend/src/main/java/org/jyu041/backend/repository/StageConfigRepository.java
package org.jyu041.backend.repository;

import org.jyu041.backend.entity.StageConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StageConfigRepository extends MongoRepository<StageConfig, String> {

    Optional<StageConfig> findByStageId(int stageId);

    List<StageConfig> findAllByOrderByStageIdAsc();

    List<StageConfig> findByDifficulty(String difficulty);

    List<StageConfig> findByMinLevelLessThanEqual(int level);
}