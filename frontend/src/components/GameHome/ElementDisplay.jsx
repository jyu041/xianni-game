// frontend/src/components/GameHome/ElementDisplay.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import elementService from "../../services/elementService";
import sharedStyles from "./SharedDisplay.module.css";

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
    return (
      <div className={sharedStyles.displayContainer}>
        <div className={sharedStyles.loading}>
          <div className={sharedStyles.loadingSpinner} />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={sharedStyles.displayContainer}>
      <div className={sharedStyles.displayHeader}>
        <h2>元素修炼</h2>
        <p>修炼五行元素，提升你的修仙能力</p>
      </div>

      <div
        className={sharedStyles.gridContainer}
        style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
      >
        {Object.keys(elementInfo.names).map((element) => {
          const level = getElementLevel(element);
          const progress = getElementProgress(element);
          const isPrimary = element === selectedElement;
          const elementColor = elementService.getElementColor(element);

          return (
            <Card
              key={element}
              variant={isPrimary ? "primary" : "default"}
              className={`${sharedStyles.itemCard} ${
                isPrimary ? sharedStyles.selected : ""
              }`}
              onClick={() => handleElementSelect(element)}
              style={{
                borderColor: isPrimary ? elementColor : "rgba(255,255,255,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: elementColor,
                    margin: "0 auto 1rem auto",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {elementInfo.names[element]}
                </div>

                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <h4
                    style={{
                      color: elementColor,
                      margin: "0 0 0.5rem 0",
                      fontSize: "1rem",
                    }}
                  >
                    {elementInfo.names[element]}属性
                  </h4>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      margin: "0 0 0.75rem 0",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    等级 {level}/100
                  </p>

                  <div
                    className={sharedStyles.progressContainer}
                    style={{ width: "100%" }}
                  >
                    <div className={sharedStyles.progressBar}>
                      <div
                        className={sharedStyles.progressFill}
                        style={{
                          width: `${progress}%`,
                          backgroundColor: elementColor,
                        }}
                      />
                    </div>
                  </div>

                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.8rem",
                      margin: "0 0 1rem 0",
                      lineHeight: "1.4",
                      flex: 1,
                    }}
                  >
                    {elementInfo.descriptions[element]}
                  </p>

                  {isPrimary && (
                    <div
                      style={{
                        background: "linear-gradient(45deg, #ffd700, #ffed4e)",
                        color: "#000000",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "12px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(255,215,0,0.4)",
                      }}
                    >
                      主要属性
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tianni Sword Info */}
      <div className={sharedStyles.statsSection}>
        <Card
          variant="primary"
          style={{
            background: "rgba(0,0,0,0.8)",
            border: "2px solid rgba(138,43,226,0.6)",
            padding: "1.5rem",
          }}
        >
          <h4
            style={{
              color: "#8a2be2",
              margin: "0 0 1rem 0",
              fontSize: "1.4rem",
              textAlign: "center",
              textShadow: "0 0 10px rgba(138,43,226,0.5)",
            }}
          >
            天逆剑
          </h4>
          <div
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.1rem",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            等级 {playerData?.tianniSwordLevel || 1}/10
            {playerData?.hasTianniSwordMutation && (
              <span
                style={{
                  background:
                    "linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4ecdc4, #45b7d1)",
                  backgroundSize: "200% 200%",
                  animation: "rainbowFlow 3s ease infinite",
                  color: "#000000",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "15px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginLeft: "0.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                五行寂灭
              </span>
            )}
          </div>

          {playerData?.tianniSwordLevel && (
            <div
              style={{
                background: "rgba(138,43,226,0.1)",
                border: "1px solid rgba(138,43,226,0.3)",
                borderRadius: "10px",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              {(() => {
                const ability = getTianniSwordAbility(
                  playerData.tianniSwordLevel,
                  playerData.hasTianniSwordMutation
                );
                return (
                  <div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        margin: "0.25rem 0",
                        fontSize: "0.9rem",
                      }}
                    >
                      <strong style={{ color: "#8a2be2" }}>
                        {ability.name}
                      </strong>
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        margin: "0.25rem 0",
                        fontSize: "0.9rem",
                      }}
                    >
                      {ability.description}
                    </p>
                    {ability.damage && (
                      <p
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          margin: "0.25rem 0",
                          fontSize: "0.9rem",
                        }}
                      >
                        伤害: {ability.damage}
                      </p>
                    )}
                    {ability.aoeSize && (
                      <p
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          margin: "0.25rem 0",
                          fontSize: "0.9rem",
                        }}
                      >
                        范围: {ability.aoeSize}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </Card>
      </div>

      {/* Element Counters */}
      <div className={sharedStyles.statsSection}>
        <Card
          variant="default"
          style={{ background: "rgba(0,0,0,0.6)", padding: "1.5rem" }}
        >
          <h4
            style={{
              color: "#ffffff",
              margin: "0 0 1rem 0",
              fontSize: "1.2rem",
              textAlign: "center",
            }}
          >
            五行相克
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0.75rem",
            }}
          >
            {Object.keys(elementInfo.names).map((element) => {
              const counters = elementInfo.counters[element];
              return (
                <div
                  key={element}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    padding: "0.5rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    fontWeight: "600",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      color: elementService.getElementColor(element),
                    }}
                  >
                    {elementInfo.names[element]}
                  </span>
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: "normal",
                    }}
                  >
                    克
                  </span>
                  <span
                    style={{
                      fontSize: "1rem",
                      color: elementService.getElementColor(counters),
                    }}
                  >
                    {elementInfo.names[counters]}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ElementDisplay;
