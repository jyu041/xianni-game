// frontend/src/components/game/GameLevelHeader.jsx
import { useState } from "react";
import Button from "../ui/Button";
import DebugMenu from "./DebugMenu";
import styles from "./GameLevelHeader.module.css";

const GameLevelHeader = ({
  playerData,
  gameState,
  onPause,
  onQuit,
  isPaused,
  debugSettings,
  onDebugChange,
}) => {
  const [showDebugMenu, setShowDebugMenu] = useState(false);

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
    <>
      <div className={styles.gameHeader}>
        {/* Left Section - Health Bar */}
        <div className={styles.leftSection}>
          <div className={styles.playerInfo}>
            <div className={styles.avatar}>
              <div className={`${styles.avatarIcon} game-text-large`}>仙</div>
            </div>
            <div className={styles.playerDetails}>
              <div className={`${styles.playerName} game-text-large`}>
                {playerData.playerName}
              </div>
              <div
                className={`${styles.cultivation} game-text-small`}
                style={{ color: cultivation.color }}
              >
                {cultivation.name}
              </div>
            </div>
          </div>

          <div className={styles.healthSection}>
            <div className={styles.healthBar}>
              <div
                className={styles.healthFill}
                style={{
                  width: `${
                    (gameState.player.health / gameState.player.maxHealth) * 100
                  }%`,
                }}
              />
            </div>
            <div className={`${styles.healthText} game-text-small`}>
              生命值: {gameState.player.health}/{gameState.player.maxHealth}
            </div>
          </div>
        </div>

        {/* Center Section - Game Stats */}
        <div className={styles.centerSection}>
          <div className={styles.gameStats}>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🏆</span>
              <span className={`${styles.statValue} game-text-large`}>
                {gameState.score}
              </span>
              <span className={`${styles.statLabel} game-text-small`}>
                得分
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>⏱️</span>
              <span className={`${styles.statValue} game-text-large`}>
                {Math.floor(gameState.time)}s
              </span>
              <span className={`${styles.statLabel} game-text-small`}>
                时间
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>⭐</span>
              <span className={`${styles.statValue} game-text-large`}>
                {gameState.experience}
              </span>
              <span className={`${styles.statLabel} game-text-small`}>
                经验
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>👹</span>
              <span className={`${styles.statValue} game-text-large`}>
                {gameState.enemies.length}
              </span>
              <span className={`${styles.statLabel} game-text-small`}>
                敌人
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🔮</span>
              <span className={`${styles.statValue} game-text-large`}>
                {gameState.soulCount || 0}
              </span>
              <span className={`${styles.statLabel} game-text-small`}>
                魂魄
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className={styles.rightSection}>
          <Button
            variant="secondary"
            onClick={() => setShowDebugMenu(!showDebugMenu)}
            className={`${styles.debugButton} game-text-small`}
          >
            Debug
          </Button>
          <Button
            variant="secondary"
            onClick={onPause}
            className={`${styles.pauseButton} game-text-small`}
          >
            {isPaused ? "继续" : "暂停"}
          </Button>
        </div>
      </div>

      <DebugMenu
        isOpen={showDebugMenu}
        onClose={() => setShowDebugMenu(false)}
        debugSettings={debugSettings}
        onDebugChange={onDebugChange}
      />
    </>
  );
};

export default GameLevelHeader;
