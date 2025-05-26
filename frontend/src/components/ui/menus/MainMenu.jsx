import React, { useState } from "react";
import useGameStore from "../../../managers/StateManager.js";
import SaveManager from "../../../managers/SaveManager.js";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";

const MainMenu = ({ onNavigate }) => {
  const { togglePause, setCurrentScreen } = useGameStore();
  const [showSaveSlots, setShowSaveSlots] = useState(false);
  const [showLoadSlots, setShowLoadSlots] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleContinue = () => {
    togglePause();
  };

  const handleSaveGame = () => {
    setShowSaveSlots(true);
  };

  const handleLoadGame = () => {
    setShowLoadSlots(true);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleReturnToHome = () => {
    if (window.confirm("确定要返回主菜单吗？未保存的进度将会丢失。")) {
      onNavigate("home");
    }
  };

  const handleSaveToSlot = (slot) => {
    SaveManager.saveToSlot(slot);
    setShowSaveSlots(false);
  };

  const handleLoadFromSlot = (slot) => {
    if (SaveManager.loadFromSlot(slot)) {
      togglePause();
    }
    setShowLoadSlots(false);
  };

  const saveSlots = SaveManager.getAllSaves();

  return (
    <div className="main-menu">
      <div className="menu-content">
        <h2>游戏菜单</h2>

        <div className="menu-buttons">
          <Button onClick={handleContinue} variant="primary">
            继续游戏
          </Button>

          <Button onClick={handleSaveGame}>保存游戏</Button>

          <Button onClick={handleLoadGame}>载入游戏</Button>

          <Button onClick={handleSettings}>设置</Button>

          <Button onClick={handleReturnToHome} variant="danger">
            返回主菜单
          </Button>
        </div>
      </div>

      {/* Save Slots Modal */}
      {showSaveSlots && (
        <Modal title="保存游戏" onClose={() => setShowSaveSlots(false)}>
          <div className="save-slots">
            {saveSlots.map((save) => (
              <div
                key={save.slot}
                className={`save-slot ${save.exists ? "has-save" : "empty"}`}
                onClick={() => handleSaveToSlot(save.slot)}
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
                    <div className="overwrite-warning">点击覆盖存档</div>
                  </div>
                ) : (
                  <div className="empty-slot">
                    <span>点击保存到此槽位</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Load Slots Modal */}
      {showLoadSlots && (
        <Modal title="载入游戏" onClose={() => setShowLoadSlots(false)}>
          <div className="save-slots">
            {saveSlots
              .filter((save) => save.exists)
              .map((save) => (
                <div
                  key={save.slot}
                  className="save-slot has-save"
                  onClick={() => handleLoadFromSlot(save.slot)}
                >
                  <div className="slot-header">
                    <span className="slot-number">槽位 {save.slot}</span>
                    <span className="save-date">
                      {new Date(save.metadata.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="save-info">
                    <div className="player-name">
                      {save.metadata.playerName}
                    </div>
                    <div className="cultivation-info">
                      {save.metadata.realm} 第{save.metadata.stage}层
                    </div>
                    <div className="location">位置: {save.metadata.region}</div>
                  </div>
                </div>
              ))}

            {saveSlots.filter((save) => save.exists).length === 0 && (
              <div className="no-saves">
                <p>没有找到存档文件</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MainMenu;
