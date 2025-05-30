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
          {totalPages > 1 && (
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
          )}

          {/* Stage Grid */}
          <div className={styles.stageGrid}>
            {currentStages.map((stage) => {
              const isUnlocked = isStageUnlocked(stage.stageId);
              const isCurrent = stage.stageId === currentStage;
              const isSelected = stage.stageId === selectedStage;

              return (
                <div
                  key={stage.stageId}
                  className={`${styles.stageCard} ${
                    !isUnlocked ? styles.locked : ""
                  } ${isCurrent ? styles.current : ""} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => handleStageClick(stage.stageId)}
                >
                  <div className={styles.stageHeader}>
                    <div className={styles.stageIcon}>
                      {getStageIcon(stage.stageId)}
                    </div>
                    <div className={styles.stageNumber}>
                      第{stage.stageId}关
                    </div>
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
                        <span className={styles.infoValue}>
                          {stage.rewards ? stage.rewards.join(", ") : "未知"}
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
