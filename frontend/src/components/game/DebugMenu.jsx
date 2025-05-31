// src/components/game/DebugMenu.jsx
import { useState, useRef, useEffect } from "react";
import styles from "./DebugMenu.module.css";

const DebugMenu = ({ isOpen, onClose, debugSettings, onDebugChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest(`.${styles.debugContent}`)) return;

    setIsDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !modalRef.current) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    modalRef.current.style.left = `${Math.max(
      0,
      Math.min(window.innerWidth - 400, newX)
    )}px`;
    modalRef.current.style.top = `${Math.max(
      0,
      Math.min(window.innerHeight - 300, newY)
    )}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleAttackSpeedChange = (e) => {
    const value = parseInt(e.target.value);
    const limitedValue = Math.max(50, value);
    onDebugChange("playerAttackSpeed", limitedValue);
  };

  const handleAttackRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const limitedValue = Math.max(1, value);
    onDebugChange("playerAttackRange", limitedValue);
  };

  const handleSoulRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const limitedValue = Math.max(1, value);
    console.log("Soul range change:", limitedValue);
    onDebugChange("soulCollectionRange", limitedValue);
  };

  if (!isOpen) return null;

  console.log("Debug menu rendering with settings:", debugSettings);

  return (
    <div className={styles.debugOverlay}>
      <div
        ref={modalRef}
        className={styles.debugModal}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.debugHeader}>
          <h3 className="game-text-large">Debug Menu</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.debugContent}>
          <div className={styles.debugSection}>
            <h4 className="game-text-large">Display Options</h4>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={debugSettings.showPlayerAttackRange}
                onChange={(e) =>
                  onDebugChange("showPlayerAttackRange", e.target.checked)
                }
              />
              <span className="game-text-small">Show Player Attack Range</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={debugSettings.showEnemyAttackRanges}
                onChange={(e) =>
                  onDebugChange("showEnemyAttackRanges", e.target.checked)
                }
              />
              <span className="game-text-small">Show Enemy Attack Ranges</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={debugSettings.showSoulCollectionRange ?? false}
                onChange={(e) => {
                  console.log(
                    "Soul collection range visibility change:",
                    e.target.checked
                  );
                  onDebugChange("showSoulCollectionRange", e.target.checked);
                }}
              />
              <span className="game-text-small">
                Show Soul Collection Range
              </span>
            </label>
          </div>

          <div className={styles.debugSection}>
            <h4 className="game-text-large">Player Settings</h4>

            <div className={styles.sliderGroup}>
              <label className="game-text-small">
                Attack Speed: {debugSettings.playerAttackSpeed}ms
              </label>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={debugSettings.playerAttackSpeed}
                onChange={handleAttackSpeedChange}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span className="game-text-small">50ms</span>
                <span className="game-text-small">5000ms</span>
              </div>
            </div>

            <div className={styles.sliderGroup}>
              <label className="game-text-small">
                Attack Range: {debugSettings.playerAttackRange}px
              </label>
              <input
                type="range"
                min="1"
                max="2000"
                step="10"
                value={debugSettings.playerAttackRange}
                onChange={handleAttackRangeChange}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span className="game-text-small">1px</span>
                <span className="game-text-small">2000px</span>
              </div>
            </div>

            <div className={styles.sliderGroup}>
              <label className="game-text-small">
                Soul Collection Range: {debugSettings.soulCollectionRange ?? 50}
                px
              </label>
              <input
                type="range"
                min="1"
                max="2000"
                step="5"
                value={debugSettings.soulCollectionRange ?? 50}
                onChange={handleSoulRangeChange}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span className="game-text-small">1px</span>
                <span className="game-text-small">2000px</span>
              </div>
            </div>
          </div>

          <div className={styles.debugSection}>
            <h4 className="game-text-large">Game Stats</h4>
            <div className={styles.statDisplay}>
              <span className="game-text-small">
                Active Enemies: {debugSettings.activeEnemies}
              </span>
              <span className="game-text-small">
                Player Health: {debugSettings.playerHealth}
              </span>
              <span className="game-text-small">
                魂魄: {debugSettings.soulCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugMenu;
