// frontend/src/components/GameHome/GachaDisplay.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import sharedStyles from "./SharedDisplay.module.css";

const GachaDisplay = ({ playerData, onGachaPull }) => {
  const [selectedBanner, setSelectedBanner] = useState("standard");
  const [pullResults, setPullResults] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const gachaBanners = {
    standard: {
      id: "standard",
      name: "标准祈愿",
      description: "基础的天机抽取，可获得各种法宝和材料",
      cost: { single: 10, ten: 90 },
      currency: "gems",
      icon: "🎲",
      color: "#4fc3f7",
      rates: {
        legendary: 1,
        epic: 5,
        rare: 15,
        uncommon: 30,
        common: 49,
      },
    },
    element: {
      id: "element",
      name: "五行祈愿",
      description: "专注于元素系法宝和元素精华的抽取",
      cost: { single: 15, ten: 135 },
      currency: "gems",
      icon: "🌟",
      color: "#ab47bc",
      rates: {
        legendary: 2,
        epic: 8,
        rare: 20,
        uncommon: 35,
        common: 35,
      },
    },
    premium: {
      id: "premium",
      name: "仙缘祈愿",
      description: "高级抽取，更高概率获得稀有法宝",
      cost: { single: 25, ten: 225 },
      currency: "gems",
      icon: "✨",
      color: "#ff8a65",
      rates: {
        legendary: 5,
        epic: 15,
        rare: 25,
        uncommon: 30,
        common: 25,
      },
    },
  };

  const gachaPool = {
    legendary: [
      {
        name: "太虚剑",
        type: "weapon",
        icon: "⚔️",
        description: "传说中的神兵",
      },
      {
        name: "混沌珠",
        type: "treasure",
        icon: "🔮",
        description: "蕴含混沌之力",
      },
      {
        name: "九天玄女令",
        type: "artifact",
        icon: "📜",
        description: "仙界信物",
      },
    ],
    epic: [
      {
        name: "雷霆锤",
        type: "weapon",
        icon: "🔨",
        description: "雷电之力凝聚",
      },
      {
        name: "凤凰羽",
        type: "material",
        icon: "🪶",
        description: "不死鸟之羽",
      },
      { name: "龙鳞甲", type: "armor", icon: "🛡️", description: "龙族守护" },
      { name: "星辰石", type: "material", icon: "⭐", description: "星空精华" },
    ],
    rare: [
      { name: "灵风剑", type: "weapon", icon: "🗡️", description: "风属性法宝" },
      {
        name: "寒冰珠",
        type: "treasure",
        icon: "❄️",
        description: "冰属性宝珠",
      },
      {
        name: "火灵石",
        type: "material",
        icon: "🔥",
        description: "火属性材料",
      },
      {
        name: "土精华",
        type: "material",
        icon: "🌍",
        description: "土属性精华",
      },
      {
        name: "水明珠",
        type: "treasure",
        icon: "💧",
        description: "水属性明珠",
      },
    ],
    uncommon: [
      { name: "锻魂石", type: "material", icon: "🗿", description: "强化材料" },
      { name: "灵草", type: "material", icon: "🌿", description: "炼丹材料" },
      { name: "精铁", type: "material", icon: "⚡", description: "铸器材料" },
      {
        name: "月华露",
        type: "consumable",
        icon: "🌙",
        description: "回复丹药",
      },
    ],
    common: [
      {
        name: "普通灵石",
        type: "currency",
        icon: "💎",
        description: "基础货币",
      },
      {
        name: "修炼心得",
        type: "experience",
        icon: "📚",
        description: "经验书籍",
      },
      {
        name: "回春丹",
        type: "consumable",
        icon: "💊",
        description: "基础恢复",
      },
    ],
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

  const simulateGachaPull = (banner, count = 1) => {
    const results = [];
    const rates = banner.rates;

    for (let i = 0; i < count; i++) {
      const roll = Math.random() * 100;
      let rarity = "common";

      if (roll < rates.legendary) {
        rarity = "legendary";
      } else if (roll < rates.legendary + rates.epic) {
        rarity = "epic";
      } else if (roll < rates.legendary + rates.epic + rates.rare) {
        rarity = "rare";
      } else if (
        roll <
        rates.legendary + rates.epic + rates.rare + rates.uncommon
      ) {
        rarity = "uncommon";
      }

      const pool = gachaPool[rarity];
      const item = pool[Math.floor(Math.random() * pool.length)];
      results.push({ ...item, rarity });
    }

    return results;
  };

  const handleGachaPull = async (count) => {
    const banner = gachaBanners[selectedBanner];
    const cost = count === 1 ? banner.cost.single : banner.cost.ten;

    if (playerData.gems < cost) {
      return;
    }

    setIsAnimating(true);

    setTimeout(() => {
      const results = simulateGachaPull(banner, count);
      setPullResults(results);
      setIsAnimating(false);

      if (onGachaPull) {
        onGachaPull({ banner: selectedBanner, count, cost, results });
      }
    }, 2000);
  };

  const canPull = (count) => {
    const banner = gachaBanners[selectedBanner];
    const cost = count === 1 ? banner.cost.single : banner.cost.ten;
    return playerData.gems >= cost;
  };

  const currentBanner = gachaBanners[selectedBanner];

  return (
    <div className={sharedStyles.displayContainer}>
      <div className={sharedStyles.displayHeader}>
        <h2>天机抽取</h2>
        <p>消耗天机石获得稀有法宝和功法</p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(0,0,0,0.8)",
            padding: "0.75rem 1.5rem",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>💎</span>
          <span
            style={{
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "1.1rem",
              textShadow: "0 0 10px rgba(255,255,255,0.3)",
            }}
          >
            {playerData.gems || 0}
          </span>
        </div>
      </div>

      <div className={sharedStyles.tabContainer}>
        {Object.values(gachaBanners).map((banner) => (
          <button
            key={banner.id}
            className={`${sharedStyles.tab} ${
              selectedBanner === banner.id ? sharedStyles.active : ""
            }`}
            onClick={() => setSelectedBanner(banner.id)}
            style={{
              borderColor:
                selectedBanner === banner.id
                  ? banner.color
                  : "rgba(255,255,255,0.2)",
            }}
          >
            <span className={sharedStyles.tabIcon}>{banner.icon}</span>
            <span className={sharedStyles.tabLabel}>{banner.name}</span>
          </button>
        ))}
      </div>

      <div className={sharedStyles.statsSection}>
        <Card variant="glass" style={{ padding: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                color: currentBanner.color,
                filter: "drop-shadow(0 0 20px currentColor)",
              }}
            >
              {currentBanner.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: "1.8rem",
                  margin: "0 0 0.5rem 0",
                  color: currentBanner.color,
                  textShadow: "0 0 15px currentColor",
                }}
              >
                {currentBanner.name}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1rem",
                  margin: "0",
                  lineHeight: "1.5",
                }}
              >
                {currentBanner.description}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h4
              style={{
                color: "#ffffff",
                margin: "0 0 1rem 0",
                fontSize: "1.2rem",
                textAlign: "center",
              }}
            >
              获取概率
            </h4>
            <div
              className={sharedStyles.gridContainer}
              style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}
            >
              {Object.entries(currentBanner.rates).map(([rarity, rate]) => (
                <div
                  key={rarity}
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color: getRarityColor(rarity),
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      textShadow: "0 0 8px currentColor",
                    }}
                  >
                    {rarity === "legendary" && "传说"}
                    {rarity === "epic" && "史诗"}
                    {rarity === "rare" && "稀有"}
                    {rarity === "uncommon" && "优秀"}
                    {rarity === "common" && "普通"}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}
          >
            <div style={{ flex: 1, maxWidth: "200px" }}>
              <Button
                variant="primary"
                size="large"
                disabled={!canPull(1) || isAnimating}
                onClick={() => handleGachaPull(1)}
                style={{ width: "100%" }}
              >
                单抽 {currentBanner.cost.single} 💎
              </Button>
            </div>
            <div style={{ flex: 1, maxWidth: "200px" }}>
              <Button
                variant="secondary"
                size="large"
                disabled={!canPull(10) || isAnimating}
                onClick={() => handleGachaPull(10)}
                style={{ width: "100%" }}
              >
                十连抽 {currentBanner.cost.ten} 💎
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {isAnimating && (
        <div className={sharedStyles.modalOverlay}>
          <div style={{ textAlign: "center", color: "#ffffff" }}>
            <div
              style={{
                fontSize: "4rem",
                animation: "spin 1s linear infinite",
                marginBottom: "1rem",
                filter: "drop-shadow(0 0 20px rgba(255,215,0,0.8))",
              }}
            >
              🎲
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                margin: "0 0 0.5rem 0",
                textShadow: "0 0 15px rgba(255,255,255,0.5)",
              }}
            >
              天机运转中...
            </h3>
            <p
              style={{
                fontSize: "1.1rem",
                margin: "0",
                color: "rgba(255,255,255,0.8)",
                fontStyle: "italic",
              }}
            >
              正在为您寻找缘分...
            </p>
          </div>
        </div>
      )}

      {pullResults && !isAnimating && (
        <div className={sharedStyles.modalOverlay}>
          <Card
            variant="glass"
            className={sharedStyles.modalPanel}
            style={{ maxWidth: "800px" }}
          >
            <div className={sharedStyles.modalHeader}>
              <h3>抽取结果</h3>
              <button
                className={sharedStyles.closeButton}
                onClick={() => setPullResults(null)}
              >
                ×
              </button>
            </div>

            <div
              className={`${sharedStyles.gridContainer} ${sharedStyles.grid3Col}`}
              style={{ marginBottom: "2rem" }}
            >
              {pullResults.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(0,0,0,0.8)",
                    border: `2px solid ${getRarityColor(item.rarity)}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      content: "",
                      position: "absolute",
                      top: "0",
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "0.5rem",
                      color: getRarityColor(item.rarity),
                      filter: "drop-shadow(0 0 10px currentColor)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        marginBottom: "0.25rem",
                        color: getRarityColor(item.rarity),
                        textShadow: "0 0 8px currentColor",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "0.8rem",
                        marginBottom: "0.5rem",
                        lineHeight: "1.3",
                      }}
                    >
                      {item.description}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        color: getRarityColor(item.rarity),
                        textShadow: "0 0 5px currentColor",
                      }}
                    >
                      {item.rarity === "legendary" && "传说"}
                      {item.rarity === "epic" && "史诗"}
                      {item.rarity === "rare" && "稀有"}
                      {item.rarity === "uncommon" && "优秀"}
                      {item.rarity === "common" && "普通"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={sharedStyles.modalActions}>
              <Button variant="primary" onClick={() => setPullResults(null)}>
                确认
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GachaDisplay;
