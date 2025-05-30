// backend/src/main/java/org/jyu041/backend/service/StageService.java
package org.jyu041.backend.service;

import org.jyu041.backend.entity.StageConfig;
import org.jyu041.backend.repository.StageConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class StageService {

    @Autowired
    private StageConfigRepository stageConfigRepository;

    @PostConstruct
    public void initializeDefaultStages() {
        // Initialize default stages if database is empty
        if (stageConfigRepository.count() == 0) {
            createDefaultStages();
        }
    }

    public List<StageConfig> getAllStages() {
        return stageConfigRepository.findAllByOrderByStageIdAsc();
    }

    public Optional<StageConfig> getStageById(int stageId) {
        return stageConfigRepository.findByStageId(stageId);
    }

    public StageConfig createStage(StageConfig stageConfig) {
        return stageConfigRepository.save(stageConfig);
    }

    public StageConfig updateStage(StageConfig stageConfig) {
        Optional<StageConfig> existingStage = stageConfigRepository.findByStageId(stageConfig.getStageId());
        if (existingStage.isPresent()) {
            stageConfig.setId(existingStage.get().getId());
            return stageConfigRepository.save(stageConfig);
        }
        return null;
    }

    private void createDefaultStages() {
        StageConfig[] defaultStages = {
                createStageConfig(1, "青云山脉", "修仙路上的第一步，山林间充满了野兽的咆哮。",
                        "简单", "山林虎王", "野兽", "mountains", 1,
                        List.of("灵石 x50", "经验 x25")),
                createStageConfig(2, "幽暗森林", "阴暗的森林中潜伏着危险的妖兽。",
                        "简单", "黑狼妖王", "妖兽", "forest", 3,
                        List.of("灵石 x75", "经验 x50")),
                createStageConfig(3, "迷雾沼泽", "迷雾缭绕的沼泽地，充满了毒虫和陷阱。",
                        "普通", "毒蛛女王", "毒虫", "swamp", 5,
                        List.of("灵石 x100", "经验 x75")),
                createStageConfig(4, "烈焰峡谷", "炽热的峡谷中居住着强大的火系生物。",
                        "普通", "炎龙", "火灵", "volcano", 8,
                        List.of("灵石 x150", "经验 x100")),
                createStageConfig(5, "冰霜雪域", "永恒的冰雪之地，考验着修仙者的意志。",
                        "困难", "冰霜巨人", "冰妖", "ice", 12,
                        List.of("灵石 x200", "经验 x125")),
                createStageConfig(6, "雷电高原", "雷电不断的高原，蕴含着天地之力。",
                        "困难", "雷鸟", "雷兽", "thunder", 16,
                        List.of("灵石 x300", "经验 x150")),
                createStageConfig(7, "暗影深渊", "无底的深渊中潜伏着来自地狱的魔物。",
                        "地狱", "深渊领主", "魔物", "abyss", 20,
                        List.of("灵石 x500", "经验 x175")),
                createStageConfig(8, "天界云海", "云雾缭绕的天界，守护着神圣的力量。",
                        "地狱", "天将", "天兵", "heaven", 25,
                        List.of("灵石 x750", "经验 x200")),
                createStageConfig(9, "混沌虚空", "混沌的虚空中存在着超越理解的生物。",
                        "噩梦", "虚空君主", "虚空生物", "void", 30,
                        List.of("灵石 x1000", "经验 x250")),
                createStageConfig(10, "仙界禁地", "仙界的最高禁地，只有最强者才能踏足。",
                        "噩梦", "仙帝", "仙人", "immortal", 35,
                        List.of("灵石 x1500", "经验 x300"))
        };

        for (StageConfig stage : defaultStages) {
            stageConfigRepository.save(stage);
        }
    }

    private StageConfig createStageConfig(int stageId, String name, String description,
                                          String difficulty, String boss, String enemies, String background,
                                          int minLevel, List<String> rewards) {
        StageConfig stage = new StageConfig(stageId, name, description, difficulty, boss);
        stage.setEnemies(enemies);
        stage.setBackground(background);
        stage.setMinLevel(minLevel);
        stage.setRewards(rewards);

        // Default enemy spawn settings
        Map<String, Object> enemySpawns = new HashMap<>();
        enemySpawns.put("baseSpawnRate", 2.0 + (stageId * 0.5));
        enemySpawns.put("maxEnemies", 20 + (stageId * 5));
        enemySpawns.put("bossSpawnTime", 300 - (stageId * 10));

        // Default stage settings
        Map<String, Object> stageSettings = new HashMap<>();
        stageSettings.put("duration", 600); // 10 minutes
        stageSettings.put("survivalMode", true);
        stageSettings.put("difficultyMultiplier", 1.0 + (stageId * 0.2));

        stage.setEnemySpawns(enemySpawns);
        stage.setStageSettings(stageSettings);

        return stage;
    }
}