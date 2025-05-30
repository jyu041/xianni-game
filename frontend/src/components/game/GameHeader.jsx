import { useState } from "react";
import styles from "./GameHeader.module.css";

const GameHeader = ({
  playerData,
  onMenuSelect,
  onShowAllLevels,
  onBackToHome,
}) => {
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

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

  const getExperiencePercent = () => {
    const currentLevelExp = (playerData.level - 1) * 100;
    const nextLevelExp = playerData.level * 100;
    const currentExp = playerData.experience || 0;
    const progressExp = currentExp - currentLevelExp;
    const neededExp = nextLevelExp - currentLevelExp;
    return Math.min((progressExp / neededExp) * 100, 100);
  };

  const cultivation = getCultivationLevel(playerData.level);

  const menuItems = [
    { id: "stages", label: "关卡选择", icon: "⚔️" },
    { id: "inventory", label: "法宝背包", icon: "🎒" },
    { id: "store", label: "修仙商店", icon: "🏪" },
    { id: "upgrades", label: "功法升级", icon: "📚" },
    { id: "gacha", label: "天机抽取", icon: "🎲" },
    { id: "achievements", label: "修仙成就", icon: "🏆" },
  ];

  return (
    <div className={styles.gameHeader}>
      <div className={styles.leftSection}>
        <button className={styles.backButton} onClick={onBackToHome}>
          ←
        </button>

        <div className={styles.playerInfo}>
          <div className={styles.avatar}>
            <div className={styles.avatarIcon}>仙</div>
            <div className={styles.levelBadge}>{playerData.level}</div>
          </div>

          <div className={styles.playerDetails}>
            <div className={styles.playerName}>{playerData.playerName}</div>
            <div
              className={styles.cultivation}
              style={{ color: cultivation.color }}
            >
              {cultivation.name}
            </div>
          </div>
        </div>

        <div className={styles.expSection}>
          <div className={styles.expBar}>
            <div
              className={styles.expFill}
              style={{ width: `${getExperiencePercent()}%` }}
            />
          </div>
          <div className={styles.expText}>
            {playerData.experience || 0} / {playerData.level * 100}
          </div>
        </div>
      </div>

      <div className={styles.centerSection}>
        <div className={styles.menuDropdown}>
          <button
            className={styles.menuButton}
            onClick={() => setShowMenuDropdown(!showMenuDropdown)}
          >
            功能菜单 ▼
          </button>

          {showMenuDropdown && (
            <div className={styles.dropdownMenu}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={styles.dropdownItem}
                  onClick={() => {
                    onMenuSelect(item.id);
                    setShowMenuDropdown(false);
                  }}
                >
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <span className={styles.itemLabel}>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className={styles.allLevelsButton} onClick={onShowAllLevels}>
          全部关卡
        </button>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.resources}>
          <div className={styles.resource}>
            <span className={styles.resourceIcon}>💰</span>
            <span className={styles.resourceValue}>{playerData.gold || 0}</span>
          </div>

          <div className={styles.resource}>
            <span className={styles.resourceIcon}>💎</span>
            <span className={styles.resourceValue}>{playerData.gems || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
