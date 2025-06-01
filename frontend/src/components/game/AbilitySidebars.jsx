// frontend/src/components/game/AbilitySidebars.jsx
import { useState, useEffect } from "react";
import elementService from "../../services/elementService";
import styles from "./AbilitySidebars.module.css";

const AbilitySidebars = ({ playerData, gameState, onTianniSwordActivate }) => {
  const [cooldowns, setCooldowns] = useState({});

  // 法宝 (Magical Treasures) - Left sidebar - Hotkeys 1,2,3,4,5
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
        hotkey: "1",
        cooldown: 0,
      };
    }

    return slots;
  });

  // 功法 (Cultivation Methods) - Right sidebar - Hotkeys 6,7,8,9,0
  const [gongfaSlots] = useState(() => {
    const slots = Array(5).fill(null);
    const hotkeys = ["6", "7", "8", "9", "0"];

    // For now, all slots are empty - will be filled with cultivation methods later
    return slots.map((slot, index) => {
      if (slot) {
        return { ...slot, hotkey: hotkeys[index] };
      }
      return null;
    });
  });

  // Handle keyboard input for hotkeys
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;

      // Handle 法宝 hotkeys (1-5)
      if (["1", "2", "3", "4", "5"].includes(key)) {
        const slotIndex = parseInt(key) - 1;
        const ability = fabaoSlots[slotIndex];
        if (ability) {
          handleAbilityActivate(ability, slotIndex, "fabao");
        }
      }

      // Handle 功法 hotkeys (6-9, 0)
      if (["6", "7", "8", "9", "0"].includes(key)) {
        const slotIndex = key === "0" ? 4 : parseInt(key) - 6;
        const ability = gongfaSlots[slotIndex];
        if (ability) {
          handleAbilityActivate(ability, slotIndex, "gongfa");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [fabaoSlots, gongfaSlots]);

  const getTianniSwordAbility = (level, hasMutation = false) => {
    if (hasMutation && level >= 10) {
      return {
        name: "五行寂灭",
        description: "同时释放五种元素斩击",
        damage: "75%",
        manaCost: 100,
        cooldown: 5000,
      };
    }

    const abilities = {
      1: {
        name: "基础剑气",
        description: "发射剑气攻击",
        damage: "25",
        manaCost: 0,
        cooldown: 0,
      },
      2: {
        name: "小型斩击",
        description: "小型AOE攻击",
        damage: "20%",
        manaCost: 20,
        cooldown: 5000,
      },
      3: {
        name: "强化小型斩击",
        description: "增强小型AOE",
        damage: "25%",
        manaCost: 20,
        cooldown: 5000,
      },
      4: {
        name: "中型斩击",
        description: "中型AOE攻击",
        damage: "30%",
        manaCost: 35,
        cooldown: 5000,
      },
      5: {
        name: "强化中型斩击",
        description: "增强中型AOE",
        damage: "35%",
        manaCost: 35,
        cooldown: 5000,
      },
      6: {
        name: "大型斩击",
        description: "大型AOE攻击",
        damage: "40%",
        manaCost: 50,
        cooldown: 5000,
      },
      7: {
        name: "强化大型斩击",
        description: "增强大型AOE",
        damage: "45%",
        manaCost: 50,
        cooldown: 5000,
      },
      8: {
        name: "极强大型斩击",
        description: "极强大型AOE",
        damage: "50%",
        manaCost: 50,
        cooldown: 5000,
      },
      9: {
        name: "至强大型斩击",
        description: "至强大型AOE",
        damage: "55%",
        manaCost: 50,
        cooldown: 5000,
      },
      10: {
        name: "三重斩击",
        description: "连续三重斩击",
        damage: "60%",
        manaCost: 75,
        cooldown: 5000,
      },
    };

    return abilities[level] || abilities[1];
  };

  const handleAbilityActivate = (ability, slotIndex, type) => {
    if (!ability) return;

    const abilityKey = `${type}-${slotIndex}`;
    const currentTime = Date.now();

    // Check cooldown
    if (cooldowns[abilityKey] && currentTime < cooldowns[abilityKey]) {
      console.log(`${ability.name} is on cooldown`);
      return false;
    }

    if (type === "fabao" && ability.id === "tianniSword") {
      // Get ability data for mana cost and cooldown
      const abilityData = getTianniSwordAbility(
        ability.level,
        ability.hasMutation
      );

      // Check mana cost (for levels > 1)
      if (abilityData.manaCost > 0) {
        const currentMana = playerData?.mana || 100;
        if (currentMana < abilityData.manaCost) {
          console.log(
            `Insufficient mana: ${currentMana}/${abilityData.manaCost}`
          );
          return false;
        }
      }

      // Trigger Tianni Sword special ability
      if (onTianniSwordActivate) {
        const success = onTianniSwordActivate();
        if (success) {
          console.log("Tianni Sword ability activated!");

          // Set cooldown
          if (abilityData.cooldown > 0) {
            setCooldowns((prev) => ({
              ...prev,
              [abilityKey]: currentTime + abilityData.cooldown,
            }));
          }

          // Visual feedback - flash the slot
          const slot = document.querySelector(`[data-slot="${abilityKey}"]`);
          if (slot) {
            slot.style.animation = "abilityActivate 0.5s ease";
            setTimeout(() => {
              slot.style.animation = "";
            }, 500);
          }

          return true;
        }
      }
    } else if (type === "gongfa") {
      // Handle cultivation method abilities (to be implemented later)
      console.log(`功法 ability ${ability.name} activated`);

      // Set a default cooldown for demonstration
      setCooldowns((prev) => ({
        ...prev,
        [abilityKey]: currentTime + 3000, // 3 second cooldown
      }));

      return true;
    }

    return false;
  };

  const getCooldownPercent = (ability, slotIndex, type) => {
    const abilityKey = `${type}-${slotIndex}`;
    const cooldownEnd = cooldowns[abilityKey];

    if (!cooldownEnd) return 0;

    const currentTime = Date.now();
    if (currentTime >= cooldownEnd) {
      // Cooldown expired, clean it up
      setCooldowns((prev) => {
        const newCooldowns = { ...prev };
        delete newCooldowns[abilityKey];
        return newCooldowns;
      });
      return 0;
    }

    // Calculate remaining cooldown percentage
    let totalCooldown = 3000; // Default cooldown
    if (type === "fabao" && ability?.id === "tianniSword") {
      const abilityData = getTianniSwordAbility(
        ability.level,
        ability.hasMutation
      );
      totalCooldown = abilityData.cooldown || 0;
    }

    if (totalCooldown === 0) return 0;

    const timeRemaining = cooldownEnd - currentTime;
    return Math.max(0, (timeRemaining / totalCooldown) * 100);
  };

  const renderAbilitySlot = (index, ability, type) => {
    const isEmpty = !ability;
    const hotkeys =
      type === "fabao" ? ["1", "2", "3", "4", "5"] : ["6", "7", "8", "9", "0"];
    const hotkey = hotkeys[index];
    const cooldownPercent = getCooldownPercent(ability, index, type);

    return (
      <div
        key={index}
        data-slot={`${type}-${index}`}
        className={`${styles.abilitySlot} ${
          isEmpty ? styles.emptySlot : styles.filledSlot
        } ${ability?.locked ? styles.lockedSlot : ""}`}
        onClick={() => handleAbilityActivate(ability, index, type)}
        style={{ cursor: ability && !isEmpty ? "pointer" : "default" }}
      >
        {isEmpty ? (
          <div className={styles.emptySlotContent}>
            <span className={styles.slotNumber}>{hotkey}</span>
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
              <div className={styles.hotkey}>{hotkey}</div>
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
                        {abilityData.manaCost > 0 && (
                          <div className={styles.skillMana}>
                            灵气: {abilityData.manaCost}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {cooldownPercent > 0 && (
              <div
                className={styles.cooldownOverlay}
                style={{
                  height: `${cooldownPercent}%`,
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
      {/* Left Sidebar - 法宝 (Magical Treasures) - Hotkeys 1,2,3,4,5 */}
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
            按 1-5 使用法宝
          </div>
        </div>
      </div>

      {/* Right Sidebar - 功法 (Cultivation Methods) - Hotkeys 6,7,8,9,0 */}
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
            按 6-9,0 使用功法
          </div>
        </div>
      </div>
    </>
  );
};

export default AbilitySidebars;
