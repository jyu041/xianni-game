import { useState } from "react";
import styles from "./StageModal.module.css";

const StageModal = ({
  isOpen,
  onClose,
  unlockedStages,
  currentStage,
  onStageSelect,
}) => {
  const [selectedStage, setSelectedStage] = useState(currentStage);

  const stages = [
    {
      id: 1,
      name: "青云山脉",
      difficulty: "简单",
      enemies: "野兽",
      reward: "灵石 x50",
      boss: "山林虎王",
    },
    {
      id: 2,
      name: "幽暗森林",
      difficulty: "简单",
      enemies: "妖兽",
      reward: "灵石 x75",
      boss: "黑狼妖王",
    },
    {
      id: 3,
      name: "迷雾沼泽",
      difficulty: "普通",
      enemies: "毒虫",
      reward: "灵石 x100",
      boss: "毒蛛女王",
    },
    {
      id: 4,
      name: "烈焰峡谷",
      difficulty: "普通",
      enemies: "火灵",
      reward: "灵石 x150",
      boss: "炎龙",
    },
    {
      id: 5,
      name: "冰霜雪域",
      difficulty: "困难",
      enemies: "冰妖",
      reward: "灵石 x200",
      boss: "冰霜巨人",
    },
    {
      id: 6,
      name: "雷电高原",
      difficulty: "困难",
      enemies: "雷兽",
      reward: "灵石 x300",
      boss: "雷鸟",
    },
    {
      id: 7,
      name: "暗影深渊",
      difficulty: "地狱",
      enemies: "魔物",
      reward: "灵石 x500",
      boss: "深渊领主",
    },
    {
      id: 8,
      name: "天界云海",
      difficulty: "地狱",
      enemies: "天兵",
      reward: "灵石 x750",
      boss: "天将",
    },
    {
      id: 9,
      name: "混沌虚空",
      difficulty: "噩梦",
      enemies: "虚空生物",
      reward: "灵石 x1000",
      boss: "虚空君主",
    },
    {
      id: 10,
      name: "仙界禁地",
      difficulty: "噩梦",
      enemies: "仙人",
      reward: "灵石 x1500",
      boss: "仙帝",
    },
  ];

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

  const isStageUnlocked = (stageId) => {
    return unlockedStages.includes(stageId);
  };

  const handleStageClick = (stageId) => {
    if (isStageUnlocked(stageId)) {
      setSelectedStage(stageId);
    }
  };

  const handleConfirm = () => {
    if (isStageUnlocked(selectedStage)) {
      onStageSelect(selectedStage);
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>选择关卡</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.stageGrid}>
          {stages.map((stage) => {
            const isUnlocked = isStageUnlocked(stage.id);
            const isCurrent = stage.id === currentStage;
            const isSelected = stage.id === selectedStage;

            return (
              <div
                key={stage.id}
                className={`${styles.stageCard} ${
                  !isUnlocked ? styles.locked : ""
                } ${isCurrent ? styles.current : ""} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => handleStageClick(stage.id)}
              >
                <div className={styles.stageHeader}>
                  <div className={styles.stageNumber}>{stage.id}</div>
                  <div className={styles.stageName}>{stage.name}</div>
                  <div
                    className={styles.difficulty}
                    style={{ color: getDifficultyColor(stage.difficulty) }}
                  >
                    {stage.difficulty}
                  </div>
                </div>

                <div className={styles.stageContent}>
                  <div className={styles.stageInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>敌人:</span>
                      <span className={styles.infoValue}>{stage.enemies}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>首领:</span>
                      <span className={styles.infoValue}>{stage.boss}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>奖励:</span>
                      <span className={styles.infoValue}>{stage.reward}</span>
                    </div>
                  </div>
                </div>

                {!isUnlocked && (
                  <div className={styles.lockOverlay}>
                    <div className={styles.lockIcon}>🔒</div>
                  </div>
                )}

                {isCurrent && <div className={styles.currentBadge}>当前</div>}

                {isSelected && isUnlocked && (
                  <div className={styles.selectedIndicator}>✓</div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            取消
          </button>
          <button
            className={`${styles.confirmButton} ${
              !isStageUnlocked(selectedStage) ? styles.disabled : ""
            }`}
            onClick={handleConfirm}
            disabled={!isStageUnlocked(selectedStage)}
          >
            {selectedStage === currentStage ? "当前关卡" : "开始挑战"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StageModal;
