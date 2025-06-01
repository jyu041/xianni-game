// frontend/src/components/game/ElementStatusHUD.jsx
import { useState, useEffect } from "react";
import elementService from "../../services/elementService";
import styles from "./ElementStatusHUD.module.css";

const ElementStatusHUD = ({ playerData, stageData, gameState }) => {
  const [elementInteraction, setElementInteraction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    calculateElementInteraction();
  }, [playerData, stageData]);

  const calculateElementInteraction = async () => {
    if (!playerData || !stageData) return;

    try {
      const playerElement = playerData.primaryElement || "fire";
      const playerLevel = playerData.elementLevels?.[playerElement] || 0;
      const stageElement = stageData.stageElement || "neutral";
      const stageLevel = stageData.elementLevel || 0;

      const interaction = await elementService.calculateElementInteraction(
        playerElement,
        playerLevel,
        stageElement,
        stageLevel
      );

      setElementInteraction(interaction);
    } catch (error) {
      console.error("Failed to calculate element interaction:", error);
    }
  };

  const getInteractionColor = () => {
    if (!elementInteraction) return "#ffffff";

    switch (elementInteraction.effectType) {
      case "advantage":
        return "#00ff00";
      case "weak_advantage":
        return "#88ff88";
      case "disadvantage":
        return "#ff4444";
      case "backfire":
        return "#ff0000";
      default:
        return "#ffffff";
    }
  };

  const getInteractionText = () => {
    if (!elementInteraction) return "无效果";

    switch (elementInteraction.effectType) {
      case "advantage":
        return "属性优势";
      case "weak_advantage":
        return "微弱优势";
      case "disadvantage":
        return "属性劣势";
      case "backfire":
        return "属性反噬";
      default:
        return "无效果";
    }
  };

  const getInteractionIcon = () => {
    if (!elementInteraction) return "⚊";

    switch (elementInteraction.effectType) {
      case "advantage":
        return "⬆️";
      case "weak_advantage":
        return "↗️";
      case "disadvantage":
        return "⬇️";
      case "backfire":
        return "💀";
      default:
        return "⚊";
    }
  };

  const primaryElement = playerData?.primaryElement || "fire";
  const stageElement = stageData?.stageElement || "neutral";
  const tianniSwordLevel = playerData?.tianniSwordLevel || 1;
  const hasMutation = playerData?.hasTianniSwordMutation || false;

  return (
    <div className={styles.elementHUD}>
      {/* Element Interaction Status */}
      <div
        className={styles.interactionStatus}
        style={{ borderColor: getInteractionColor() }}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        <div className={styles.interactionIcon}>{getInteractionIcon()}</div>
        <div className={styles.interactionInfo}>
          <div
            className={styles.interactionText}
            style={{ color: getInteractionColor() }}
          >
            {getInteractionText()}
          </div>
          <div className={styles.elementComparison}>
            <span
              style={{ color: elementService.getElementColor(primaryElement) }}
            >
              {elementService.getElementName(primaryElement)}
            </span>
            <span className={styles.vs}>vs</span>
            <span
              style={{ color: elementService.getElementColor(stageElement) }}
            >
              {stageElement === "neutral"
                ? "无"
                : elementService.getElementName(stageElement)}
            </span>
          </div>
        </div>
      </div>

      {/* Tianni Sword Status */}
      <div className={styles.swordStatus}>
        <div className={styles.swordIcon}>⚔️</div>
        <div className={styles.swordInfo}>
          <div className={styles.swordLevel}>
            天逆剑 Lv.{tianniSwordLevel}
            {hasMutation && <span className={styles.mutationIndicator}>★</span>}
          </div>
          <div className={styles.skillHint}>按空格键使用技能</div>
        </div>
      </div>

      {/* Detailed Tooltip */}
      {showDetails && elementInteraction && (
        <div className={styles.detailsTooltip}>
          <h4>属性相克效果</h4>
          {elementInteraction.damageMultiplier !== 1.0 && (
            <p>
              伤害倍数: {(elementInteraction.damageMultiplier * 100).toFixed(0)}
              %
            </p>
          )}
          {elementInteraction.damageReduction !== 0 && (
            <p>
              伤害减免:{" "}
              {(Math.abs(elementInteraction.damageReduction) * 100).toFixed(0)}%
            </p>
          )}
          {elementInteraction.manaEfficiency !== 1.0 && (
            <p>
              灵气消耗: {(elementInteraction.manaEfficiency * 100).toFixed(0)}%
            </p>
          )}
          {elementInteraction.healthCostOnSkill && (
            <p className={styles.warning}>技能消耗生命值</p>
          )}
        </div>
      )}

      {/* Element Passive Indicators */}
      <div className={styles.passiveIndicators}>
        {playerData?.elementLevels &&
          Object.entries(playerData.elementLevels).map(([element, level]) => {
            if (level === 0) return null;

            const isPrimary = element === primaryElement;
            const bonus = elementService.getElementPassiveBonus(
              element,
              level,
              isPrimary
            );

            if (bonus === 0) return null;

            return (
              <div
                key={element}
                className={`${styles.passiveIndicator} ${
                  isPrimary ? styles.primary : ""
                }`}
                style={{ borderColor: elementService.getElementColor(element) }}
              >
                <span
                  className={styles.elementSymbol}
                  style={{ color: elementService.getElementColor(element) }}
                >
                  {elementService.getElementName(element)}
                </span>
                <span className={styles.bonusValue}>
                  {element === "metal"
                    ? `+${(bonus * 100).toFixed(0)}%`
                    : element === "wood"
                    ? `${(bonus * 100).toFixed(1)}%/s`
                    : element === "water"
                    ? `+${(bonus * 100).toFixed(1)}%/s`
                    : element === "fire"
                    ? `+${(bonus * 100).toFixed(0)}%`
                    : element === "earth"
                    ? `-${(bonus * 100).toFixed(0)}%`
                    : ""}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ElementStatusHUD;
