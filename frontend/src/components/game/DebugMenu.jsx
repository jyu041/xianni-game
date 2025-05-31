// frontend/src/components/game/DebugMenu.jsx
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
    // Ensure minimum attack speed of 50ms
    const limitedValue = Math.max(50, value);
    onDebugChange("playerAttackSpeed", limitedValue);
  };

  if (!isOpen) return null;

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
          </div>

          <div className={styles.debugSection}>
            <h4 className="game-text-large">Player Settings</h4>

            <div className={styles.inputGroup}>
              <label className="game-text-small">Attack Speed (ms):</label>
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={debugSettings.playerAttackSpeed}
                onChange={handleAttackSpeedChange}
                className="game-text-small"
              />
              <small
                className="game-text-small"
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  marginTop: "0.25rem",
                }}
              >
                Minimum: 50ms
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label className="game-text-small">Attack Range:</label>
              <input
                type="number"
                min="50"
                max="300"
                step="10"
                value={debugSettings.playerAttackRange}
                onChange={(e) =>
                  onDebugChange("playerAttackRange", parseInt(e.target.value))
                }
                className="game-text-small"
              />
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
