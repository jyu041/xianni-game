import { useState } from "react";
import styles from "./LevelSelector.module.css";

const LevelSelector = ({
  unlockedStages,
  currentStage,
  onStageSelect,
  totalStages = 10,
}) => {
  const [selectedStage, setSelectedStage] = useState(currentStage);

  const stages = [
    { id: 1, name: "青云山脉", difficulty: "简单", boss: "山林虎王" },
    { id: 2, name: "幽暗森林", difficulty: "简单", boss: "黑狼妖王" },
    { id: 3, name: "迷雾沼泽", difficulty: "普通", boss: "毒蛛女王" },
    { id: 4, name: "烈焰峡谷", difficulty: "普通", boss: "炎龙" },
    { id: 5, name: "冰霜雪域", difficulty: "困难", boss: "冰霜巨人" },
    { id: 6, name: "雷电高原", difficulty: "困难", boss: "雷鸟" },
    { id: 7, name: "暗影深渊", difficulty: "地狱", boss: "深渊领主" },
    { id: 8, name: "天界云海", difficulty: "地狱", boss: "天将" },
    { id: 9, name: "混沌虚空", difficulty: "噩梦", boss: "虚空君主" },
    { id: 10, name: "仙界禁地", difficulty: "噩梦", boss: "仙帝" },
  ];

  const currentStageData =
    stages.find((s) => s.id === selectedStage) || stages[0];
  const isUnlocked = unlockedStages.includes(selectedStage);
  const isCurrent = selectedStage === currentStage;

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

  return (
    <div className={styles.levelSelector}>
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
              <div className={styles.rewardItem}>
                <span className={styles.rewardIcon}>💰</span>
                <span className={styles.rewardText}>
                  灵石 x{50 * selectedStage}
                </span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardIcon}>⭐</span>
                <span className={styles.rewardText}>
                  经验 x{25 * selectedStage}
                </span>
              </div>
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
            style={{
              width: `${(Math.max(...unlockedStages) / totalStages) * 100}%`,
            }}
          />
        </div>
        <div className={styles.progressText}>
          进度: {Math.max(...unlockedStages)}/{totalStages}
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;
