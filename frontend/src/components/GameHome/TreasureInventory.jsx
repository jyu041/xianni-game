// frontend/src/components/inventory/TreasureInventory.jsx
import { useState, useEffect } from "react";
import elementService from "../../services/elementService";
import styles from "./TreasureInventory.module.css";

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
        "一剑出，时流滞，五行寂灭；再剑落，天机断，轮回逆生。——此剑，为悖逆之道。",
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
    <div className={styles.treasureInventory}>
      <div className={styles.content}>
        {/* Treasure List */}
        <div className={styles.treasureList}>
          <h3>法宝列表</h3>
          <div className={styles.treasureGrid}>
            {treasures.map((treasure) => (
              <div
                key={treasure.id}
                className={`${styles.treasureCard} ${
                  selectedTreasure === treasure.id ? styles.selected : ""
                } ${treasure.equipped ? styles.equipped : ""}`}
                onClick={() => setSelectedTreasure(treasure.id)}
                style={{
                  borderColor: getRarityColor(treasure.rarity),
                }}
              >
                <div className={styles.treasureIcon}>
                  <span className={styles.weaponIcon}>⚔️</span>
                  {treasure.locked && (
                    <div className={styles.lockedIndicator}>🔒</div>
                  )}
                  {treasure.equipped && (
                    <div className={styles.equippedIndicator}>✓</div>
                  )}
                </div>

                <div className={styles.treasureInfo}>
                  <div
                    className={styles.treasureName}
                    style={{ color: getRarityColor(treasure.rarity) }}
                  >
                    {treasure.name}
                  </div>
                  <div className={styles.treasureLevel}>
                    Lv.{treasure.level}/{treasure.maxLevel}
                    {treasure.hasMutation && (
                      <span className={styles.mutationBadge}>★</span>
                    )}
                  </div>
                  <div
                    className={styles.treasureElement}
                    style={{ color: getElementColor(treasure.element) }}
                  >
                    {elementService.getElementName(treasure.element)}属性
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treasure Details */}
        <div className={styles.treasureDetails}>
          {selectedTreasureData && (
            <>
              <div className={styles.detailsHeader}>
                <div className={styles.treasureTitle}>
                  <h3
                    style={{
                      color: getRarityColor(selectedTreasureData.rarity),
                    }}
                  >
                    {selectedTreasureData.name}
                    {selectedTreasureData.hasMutation && (
                      <span className={styles.mutationIndicator}>五行寂灭</span>
                    )}
                  </h3>
                  <div className={styles.levelInfo}>
                    等级 {selectedTreasureData.level}/
                    {selectedTreasureData.maxLevel}
                  </div>
                </div>
              </div>

              <div className={styles.description}>
                <p>{selectedTreasureData.description}</p>
              </div>

              {/* Current Ability */}
              {ability && (
                <div className={styles.abilitySection}>
                  <h4>当前能力</h4>
                  <div
                    className={`${styles.abilityCard} ${
                      ability.special ? styles.special : ""
                    }`}
                  >
                    <div className={styles.abilityHeader}>
                      <span className={styles.abilityName}>{ability.name}</span>
                      <span className={styles.abilityHotkey}>空格键</span>
                    </div>
                    <div className={styles.abilityDescription}>
                      {ability.description}
                    </div>
                    <div className={styles.abilityStats}>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>伤害:</span>
                        <span className={styles.statValue}>
                          {ability.damage}
                        </span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>范围:</span>
                        <span className={styles.statValue}>
                          {ability.aoeSize}
                        </span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>冷却:</span>
                        <span className={styles.statValue}>
                          {ability.cooldown}
                        </span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>灵气:</span>
                        <span className={styles.statValue}>
                          {ability.manaCost}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upgrade Section */}
              <div className={styles.upgradeSection}>
                <h4>升级</h4>
                {canUpgrade(selectedTreasureData) ? (
                  <div className={styles.upgradeInfo}>
                    <p>升级到 Lv.{selectedTreasureData.level + 1}</p>
                    <div className={styles.upgradeCost}>
                      <span>
                        消耗: {getUpgradeCost(selectedTreasureData)} 灵石
                      </span>
                    </div>
                    <button
                      className={styles.upgradeButton}
                      onClick={() =>
                        onTreasureUpgrade &&
                        onTreasureUpgrade(selectedTreasureData.id)
                      }
                      disabled={
                        playerData.gold < getUpgradeCost(selectedTreasureData)
                      }
                    >
                      升级法宝
                    </button>
                  </div>
                ) : selectedTreasureData.hasMutation ? (
                  <div className={styles.maxLevelInfo}>
                    <p>✨ 已达到终极形态 - 五行寂灭</p>
                    <p>天逆剑已获得所有元素之力，无法再次升级</p>
                  </div>
                ) : (
                  <div className={styles.maxLevelInfo}>
                    <p>已达到最高等级</p>
                    <p>需要完成"大元素使"成就解锁终极形态</p>
                  </div>
                )}
              </div>

              {/* Mutation Info */}
              {selectedTreasureData.level === 10 &&
                !selectedTreasureData.hasMutation && (
                  <div className={styles.mutationSection}>
                    <h4>终极突变</h4>
                    <div className={styles.mutationInfo}>
                      <p>
                        当所有元素等级达到满级(100)时，天逆剑将解锁终极形态：
                      </p>
                      <div className={styles.mutationPreview}>
                        <span className={styles.mutationName}>五行寂灭</span>
                        <span className={styles.mutationDescription}>
                          同时释放五种元素的斩击组合，造成75%最大生命值伤害
                        </span>
                      </div>
                      <div className={styles.mutationRequirement}>
                        <span>需要成就: 大元素使</span>
                      </div>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreasureInventory;
