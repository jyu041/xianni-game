// src/components/game/LevelSelector.jsx
import { useState } from "react";
import styles from "./LevelSelector.module.css";

const LevelSelector = ({
  unlockedStages,
  currentStage,
  onStageSelect,
  onShowAllStages,
  totalStages = 10,
  stages = [],
}) => {
  const [selectedStage, setSelectedStage] = useState(currentStage);

  const currentStageData =
    stages.find((s) => s.stageId === selectedStage) || stages[0];
  const isUnlocked = unlockedStages.includes(selectedStage);
  const isCurrent = currentStage === selectedStage;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "简单":
        return "#4caf50";
      case "普通":
        return "#ff9800";
      case "困难":
        return "#f44336";
      case "地狱":
        return "#9c27b0";
      case "噩梦":
        return "#e91e63";
      default:
        return "#666";
    }
  };

  const handlePrevious = () => {
    if (selectedStage > 1) {
      setSelectedStage(selectedStage - 1);
    }
  };

  const handleNext = () => {
    if (selectedStage < totalStages) {
      setSelectedStage(selectedStage + 1);
    }
  };

  const handleStartStage = () => {
    if (isUnlocked) {
      onStageSelect(selectedStage);
    }
  };

  if (!currentStageData) {
    return (
      <div className={styles.levelSelector}>
        <div className={styles.menuContent}>
          <div className={styles.comingSoon}>
            <div className={styles.comingSoonIcon}>⚔️</div>
            <h3>加载关卡中...</h3>
            <p>正在从服务器获取关卡信息...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.levelSelector}>
      <div className={styles.levelSelectorHeader}>
        <h3 className={styles.selectorTitle}>选择关卡</h3>
        <button className={styles.allLevelsButton} onClick={onShowAllStages}>
          全部关卡
        </button>
      </div>

      <div className={styles.stageNavigation}>
        <button
          className={`${styles.navButton} ${
            selectedStage <= 1 ? styles.disabled : ""
          }`}
          onClick={handlePrevious}
          disabled={selectedStage <= 1}
        >
          ←
        </button>

        <div className={styles.stageDisplay}>
          <div className={styles.stageNumber}>
            <span className={styles.stageLabel}>关卡</span>
            <span className={styles.number}>{selectedStage}</span>
          </div>

          <div className={styles.stageInfo}>
            <h3 className={styles.stageName}>{currentStageData.name}</h3>

            <div className={styles.stageDetails}>
              <div
                className={styles.difficulty}
                style={{
                  color: getDifficultyColor(currentStageData.difficulty),
                }}
              >
                难度: {currentStageData.difficulty}
              </div>

              <div className={styles.boss}>首领: {currentStageData.boss}</div>
            </div>

            <div className={styles.rewards}>
              {currentStageData.rewards &&
                currentStageData.rewards.map((reward, index) => (
                  <div key={index} className={styles.rewardItem}>
                    <span className={styles.rewardIcon}>
                      {reward.includes("灵石") ? "💰" : "⭐"}
                    </span>
                    <span className={styles.rewardText}>{reward}</span>
                  </div>
                ))}
            </div>
          </div>

          {!isUnlocked && (
            <div className={styles.lockOverlay}>
              <div className={styles.lockIcon}>🔒</div>
              <div className={styles.lockText}>未解锁</div>
            </div>
          )}
        </div>

        <button
          className={`${styles.navButton} ${
            selectedStage >= totalStages ? styles.disabled : ""
          }`}
          onClick={handleNext}
          disabled={selectedStage >= totalStages}
        >
          →
        </button>
      </div>

      <div className={styles.stageActions}>
        {isUnlocked ? (
          <button
            className={`${styles.startButton} ${
              isCurrent ? styles.current : ""
            }`}
            onClick={handleStartStage}
          >
            {isCurrent ? "当前关卡" : "开始挑战"}
          </button>
        ) : (
          <div className={styles.lockedButton}>
            <span className={styles.lockIcon}>🔒</span>
            <span>需要通过关卡 {selectedStage - 1}</span>
          </div>
        )}
      </div>

      <div className={styles.progressIndicator}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(unlockedStages.length / totalStages) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>
          已解锁: {unlockedStages.length} / {totalStages} 关卡
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;
