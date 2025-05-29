import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import PlayerStats from "../game/PlayerStats";
import StageSelection from "../game/StageSelection";
import MenuNavigation from "../game/MenuNavigation";
import styles from "./GameHome.module.css";

const GameHome = ({ saveData, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState("stages");
  const [playerData, setPlayerData] = useState(saveData);

  useEffect(() => {
    // Update last played time
    updateLastPlayed();
  }, []);

  const updateLastPlayed = async () => {
    try {
      await fetch(`/api/saves/${playerData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastPlayed: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to update last played:", error);
    }
  };

  const handleMenuSelect = (menu) => {
    setActiveMenu(menu);
  };

  const handleStageSelect = (stageId) => {
    // Navigate to game level
    console.log("Starting stage:", stageId);
    // onNavigate('gameLevel', { stageId })
  };

  const renderActiveMenu = () => {
    switch (activeMenu) {
      case "stages":
        return (
          <StageSelection
            unlockedStages={playerData.unlockedStages || [1]}
            currentStage={playerData.currentStage || 1}
            onStageSelect={handleStageSelect}
          />
        );
      case "inventory":
        return (
          <div className={styles.menuContent}>
            <h3>背包系统</h3>
            <p>背包功能开发中...</p>
          </div>
        );
      case "store":
        return (
          <div className={styles.menuContent}>
            <h3>修仙商店</h3>
            <p>商店功能开发中...</p>
          </div>
        );
      case "upgrades":
        return (
          <div className={styles.menuContent}>
            <h3>功法升级</h3>
            <p>升级系统开发中...</p>
          </div>
        );
      case "gacha":
        return (
          <div className={styles.menuContent}>
            <h3>天机抽取</h3>
            <p>抽取系统开发中...</p>
          </div>
        );
      case "achievements":
        return (
          <div className={styles.menuContent}>
            <h3>成就系统</h3>
            <p>成就功能开发中...</p>
          </div>
        );
      default:
        return (
          <StageSelection
            unlockedStages={playerData.unlockedStages || [1]}
            currentStage={playerData.currentStage || 1}
            onStageSelect={handleStageSelect}
          />
        );
    }
  };

  return (
    <div className={styles.gameHomePage}>
      <div className={styles.background}>
        <div className={styles.cultivationAura}>
          <div className={styles.auraRing}></div>
          <div className={styles.auraRing}></div>
          <div className={styles.auraRing}></div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className={styles.backButton}
          >
            ← 返回主菜单
          </Button>

          <div className={styles.playerInfo}>
            <h2 className={styles.playerName}>{playerData.playerName}</h2>
            <p className={styles.cultivation}>
              修为: {getCultivationLevel(playerData.level)}
            </p>
          </div>

          <div className={styles.debugMenu}>
            <Button
              variant="ghost"
              onClick={() => setActiveMenu("debug")}
              className={styles.debugButton}
            >
              调试菜单
            </Button>
          </div>
        </div>

        <div className={styles.gameLayout}>
          <div className={styles.leftPanel}>
            <PlayerStats playerData={playerData} />
            <MenuNavigation
              activeMenu={activeMenu}
              onMenuSelect={handleMenuSelect}
            />
          </div>

          <div className={styles.mainPanel}>
            <Card className={styles.mainContent}>{renderActiveMenu()}</Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get cultivation level name
const getCultivationLevel = (level) => {
  if (level <= 10) return "练气期";
  if (level <= 20) return "筑基期";
  if (level <= 30) return "金丹期";
  if (level <= 40) return "元婴期";
  if (level <= 50) return "化神期";
  if (level <= 60) return "炼虚期";
  if (level <= 70) return "合体期";
  if (level <= 80) return "大乘期";
  return "渡劫期";
};

export default GameHome;
