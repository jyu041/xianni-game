// frontend/src/components/game/AbilitySidebars.jsx
import { useState } from "react";
import styles from "./AbilitySidebars.module.css";

const AbilitySidebars = ({ playerData, gameState }) => {
  // 法宝 (Magical Treasures) - Left sidebar
  const [fabaoSlots] = useState(Array(5).fill(null));

  // 功法 (Cultivation Methods) - Right sidebar
  const [gongfaSlots] = useState(Array(5).fill(null));

  const renderAbilitySlot = (index, ability, type) => {
    const isEmpty = !ability;

    return (
      <div
        key={index}
        className={`${styles.abilitySlot} ${
          isEmpty ? styles.emptySlot : styles.filledSlot
        }`}
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
            </div>
            <div className={styles.abilityInfo}>
              <div className={styles.abilityName}>{ability.name}</div>
              <div className={styles.abilityLevel}>Lv.{ability.level || 1}</div>
            </div>
            <div
              className={styles.cooldownOverlay}
              style={{
                height: `${ability.cooldownPercent || 0}%`,
              }}
            />
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
        </div>
      </div>
    </>
  );
};

export default AbilitySidebars;
