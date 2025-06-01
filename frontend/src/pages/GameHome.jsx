// frontend/src/pages/GameHome.jsx
import { useState, useEffect } from "react";
import GameHeader from "../components/game/GameHeader";
import StageSelection from "../components/game/StageSelection";
import ElementDisplay from "../components/elements/ElementDisplay";
import TreasureInventory from "../components/inventory/TreasureInventory";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import playerService from "../services/playerService";
import stageService from "../services/stageService";
import styles from "./GameHome.module.css";

const GameHome = ({ saveData, onNavigate }) => {
  const [currentTab, setCurrentTab] = useState("stages");
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

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>加载中...</p>
        </div>
      );
    }

    switch (currentTab) {
      case "stages":
        return (
          <StageSelection
            stages={stages}
            playerData={playerData}
            onStageSelect={handleStageSelect}
          />
        );
      case "elements":
        return (
          <ElementDisplay
            playerData={playerData}
            onElementChange={handleElementChange}
          />
        );
      case "treasure":
        return (
          <TreasureInventory
            playerData={playerData}
            onTreasureUpgrade={handleTreasureUpgrade}
          />
        );
      default:
        return <div>选择一个标签页</div>;
    }
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case "stages":
        return "关卡选择";
      case "elements":
        return "元素修炼";
      case "treasure":
        return "法宝管理";
      default:
        return "";
    }
  };

  if (!playerData) {
    return (
      <div className={styles.gameHome}>
        <p>加载存档数据...</p>
      </div>
    );
  }

  return (
    <ResponsiveLayout className={styles.gameHome}>
      <GameHeader
        playerData={playerData}
        onBackToHome={() => onNavigate("home")}
      />

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <Card variant="dark" className={styles.navigationCard}>
            <h3>游戏菜单</h3>
            <div className={styles.tabButtons}>
              <Button
                variant={currentTab === "stages" ? "primary" : "ghost"}
                onClick={() => setCurrentTab("stages")}
                className={styles.tabButton}
              >
                🗺️ 关卡挑战
              </Button>
              <Button
                variant={currentTab === "elements" ? "primary" : "ghost"}
                onClick={() => setCurrentTab("elements")}
                className={styles.tabButton}
              >
                🔥 元素修炼
              </Button>
              <Button
                variant={currentTab === "treasure" ? "primary" : "ghost"}
                onClick={() => setCurrentTab("treasure")}
                className={styles.tabButton}
              >
                ⚔️ 法宝背包
              </Button>
            </div>
          </Card>

          <Card variant="dark" className={styles.playerStatsCard}>
            <h4>修炼境界</h4>
            <div className={styles.statsGrid}>
              <div className={styles.statRow}>
                <span>等级:</span>
                <span>{playerData.level}</span>
              </div>
              <div className={styles.statRow}>
                <span>经验:</span>
                <span>{playerData.experience || 0}</span>
              </div>
              <div className={styles.statRow}>
                <span>金币:</span>
                <span>{playerData.gold || 0}</span>
              </div>
              <div className={styles.statRow}>
                <span>宝石:</span>
                <span>{playerData.gems || 0}</span>
              </div>
              <div className={styles.statRow}>
                <span>魂魄:</span>
                <span>{playerData.soulCount || 0}</span>
              </div>
              <div className={styles.statRow}>
                <span>灵气:</span>
                <span>
                  {playerData.mana || 100}/{playerData.maxMana || 100}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.mainContent}>
          <Card variant="dark" className={styles.contentCard}>
            <div className={styles.contentHeader}>
              <h2>{getTabTitle()}</h2>
            </div>
            <div className={styles.tabContent}>{renderTabContent()}</div>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default GameHome;
