import React, { useEffect, useState } from "react";
import useGameStore from "../../managers/StateManager.js";
import CultivationManager from "../../managers/CultivationManager.js";
import SaveManager from "../../managers/SaveManager.js";

// UI Components
import HealthBar from "../ui/bars/HealthBar.jsx";
import ManaBar from "../ui/bars/ManaBar.jsx";
import EnergyBar from "../ui/bars/EnergyBar.jsx";
import ExperienceBar from "../ui/bars/ExperienceBar.jsx";
import CultivationPanel from "../game/cultivation/CultivationPanel.jsx";
import InventoryGrid from "../game/inventory/InventoryGrid.jsx";
import WorldMap from "../game/world/WorldMap.jsx";
import MainMenu from "../ui/menus/MainMenu.jsx";
import Button from "../ui/common/Button.jsx";

const GameScreen = ({ onNavigate }) => {
  const {
    player,
    ui,
    isPaused,
    togglePause,
    toggleCultivation,
    toggleInventory,
    setActiveMenu,
  } = useGameStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-save every 5 minutes
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      SaveManager.autoSave();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(autoSaveTimer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "c":
        case "C":
          toggleCultivation();
          break;
        case "i":
        case "I":
          toggleInventory();
          break;
        case "Escape":
          if (ui.activeMenu) {
            setActiveMenu(null);
          } else {
            togglePause();
          }
          break;
        case "F5":
          e.preventDefault();
          SaveManager.quickSave();
          break;
        case "F9":
          e.preventDefault();
          SaveManager.quickLoad();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    ui.activeMenu,
    toggleCultivation,
    toggleInventory,
    togglePause,
    setActiveMenu,
  ]);

  const cultivationProgress = CultivationManager.getCultivationProgress();

  return (
    <div className="game-screen">
      {/* Top HUD */}
      <div className="top-hud">
        <div className="player-info">
          <div className="player-name">{player.name}</div>
          <div className="cultivation-info">
            {cultivationProgress.realm} 第{cultivationProgress.stage}层
          </div>
          <div className="level-info">等级 {player.level}</div>
        </div>

        <div className="bars-container">
          <HealthBar
            current={player.stats.health}
            max={player.stats.maxHealth}
          />
          <ManaBar current={player.stats.mana} max={player.stats.maxMana} />
          <EnergyBar
            current={player.stats.energy}
            max={player.stats.maxEnergy}
          />
          <ExperienceBar
            current={player.experience}
            max={player.experienceToNext}
          />
        </div>

        <div className="time-info">
          <div className="game-time">{currentTime.toLocaleTimeString()}</div>
          <div className="location">{player.position.region}</div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="main-game-area">
        <WorldMap />
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="quick-actions">
          <Button
            onClick={toggleCultivation}
            className={`action-button ${ui.showCultivation ? "active" : ""}`}
          >
            修炼 (C)
          </Button>
          <Button
            onClick={toggleInventory}
            className={`action-button ${ui.showInventory ? "active" : ""}`}
          >
            背包 (I)
          </Button>
          <Button
            onClick={() => SaveManager.quickSave()}
            className="action-button"
          >
            快存 (F5)
          </Button>
        </div>

        <div className="cultivation-summary">
          <h3>修炼进度</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${cultivationProgress.progress * 100}%` }}
            />
          </div>
          <div className="progress-text">
            {cultivationProgress.cultivationPoints} /{" "}
            {cultivationProgress.requiredPoints}
          </div>
        </div>
      </div>

      {/* Panels */}
      {ui.showCultivation && (
        <div className="panel-overlay">
          <CultivationPanel onClose={toggleCultivation} />
        </div>
      )}

      {ui.showInventory && (
        <div className="panel-overlay">
          <InventoryGrid onClose={toggleInventory} />
        </div>
      )}

      {/* Pause Menu */}
      {isPaused && (
        <div className="pause-overlay">
          <MainMenu onNavigate={onNavigate} />
        </div>
      )}

      {/* Bottom HUD */}
      <div className="bottom-hud">
        <div className="hotbar">{/* Skill/Item hotbar would go here */}</div>

        <Button onClick={togglePause} className="menu-button">
          菜单 (ESC)
        </Button>
      </div>
    </div>
  );
};

export default GameScreen;
