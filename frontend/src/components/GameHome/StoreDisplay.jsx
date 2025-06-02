// frontend/src/components/GameHome/StoreDisplay.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import elementService from "../../services/elementService";
import sharedStyles from "./SharedDisplay.module.css";

const StoreDisplay = ({ playerData, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState("resources");
  const [selectedItem, setSelectedItem] = useState(null);

  const storeCategories = [
    { id: "resources", name: "修炼资源", icon: "💎" },
    { id: "treasures", name: "法宝神兵", icon: "⚔️" },
    { id: "elixirs", name: "仙丹妙药", icon: "🧪" },
    { id: "materials", name: "炼制材料", icon: "🔨" },
  ];

  const storeItems = {
    resources: [
      {
        id: "gold_small",
        name: "灵石袋",
        description: "包含1000枚灵石",
        price: { type: "gems", amount: 10 },
        reward: { type: "gold", amount: 1000 },
        icon: "💰",
        rarity: "common",
      },
      {
        id: "gold_medium",
        name: "灵石箱",
        description: "包含5000枚灵石",
        price: { type: "gems", amount: 45 },
        reward: { type: "gold", amount: 5000 },
        icon: "📦",
        rarity: "uncommon",
      },
      {
        id: "gold_large",
        name: "灵石宝库",
        description: "包含15000枚灵石",
        price: { type: "gems", amount: 120 },
        reward: { type: "gold", amount: 15000 },
        icon: "🏛️",
        rarity: "rare",
      },
      {
        id: "exp_potion",
        name: "悟道丹",
        description: "立即获得500点修炼经验",
        price: { type: "gems", amount: 25 },
        reward: { type: "experience", amount: 500 },
        icon: "📜",
        rarity: "uncommon",
      },
    ],
    treasures: [
      {
        id: "sword_upgrade",
        name: "天逆剑强化石",
        description: "提升天逆剑一级(需要满足升级条件)",
        price: { type: "gems", amount: 100 },
        reward: { type: "sword_upgrade", amount: 1 },
        icon: "💎",
        rarity: "epic",
        requirement: "天逆剑未达到最高等级",
      },
      {
        id: "artifact_box",
        name: "神秘法宝箱",
        description: "随机获得一件稀有法宝",
        price: { type: "gems", amount: 200 },
        reward: { type: "random_artifact", amount: 1 },
        icon: "📦",
        rarity: "legendary",
      },
    ],
    elixirs: [
      {
        id: "health_potion",
        name: "回春丹",
        description: "战斗中回复生命值的丹药",
        price: { type: "gold", amount: 500 },
        reward: { type: "consumable", item: "health_potion", amount: 5 },
        icon: "❤️",
        rarity: "common",
      },
      {
        id: "mana_potion",
        name: "凝神丹",
        description: "战斗中回复灵气的丹药",
        price: { type: "gold", amount: 750 },
        reward: { type: "consumable", item: "mana_potion", amount: 5 },
        icon: "🔵",
        rarity: "common",
      },
      {
        id: "element_essence",
        name: "五行精华",
        description: "提升所有元素经验1000点",
        price: { type: "gems", amount: 50 },
        reward: { type: "element_exp", amount: 1000 },
        icon: "🌟",
        rarity: "rare",
      },
    ],
    materials: [
      {
        id: "spirit_stone",
        name: "灵魂石",
        description: "用于强化法宝的珍贵材料",
        price: { type: "gold", amount: 2000 },
        reward: { type: "material", item: "spirit_stone", amount: 1 },
        icon: "💎",
        rarity: "uncommon",
      },
      {
        id: "star_fragment",
        name: "星辰碎片",
        description: "炼制顶级法宝的稀有材料",
        price: { type: "gems", amount: 75 },
        reward: { type: "material", item: "star_fragment", amount: 1 },
        icon: "⭐",
        rarity: "epic",
      },
    ],
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: "#ffffff",
      uncommon: "#1eff00",
      rare: "#0070dd",
      epic: "#a335ee",
      legendary: "#ff8000",
    };
    return colors[rarity] || colors.common;
  };

  const canPurchase = (item) => {
    if (item.price.type === "gold") {
      return playerData.gold >= item.price.amount;
    } else if (item.price.type === "gems") {
      return playerData.gems >= item.price.amount;
    }
    return false;
  };

  const handlePurchase = (item) => {
    if (canPurchase(item) && onPurchase) {
      onPurchase(item);
    }
  };

  const currentItems = storeItems[selectedCategory] || [];

  return (
    <div className={sharedStyles.displayContainer}>
      <div className={sharedStyles.displayHeader}>
        <h2>修仙商店</h2>
        <p>购买珍贵的修炼资源和法宝</p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1rem",
            background: "rgba(0,0,0,0.8)",
            padding: "0.75rem 1.5rem",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>💰</span>
            <span
              style={{
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "1rem",
                textShadow: "0 0 10px rgba(255,255,255,0.3)",
              }}
            >
              {playerData.gold || 0}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>💎</span>
            <span
              style={{
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "1rem",
                textShadow: "0 0 10px rgba(255,255,255,0.3)",
              }}
            >
              {playerData.gems || 0}
            </span>
          </div>
        </div>
      </div>

      <div className={sharedStyles.tabContainer}>
        {storeCategories.map((category) => (
          <button
            key={category.id}
            className={`${sharedStyles.tab} ${
              selectedCategory === category.id ? sharedStyles.active : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className={sharedStyles.tabIcon}>{category.icon}</span>
            <span className={sharedStyles.tabLabel}>{category.name}</span>
          </button>
        ))}
      </div>

      <div className={`${sharedStyles.gridContainer} ${sharedStyles.grid3Col}`}>
        {currentItems.map((item) => {
          const affordable = canPurchase(item);
          return (
            <Card
              key={item.id}
              variant={affordable ? "default" : "dark"}
              className={`${sharedStyles.itemCard} ${
                !affordable ? sharedStyles.disabled : ""
              }`}
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
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(0, 0, 0, 0.6)",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    margin: "0.75rem 0",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>
                    {item.price.type === "gold" ? "💰" : "💎"}
                  </span>
                  <span
                    style={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    {item.price.amount}
                  </span>
                </div>

                {item.requirement && (
                  <div
                    style={{
                      background: "rgba(255, 193, 7, 0.1)",
                      border: "1px solid rgba(255, 193, 7, 0.3)",
                      borderRadius: "6px",
                      padding: "0.4rem 0.6rem",
                      margin: "0.5rem 0",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffeb3b",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                      }}
                    >
                      {item.requirement}
                    </span>
                  </div>
                )}
              </div>

              <Button
                variant={affordable ? "primary" : "ghost"}
                size="small"
                disabled={!affordable}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(item);
                }}
              >
                {affordable ? "购买" : "不足"}
              </Button>
            </Card>
          );
        })}
      </div>

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
                    color: getRarityColor(selectedItem.rarity),
                  }}
                >
                  {selectedItem.rarity}
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
                  margin: "0 0 0.5rem 0",
                  fontSize: "1rem",
                }}
              >
                价格:
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "1.2rem",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>
                  {selectedItem.price.type === "gold" ? "💰" : "💎"}
                </span>
                <span
                  style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    textShadow: "0 0 10px rgba(255,255,255,0.3)",
                  }}
                >
                  {selectedItem.price.amount}
                </span>
              </div>
            </div>

            <div className={sharedStyles.modalActions}>
              <Button variant="ghost" onClick={() => setSelectedItem(null)}>
                取消
              </Button>
              <Button
                variant="primary"
                disabled={!canPurchase(selectedItem)}
                onClick={() => {
                  handlePurchase(selectedItem);
                  setSelectedItem(null);
                }}
              >
                购买
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StoreDisplay;
