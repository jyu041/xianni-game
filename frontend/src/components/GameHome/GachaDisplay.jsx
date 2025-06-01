// frontend/src/components/GameHome/GachaDisplay.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import styles from "./GachaDisplay.module.css";

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

    // Simulate animation delay
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
    <div className={styles.gachaDisplay}>
      <div className={styles.gachaHeader}>
        <h2>天机抽取</h2>
        <p>消耗天机石获得稀有法宝和功法</p>
        <div className={styles.playerGems}>
          <span className={styles.gemsIcon}>💎</span>
          <span className={styles.gemsAmount}>{playerData.gems || 0}</span>
        </div>
      </div>

      <div className={styles.bannerTabs}>
        {Object.values(gachaBanners).map((banner) => (
          <button
            key={banner.id}
            className={`${styles.bannerTab} ${
              selectedBanner === banner.id ? styles.active : ""
            }`}
            onClick={() => setSelectedBanner(banner.id)}
            style={{
              borderColor:
                selectedBanner === banner.id
                  ? banner.color
                  : "rgba(255,255,255,0.2)",
            }}
          >
            <span className={styles.bannerIcon}>{banner.icon}</span>
            <span className={styles.bannerName}>{banner.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.bannerInfo}>
        <Card variant="glass" className={styles.bannerCard}>
          <div className={styles.bannerHeader}>
            <div
              className={styles.bannerMainIcon}
              style={{ color: currentBanner.color }}
            >
              {currentBanner.icon}
            </div>
            <div className={styles.bannerDetails}>
              <h3 style={{ color: currentBanner.color }}>
                {currentBanner.name}
              </h3>
              <p>{currentBanner.description}</p>
            </div>
          </div>

          <div className={styles.ratesDisplay}>
            <h4>获取概率</h4>
            <div className={styles.ratesList}>
              {Object.entries(currentBanner.rates).map(([rarity, rate]) => (
                <div key={rarity} className={styles.rateItem}>
                  <span
                    className={styles.rarityLabel}
                    style={{ color: getRarityColor(rarity) }}
                  >
                    {rarity === "legendary" && "传说"}
                    {rarity === "epic" && "史诗"}
                    {rarity === "rare" && "稀有"}
                    {rarity === "uncommon" && "优秀"}
                    {rarity === "common" && "普通"}
                  </span>
                  <span className={styles.ratePercent}>{rate}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.pullActions}>
            <div className={styles.pullButton}>
              <Button
                variant="primary"
                size="large"
                disabled={!canPull(1) || isAnimating}
                onClick={() => handleGachaPull(1)}
              >
                单抽 {currentBanner.cost.single} 💎
              </Button>
            </div>
            <div className={styles.pullButton}>
              <Button
                variant="secondary"
                size="large"
                disabled={!canPull(10) || isAnimating}
                onClick={() => handleGachaPull(10)}
              >
                十连抽 {currentBanner.cost.ten} 💎
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {isAnimating && (
        <div className={styles.animationOverlay}>
          <div className={styles.gachaAnimation}>
            <div className={styles.spinningIcon}>🎲</div>
            <h3>天机运转中...</h3>
            <p>正在为您寻找缘分...</p>
          </div>
        </div>
      )}

      {pullResults && !isAnimating && (
        <div className={styles.resultsOverlay}>
          <Card variant="glass" className={styles.resultsPanel}>
            <div className={styles.resultsHeader}>
              <h3>抽取结果</h3>
              <button
                className={styles.closeButton}
                onClick={() => setPullResults(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.resultsGrid}>
              {pullResults.map((item, index) => (
                <div
                  key={index}
                  className={styles.resultItem}
                  style={{ borderColor: getRarityColor(item.rarity) }}
                >
                  <div
                    className={styles.resultIcon}
                    style={{ color: getRarityColor(item.rarity) }}
                  >
                    {item.icon}
                  </div>
                  <div className={styles.resultInfo}>
                    <div
                      className={styles.resultName}
                      style={{ color: getRarityColor(item.rarity) }}
                    >
                      {item.name}
                    </div>
                    <div className={styles.resultDescription}>
                      {item.description}
                    </div>
                    <div
                      className={styles.resultRarity}
                      style={{ color: getRarityColor(item.rarity) }}
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

            <div className={styles.resultsActions}>
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
