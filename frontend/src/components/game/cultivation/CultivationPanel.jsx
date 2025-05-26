import React, { useState } from "react";
import useGameStore from "../../../managers/StateManager.js";
import CultivationManager from "../../../managers/CultivationManager.js";
import Button from "../../ui/common/Button.jsx";
import Modal from "../../ui/common/Modal.jsx";
import { CULTIVATION_TECHNIQUES_DATA } from "../../../data/cultivation/techniques.js";

const CultivationPanel = ({ onClose }) => {
  const { player, updateCultivation } = useGameStore();
  const { cultivation } = player;

  const [selectedTechnique, setSelectedTechnique] = useState(
    cultivation.currentTechnique?.id || null
  );
  const [isCultivating, setIsCultivating] = useState(
    !!CultivationManager.cultivationTimer
  );

  const progress = CultivationManager.getCultivationProgress();
  const availableTechniques = CultivationManager.getAvailableTechniques(player);

  const handleStartCultivation = () => {
    if (CultivationManager.startCultivation(selectedTechnique)) {
      setIsCultivating(true);
    }
  };

  const handleStopCultivation = () => {
    CultivationManager.stopCultivation();
    setIsCultivating(false);
  };

  const handleTechniqueChange = (techniqueId) => {
    setSelectedTechnique(techniqueId);
    CultivationManager.setCurrentTechnique(techniqueId);
  };

  const handleBreakthrough = () => {
    if (progress.canBreakthrough) {
      if (progress.isMaxStage) {
        CultivationManager.attemptRealmBreakthrough();
      } else {
        CultivationManager.attemptStageBreakthrough();
      }
    }
  };

  return (
    <Modal title="修炼界面" onClose={onClose} className="cultivation-panel">
      <div className="cultivation-content">
        {/* Current Status */}
        <div className="cultivation-status">
          <h3>修炼状态</h3>
          <div className="status-grid">
            <div className="status-item">
              <label>境界:</label>
              <span>{progress.realm}</span>
            </div>
            <div className="status-item">
              <label>层次:</label>
              <span>第 {progress.stage} 层</span>
            </div>
            <div className="status-item">
              <label>修为:</label>
              <span>{cultivation.cultivationPoints}</span>
            </div>
            <div className="status-item">
              <label>灵气:</label>
              <span>
                {cultivation.spiritualEnergy} / {cultivation.maxSpiritualEnergy}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="cultivation-progress">
          <h3>境界进度</h3>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress.progress * 100}%` }}
              />
            </div>
            <div className="progress-text">
              {progress.cultivationPoints} / {progress.requiredPoints}
            </div>
          </div>

          {progress.canBreakthrough && (
            <Button
              onClick={handleBreakthrough}
              variant="primary"
              className="breakthrough-button"
            >
              {progress.isMaxStage ? "突破境界" : "突破层次"}
            </Button>
          )}
        </div>

        {/* Spiritual Roots */}
        <div className="spiritual-roots">
          <h3>灵根资质</h3>
          <div className="roots-grid">
            {Object.entries(cultivation.spiritualRoots).map(
              ([element, value]) => (
                <div key={element} className="root-item">
                  <span className="root-name">{element}</span>
                  <div className="root-bar">
                    <div className="root-fill" style={{ width: `${value}%` }} />
                  </div>
                  <span className="root-value">{value}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Technique Selection */}
        <div className="technique-selection">
          <h3>选择功法</h3>
          <div className="techniques-list">
            {availableTechniques.map((technique) => (
              <div
                key={technique.id}
                className={`technique-item ${
                  selectedTechnique === technique.id ? "selected" : ""
                }`}
                onClick={() => handleTechniqueChange(technique.id)}
              >
                <div className="technique-name">{technique.name}</div>
                <div className="technique-description">
                  {technique.description}
                </div>
                <div className="technique-efficiency">
                  效率: {technique.efficiency}x
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cultivation Controls */}
        <div className="cultivation-controls">
          {!isCultivating ? (
            <Button
              onClick={handleStartCultivation}
              variant="primary"
              disabled={!selectedTechnique || player.stats.energy < 10}
            >
              开始修炼
            </Button>
          ) : (
            <Button onClick={handleStopCultivation} variant="danger">
              停止修炼
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CultivationPanel;
