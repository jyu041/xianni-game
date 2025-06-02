// frontend/src/components/GameHome/CultivationDisplay.jsx
import styles from "./CultivationDisplay.module.css";

const CultivationDisplay = ({ playerData }) => {
  const getCultivationLevel = (level) => {
    if (level <= 15) {
      // 凝气期 (1-15层)
      const chineseNumbers = [
        "",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
        "十三",
        "十四",
        "十五",
      ];
      return {
        name: `凝气${chineseNumbers[level]}层`,
        color: "#8fbc8f",
        description: "感受天地灵气，凝聚丹田基础",
        stage: "凝气期",
        phase: chineseNumbers[level] + "层",
      };
    }

    // Calculate stage and phase for post-凝气 levels
    const adjustedLevel = level - 15; // Levels after 凝气
    const stageIndex = Math.floor((adjustedLevel - 1) / 20); // Which major stage (筑基, 结丹, etc.)
    const phaseInStage = Math.floor(((adjustedLevel - 1) % 20) / 5); // Which phase within stage (初期, 中期, 后期, 大圆满)

    const stages = [
      { name: "筑基", color: "#4682b4", description: "筑建修仙根基，凝聚丹田" },
      {
        name: "结丹",
        color: "#daa520",
        description: "凝聚金丹，踏入真正的修仙之门",
      },
      { name: "元婴", color: "#9370db", description: "元婴出世，可以离体而存" },
      { name: "化神", color: "#ff6347", description: "神识化形，感悟天地大道" },
      { name: "婴变", color: "#ff1493", description: "元婴蜕变，掌控更强力量" },
      { name: "问鼎", color: "#00ced1", description: "问鼎天下，挑战天道" },
      { name: "阴虚", color: "#ffd700", description: "阴虚境界，接近仙人" },
      { name: "阳实", color: "#ff4500", description: "阳实大成，仙人境界" },
    ];

    const phases = ["初期", "中期", "后期", "大圆满"];

    const stage = stages[Math.min(stageIndex, stages.length - 1)];
    const phaseName = phases[phaseInStage];

    return {
      name: stage.name + phaseName,
      color: stage.color,
      description: stage.description,
      stage: stage.name,
      phase: phaseName,
    };
  };

  const getBreakthroughInfo = (level) => {
    if (level <= 15) {
      return {
        smallBreakthroughs: 0,
        bigBreakthroughs: level <= 15 ? 0 : 1,
      };
    }

    const adjustedLevel = level - 15;
    const stageIndex = Math.floor((adjustedLevel - 1) / 20);
    const smallBreakthroughs = Math.floor((adjustedLevel - 1) / 5);
    const bigBreakthroughs = 1 + stageIndex; // 凝气->筑基 + major stage transitions

    return { smallBreakthroughs, bigBreakthroughs };
  };

  const calculateBaseStats = (level) => {
    const breakthroughs = getBreakthroughInfo(level);

    return {
      health:
        100 +
        level * 10 +
        breakthroughs.smallBreakthroughs * 20 +
        breakthroughs.bigBreakthroughs * 50,
      mana:
        100 +
        level * 10 +
        breakthroughs.smallBreakthroughs * 50 +
        breakthroughs.bigBreakthroughs * 100,
      attack:
        25 +
        level * 5 +
        breakthroughs.smallBreakthroughs * 10 +
        breakthroughs.bigBreakthroughs * 25,
      defense:
        0 +
        level * 1 +
        breakthroughs.smallBreakthroughs * 2 +
        breakthroughs.bigBreakthroughs * 5,
    };
  };

  const cultivation = getCultivationLevel(playerData?.level || 1);
  const experienceProgress =
    (((playerData?.experience || 0) % 100) / 100) * 100;
  const baseStats = calculateBaseStats(playerData?.level || 1);
  const breakthroughs = getBreakthroughInfo(playerData?.level || 1);

  const getStats = () => {
    return [
      {
        label: "当前等级",
        value: playerData?.level || 1,
        color: cultivation.color,
      },
      {
        label: "修炼经验",
        value: `${playerData?.experience || 0}`,
        color: "#8a2be2",
      },
      {
        label: "小突破次数",
        value: `${breakthroughs.smallBreakthroughs}`,
        color: "#4caf50",
      },
      {
        label: "大突破次数",
        value: `${breakthroughs.bigBreakthroughs}`,
        color: "#ff9800",
      },
      {
        label: "基础生命值",
        value: `${baseStats.health}`,
        color: "#f44336",
      },
      {
        label: "基础灵气",
        value: `${baseStats.mana}`,
        color: "#2196f3",
      },
      {
        label: "基础攻击",
        value: `${baseStats.attack}`,
        color: "#ff5722",
      },
      {
        label: "基础防御",
        value: `${baseStats.defense}`,
        color: "#9c27b0",
      },
    ];
  };

  return (
    <div className={styles.cultivationDisplay}>
      {/* Current Cultivation Realm */}
      <div className={styles.currentRealm}>
        <div className={styles.realmCard}>
          <div
            className={styles.realmIcon}
            style={{ color: cultivation.color }}
          >
            🧘
          </div>
          <div className={styles.realmInfo}>
            <h4 style={{ color: cultivation.color }}>{cultivation.name}</h4>
            <p className={styles.realmDescription}>{cultivation.description}</p>
            <div className={styles.levelProgress}>
              <div className={styles.progressLabel}>
                修炼进度: 等级 {playerData?.level || 1} ({cultivation.stage} -{" "}
                {cultivation.phase})
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${experienceProgress}%`,
                    backgroundColor: cultivation.color,
                  }}
                />
              </div>
              <div className={styles.progressText}>
                经验: {(playerData?.experience || 0) % 100}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakthrough Information */}
      <div className={styles.statsSection}>
        <h4>突破信息</h4>
        <div className={styles.breakthroughInfo}>
          <div className={styles.breakthroughCard}>
            <div
              className={styles.breakthroughIcon}
              style={{ color: "#4caf50" }}
            >
              🌟
            </div>
            <div className={styles.breakthroughDetails}>
              <span className={styles.breakthroughLabel}>小突破</span>
              <span className={styles.breakthroughValue}>
                {breakthroughs.smallBreakthroughs} 次
              </span>
              <span className={styles.breakthroughDesc}>每5级一次小突破</span>
            </div>
          </div>
          <div className={styles.breakthroughCard}>
            <div
              className={styles.breakthroughIcon}
              style={{ color: "#ff9800" }}
            >
              ⭐
            </div>
            <div className={styles.breakthroughDetails}>
              <span className={styles.breakthroughLabel}>大突破</span>
              <span className={styles.breakthroughValue}>
                {breakthroughs.bigBreakthroughs} 次
              </span>
              <span className={styles.breakthroughDesc}>境界提升突破</span>
            </div>
          </div>
        </div>
      </div>

      {/* Base Stats Calculation */}
      <div className={styles.statsSection}>
        <h4>基础属性计算</h4>
        <div className={styles.calculationInfo}>
          <div className={styles.calculationCard}>
            <h5>生命值计算</h5>
            <div className={styles.formula}>
              100 (基础) + {playerData?.level || 1} × 10 (等级) +{" "}
              {breakthroughs.smallBreakthroughs} × 20 (小突破) +{" "}
              {breakthroughs.bigBreakthroughs} × 50 (大突破) ={" "}
              <strong>{baseStats.health}</strong>
            </div>
          </div>
          <div className={styles.calculationCard}>
            <h5>灵气计算</h5>
            <div className={styles.formula}>
              100 (基础) + {playerData?.level || 1} × 10 (等级) +{" "}
              {breakthroughs.smallBreakthroughs} × 50 (小突破) +{" "}
              {breakthroughs.bigBreakthroughs} × 100 (大突破) ={" "}
              <strong>{baseStats.mana}</strong>
            </div>
          </div>
          <div className={styles.calculationCard}>
            <h5>攻击计算</h5>
            <div className={styles.formula}>
              25 (基础) + {playerData?.level || 1} × 5 (等级) +{" "}
              {breakthroughs.smallBreakthroughs} × 10 (小突破) +{" "}
              {breakthroughs.bigBreakthroughs} × 25 (大突破) ={" "}
              <strong>{baseStats.attack}</strong>
            </div>
          </div>
          <div className={styles.calculationCard}>
            <h5>防御计算</h5>
            <div className={styles.formula}>
              0 (基础) + {playerData?.level || 1} × 1 (等级) +{" "}
              {breakthroughs.smallBreakthroughs} × 2 (小突破) +{" "}
              {breakthroughs.bigBreakthroughs} × 5 (大突破) ={" "}
              <strong>{baseStats.defense}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsSection}>
        <h4>修炼数据</h4>
        <div className={styles.statsGrid}>
          {getStats().map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue} style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current vs Equipment Enhanced Stats */}
      {(playerData?.currentMaxHealth || playerData?.currentAttack) && (
        <div className={styles.statsSection}>
          <h4>装备增强后属性</h4>
          <div className={styles.enhancedStats}>
            <div className={styles.statComparison}>
              <span>生命值:</span>
              <span className={styles.baseStat}>{baseStats.health}</span>
              <span>→</span>
              <span className={styles.enhancedStat}>
                {playerData?.currentMaxHealth || baseStats.health}
              </span>
            </div>
            <div className={styles.statComparison}>
              <span>灵气:</span>
              <span className={styles.baseStat}>{baseStats.mana}</span>
              <span>→</span>
              <span className={styles.enhancedStat}>
                {playerData?.currentMaxMana || baseStats.mana}
              </span>
            </div>
            <div className={styles.statComparison}>
              <span>攻击:</span>
              <span className={styles.baseStat}>{baseStats.attack}</span>
              <span>→</span>
              <span className={styles.enhancedStat}>
                {playerData?.currentAttack || baseStats.attack}
              </span>
            </div>
            <div className={styles.statComparison}>
              <span>防御:</span>
              <span className={styles.baseStat}>{baseStats.defense}</span>
              <span>→</span>
              <span className={styles.enhancedStat}>
                {playerData?.currentDefense || baseStats.defense}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CultivationDisplay;
