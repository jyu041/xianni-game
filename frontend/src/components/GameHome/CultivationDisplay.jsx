// frontend/src/components/GameHome/CultivationDisplay.jsx
import Card from "../ui/Card";
import sharedStyles from "./SharedDisplay.module.css";

const CultivationDisplay = ({ playerData }) => {
  const getCultivationLevel = (level) => {
    if (level <= 15) {
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

    const adjustedLevel = level - 15;
    const stageIndex = Math.floor((adjustedLevel - 1) / 20);
    const phaseInStage = Math.floor(((adjustedLevel - 1) % 20) / 5);

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
      return { smallBreakthroughs: 0, bigBreakthroughs: level <= 15 ? 0 : 1 };
    }

    const adjustedLevel = level - 15;
    const stageIndex = Math.floor((adjustedLevel - 1) / 20);
    const smallBreakthroughs = Math.floor((adjustedLevel - 1) / 5);
    const bigBreakthroughs = 1 + stageIndex;

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

  const getStats = () => [
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
    { label: "基础生命值", value: `${baseStats.health}`, color: "#f44336" },
    { label: "基础灵气", value: `${baseStats.mana}`, color: "#2196f3" },
    { label: "基础攻击", value: `${baseStats.attack}`, color: "#ff5722" },
    { label: "基础防御", value: `${baseStats.defense}`, color: "#9c27b0" },
  ];

  return (
    <div className={sharedStyles.displayContainer}>
      <div className={sharedStyles.displayHeader}>
        <h2>修为境界</h2>
        <p>查看你的修炼境界和属性计算</p>
      </div>

      {/* Current Cultivation Realm */}
      <div className={sharedStyles.statsSection}>
        <Card variant="glass" style={{ marginBottom: "2rem" }}>
          <div
            style={{
              background: "rgba(0,0,0,0.8)",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "20px",
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                color: cultivation.color,
                filter: "drop-shadow(0 0 20px currentColor)",
              }}
            >
              🧘
            </div>
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  fontSize: "2rem",
                  margin: "0 0 0.5rem 0",
                  color: cultivation.color,
                  textShadow: "0 0 15px currentColor",
                }}
              >
                {cultivation.name}
              </h4>
              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "1.1rem",
                  margin: "0 0 1.5rem 0",
                  fontStyle: "italic",
                }}
              >
                {cultivation.description}
              </p>
              <div className={sharedStyles.progressContainer}>
                <div className={sharedStyles.progressLabel}>
                  修炼进度: 等级 {playerData?.level || 1} ({cultivation.stage} -{" "}
                  {cultivation.phase})
                </div>
                <div className={sharedStyles.progressBar}>
                  <div
                    className={sharedStyles.progressFill}
                    style={{
                      width: `${experienceProgress}%`,
                      backgroundColor: cultivation.color,
                    }}
                  />
                </div>
                <div className={sharedStyles.progressText}>
                  经验: {(playerData?.experience || 0) % 100}/100
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Breakthrough Information */}
      <div className={sharedStyles.statsSection}>
        <h4>突破信息</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <Card variant="default" className={sharedStyles.statCard}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  fontSize: "2rem",
                  color: "#4caf50",
                  filter: "drop-shadow(0 0 10px currentColor)",
                }}
              >
                🌟
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <span
                  style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  小突破
                </span>
                <span
                  style={{
                    color: "#4caf50",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textShadow: "0 0 5px rgba(76,175,80,0.5)",
                  }}
                >
                  {breakthroughs.smallBreakthroughs} 次
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                  }}
                >
                  每5级一次小突破
                </span>
              </div>
            </div>
          </Card>
          <Card variant="default" className={sharedStyles.statCard}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  fontSize: "2rem",
                  color: "#ff9800",
                  filter: "drop-shadow(0 0 10px currentColor)",
                }}
              >
                ⭐
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <span
                  style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  大突破
                </span>
                <span
                  style={{
                    color: "#ff9800",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textShadow: "0 0 5px rgba(255,152,0,0.5)",
                  }}
                >
                  {breakthroughs.bigBreakthroughs} 次
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                  }}
                >
                  境界提升突破
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Base Stats Calculation */}
      <div className={sharedStyles.statsSection}>
        <h4>基础属性计算</h4>
        <div
          className={`${sharedStyles.gridContainer} ${sharedStyles.grid2Col}`}
        >
          {[
            {
              name: "生命值计算",
              formula: `100 (基础) + ${playerData?.level || 1} × 10 (等级) + ${
                breakthroughs.smallBreakthroughs
              } × 20 (小突破) + ${
                breakthroughs.bigBreakthroughs
              } × 50 (大突破) = ${baseStats.health}`,
            },
            {
              name: "灵气计算",
              formula: `100 (基础) + ${playerData?.level || 1} × 10 (等级) + ${
                breakthroughs.smallBreakthroughs
              } × 50 (小突破) + ${
                breakthroughs.bigBreakthroughs
              } × 100 (大突破) = ${baseStats.mana}`,
            },
            {
              name: "攻击计算",
              formula: `25 (基础) + ${playerData?.level || 1} × 5 (等级) + ${
                breakthroughs.smallBreakthroughs
              } × 10 (小突破) + ${
                breakthroughs.bigBreakthroughs
              } × 25 (大突破) = ${baseStats.attack}`,
            },
            {
              name: "防御计算",
              formula: `0 (基础) + ${playerData?.level || 1} × 1 (等级) + ${
                breakthroughs.smallBreakthroughs
              } × 2 (小突破) + ${
                breakthroughs.bigBreakthroughs
              } × 5 (大突破) = ${baseStats.defense}`,
            },
          ].map((calc, index) => (
            <Card
              key={index}
              variant="default"
              className={sharedStyles.statCard}
            >
              <h5
                style={{
                  color: "#8a2be2",
                  margin: "0 0 0.5rem 0",
                  fontSize: "1rem",
                  textShadow: "0 0 8px rgba(138,43,226,0.5)",
                }}
              >
                {calc.name}
              </h5>
              <div
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.85rem",
                  lineHeight: "1.4",
                  fontFamily: "Courier New, monospace",
                }}
              >
                {calc.formula.split("=").map((part, i) =>
                  i === calc.formula.split("=").length - 1 ? (
                    <strong
                      key={i}
                      style={{
                        color: "#4caf50",
                        fontSize: "1.1rem",
                        textShadow: "0 0 5px rgba(76,175,80,0.5)",
                      }}
                    >
                      = {part.trim()}
                    </strong>
                  ) : (
                    part + (i < calc.formula.split("=").length - 1 ? " =" : "")
                  )
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={sharedStyles.statsSection}>
        <h4>修炼数据</h4>
        <div className={sharedStyles.statsGrid}>
          {getStats().map((stat, index) => (
            <div key={index} className={sharedStyles.statCard}>
              <div className={sharedStyles.statLabel}>{stat.label}</div>
              <div
                className={sharedStyles.statValue}
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current vs Equipment Enhanced Stats */}
      {(playerData?.currentMaxHealth || playerData?.currentAttack) && (
        <div className={sharedStyles.statsSection}>
          <h4>装备增强后属性</h4>
          <Card variant="default" style={{ padding: "1.5rem" }}>
            {[
              {
                label: "生命值",
                base: baseStats.health,
                enhanced: playerData?.currentMaxHealth || baseStats.health,
              },
              {
                label: "灵气",
                base: baseStats.mana,
                enhanced: playerData?.currentMaxMana || baseStats.mana,
              },
              {
                label: "攻击",
                base: baseStats.attack,
                enhanced: playerData?.currentAttack || baseStats.attack,
              },
              {
                label: "防御",
                base: baseStats.defense,
                enhanced: playerData?.currentDefense || baseStats.defense,
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem",
                  marginBottom: "0.5rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {stat.label}:
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: "500",
                    minWidth: "60px",
                    textAlign: "center",
                  }}
                >
                  {stat.base}
                </span>
                <span
                  style={{ color: "rgba(255,255,255,0.5)", margin: "0 0.5rem" }}
                >
                  →
                </span>
                <span
                  className={sharedStyles.enhanced}
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    minWidth: "60px",
                    textAlign: "center",
                  }}
                >
                  {stat.enhanced}
                </span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

export default CultivationDisplay;
