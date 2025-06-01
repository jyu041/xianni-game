// frontend/src/components/game/GameLevelHeader.jsx
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import DebugMenu from "./DebugMenu";
import SkillUpgradeModal from "./SkillUpgradeModal";
import styles from "./GameLevelHeader.module.css";

const GameLevelHeader = ({
  playerData,
  gameState,
  onPause,
  onQuit,
  isPaused,
  debugSettings,
  onDebugChange,
  phaserGameRef,
}) => {
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [soulProgress, setSoulProgress] = useState(0);
  const [skillLevel, setSkillLevel] = useState(0);

  const soulProgressMax = 25;

  useEffect(() => {
    const totalSouls = gameState.soulCount || 0;
    const currentProgress = totalSouls % soulProgressMax;
    const currentSkillLevel = Math.floor(totalSouls / soulProgressMax);

    // Check if we've gained a new skill level
    if (currentSkillLevel > skillLevel && totalSouls > 0) {
      setShowSkillModal(true);
      setSkillLevel(currentSkillLevel);
    }

    setSoulProgress(currentProgress);
  }, [gameState.soulCount]);

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

  const getManaPercent = () => {
    const mana = playerData?.mana || 100;
    const maxMana = playerData?.maxMana || 100;
    return (mana / maxMana) * 100;
  };

  const handleSkillSelect = (skill) => {
    console.log("Selected skill:", skill);
    // TODO: Apply skill effects to game state
    setShowSkillModal(false);
  };

  // Handle VFX casting from debug menu
  const handleCastVfx = (effectKey, options = {}) => {
    if (!phaserGameRef?.current) {
      console.warn("Phaser game instance not available for VFX casting");
      return;
    }

    try {
      const scene = phaserGameRef.current.scene.getScene("GameScene");
      if (scene && scene.castVfxEffect) {
        scene.castVfxEffect(effectKey, options);
        console.log(`VFX Effect cast: ${effectKey}`);
      } else {
        console.warn("GameScene or castVfxEffect method not available");
      }
    } catch (error) {
      console.error("Error casting VFX effect:", error);
    }
  };

  const cultivation = getCultivationLevel(playerData.level);

  return (
    <>
      <div className={styles.gameHeader}>
        {/* Left Section - Player Info and Health Bar */}
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

          {/* Mana Section - Moved from GameHeader */}
          <div className={styles.manaSection}>
            <div className={styles.manaBar}>
              <div
                className={styles.manaFill}
                style={{ width: `${getManaPercent()}%` }}
              />
            </div>
            <div className={`${styles.manaText} game-text-small`}>
              灵气: {playerData?.mana || 100} / {playerData?.maxMana || 100}
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

        {/* Right Section - Soul Progress and Controls */}
        <div className={styles.rightSection}>
          {/* Soul Progress Bar */}
          <div className={styles.soulProgressSection}>
            <div className={styles.soulProgressLabel}>
              <span className={`${styles.soulProgressText} game-text-small`}>
                下个技能: {soulProgress}/{soulProgressMax}
              </span>
              <span className={`${styles.skillLevelText} game-text-small`}>
                技能等级: {skillLevel}
              </span>
            </div>
            <div className={styles.soulProgressBar}>
              <div
                className={styles.soulProgressFill}
                style={{
                  width: `${(soulProgress / soulProgressMax) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className={styles.controlButtons}>
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
      </div>

      <DebugMenu
        isOpen={showDebugMenu}
        onClose={() => setShowDebugMenu(false)}
        debugSettings={debugSettings}
        onDebugChange={onDebugChange}
        onCastVfx={handleCastVfx}
      />

      <SkillUpgradeModal
        isOpen={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        onSkillSelect={handleSkillSelect}
      />
    </>
  );
};

export default GameLevelHeader;
