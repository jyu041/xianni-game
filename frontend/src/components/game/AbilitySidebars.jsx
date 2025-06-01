// frontend/src/components/game/AbilitySidebars.jsx
import { useState } from "react";
import elementService from "../../services/elementService";
import styles from "./AbilitySidebars.module.css";

const AbilitySidebars = ({ playerData, gameState, onTianniSwordActivate }) => {
  // 法宝 (Magical Treasures) - Left sidebar
  const [fabaoSlots] = useState(() => {
    const slots = Array(5).fill(null);

    // Always place Tianni Sword in first slot (locked)
    if (playerData) {
      slots[0] = {
        id: "tianniSword",
        name: "天逆剑",
        level: playerData.tianniSwordLevel || 1,
        icon: "⚔️",
        locked: true,
        equipped: true,
        hasMutation: playerData.hasTianniSwordMutation || false,
        element: playerData.primaryElement || "fire",
        cooldownPercent: 0, // Will be updated based on game state
        hotkey: "空格",
      };
    }

    return slots;
  });

  // 功法 (Cultivation Methods) - Right sidebar
  const [gongfaSlots] = useState(Array(5).fill(null));

  const getTianniSwordAbility = (level, hasMutation = false) => {
    if (hasMutation && level >= 10) {
      return {
        name: "五行寂灭",
        description: "同时释放五种元素斩击",
        damage: "75%",
      };
    }

    const abilities = {
      1: { name: "基础剑气", description: "发射剑气攻击", damage: "25" },
      2: { name: "小型斩击", description: "小型AOE攻击", damage: "20%" },
      3: { name: "强化小型斩击", description: "增强小型AOE", damage: "25%" },
      4: { name: "中型斩击", description: "中型AOE攻击", damage: "30%" },
      5: { name: "强化中型斩击", description: "增强中型AOE", damage: "35%" },
      6: { name: "大型斩击", description: "大型AOE攻击", damage: "40%" },
      7: { name: "强化大型斩击", description: "增强大型AOE", damage: "45%" },
      8: { name: "极强大型斩击", description: "极强大型AOE", damage: "50%" },
      9: { name: "至强大型斩击", description: "至强大型AOE", damage: "55%" },
      10: { name: "三重斩击", description: "连续三重斩击", damage: "60%" },
    };

    return abilities[level] || abilities[1];
  };

  const handleAbilityClick = (ability, slotIndex, type) => {
    if (!ability) return;

    if (type === "fabao" && ability.id === "tianniSword") {
      // Trigger Tianni Sword special ability
      if (onTianniSwordActivate) {
        const success = onTianniSwordActivate();
        if (success) {
          console.log("Tianni Sword ability activated!");

          // Visual feedback - flash the slot
          const slot = document.querySelector(
            `[data-slot="${type}-${slotIndex}"]`
          );
          if (slot) {
            slot.style.animation = "abilityActivate 0.5s ease";
            setTimeout(() => {
              slot.style.animation = "";
            }, 500);
          }
        } else {
          console.log("Tianni Sword ability on cooldown or insufficient mana");
        }
      }
    }
  };

  const renderAbilitySlot = (index, ability, type) => {
    const isEmpty = !ability;

    return (
      <div
        key={index}
        data-slot={`${type}-${index}`}
        className={`${styles.abilitySlot} ${
          isEmpty ? styles.emptySlot : styles.filledSlot
        } ${ability?.locked ? styles.lockedSlot : ""}`}
        onClick={() => handleAbilityClick(ability, index, type)}
        style={{ cursor: ability && !isEmpty ? "pointer" : "default" }}
      >
        {isEmpty ? (
          <div className={styles.emptySlotContent}>
            <span className={styles.slotNumber}>{index + 1}</span>
            <span className={styles.slotType}>
              {type === "fabao" ? "法宝" : "功法"}
            </span>
          </div>
        ) : (
          <div className={styles.abilityContent}>
            <div className={styles.abilityIcon}>
              {ability.icon || (type === "fabao" ? "🔮" : "📿")}
              {ability.locked && <div className={styles.lockedIcon}>🔒</div>}
              {ability.hasMutation && (
                <div className={styles.mutationGlow}>★</div>
              )}
            </div>

            <div className={styles.abilityInfo}>
              <div className={styles.abilityName}>
                {ability.name}
                {ability.hasMutation && (
                  <span className={styles.mutationBadge}>★</span>
                )}
              </div>
              <div className={styles.abilityLevel}>Lv.{ability.level || 1}</div>
              {ability.hotkey && (
                <div className={styles.hotkey}>{ability.hotkey}</div>
              )}
              {ability.id === "tianniSword" && (
                <div className={styles.abilityDescription}>
                  {(() => {
                    const abilityData = getTianniSwordAbility(
                      ability.level,
                      ability.hasMutation
                    );
                    return (
                      <div className={styles.skillInfo}>
                        <div className={styles.skillName}>
                          {abilityData.name}
                        </div>
                        <div className={styles.skillDamage}>
                          伤害: {abilityData.damage}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {ability.cooldownPercent > 0 && (
              <div
                className={styles.cooldownOverlay}
                style={{
                  height: `${ability.cooldownPercent}%`,
                }}
              />
            )}

            {ability.element && (
              <div
                className={styles.elementIndicator}
                style={{
                  backgroundColor: elementService.getElementColor(
                    ability.element
                  ),
                  color: "#000000",
                }}
              >
                {elementService.getElementName(ability.element)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Left Sidebar - 法宝 (Magical Treasures) */}
      <div className={styles.leftSidebar}>
        <div className={styles.sidebarHeader}>
          <h3 className={`${styles.sidebarTitle} game-text-large`}>法宝</h3>
          <div className={`${styles.sidebarSubtitle} game-text-small`}>
            Magical Treasures
          </div>
        </div>

        <div className={styles.abilityList}>
          {fabaoSlots.map((ability, index) =>
            renderAbilitySlot(index, ability, "fabao")
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <div className={`${styles.slotCount} game-text-small`}>
            {fabaoSlots.filter((slot) => slot !== null).length}/5
          </div>
          <div className={`${styles.hotkeyHint} game-text-small`}>
            点击使用法宝技能
          </div>
        </div>
      </div>

      {/* Right Sidebar - 功法 (Cultivation Methods) */}
      <div className={styles.rightSidebar}>
        <div className={styles.sidebarHeader}>
          <h3 className={`${styles.sidebarTitle} game-text-large`}>功法</h3>
          <div className={`${styles.sidebarSubtitle} game-text-small`}>
            Cultivation Methods
          </div>
        </div>

        <div className={styles.abilityList}>
          {gongfaSlots.map((ability, index) =>
            renderAbilitySlot(index, ability, "gongfa")
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <div className={`${styles.slotCount} game-text-small`}>
            {gongfaSlots.filter((slot) => slot !== null).length}/5
          </div>
          <div className={`${styles.hotkeyHint} game-text-small`}>
            暂无可用功法
          </div>
        </div>
      </div>
    </>
  );
};

export default AbilitySidebars;
