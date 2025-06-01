// frontend/src/pages/GameHome.jsx
import { useState, useEffect } from "react";
import GameHeader from "/src/components/GameHome/GameHeader";
import SidebarMenu from "/src/components/GameHome/SidebarMenu";
import StageSelection from "/src/components/GameHome/StageSelection";
import ElementDisplay from "/src/components/GameHome/ElementDisplay";
import TreasureInventory from "/src/components/GameHome/TreasureInventory";
import CultivationDisplay from "/src/components/GameHome/CultivationDisplay";
import StoreDisplay from "/src/components/GameHome/StoreDisplay";
import GachaDisplay from "/src/components/GameHome/GachaDisplay";
import AchievementsDisplay from "/src/components/GameHome/AchievementsDisplay";
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

  const handleStorePurchase = async (item) => {
    try {
      // Simulate store purchase - in real implementation, this would call an API
      console.log("Purchasing item:", item);

      // Deduct cost
      const updatedPlayerData = { ...playerData };
      if (item.price.type === "gold") {
        updatedPlayerData.gold -= item.price.amount;
      } else if (item.price.type === "gems") {
        updatedPlayerData.gems -= item.price.amount;
      }

      // Add rewards
      if (item.reward.type === "gold") {
        updatedPlayerData.gold += item.reward.amount;
      } else if (item.reward.type === "experience") {
        updatedPlayerData.experience += item.reward.amount;
      } else if (item.reward.type === "sword_upgrade") {
        // Upgrade sword if possible
        if (updatedPlayerData.tianniSwordLevel < 10) {
          updatedPlayerData.tianniSwordLevel += 1;
        }
      }

      setPlayerData(updatedPlayerData);

      // In real implementation, update player via API
      // await playerService.updatePlayer(playerData.id, updatedPlayerData);
    } catch (error) {
      console.error("Failed to purchase item:", error);
    }
  };

  const handleGachaPull = async (pullData) => {
    try {
      console.log("Gacha pull:", pullData);

      // Deduct gems
      const updatedPlayerData = { ...playerData };
      updatedPlayerData.gems -= pullData.cost;

      // Add rewards based on results
      pullData.results.forEach((result) => {
        if (result.type === "currency") {
          updatedPlayerData.gold += 100; // Example reward
        } else if (result.type === "experience") {
          updatedPlayerData.experience += 50; // Example reward
        }
        // Add other reward types as needed
      });

      setPlayerData(updatedPlayerData);
    } catch (error) {
      console.error("Failed to process gacha pull:", error);
    }
  };

  const handleAchievementClaim = async (achievement) => {
    try {
      console.log("Claiming achievement:", achievement);

      // Add rewards
      const updatedPlayerData = { ...playerData };
      if (achievement.rewards.gold) {
        updatedPlayerData.gold += achievement.rewards.gold;
      }
      if (achievement.rewards.experience) {
        updatedPlayerData.experience += achievement.rewards.experience;
      }
      if (achievement.rewards.gems) {
        updatedPlayerData.gems += achievement.rewards.gems;
      }

      // Mark achievement as claimed
      achievement.claimed = true;

      setPlayerData(updatedPlayerData);
    } catch (error) {
      console.error("Failed to claim achievement:", error);
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
          <StoreDisplay
            playerData={playerData}
            onPurchase={handleStorePurchase}
          />
        );
      case "gacha":
        return (
          <GachaDisplay playerData={playerData} onGachaPull={handleGachaPull} />
        );
      case "achievements":
        return (
          <AchievementsDisplay
            playerData={playerData}
            onClaimReward={handleAchievementClaim}
          />
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
