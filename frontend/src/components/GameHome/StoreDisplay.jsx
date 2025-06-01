// frontend/src/components/GameHome/StoreDisplay.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import elementService from "../../services/elementService";
import styles from "./StoreDisplay.module.css";

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
    <div className={styles.storeDisplay}>
      <div className={styles.storeHeader}>
        <h2>修仙商店</h2>
        <p>购买珍贵的修炼资源和法宝</p>
      </div>

      <div className={styles.categoryTabs}>
        {storeCategories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryTab} ${
              selectedCategory === category.id ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className={styles.categoryIcon}>{category.icon}</span>
            <span className={styles.categoryName}>{category.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.storeContent}>
        <div className={styles.itemGrid}>
          {currentItems.map((item) => {
            const affordable = canPurchase(item);
            return (
              <Card
                key={item.id}
                variant={affordable ? "default" : "dark"}
                className={`${styles.storeItem} ${
                  !affordable ? styles.unaffordable : ""
                }`}
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
                </div>

                <div className={styles.itemInfo}>
                  <h4
                    className={styles.itemName}
                    style={{ color: getRarityColor(item.rarity) }}
                  >
                    {item.name}
                  </h4>
                  <p className={styles.itemDescription}>{item.description}</p>

                  <div className={styles.itemPrice}>
                    <span className={styles.priceIcon}>
                      {item.price.type === "gold" ? "💰" : "💎"}
                    </span>
                    <span className={styles.priceAmount}>
                      {item.price.amount}
                    </span>
                  </div>

                  {item.requirement && (
                    <div className={styles.requirement}>
                      <span className={styles.requirementText}>
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
      </div>

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
                <div
                  className={styles.detailRarity}
                  style={{ color: getRarityColor(selectedItem.rarity) }}
                >
                  {selectedItem.rarity}
                </div>
              </div>
            </div>

            <p className={styles.detailDescription}>
              {selectedItem.description}
            </p>

            <div className={styles.detailPrice}>
              <h4>价格:</h4>
              <div className={styles.priceInfo}>
                <span className={styles.priceIcon}>
                  {selectedItem.price.type === "gold" ? "💰" : "💎"}
                </span>
                <span className={styles.priceAmount}>
                  {selectedItem.price.amount}
                </span>
              </div>
            </div>

            <div className={styles.detailActions}>
              <Button variant="ghost" onClick={() => setSelectedItem(null)}>
                取消
              </Button>
              <Button
                variant="primary"
                disabled={!canPurchase(selectedItem)}
                onClick={() => handlePurchase(selectedItem)}
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
