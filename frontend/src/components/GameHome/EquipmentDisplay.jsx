// frontend/src/components/GameHome/EquipmentDisplay.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import styles from "./EquipmentDisplay.module.css";

const EquipmentDisplay = ({ playerData, onEquipmentChange }) => {
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipmentData();
    loadPlayerStats();
  }, [playerData]);

  const loadEquipmentData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/equipment/available"
      );
      const equipment = await response.json();
      setAvailableEquipment(equipment);
    } catch (error) {
      console.error("Failed to load equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/equipment/player/${playerData.id}/stats`
      );
      const stats = await response.json();
      setPlayerStats(stats);
    } catch (error) {
      console.error("Failed to load player stats:", error);
    }
  };

  const handleEquipItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/equipment/player/${playerData.id}/equip`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId }),
        }
      );

      if (response.ok) {
        const updatedPlayer = await response.json();
        onEquipmentChange && onEquipmentChange(updatedPlayer);
        loadPlayerStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Failed to equip item:", error);
    }
  };

  const handleUnequipItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/equipment/player/${playerData.id}/unequip`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId }),
        }
      );

      if (response.ok) {
        const updatedPlayer = await response.json();
        onEquipmentChange && onEquipmentChange(updatedPlayer);
        loadPlayerStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Failed to unequip item:", error);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: "#9e9e9e",
      uncommon: "#4caf50",
      rare: "#2196f3",
      epic: "#9c27b0",
      legendary: "#ff9800",
    };
    return colors[rarity] || colors.common;
  };

  const isItemEquipped = (itemId) => {
    return (
      playerData.equippedItems?.some((item) => item.id === itemId) || false
    );
  };

  const canEquipItem = (item) => {
    return playerData.level >= item.levelRequirement;
  };

  const formatStatBonus = (statName, value) => {
    const statNames = {
      attackPercent: "攻击力",
      healthPercent: "生命值",
      manaPercent: "灵气",
      defensePercent: "防御力",
      healthRegenPercent: "生命回复",
      manaRegenPercent: "灵气回复",
    };
    return `${statNames[statName] || statName}: +${value}%`;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <p>加载装备中...</p>
      </div>
    );
  }

  return (
    <div className={styles.equipmentDisplay}>
      {/* Player Stats Panel */}
      {playerStats && (
        <div className={styles.statsPanel}>
          <Card variant="glass" className={styles.statsCard}>
            <h3>角色属性</h3>
            <div className={styles.cultivationInfo}>
              <span className={styles.cultivation}>
                {playerStats.cultivation}
              </span>
              <span className={styles.level}>等级 {playerStats.level}</span>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCategory}>
                <h4>基础属性</h4>
                <div className={styles.statList}>
                  <div className={styles.statItem}>
                    <span>生命值:</span>
                    <span>{playerStats.baseStats.health}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span>生命回复:</span>
                    <span>
                      {playerStats.baseStats.healthRegen.toFixed(1)}/秒
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span>灵气:</span>
                    <span>{playerStats.baseStats.mana}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span>灵气回复:</span>
                    <span>{playerStats.baseStats.manaRegen.toFixed(1)}/秒</span>
                  </div>
                  <div className={styles.statItem}>
                    <span>攻击力:</span>
                    <span>{playerStats.baseStats.attack}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span>防御力:</span>
                    <span>{playerStats.baseStats.defense}</span>
                  </div>
                </div>
              </div>

              <div className={styles.statCategory}>
                <h4>总属性 (含装备)</h4>
                <div className={styles.statList}>
                  <div className={styles.statItem}>
                    <span>生命值:</span>
                    <span className={styles.enhanced}>
                      {playerStats.currentStats.health}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span>生命回复:</span>
                    <span className={styles.enhanced}>
                      {playerStats.currentStats.healthRegen.toFixed(1)}/秒
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span>灵气:</span>
                    <span className={styles.enhanced}>
                      {playerStats.currentStats.mana}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span>灵气回复:</span>
                    <span className={styles.enhanced}>
                      {playerStats.currentStats.manaRegen.toFixed(1)}/秒
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span>攻击力:</span>
                    <span className={styles.enhanced}>
                      {playerStats.currentStats.attack}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span>防御力:</span>
                    <span className={styles.enhanced}>
                      {playerStats.currentStats.defense}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Equipment Grid */}
      <div className={styles.equipmentGrid}>
        {availableEquipment.map((item) => {
          const equipped = isItemEquipped(item.id);
          const canEquip = canEquipItem(item);

          return (
            <Card
              key={item.id}
              variant={equipped ? "primary" : canEquip ? "default" : "dark"}
              className={`${styles.equipmentCard} ${
                equipped ? styles.equipped : ""
              } ${!canEquip ? styles.locked : ""}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className={styles.itemHeader}>
                <div
                  className={styles.itemIcon}
                  style={{ color: getRarityColor(item.rarity) }}
                >
                  {item.icon}
                </div>
                <div
                  className={styles.rarityBadge}
                  style={{ backgroundColor: getRarityColor(item.rarity) }}
                >
                  {item.rarity}
                </div>
                {equipped && <div className={styles.equippedBadge}>已装备</div>}
              </div>

              <div className={styles.itemInfo}>
                <h4
                  className={styles.itemName}
                  style={{ color: getRarityColor(item.rarity) }}
                >
                  {item.name}
                </h4>
                <p className={styles.itemDescription}>{item.description}</p>

                <div className={styles.statsPreview}>
                  {Object.entries(item.stats).map(([stat, value]) => (
                    <div key={stat} className={styles.statBonus}>
                      {formatStatBonus(stat, value)}
                    </div>
                  ))}
                </div>

                <div className={styles.requirements}>
                  <span className={styles.levelReq}>
                    需要等级: {item.levelRequirement}
                  </span>
                </div>
              </div>

              {!canEquip && (
                <div className={styles.lockedOverlay}>
                  <span>等级不足</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className={styles.itemDetail}>
          <Card variant="glass" className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <div
                className={styles.detailIcon}
                style={{ color: getRarityColor(selectedItem.rarity) }}
              >
                {selectedItem.icon}
              </div>
              <div className={styles.detailInfo}>
                <h3 style={{ color: getRarityColor(selectedItem.rarity) }}>
                  {selectedItem.name}
                </h3>
                <div className={styles.detailRarity}>
                  {selectedItem.rarity} {selectedItem.category}
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedItem(null)}
              >
                ×
              </button>
            </div>

            <p className={styles.detailDescription}>
              {selectedItem.description}
            </p>

            <div className={styles.detailStats}>
              <h4>属性加成</h4>
              <div className={styles.statsList}>
                {Object.entries(selectedItem.stats).map(([stat, value]) => (
                  <div key={stat} className={styles.detailStatItem}>
                    {formatStatBonus(stat, value)}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.detailRequirements}>
              <h4>装备需求</h4>
              <p>等级: {selectedItem.levelRequirement}</p>
            </div>

            <div className={styles.detailActions}>
              <Button variant="ghost" onClick={() => setSelectedItem(null)}>
                关闭
              </Button>
              {isItemEquipped(selectedItem.id) ? (
                <Button
                  variant="danger"
                  onClick={() => handleUnequipItem(selectedItem.id)}
                >
                  卸下装备
                </Button>
              ) : (
                <Button
                  variant="primary"
                  disabled={!canEquipItem(selectedItem)}
                  onClick={() => handleEquipItem(selectedItem.id)}
                >
                  装备
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EquipmentDisplay;
