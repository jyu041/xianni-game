// frontend/src/components/GameHome/EquipmentDisplay.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import sharedStyles from "./SharedDisplay.module.css";

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
        loadPlayerStats();
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
        loadPlayerStats();
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
      <div className={sharedStyles.displayContainer}>
        <div className={sharedStyles.loading}>
          <div className={sharedStyles.loadingSpinner} />
          <p>加载装备中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={sharedStyles.displayContainer}>
      <div className={sharedStyles.displayHeader}>
        <h2>装备系统</h2>
        <p>装备强大的法宝来提升你的修炼属性</p>
      </div>

      {/* Player Stats Panel */}
      {playerStats && (
        <div className={sharedStyles.statsSection}>
          <Card variant="glass">
            <div style={{ padding: "1.5rem" }}>
              <h3
                style={{
                  color: "#ffffff",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                角色属性
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span
                  style={{
                    color: "#8a2be2",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  {playerStats.cultivation}
                </span>
                <span
                  style={{ color: "rgba(255,255,255,0.9)", fontWeight: "600" }}
                >
                  等级 {playerStats.level}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <h4
                    style={{
                      color: "#ffffff",
                      margin: "0 0 0.75rem 0",
                      fontSize: "1rem",
                      textAlign: "center",
                      paddingBottom: "0.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    基础属性
                  </h4>
                  <div
                    className={sharedStyles.statsGrid}
                    style={{ gridTemplateColumns: "1fr", gap: "0.5rem" }}
                  >
                    {[
                      { label: "生命值", value: playerStats.baseStats.health },
                      {
                        label: "生命回复",
                        value: `${playerStats.baseStats.healthRegen.toFixed(
                          1
                        )}/秒`,
                      },
                      { label: "灵气", value: playerStats.baseStats.mana },
                      {
                        label: "灵气回复",
                        value: `${playerStats.baseStats.manaRegen.toFixed(
                          1
                        )}/秒`,
                      },
                      { label: "攻击力", value: playerStats.baseStats.attack },
                      { label: "防御力", value: playerStats.baseStats.defense },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.4rem 0.6rem",
                          background: "rgba(0,0,0,0.4)",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <span
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {stat.label}:
                        </span>
                        <span
                          style={{
                            color: "#ffffff",
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                          }}
                        >
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      color: "#ffffff",
                      margin: "0 0 0.75rem 0",
                      fontSize: "1rem",
                      textAlign: "center",
                      paddingBottom: "0.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    总属性 (含装备)
                  </h4>
                  <div
                    className={sharedStyles.statsGrid}
                    style={{ gridTemplateColumns: "1fr", gap: "0.5rem" }}
                  >
                    {[
                      {
                        label: "生命值",
                        value: playerStats.currentStats.health,
                      },
                      {
                        label: "生命回复",
                        value: `${playerStats.currentStats.healthRegen.toFixed(
                          1
                        )}/秒`,
                      },
                      { label: "灵气", value: playerStats.currentStats.mana },
                      {
                        label: "灵气回复",
                        value: `${playerStats.currentStats.manaRegen.toFixed(
                          1
                        )}/秒`,
                      },
                      {
                        label: "攻击力",
                        value: playerStats.currentStats.attack,
                      },
                      {
                        label: "防御力",
                        value: playerStats.currentStats.defense,
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.4rem 0.6rem",
                          background: "rgba(0,0,0,0.4)",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <span
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {stat.label}:
                        </span>
                        <span
                          className={sharedStyles.enhanced}
                          style={{ fontWeight: "bold", fontSize: "0.9rem" }}
                        >
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Equipment Grid */}
      <div className={`${sharedStyles.gridContainer} ${sharedStyles.grid3Col}`}>
        {availableEquipment.map((item) => {
          const equipped = isItemEquipped(item.id);
          const canEquip = canEquipItem(item);

          return (
            <Card
              key={item.id}
              variant={equipped ? "primary" : canEquip ? "default" : "dark"}
              className={`${sharedStyles.itemCard} ${
                equipped ? sharedStyles.equipped : ""
              } ${!canEquip ? sharedStyles.locked : ""}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className={sharedStyles.itemHeader}>
                <div
                  className={sharedStyles.itemIcon}
                  style={{ color: getRarityColor(item.rarity) }}
                >
                  {item.icon}
                </div>
                <div
                  className={sharedStyles.rarityBadge}
                  style={{ backgroundColor: getRarityColor(item.rarity) }}
                >
                  {item.rarity}
                </div>
                {equipped && (
                  <div
                    className={`${sharedStyles.statusBadge} ${sharedStyles.equippedBadge}`}
                  >
                    已装备
                  </div>
                )}
              </div>

              <div className={sharedStyles.itemInfo}>
                <h4
                  className={sharedStyles.itemName}
                  style={{ color: getRarityColor(item.rarity) }}
                >
                  {item.name}
                </h4>
                <p className={sharedStyles.itemDescription}>
                  {item.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  {Object.entries(item.stats).map(([stat, value]) => (
                    <div key={stat} className={sharedStyles.statBonus}>
                      {formatStatBonus(stat, value)}
                    </div>
                  ))}
                </div>

                <div className={sharedStyles.itemDetails}>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                    }}
                  >
                    需要等级: {item.levelRequirement}
                  </span>
                </div>
              </div>

              {!canEquip && (
                <div className={sharedStyles.lockedOverlay}>
                  <span>等级不足</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className={sharedStyles.modalOverlay}>
          <Card variant="glass" className={sharedStyles.modalPanel}>
            <div className={sharedStyles.modalHeader}>
              <div
                className={sharedStyles.modalIcon}
                style={{ color: getRarityColor(selectedItem.rarity) }}
              >
                {selectedItem.icon}
              </div>
              <div className={sharedStyles.modalInfo}>
                <h3 style={{ color: getRarityColor(selectedItem.rarity) }}>
                  {selectedItem.name}
                </h3>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    opacity: "0.8",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {selectedItem.rarity} {selectedItem.category}
                </div>
              </div>
              <button
                className={sharedStyles.closeButton}
                onClick={() => setSelectedItem(null)}
              >
                ×
              </button>
            </div>

            <p className={sharedStyles.modalDescription}>
              {selectedItem.description}
            </p>

            <div
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h4
                style={{
                  color: "#ffffff",
                  margin: "0 0 0.75rem 0",
                  fontSize: "1rem",
                }}
              >
                属性加成
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {Object.entries(selectedItem.stats).map(([stat, value]) => (
                  <div
                    key={stat}
                    style={{
                      color: "#4caf50",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      textShadow: "0 0 5px rgba(76,175,80,0.3)",
                    }}
                  >
                    {formatStatBonus(stat, value)}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,193,7,0.1)",
                border: "1px solid rgba(255,193,7,0.3)",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h4
                style={{
                  color: "#ffc107",
                  margin: "0 0 0.5rem 0",
                  fontSize: "1rem",
                }}
              >
                装备需求
              </h4>
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  margin: "0",
                  fontWeight: "500",
                }}
              >
                等级: {selectedItem.levelRequirement}
              </p>
            </div>

            <div className={sharedStyles.modalActions}>
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
