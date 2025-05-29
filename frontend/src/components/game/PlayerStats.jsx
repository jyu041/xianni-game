import Card from "../ui/Card";
import styles from "./PlayerStats.module.css";

const PlayerStats = ({ playerData }) => {
  const getExperiencePercent = () => {
    const currentLevelExp = (playerData.level - 1) * 100;
    const nextLevelExp = playerData.level * 100;
    const currentExp = playerData.experience || 0;
    const progressExp = currentExp - currentLevelExp;
    const neededExp = nextLevelExp - currentLevelExp;
    return Math.min((progressExp / neededExp) * 100, 100);
  };

  const getCultivationLevel = (level) => {
    if (level <= 10) return { name: "练气期", color: "#8fbc8f" };
    if (level <= 20) return { name: "筑基期", color: "#4682b4" };
    if (level <= 30) return { name: "金丹期", color: "#daa520" };
    if (level <= 40) return { name: "元婴期", color: "#9370db" };
    if (level <= 50) return { name: "化神期", color: "#ff6347" };
    if (level <= 60) return { name: "炼虚期", color: "#ff1493" };
    if (level <= 70) return { name: "合体期", color: "#00ced1" };
    if (level <= 80) return { name: "大乘期", color: "#ffd700" };
    return { name: "渡劫期", color: "#ff4500" };
  };

  const cultivation = getCultivationLevel(playerData.level);

  return (
    <Card className={styles.playerStats} variant="glass">
      <div className={styles.header}>
        <div className={styles.avatar}>
          <div className={styles.avatarIcon}>仙</div>
          <div className={styles.levelBadge}>{playerData.level}</div>
        </div>
        <div className={styles.nameInfo}>
          <h3 className={styles.playerName}>{playerData.playerName}</h3>
          <p
            className={styles.cultivation}
            style={{ color: cultivation.color }}
          >
            {cultivation.name}
          </p>
        </div>
      </div>

      <div className={styles.expSection}>
        <div className={styles.expHeader}>
          <span className={styles.expLabel}>修为经验</span>
          <span className={styles.expValue}>
            {playerData.experience || 0} / {playerData.level * 100}
          </span>
        </div>
        <div className={styles.expBar}>
          <div
            className={styles.expFill}
            style={{ width: `${getExperiencePercent()}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.resources}>
        <div className={styles.resource}>
          <div className={styles.resourceIcon}>💰</div>
          <div className={styles.resourceInfo}>
            <span className={styles.resourceLabel}>灵石</span>
            <span className={styles.resourceValue}>{playerData.gold || 0}</span>
          </div>
        </div>

        <div className={styles.resource}>
          <div className={styles.resourceIcon}>💎</div>
          <div className={styles.resourceInfo}>
            <span className={styles.resourceLabel}>仙晶</span>
            <span className={styles.resourceValue}>{playerData.gems || 0}</span>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>攻击力</span>
          <span className={styles.statValue}>{playerData.attack || 10}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>防御力</span>
          <span className={styles.statValue}>{playerData.defense || 5}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>生命值</span>
          <span className={styles.statValue}>{playerData.health || 100}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>法力值</span>
          <span className={styles.statValue}>{playerData.mana || 50}</span>
        </div>
      </div>
    </Card>
  );
};

export default PlayerStats;
