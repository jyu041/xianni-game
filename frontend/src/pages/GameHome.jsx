// frontend/src/pages/GameHome.jsx
import { useState, useEffect } from "react";
import GameHeader from "/src/components/GameHome/GameHeader";
import SidebarMenu from "/src/components/GameHome/SidebarMenu";
import StageSelection from "/src/components/GameHome/StageSelection";
import ElementDisplay from "/src/components/GameHome/ElementDisplay";
import TreasureInventory from "/src/components/GameHome/TreasureInventory";
import CultivationDisplay from "/src/components/GameHome/CultivationDisplay";
import ResponsiveLayout from "/src/components/layout/ResponsiveLayout";
import playerService from "/src/services/playerService";
import stageService from "/src/services/stageService";
import styles from "./GameHome.module.css";

const GameHome = ({ saveData, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState("stages");
  const [playerData, setPlayerData] = useState(saveData);
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      setIsLoading(true);

      // Load latest player data
      const updatedPlayer = await playerService.getPlayerById(saveData.id);
      if (updatedPlayer) {
        setPlayerData(updatedPlayer);
      }

      // Load stages
      const stageData = await stageService.getAllStages();
      setStages(stageData || []);
    } catch (error) {
      console.error("Failed to load game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageSelect = (stage) => {
    onNavigate("gameLevel", {
      stageData: stage,
      playerData: playerData,
    });
  };

  const handleElementChange = async (newPrimaryElement) => {
    try {
      // Update player data locally
      setPlayerData((prev) => ({
        ...prev,
        primaryElement: newPrimaryElement,
      }));

      // Reload player data to get updated info
      await loadGameData();
    } catch (error) {
      console.error("Failed to update element:", error);
    }
  };

  const handleTreasureUpgrade = async (treasureId) => {
    try {
      if (treasureId === "tianniSword") {
        const updatedPlayer = await playerService.upgradeTianniSword(
          playerData.id
        );
        if (updatedPlayer) {
          setPlayerData(updatedPlayer);
        }
      }
    } catch (error) {
      console.error("Failed to upgrade treasure:", error);
    }
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className={styles.menuContent}>
          <div className={styles.comingSoon}>
            <div className={styles.comingSoonIcon}>⏳</div>
            <h3>加载中...</h3>
            <p>正在加载游戏数据...</p>
          </div>
        </div>
      );
    }

    switch (activeMenu) {
      case "stages":
        return (
          <StageSelection
            stages={stages}
            playerData={playerData}
            onStageSelect={handleStageSelect}
          />
        );
      case "inventory":
        return (
          <TreasureInventory
            playerData={playerData}
            onTreasureUpgrade={handleTreasureUpgrade}
          />
        );
      case "cultivation":
        return <CultivationDisplay playerData={playerData} />;
      case "upgrades":
        return (
          <ElementDisplay
            playerData={playerData}
            onElementChange={handleElementChange}
          />
        );
      case "store":
        return (
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>🏪</div>
              <h3>修仙商店</h3>
              <p>购买珍贵的修炼资源和法宝</p>
              <p>即将开放，敬请期待！</p>
            </div>
          </div>
        );
      case "gacha":
        return (
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>🎲</div>
              <h3>天机抽取</h3>
              <p>消耗天机石获得稀有法宝和功法</p>
              <p>即将开放，敬请期待！</p>
            </div>
          </div>
        );
      case "achievements":
        return (
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>🏆</div>
              <h3>修仙成就</h3>
              <p>查看你的修炼成就和里程碑</p>
              <p>即将开放，敬请期待！</p>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>❓</div>
              <h3>未知区域</h3>
              <p>此功能正在开发中...</p>
            </div>
          </div>
        );
    }
  };

  const getContentTitle = () => {
    const titles = {
      stages: "关卡选择",
      inventory: "法宝背包",
      cultivation: "修为境界",
      store: "修仙商店",
      upgrades: "元素修炼",
      gacha: "天机抽取",
      achievements: "修仙成就",
    };
    return titles[activeMenu] || "游戏功能";
  };

  const getContentIcon = () => {
    const icons = {
      stages: "⚔️",
      inventory: "🎒",
      cultivation: "🧘",
      store: "🏪",
      upgrades: "📚",
      gacha: "🎲",
      achievements: "🏆",
    };
    return icons[activeMenu] || "❓";
  };

  if (!playerData) {
    return (
      <div className={styles.gameHomePage}>
        <div className={styles.content}>
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>⏳</div>
              <h3>加载存档数据...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameHomePage}>
      {/* Background effects */}
      <div className={styles.background}>
        <div className={styles.cultivationAura}>
          <div className={styles.auraRing}></div>
          <div className={styles.auraRing}></div>
          <div className={styles.auraRing}></div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Game Header */}
        <GameHeader
          playerData={playerData}
          onBackToHome={() => onNavigate("home")}
        />

        {/* Main Game Layout */}
        <div className={styles.gameLayout}>
          {/* Sidebar Menu */}
          <div className={styles.sidebarSection}>
            <SidebarMenu
              activeMenu={activeMenu}
              onMenuSelect={setActiveMenu}
              playerData={playerData}
            />
          </div>

          {/* Main Content Panel */}
          <div className={styles.mainPanel}>
            <div className={styles.mainContent}>
              {/* Content Body */}
              <div className={styles.contentBody}>{renderMainContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHome;
