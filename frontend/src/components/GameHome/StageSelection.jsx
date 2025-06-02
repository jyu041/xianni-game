// frontend/src/components/GameHome/StageSelection.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import elementService from "../../services/elementService";
import stageService from "../../services/stageService";
import sharedStyles from "./SharedDisplay.module.css";

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
      <div className={sharedStyles.displayContainer}>
        <div className={sharedStyles.loading}>
          <div className={sharedStyles.loadingSpinner} />
          <p>加载关卡中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={sharedStyles.displayContainer}>
      <div className={sharedStyles.displayHeader}>
        <h2>关卡选择</h2>
        <p>选择关卡开始你的修仙之旅</p>
      </div>

      <div className={`${sharedStyles.gridContainer} ${sharedStyles.grid3Col}`}>
        {stages.map((stage) => {
          const unlocked = isStageUnlocked(stage.stageId);
          const canEnter = canEnterStage(stage);
          const isSelected = selectedStage?.stageId === stage.stageId;

          return (
            <Card
              key={stage.stageId}
              variant={isSelected ? "primary" : unlocked ? "default" : "dark"}
              className={`${sharedStyles.itemCard} ${
                !canEnter ? sharedStyles.locked : ""
              } ${isSelected ? sharedStyles.selected : ""}`}
              onClick={() => handleStageClick(stage)}
            >
              <div className={sharedStyles.itemHeader}>
                <div
                  style={{
                    background: "linear-gradient(45deg, #8a2be2, #9370db)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    boxShadow: "0 2px 8px rgba(138,43,226,0.4)",
                  }}
                >
                  第{stage.stageId}关
                </div>
                <div
                  style={{
                    color: getDifficultyColor(stage.difficulty),
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "15px",
                    background: "rgba(0,0,0,0.6)",
                    border: `1px solid ${getDifficultyColor(stage.difficulty)}`,
                    textShadow: `0 0 10px ${getDifficultyColor(
                      stage.difficulty
                    )}`,
                  }}
                >
                  {stage.difficulty}
                </div>
              </div>

              <div className={sharedStyles.itemInfo}>
                <h4
                  className={sharedStyles.itemName}
                  style={{
                    color: "#ffffff",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    textShadow: "0 0 10px rgba(255,255,255,0.5)",
                  }}
                >
                  {stage.name}
                </h4>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "0.9rem",
                    }}
                  >
                    最低等级: {stage.minLevel}
                  </div>

                  {stage.stageElement && stage.stageElement !== "neutral" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      <span
                        style={{
                          color: elementService.getElementColor(
                            stage.stageElement
                          ),
                        }}
                      >
                        {elementService.getElementName(stage.stageElement)}属性
                      </span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.8rem",
                        }}
                      >
                        Lv.{stage.elementLevel}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={sharedStyles.itemDescription}
                  style={{ marginBottom: "1rem" }}
                >
                  {stage.description}
                </div>

                <div style={{ marginTop: "auto" }}>
                  <h4
                    style={{
                      color: "#ffd700",
                      margin: "0 0 0.5rem 0",
                      fontSize: "0.9rem",
                      textShadow: "0 0 10px rgba(255,215,0,0.5)",
                    }}
                  >
                    通关奖励:
                  </h4>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {(stage.rewards || []).map((reward, index) => (
                      <span
                        key={index}
                        style={{
                          background: "rgba(255,215,0,0.2)",
                          color: "#ffd700",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          border: "1px solid rgba(255,215,0,0.3)",
                        }}
                      >
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {!unlocked && (
                <div className={sharedStyles.lockedOverlay}>
                  <span className={sharedStyles.lockIcon}>🔒</span>
                  <span>未解锁</span>
                </div>
              )}

              {unlocked && !canEnter && (
                <div className={sharedStyles.lockedOverlay}>
                  <span className={sharedStyles.lockIcon}>⚠️</span>
                  <span>等级不足</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {selectedStage && (
        <div className={sharedStyles.modalOverlay}>
          <Card variant="glass" className={sharedStyles.modalPanel}>
            <div className={sharedStyles.modalHeader}>
              <div className={sharedStyles.modalInfo}>
                <h3>{selectedStage.name}</h3>
              </div>
              <button
                className={sharedStyles.closeButton}
                onClick={() => setSelectedStage(null)}
              >
                ×
              </button>
            </div>

            <p className={sharedStyles.modalDescription}>
              {selectedStage.description}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span
                  style={{ color: "rgba(255,255,255,0.7)", fontWeight: "600" }}
                >
                  难度:
                </span>
                <span
                  style={{
                    color: getDifficultyColor(selectedStage.difficulty),
                    fontWeight: "bold",
                  }}
                >
                  {selectedStage.difficulty}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span
                  style={{ color: "rgba(255,255,255,0.7)", fontWeight: "600" }}
                >
                  Boss:
                </span>
                <span
                  style={{
                    color: "#ff6b6b",
                    fontWeight: "bold",
                    textShadow: "0 0 10px rgba(255,107,107,0.5)",
                  }}
                >
                  {selectedStage.boss}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span
                  style={{ color: "rgba(255,255,255,0.7)", fontWeight: "600" }}
                >
                  敌人类型:
                </span>
                <span style={{ color: "#ffffff", fontWeight: "bold" }}>
                  {selectedStage.enemies}
                </span>
              </div>

              {selectedStage.elementInteraction && (
                <div
                  style={{
                    background: "rgba(138,43,226,0.1)",
                    border: "1px solid rgba(138,43,226,0.3)",
                    borderRadius: "10px",
                    padding: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <h4
                    style={{
                      color: "#8a2be2",
                      margin: "0 0 0.5rem 0",
                      fontSize: "1rem",
                      textShadow: "0 0 10px rgba(138,43,226,0.5)",
                    }}
                  >
                    属性相克效果:
                  </h4>
                  <p
                    style={{
                      margin: "0",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: (() => {
                        switch (selectedStage.elementInteraction.type) {
                          case "advantage":
                            return "#00ff00";
                          case "weak_advantage":
                            return "#88ff88";
                          case "disadvantage":
                            return "#ff6b6b";
                          case "backfire":
                            return "#ff0000";
                          default:
                            return "rgba(255,255,255,0.8)";
                        }
                      })(),
                    }}
                  >
                    {selectedStage.elementInteraction.description}
                  </p>
                </div>
              )}
            </div>

            <div className={sharedStyles.modalActions}>
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
