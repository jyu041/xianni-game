// frontend/src/components/GameHome/CultivationDisplay.jsx
import styles from "./CultivationDisplay.module.css";

const CultivationDisplay = ({ playerData }) => {
  const getCultivationLevel = (level) => {
    if (level <= 10)
      return {
        name: "练气期",
        color: "#8fbc8f",
        description: "修仙之路的起点，感受天地灵气",
      };
    if (level <= 20)
      return {
        name: "筑基期",
        color: "#4682b4",
        description: "筑建修仙根基，凝聚丹田",
      };
    if (level <= 30)
      return {
        name: "金丹期",
        color: "#daa520",
        description: "凝聚金丹，踏入真正的修仙之门",
      };
    if (level <= 40)
      return {
        name: "元婴期",
        color: "#9370db",
        description: "元婴出世，可以离体而存",
      };
    if (level <= 50)
      return {
        name: "化神期",
        color: "#ff6347",
        description: "神识化形，感悟天地大道",
      };
    if (level <= 60)
      return {
        name: "炼虚期",
        color: "#ff1493",
        description: "炼化虚空，掌控空间之力",
      };
    if (level <= 70)
      return {
        name: "合体期",
        color: "#00ced1",
        description: "天人合一，与大道相合",
      };
    if (level <= 80)
      return {
        name: "大乘期",
        color: "#ffd700",
        description: "大乘圆满，接近仙人境界",
      };
    return {
      name: "渡劫期",
      color: "#ff4500",
      description: "面临天劫考验，一步登仙",
    };
  };

  const cultivation = getCultivationLevel(playerData?.level || 1);
  const experienceProgress =
    (((playerData?.experience || 0) % 100) / 100) * 100;

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
        label: "灵石财富",
        value: `${playerData?.gold || 0}`,
        color: "#ffd700",
      },
      {
        label: "仙石宝藏",
        value: `${playerData?.gems || 0}`,
        color: "#00ffff",
      },
      {
        label: "收集魂魄",
        value: `${playerData?.soulCount || 0}`,
        color: "#ff69b4",
      },
      {
        label: "当前灵气",
        value: `${playerData?.mana || 100}/${playerData?.maxMana || 100}`,
        color: "#0ea5e9",
      },
    ];
  };

  const getAchievements = () => {
    const achievements = playerData?.achievements || [];
    return [
      {
        name: "初入仙途",
        description: "开始修仙之路",
        unlocked: playerData?.level >= 1,
      },
      {
        name: "筑基成功",
        description: "达到筑基期",
        unlocked: playerData?.level >= 11,
      },
      {
        name: "金丹凝聚",
        description: "成功凝聚金丹",
        unlocked: playerData?.level >= 21,
      },
      {
        name: "元婴出世",
        description: "元婴期突破",
        unlocked: playerData?.level >= 31,
      },
      {
        name: "大元素使",
        description: "所有元素达到满级",
        unlocked: achievements.includes("大元素使"),
      },
    ];
  };

  return (
    <div className={styles.cultivationDisplay}>
      <div className={styles.header}>
        <h3>修为境界</h3>
        <p>查看你的修炼进度和境界状态</p>
      </div>

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
                修炼进度: 等级 {playerData?.level || 1}
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

      {/* Achievements */}
      <div className={styles.achievementsSection}>
        <h4>修炼成就</h4>
        <div className={styles.achievementsList}>
          {getAchievements().map((achievement, index) => (
            <div
              key={index}
              className={`${styles.achievementCard} ${
                achievement.unlocked ? styles.unlocked : styles.locked
              }`}
            >
              <div className={styles.achievementIcon}>
                {achievement.unlocked ? "🏆" : "🔒"}
              </div>
              <div className={styles.achievementInfo}>
                <div className={styles.achievementName}>{achievement.name}</div>
                <div className={styles.achievementDesc}>
                  {achievement.description}
                </div>
              </div>
              {achievement.unlocked && (
                <div className={styles.unlockedBadge}>已解锁</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CultivationDisplay;
