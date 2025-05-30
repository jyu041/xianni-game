// frontend/src/components/pages/GameHome.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import GameHeader from "../game/GameHeader";
import SidebarMenu from "../game/SidebarMenu";
import LevelSelector from "../game/LevelSelector";
import StageModal from "../game/StageModal";
import styles from "./GameHome.module.css";

const GameHome = ({ saveData, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState("stages");
  const [playerData, setPlayerData] = useState(saveData);
  const [showAllStages, setShowAllStages] = useState(false);

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

  const handleShowAllStages = () => {
    setShowAllStages(true);
  };

  const handleCloseStageModal = () => {
    setShowAllStages(false);
  };

  const getMenuTitle = (menuId) => {
    const menuTitles = {
      stages: "关卡选择",
      inventory: "法宝背包",
      store: "修仙商店",
      upgrades: "功法升级",
      gacha: "天机抽取",
      achievements: "修仙成就",
    };
    return menuTitles[menuId] || "功能菜单";
  };

  const getMenuIcon = (menuId) => {
    const menuIcons = {
      stages: "⚔️",
      inventory: "🎒",
      store: "🏪",
      upgrades: "📚",
      gacha: "🎲",
      achievements: "🏆",
    };
    return menuIcons[menuId] || "⚡";
  };

  const renderActiveMenu = () => {
    switch (activeMenu) {
      case "stages":
        return (
          <LevelSelector
            unlockedStages={playerData.unlockedStages || [1, 2, 3]}
            currentStage={playerData.currentStage || 1}
            onStageSelect={handleStageSelect}
            onShowAllStages={handleShowAllStages}
            totalStages={10}
          />
        );
      case "inventory":
        return (
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>🎒</div>
              <h3>法宝背包</h3>
              <p>背包系统正在开发中...</p>
              <p>敬请期待更多精彩内容！</p>
            </div>
          </div>
        );
      case "store":
        return (
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>🏪</div>
              <h3>修仙商店</h3>
              <p>商店功能正在开发中...</p>
              <p>敬请期待更多精彩内容！</p>
            </div>
          </div>
        );
      case "upgrades":
        return (
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>📚</div>
              <h3>功法升级</h3>
              <p>升级系统正在开发中...</p>
              <p>敬请期待更多精彩内容！</p>
            </div>
          </div>
        );
      case "gacha":
        return (
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>🎲</div>
              <h3>天机抽取</h3>
              <p>抽取系统正在开发中...</p>
              <p>敬请期待更多精彩内容！</p>
            </div>
          </div>
        );
      case "achievements":
        return (
          <div className={styles.menuContent}>
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>🏆</div>
              <h3>修仙成就</h3>
              <p>成就系统正在开发中...</p>
              <p>敬请期待更多精彩内容！</p>
            </div>
          </div>
        );
      default:
        return (
          <LevelSelector
            unlockedStages={playerData.unlockedStages || [1, 2, 3]}
            currentStage={playerData.currentStage || 1}
            onStageSelect={handleStageSelect}
            onShowAllStages={handleShowAllStages}
            totalStages={10}
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
        <GameHeader
          playerData={playerData}
          onBackToHome={() => onNavigate("home")}
        />

        <div className={styles.gameLayout}>
          <div className={styles.sidebarSection}>
            <SidebarMenu
              activeMenu={activeMenu}
              onMenuSelect={handleMenuSelect}
              playerData={playerData}
            />
          </div>

          <div className={styles.mainPanel}>
            <Card className={styles.mainContent}>
              <div className={styles.contentHeader}>
                <h2 className={styles.contentTitle}>
                  <span className={styles.contentIcon}>
                    {getMenuIcon(activeMenu)}
                  </span>
                  {getMenuTitle(activeMenu)}
                </h2>
              </div>

              <div className={styles.contentBody}>{renderActiveMenu()}</div>
            </Card>
          </div>
        </div>
      </div>

      <StageModal
        isOpen={showAllStages}
        onClose={handleCloseStageModal}
        unlockedStages={playerData.unlockedStages || [1, 2, 3]}
        currentStage={playerData.currentStage || 1}
        onStageSelect={handleStageSelect}
      />
    </div>
  );
};

export default GameHome;
