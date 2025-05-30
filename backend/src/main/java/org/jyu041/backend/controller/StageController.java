// backend/src/main/java/org/jyu041/backend/controller/StageController.java
package org.jyu041.backend.controller;

import org.jyu041.backend.entity.StageConfig;
import org.jyu041.backend.service.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "*")
public class StageController {

    @Autowired
    private StageService stageService;

    @GetMapping
    public ResponseEntity<List<StageConfig>> getAllStages() {
        List<StageConfig> stages = stageService.getAllStages();
        return ResponseEntity.ok(stages);
    }

    @GetMapping("/{stageId}")
    public ResponseEntity<StageConfig> getStageById(@PathVariable int stageId) {
        Optional<StageConfig> stage = stageService.getStageById(stageId);
        return stage.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StageConfig> createStage(@RequestBody StageConfig stageConfig) {
        try {
            StageConfig createdStage = stageService.createStage(stageConfig);
            return ResponseEntity.ok(createdStage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{stageId}")
    public ResponseEntity<StageConfig> updateStage(@PathVariable int stageId, @RequestBody StageConfig stageConfig) {
        stageConfig.setStageId(stageId);
        StageConfig updatedStage = stageService.updateStage(stageConfig);
        if (updatedStage != null) {
            return ResponseEntity.ok(updatedStage);
        }
        return ResponseEntity.notFound().build();
    }
}