import React from "react";
import useGameStore from "../../managers/StateManager.js";
import SaveManager from "../../managers/SaveManager.js";
import Button from "../ui/common/Button.jsx";
import Modal from "../ui/common/Modal.jsx";
import { useState } from "react";

const HomeScreen = ({ onNavigate }) => {
  const { settings, updateSettings } = useGameStore();
  const [showSaveSlots, setShowSaveSlots] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const saveSlots = SaveManager.getAllSaves();

  const handleNewGame = () => {
    useGameStore.getState().resetGame();
    onNavigate("game");
  };

  const handleLoadGame = (slot) => {
    if (SaveManager.loadFromSlot(slot)) {
      onNavigate("game");
    }
    setShowSaveSlots(false);
  };

  const handleContinue = () => {
    if (SaveManager.hasSlot(1)) {
      handleLoadGame(1);
    } else {
      handleNewGame();
    }
  };

  return (
    <div className="home-screen">
      <div className="title-section">
        <h1 className="game-title">仙逆</h1>
        <h2 className="game-subtitle">Renegade Immortal</h2>
        <p className="game-version">v1.0.0</p>
      </div>

      <div className="menu-section">
        <Button onClick={handleContinue} className="menu-button primary">
          {SaveManager.hasSlot(1) ? "继续游戏" : "开始游戏"}
        </Button>

        <Button onClick={handleNewGame} className="menu-button">
          新游戏
        </Button>

        <Button onClick={() => setShowSaveSlots(true)} className="menu-button">
          加载游戏
        </Button>

        <Button onClick={() => setShowSettings(true)} className="menu-button">
          设置
        </Button>

        <Button onClick={() => window.close()} className="menu-button">
          退出游戏
        </Button>
      </div>

      {/* Save Slots Modal */}
      {showSaveSlots && (
        <Modal title="选择存档" onClose={() => setShowSaveSlots(false)}>
          <div className="save-slots">
            {saveSlots.map((save) => (
              <div
                key={save.slot}
                className={`save-slot ${save.exists ? "has-save" : "empty"}`}
              >
                <div className="slot-header">
                  <span className="slot-number">槽位 {save.slot}</span>
                  {save.exists && (
                    <span className="save-date">
                      {new Date(save.metadata.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {save.exists ? (
                  <div className="save-info">
                    <div className="player-name">
                      {save.metadata.playerName}
                    </div>
                    <div className="cultivation-info">
                      {save.metadata.realm} 第{save.metadata.stage}层
                    </div>
                    <div className="location">位置: {save.metadata.region}</div>
                    <Button
                      onClick={() => handleLoadGame(save.slot)}
                      className="load-button"
                    >
                      加载
                    </Button>
                  </div>
                ) : (
                  <div className="empty-slot">
                    <span>空槽位</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Modal title="游戏设置" onClose={() => setShowSettings(false)}>
          <div className="settings-panel">
            <div className="setting-group">
              <label>语言</label>
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value })}
              >
                <option value="zh-CN">中文</option>
                <option value="en-US">English</option>
              </select>
            </div>

            <div className="setting-group">
              <label>音乐音量: {Math.round(settings.musicVolume * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.musicVolume}
                onChange={(e) =>
                  updateSettings({ musicVolume: parseFloat(e.target.value) })
                }
              />
            </div>

            <div className="setting-group">
              <label>音效音量: {Math.round(settings.sfxVolume * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.sfxVolume}
                onChange={(e) =>
                  updateSettings({ sfxVolume: parseFloat(e.target.value) })
                }
              />
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) =>
                    updateSettings({ autoSave: e.target.checked })
                  }
                />
                自动保存
              </label>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HomeScreen;
