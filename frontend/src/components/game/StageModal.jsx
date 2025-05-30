// frontend/src/components/game/StageModal.jsx
import { useState } from "react";
import styles from "./StageModal.module.css";

const StageModal = ({
  isOpen,
  onClose,
  unlockedStages,
  currentStage,
  onStageSelect,
  stages = [],
}) => {
  const [selectedStage, setSelectedStage] = useState(currentStage);
  const [currentPage, setCurrentPage] = useState(0);

  const stagesPerPage = 6; // 3x2 grid per page

  // Use backend stages data or fallback to hardcoded data
  const defaultStages = [
    {
      stageId: 1,
      name: "青云山脉",
      difficulty: "简单",
      enemies: "野兽",
      rewards: ["灵石 x50"],
      boss: "山林虎王",
      description: "修仙路上的第一步，山林间充满了野兽的咆哮。",
      background: "mountains",
    },
    {
      stageId: 2,
      name: "幽暗森林",
      difficulty: "简单",
      enemies: "妖兽",
      rewards: ["灵石 x75"],
      boss: "黑狼妖王",
      description: "阴暗的森林中潜伏着危险的妖兽。",
      background: "forest",
    },
    {
      stageId: 3,
      name: "迷雾沼泽",
      difficulty: "普通",
      enemies: "毒虫",
      rewards: ["灵石 x100"],
      boss: "毒蛛女王",
      description: "迷雾缭绕的沼泽地，充满了毒虫和陷阱。",
      background: "swamp",
    },
    {
      stageId: 4,
      name: "烈焰峡谷",
      difficulty: "普通",
      enemies: "火灵",
      rewards: ["灵石 x150"],
      boss: "炎龙",
      description: "炽热的峡谷中居住着强大的火系生物。",
      background: "volcano",
    },
    {
      stageId: 5,
      name: "冰霜雪域",
      difficulty: "困难",
      enemies: "冰妖",
      rewards: ["灵石 x200"],
      boss: "冰霜巨人",
      description: "永恒的冰雪之地，考验着修仙者的意志。",
      background: "ice",
    },
    {
      stageId: 6,
      name: "雷电高原",
      difficulty: "困难",
      enemies: "雷兽",
      rewards: ["灵石 x300"],
      boss: "雷鸟",
      description: "雷电不断的高原，蕴含着天地之力。",
      background: "thunder",
    },
    {
      stageId: 7,
      name: "暗影深渊",
      difficulty: "地狱",
      enemies: "魔物",
      rewards: ["灵石 x500"],
      boss: "深渊领主",
      description: "无底的深渊中潜伏着来自地狱的魔物。",
      background: "abyss",
    },
    {
      stageId: 8,
      name: "天界云海",
      difficulty: "地狱",
      enemies: "天兵",
      rewards: ["灵石 x750"],
      boss: "天将",
      description: "云雾缭绕的天界，守护着神圣的力量。",
      background: "heaven",
    },
    {
      stageId: 9,
      name: "混沌虚空",
      difficulty: "噩梦",
      enemies: "虚空生物",
      rewards: ["灵石 x1000"],
      boss: "虚空君主",
      description: "混沌的虚空中存在着超越理解的生物。",
      background: "void",
    },
    {
      stageId: 10,
      name: "仙界禁地",
      difficulty: "噩梦",
      enemies: "仙人",
      rewards: ["灵石 x1500"],
      boss: "仙帝",
      description: "仙界的最高禁地，只有最强者才能踏足。",
      background: "immortal",
    },
  ];

  const stageList = stages.length > 0 ? stages : defaultStages;

  const totalPages = Math.ceil(stages.length / stagesPerPage);
  const startIndex = currentPage * stagesPerPage;
  const endIndex = Math.min(startIndex + stagesPerPage, stages.length);
  const currentStages = stages.slice(startIndex, endIndex);

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

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "简单":
        return "🟢";
      case "普通":
        return "🟡";
      case "困难":
        return "🔴";
      case "地狱":
        return "🟣";
      case "噩梦":
        return "💀";
      default:
        return "⚪";
    }
  };

  const getStageIcon = (stageId) => {
    const icons = {
      1: "🏔️",
      2: "🌲",
      3: "🐸",
      4: "🌋",
      5: "❄️",
      6: "⚡",
      7: "🕳️",
      8: "☁️",
      9: "🌀",
      10: "✨",
    };
    return icons[stageId] || "⚔️";
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

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <span className={styles.titleIcon}>⚔️</span>
            选择关卡
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Page Navigation */}
          <div className={styles.pageNavigation}>
            <button
              className={`${styles.pageNavButton} ${
                currentPage === 0 ? styles.disabled : ""
              }`}
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              ← 上一页
            </button>

            <div className={styles.pageIndicators}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`${styles.pageIndicator} ${
                    currentPage === index ? styles.active : ""
                  }`}
                  onClick={() => handlePageClick(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className={`${styles.pageNavButton} ${
                currentPage === totalPages - 1 ? styles.disabled : ""
              }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              下一页 →
            </button>
          </div>

          {/* Stage Grid */}
          <div className={styles.stageGrid}>
            {currentStages.map((stage) => {
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
                    <div className={styles.stageIcon}>
                      {getStageIcon(stage.id)}
                    </div>
                    <div className={styles.stageNumber}>第{stage.id}关</div>
                    <div
                      className={styles.difficulty}
                      style={{ color: getDifficultyColor(stage.difficulty) }}
                    >
                      {getDifficultyIcon(stage.difficulty)} {stage.difficulty}
                    </div>
                  </div>

                  <div className={styles.stageContent}>
                    <h3 className={styles.stageName}>{stage.name}</h3>
                    <p className={styles.stageDescription}>
                      {stage.description}
                    </p>

                    <div className={styles.stageInfo}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>敌人:</span>
                        <span className={styles.infoValue}>
                          {stage.enemies}
                        </span>
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
                      <div className={styles.lockText}>未解锁</div>
                    </div>
                  )}

                  {isCurrent && (
                    <div className={styles.currentBadge}>
                      <span className={styles.currentIcon}>⭐</span>
                      当前
                    </div>
                  )}

                  {isSelected && isUnlocked && (
                    <div className={styles.selectedIndicator}>
                      <span className={styles.selectedIcon}>✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Information */}
          <div className={styles.progressInfo}>
            <div className={styles.progressStats}>
              <div className={styles.progressStat}>
                <span className={styles.statIcon}>🏆</span>
                <span className={styles.statLabel}>已解锁:</span>
                <span className={styles.statValue}>
                  {unlockedStages.length} / {stages.length}
                </span>
              </div>
              <div className={styles.progressStat}>
                <span className={styles.statIcon}>📍</span>
                <span className={styles.statLabel}>当前关卡:</span>
                <span className={styles.statValue}>第{currentStage}关</span>
              </div>
              <div className={styles.progressStat}>
                <span className={styles.statIcon}>🎯</span>
                <span className={styles.statLabel}>选中关卡:</span>
                <span className={styles.statValue}>第{selectedStage}关</span>
              </div>
            </div>
          </div>
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
