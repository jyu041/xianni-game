// frontend/src/components/game/StageSelection.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import elementService from "../../services/elementService";
import stageService from "../../services/stageService";
import styles from "./StageSelection.module.css";

const StageSelection = ({ playerData, onStageSelect, onNavigate }) => {
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStages();
  }, []);

  const loadStages = async () => {
    try {
      setLoading(true);
      const stageData = await stageService.getAllStages();
      setStages(stageData || []);
    } catch (error) {
      console.error("Failed to load stages:", error);
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      简单: "#4ade80",
      普通: "#fbbf24",
      困难: "#f97316",
      地狱: "#ef4444",
      噩梦: "#8b5cf6",
    };
    return colors[difficulty] || "#ffffff";
  };

  const isStageUnlocked = (stageId) => {
    return playerData?.unlockedStages?.includes(stageId) || false;
  };

  const canEnterStage = (stage) => {
    return (
      isStageUnlocked(stage.stageId) && playerData?.level >= stage.minLevel
    );
  };

  const getElementInteractionPreview = async (stage) => {
    if (!stage.stageElement || stage.stageElement === "neutral") {
      return { type: "neutral", description: "无属性影响" };
    }

    try {
      const playerElement = playerData?.primaryElement || "fire";
      const playerLevel = playerData?.elementLevels?.[playerElement] || 0;

      const interaction = await elementService.calculateElementInteraction(
        playerElement,
        playerLevel,
        stage.stageElement,
        stage.elementLevel
      );

      const descriptions = {
        advantage: "属性优势 - 伤害+25%, 受伤-15%, 灵气-15%",
        weak_advantage: "微弱优势 - 伤害+10%, 受伤-5%, 灵气-5%",
        disadvantage: "属性劣势 - 伤害-20%, 受伤+15%, 灵气+20%",
        backfire: "属性反噬 - 技能消耗生命值, 灵气+50%",
        neutral: "无属性影响",
      };

      return {
        type: interaction.effectType,
        description: descriptions[interaction.effectType] || "无属性影响",
      };
    } catch (error) {
      console.error("Failed to calculate element interaction:", error);
      return { type: "neutral", description: "无属性影响" };
    }
  };

  const handleStageClick = async (stage) => {
    if (!canEnterStage(stage)) return;

    const interaction = await getElementInteractionPreview(stage);
    setSelectedStage({ ...stage, elementInteraction: interaction });
  };

  const handleEnterStage = () => {
    if (selectedStage && onStageSelect) {
      onStageSelect(selectedStage);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <p>加载关卡中...</p>
      </div>
    );
  }

  return (
    <div className={styles.stageSelection}>
      <div className={styles.stageGrid}>
        {stages.map((stage) => {
          const unlocked = isStageUnlocked(stage.stageId);
          const canEnter = canEnterStage(stage);
          const isSelected = selectedStage?.stageId === stage.stageId;

          return (
            <Card
              key={stage.stageId}
              variant={isSelected ? "primary" : unlocked ? "default" : "dark"}
              className={`${styles.stageCard} ${
                !canEnter ? styles.locked : ""
              } ${isSelected ? styles.selected : ""}`}
              onClick={() => handleStageClick(stage)}
            >
              <div className={styles.stageHeader}>
                <div className={styles.stageNumber}>第{stage.stageId}关</div>
                <div
                  className={styles.difficulty}
                  style={{ color: getDifficultyColor(stage.difficulty) }}
                >
                  {stage.difficulty}
                </div>
              </div>

              <div className={styles.stageName}>{stage.name}</div>

              <div className={styles.stageInfo}>
                <div className={styles.requirement}>
                  最低等级: {stage.minLevel}
                </div>

                {stage.stageElement && stage.stageElement !== "neutral" && (
                  <div className={styles.elementInfo}>
                    <span
                      style={{
                        color: elementService.getElementColor(
                          stage.stageElement
                        ),
                      }}
                    >
                      {elementService.getElementName(stage.stageElement)}属性
                    </span>
                    <span className={styles.elementLevel}>
                      Lv.{stage.elementLevel}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.stageDescription}>{stage.description}</div>

              <div className={styles.stageRewards}>
                <h4>通关奖励:</h4>
                <div className={styles.rewardList}>
                  {(stage.rewards || []).map((reward, index) => (
                    <span key={index} className={styles.reward}>
                      {reward}
                    </span>
                  ))}
                </div>
              </div>

              {!unlocked && (
                <div className={styles.lockedOverlay}>
                  <span className={styles.lockIcon}>🔒</span>
                  <span>未解锁</span>
                </div>
              )}

              {unlocked && !canEnter && (
                <div className={styles.lockedOverlay}>
                  <span className={styles.lockIcon}>⚠️</span>
                  <span>等级不足</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {selectedStage && (
        <div className={styles.stageDetail}>
          <Card variant="glass" className={styles.detailPanel}>
            <h3>{selectedStage.name}</h3>
            <p className={styles.detailDescription}>
              {selectedStage.description}
            </p>

            <div className={styles.detailInfo}>
              <div className={styles.detailRow}>
                <span>难度:</span>
                <span
                  style={{
                    color: getDifficultyColor(selectedStage.difficulty),
                  }}
                >
                  {selectedStage.difficulty}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span>Boss:</span>
                <span className={styles.bossName}>{selectedStage.boss}</span>
              </div>

              <div className={styles.detailRow}>
                <span>敌人类型:</span>
                <span>{selectedStage.enemies}</span>
              </div>

              {selectedStage.elementInteraction && (
                <div className={styles.elementInteraction}>
                  <h4>属性相克效果:</h4>
                  <p
                    className={`${styles.interactionText} ${
                      styles[selectedStage.elementInteraction.type]
                    }`}
                  >
                    {selectedStage.elementInteraction.description}
                  </p>
                </div>
              )}
            </div>

            <div className={styles.detailActions}>
              <Button variant="ghost" onClick={() => setSelectedStage(null)}>
                取消
              </Button>
              <Button variant="primary" onClick={handleEnterStage}>
                进入关卡
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StageSelection;
