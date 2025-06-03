// frontend/src/components/GameHome/TreasureInventory.jsx
import { useState, useEffect } from "react";
import elementService from "../../services/elementService";
import Card from "../ui/Card";
import Button from "../ui/Button";
import sharedStyles from "./SharedDisplay.module.css";

const TreasureInventory = ({ playerData, onTreasureUpgrade }) => {
  const [selectedTreasure, setSelectedTreasure] = useState("tianniSword");

  // Get Tianni Sword ability description based on level
  const getTianniSwordAbility = (level, hasMutation = false) => {
    if (hasMutation && level >= 10) {
      return {
        name: "五行寂灭",
        description: "释放所有五种元素的斩击组合，造成大范围伤害",
        damage: "75%最大生命值",
        aoeSize: "大型AOE",
        animation: "slash3 + slash2 + slash1 (五色组合)",
        cooldown: "5秒",
        manaCost: "100",
        special: true,
      };
    }

    const abilities = {
      1: {
        name: "基础剑气",
        description: "发射基础剑气攻击敌人",
        damage: "25点固定伤害",
        aoeSize: "单体",
        animation: "基础剑气",
        cooldown: "无",
        manaCost: "0",
      },
      2: {
        name: "小型斩击",
        description: "释放小型AOE伤害技能",
        damage: "20%最大生命值",
        aoeSize: "小型AOE",
        animation: "slash3",
        cooldown: "5秒",
        manaCost: "20",
      },
      3: {
        name: "强化小型斩击",
        description: "释放强化的小型AOE伤害技能",
        damage: "25%最大生命值",
        aoeSize: "小型AOE",
        animation: "slash3",
        cooldown: "5秒",
        manaCost: "20",
      },
      4: {
        name: "中型斩击",
        description: "释放中型AOE伤害技能",
        damage: "30%最大生命值",
        aoeSize: "中型AOE",
        animation: "slash2",
        cooldown: "5秒",
        manaCost: "35",
      },
      5: {
        name: "强化中型斩击",
        description: "释放强化的中型AOE伤害技能",
        damage: "35%最大生命值",
        aoeSize: "中型AOE",
        animation: "slash2",
        cooldown: "5秒",
        manaCost: "35",
      },
      6: {
        name: "大型斩击",
        description: "释放大型AOE伤害技能",
        damage: "40%最大生命值",
        aoeSize: "大型AOE",
        animation: "slash1",
        cooldown: "5秒",
        manaCost: "50",
      },
      7: {
        name: "强化大型斩击",
        description: "释放强化的大型AOE伤害技能",
        damage: "45%最大生命值",
        aoeSize: "大型AOE",
        animation: "slash1",
        cooldown: "5秒",
        manaCost: "50",
      },
      8: {
        name: "极强大型斩击",
        description: "释放极强的大型AOE伤害技能",
        damage: "50%最大生命值",
        aoeSize: "大型AOE",
        animation: "slash1",
        cooldown: "5秒",
        manaCost: "50",
      },
      9: {
        name: "至强大型斩击",
        description: "释放至强的大型AOE伤害技能",
        damage: "55%最大生命值",
        aoeSize: "大型AOE",
        animation: "slash1",
        cooldown: "5秒",
        manaCost: "50",
      },
      10: {
        name: "三重斩击",
        description: "连续释放三种斩击技能",
        damage: "60%最大生命值",
        aoeSize: "中大型AOE",
        animation: "slash3 + slash2 + slash1",
        cooldown: "5秒",
        manaCost: "75",
      },
    };

    return abilities[level] || abilities[1];
  };

  const treasures = [
    {
      id: "tianniSword",
      name: "天逆剑",
      description:
        "一剑出，时流滞，五行寂灭。再剑落，天机断，轮回逆生。————此剑，为悖逆之道。",
      level: playerData?.tianniSwordLevel || 1,
      maxLevel: 10,
      rarity: "legendary",
      locked: true, // Cannot be removed
      equipped: true,
      hasMutation: playerData?.hasTianniSwordMutation || false,
      element: playerData?.primaryElement || "fire",
      type: "weapon",
    },
  ];

  const selectedTreasureData = treasures.find((t) => t.id === selectedTreasure);
  const ability = selectedTreasureData
    ? getTianniSwordAbility(
        selectedTreasureData.level,
        selectedTreasureData.hasMutation
      )
    : null;

  const getElementColor = (element) => {
    return elementService.getElementColor(element);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: "#ffffff",
      uncommon: "#1eff00",
      rare: "#0070dd",
      epic: "#a335ee",
      legendary: "#ff8000",
      artifact: "#e6cc80",
    };
    return colors[rarity] || colors.common;
  };

  const canUpgrade = (treasure) => {
    return treasure.level < treasure.maxLevel && !treasure.hasMutation;
  };

  const getUpgradeCost = (treasure) => {
    const baseCost = 1000;
    return baseCost * treasure.level;
  };

  return (
    <div className={sharedStyles.displayContainer}>
      <div className={sharedStyles.displayHeader}>
        <h2>法宝背包</h2>
        <p>查看和管理你的法宝收藏</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "2rem",
          height: "100%",
        }}
      >
        {/* Treasure List */}
        <div className={sharedStyles.statsSection}>
          <Card variant="default" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                color: "#ffffff",
                margin: "0 0 1rem 0",
                fontSize: "1.2rem",
                textAlign: "center",
              }}
            >
              法宝列表
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {treasures.map((treasure) => (
                <Card
                  key={treasure.id}
                  variant={
                    selectedTreasure === treasure.id ? "primary" : "default"
                  }
                  className={`${sharedStyles.itemCard} ${
                    selectedTreasure === treasure.id
                      ? sharedStyles.selected
                      : ""
                  } ${treasure.equipped ? sharedStyles.equipped : ""}`}
                  onClick={() => setSelectedTreasure(treasure.id)}
                  style={{
                    borderColor: getRarityColor(treasure.rarity),
                    padding: "1rem",
                    minHeight: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          fontSize: "2rem",
                          color: getRarityColor(treasure.rarity),
                          filter: "drop-shadow(0 0 10px currentColor)",
                        }}
                      >
                        ⚔️
                      </div>
                      {treasure.locked && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            fontSize: "1rem",
                            filter: "drop-shadow(0 0 5px rgba(255, 0, 0, 0.8))",
                          }}
                        >
                          🔒
                        </div>
                      )}
                      {treasure.equipped && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-5px",
                            left: "-5px",
                            background: "#00ff00",
                            color: "#000000",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            padding: "0.2rem",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          color: getRarityColor(treasure.rarity),
                          textShadow: "0 0 10px currentColor",
                        }}
                      >
                        {treasure.name}
                      </div>
                      <div
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        Lv.{treasure.level}/{treasure.maxLevel}
                        {treasure.hasMutation && (
                          <span
                            style={{
                              color: "#ffd700",
                              fontSize: "1.2rem",
                              marginLeft: "0.5rem",
                              filter: "drop-shadow(0 0 5px #ffd700)",
                              animation: "sparkle 2s ease-in-out infinite",
                            }}
                          >
                            ★
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          color: getElementColor(treasure.element),
                          textShadow: "0 0 5px currentColor",
                        }}
                      >
                        {elementService.getElementName(treasure.element)}属性
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Treasure Details */}
        <div style={{ overflow: "auto", maxHeight: "70vh" }}>
          {selectedTreasureData && (
            <Card variant="default" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <h3
                  style={{
                    color: getRarityColor(selectedTreasureData.rarity),
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.8rem",
                    textShadow: "0 0 15px currentColor",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {selectedTreasureData.name}
                  {selectedTreasureData.hasMutation && (
                    <span
                      style={{
                        background:
                          "linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4ecdc4, #45b7d1)",
                        backgroundSize: "200% 200%",
                        animation: "rainbowFlow 3s ease infinite",
                        color: "#000000",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "15px",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      五行寂灭
                    </span>
                  )}
                </h3>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                  }}
                >
                  等级 {selectedTreasureData.level}/
                  {selectedTreasureData.maxLevel}
                </div>
              </div>

              <div
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  background: "rgba(138, 43, 226, 0.1)",
                  border: "1px solid rgba(138, 43, 226, 0.3)",
                  borderRadius: "10px",
                }}
              >
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    margin: "0",
                    fontStyle: "italic",
                    lineHeight: "1.6",
                    textAlign: "center",
                  }}
                >
                  {selectedTreasureData.description}
                </p>
              </div>

              {/* Current Ability */}
              {ability && (
                <div className={sharedStyles.statsSection}>
                  <h4>当前能力</h4>
                  <Card
                    variant={ability.special ? "primary" : "default"}
                    style={{
                      padding: "1rem",
                      border: ability.special ? "2px solid #ffd700" : undefined,
                      boxShadow: ability.special
                        ? "0 0 20px rgba(255, 215, 0, 0.3)"
                        : undefined,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          color: "#8a2be2",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          textShadow: "0 0 10px rgba(138, 43, 226, 0.5)",
                        }}
                      >
                        {ability.name}
                      </span>
                      <span
                        style={{
                          background: "rgba(255, 255, 255, 0.2)",
                          color: "#ffffff",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        空格键
                      </span>
                    </div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        marginBottom: "1rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {ability.description}
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.5rem",
                      }}
                    >
                      {[
                        { label: "伤害:", value: ability.damage },
                        { label: "范围:", value: ability.aoeSize },
                        { label: "冷却:", value: ability.cooldown },
                        { label: "灵气:", value: ability.manaCost },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "0.3rem 0.5rem",
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "6px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <span
                            style={{
                              color: "rgba(255, 255, 255, 0.7)",
                              fontSize: "0.9rem",
                            }}
                          >
                            {stat.label}
                          </span>
                          <span
                            style={{
                              color: "#ffffff",
                              fontWeight: "600",
                              fontSize: "0.9rem",
                            }}
                          >
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Upgrade Section */}
              <div className={sharedStyles.statsSection}>
                <h4>升级</h4>
                {canUpgrade(selectedTreasureData) ? (
                  <Card
                    variant="default"
                    style={{
                      background: "rgba(0, 255, 0, 0.1)",
                      border: "1px solid rgba(0, 255, 0, 0.3)",
                      padding: "1rem",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        margin: "0 0 0.5rem 0",
                        fontWeight: "600",
                      }}
                    >
                      升级到 Lv.{selectedTreasureData.level + 1}
                    </p>
                    <div style={{ marginBottom: "1rem" }}>
                      <span style={{ color: "#ffd700", fontWeight: "bold" }}>
                        消耗: {getUpgradeCost(selectedTreasureData)} 灵石
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() =>
                        onTreasureUpgrade &&
                        onTreasureUpgrade(selectedTreasureData.id)
                      }
                      disabled={
                        playerData.gold < getUpgradeCost(selectedTreasureData)
                      }
                    >
                      升级法宝
                    </Button>
                  </Card>
                ) : selectedTreasureData.hasMutation ? (
                  <Card
                    variant="default"
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      padding: "1rem",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        margin: "0.25rem 0",
                      }}
                    >
                      ✨ 已达到终极形态 - 五行寂灭
                    </p>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        margin: "0.25rem 0",
                      }}
                    >
                      天逆剑已获得所有元素之力，无法再次升级
                    </p>
                  </Card>
                ) : (
                  <Card
                    variant="default"
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      padding: "1rem",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        margin: "0.25rem 0",
                      }}
                    >
                      已达到最高等级
                    </p>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        margin: "0.25rem 0",
                      }}
                    >
                      需要完成"大元素使"成就解锁终极形态
                    </p>
                  </Card>
                )}
              </div>

              {/* Mutation Info */}
              {selectedTreasureData.level === 10 &&
                !selectedTreasureData.hasMutation && (
                  <Card
                    variant="default"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.1))",
                      border: "2px solid rgba(255, 215, 0, 0.5)",
                      padding: "1.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <h4
                      style={{
                        color: "#ffd700",
                        margin: "0 0 1rem 0",
                        fontSize: "1.3rem",
                        textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                        textAlign: "center",
                      }}
                    >
                      终极突变
                    </h4>
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          color: "rgba(255, 255, 255, 0.9)",
                          margin: "0 0 1rem 0",
                        }}
                      >
                        当所有元素等级达到满级(100)时，天逆剑将解锁终极形态：
                      </p>
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.6)",
                          border: "1px solid rgba(255, 215, 0, 0.4)",
                          borderRadius: "10px",
                          padding: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            color: "#ffd700",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            marginBottom: "0.5rem",
                            textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                          }}
                        >
                          五行寂灭
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontStyle: "italic",
                          }}
                        >
                          同时释放五种元素的斩击组合，造成75%最大生命值伤害
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            color: "#ff6b6b",
                            fontWeight: "bold",
                            padding: "0.5rem 1rem",
                            background: "rgba(255, 107, 107, 0.1)",
                            border: "1px solid rgba(255, 107, 107, 0.3)",
                            borderRadius: "8px",
                          }}
                        >
                          需要成就: 大元素使
                        </span>
                      </div>
                    </div>
                  </Card>
                )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreasureInventory;
