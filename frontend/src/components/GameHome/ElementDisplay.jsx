// frontend/src/components/GameHome/ElementDisplay.jsx
import { useState, useEffect } from "react";
import elementService from "../../services/elementService";
import styles from "./ElementDisplay.module.css";

const ElementDisplay = ({ playerData, onElementChange }) => {
  const [elementInfo, setElementInfo] = useState(null);
  const [selectedElement, setSelectedElement] = useState(
    playerData?.primaryElement || "fire"
  );

  useEffect(() => {
    loadElementInfo();
  }, []);

  const loadElementInfo = async () => {
    try {
      const info = await elementService.getElementInfo();
      setElementInfo(info);
    } catch (error) {
      console.error("Failed to load element info:", error);
    }
  };

  const handleElementSelect = async (element) => {
    setSelectedElement(element);
    if (onElementChange) {
      try {
        await elementService.updatePrimaryElement(playerData.id, element);
        onElementChange(element);
      } catch (error) {
        console.error("Failed to update primary element:", error);
      }
    }
  };

  const getElementLevel = (element) => {
    if (!playerData?.elementLevels) return 0;
    return playerData.elementLevels[element] || 0;
  };

  const getElementExperience = (element) => {
    if (!playerData?.elementExperience) return 0;
    return playerData.elementExperience[element] || 0;
  };

  const getElementProgress = (element) => {
    const level = getElementLevel(element);
    const exp = getElementExperience(element);
    const currentLevelExp = level * 1000;
    const nextLevelExp = (level + 1) * 1000;
    const progress =
      ((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getTianniSwordAbility = (level, hasMutation = false) => {
    if (hasMutation && level >= 10) {
      return {
        name: "五行寂灭",
        description: "释放所有五种元素的斩击组合，造成大范围伤害",
        damage: "75%最大生命值",
        aoeSize: "大型AOE",
      };
    }

    const abilities = {
      1: {
        name: "基础剑气",
        description: "发射基础剑气攻击敌人",
        damage: "25点固定伤害",
      },
      2: {
        name: "小型斩击",
        description: "释放小型AOE伤害技能",
        damage: "20%最大生命值",
      },
      3: {
        name: "强化小型斩击",
        description: "释放强化的小型AOE伤害技能",
        damage: "25%最大生命值",
      },
      4: {
        name: "中型斩击",
        description: "释放中型AOE伤害技能",
        damage: "30%最大生命值",
      },
      5: {
        name: "强化中型斩击",
        description: "释放强化的中型AOE伤害技能",
        damage: "35%最大生命值",
      },
      6: {
        name: "大型斩击",
        description: "释放大型AOE伤害技能",
        damage: "40%最大生命值",
      },
      7: {
        name: "强化大型斩击",
        description: "释放强化的大型AOE伤害技能",
        damage: "45%最大生命值",
      },
      8: {
        name: "极强大型斩击",
        description: "释放极强的大型AOE伤害技能",
        damage: "50%最大生命值",
      },
      9: {
        name: "至强大型斩击",
        description: "释放至强的大型AOE伤害技能",
        damage: "55%最大生命值",
      },
      10: {
        name: "三重斩击",
        description: "连续释放三种斩击技能",
        damage: "60%最大生命值",
      },
    };

    return abilities[level] || abilities[1];
  };

  if (!elementInfo) {
    return <div className={styles.loading}>加载中...</div>;
  }

  return (
    <div className={styles.elementDisplay}>
      <div className={styles.header}>
        <h3>元素修炼</h3>
        <p>选择你的主要元素属性</p>
      </div>

      <div className={styles.elementGrid}>
        {Object.keys(elementInfo.names).map((element) => {
          const level = getElementLevel(element);
          const progress = getElementProgress(element);
          const isPrimary = element === selectedElement;
          const elementColor = elementService.getElementColor(element);

          return (
            <div
              key={element}
              className={`${styles.elementCard} ${
                isPrimary ? styles.primary : ""
              }`}
              onClick={() => handleElementSelect(element)}
              style={{
                borderColor: isPrimary ? elementColor : "rgba(255,255,255,0.2)",
              }}
            >
              <div
                className={styles.elementIcon}
                style={{ backgroundColor: elementColor }}
              >
                {elementInfo.names[element]}
              </div>

              <div className={styles.elementInfo}>
                <h4 style={{ color: elementColor }}>
                  {elementInfo.names[element]}属性
                </h4>
                <p className={styles.level}>等级 {level}/100</p>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${progress}%`,
                      backgroundColor: elementColor,
                    }}
                  />
                </div>

                <p className={styles.description}>
                  {elementInfo.descriptions[element]}
                </p>

                {isPrimary && (
                  <div className={styles.primaryBadge}>主要属性</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.tianniSwordInfo}>
        <h4>天逆剑</h4>
        <div className={styles.swordLevel}>
          等级 {playerData?.tianniSwordLevel || 1}/10
          {playerData?.hasTianniSwordMutation && (
            <span className={styles.mutationBadge}>五行寂灭</span>
          )}
        </div>

        {playerData?.tianniSwordLevel && (
          <div className={styles.abilityInfo}>
            {(() => {
              const ability = getTianniSwordAbility(
                playerData.tianniSwordLevel,
                playerData.hasTianniSwordMutation
              );
              return (
                <div className={styles.abilityDetails}>
                  <p>
                    <strong>{ability.name}</strong>
                  </p>
                  <p>{ability.description}</p>
                  {ability.damage && <p>伤害: {ability.damage}</p>}
                  {ability.aoeSize && <p>范围: {ability.aoeSize}</p>}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <div className={styles.elementCounters}>
        <h4>五行相克</h4>
        <div className={styles.counterGrid}>
          {Object.keys(elementInfo.names).map((element) => {
            const counters = elementInfo.counters[element];
            return (
              <div key={element} className={styles.counterRow}>
                <span
                  style={{ color: elementService.getElementColor(element) }}
                >
                  {elementInfo.names[element]}
                </span>
                <span>克</span>
                <span
                  style={{ color: elementService.getElementColor(counters) }}
                >
                  {elementInfo.names[counters]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ElementDisplay;
