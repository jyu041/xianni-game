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

  if (!isOpen) return null;

  return (
    <div className={styles.debugOverlay}>
      <div
        ref={modalRef}
        className={styles.debugModal}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.debugHeader}>
          <h3>Debug Menu</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.debugContent}>
          <div className={styles.debugSection}>
            <h4>Display Options</h4>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={debugSettings.showPlayerAttackRange}
                onChange={(e) =>
                  onDebugChange("showPlayerAttackRange", e.target.checked)
                }
              />
              Show Player Attack Range
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={debugSettings.showEnemyAttackRanges}
                onChange={(e) =>
                  onDebugChange("showEnemyAttackRanges", e.target.checked)
                }
              />
              Show Enemy Attack Ranges
            </label>
          </div>

          <div className={styles.debugSection}>
            <h4>Player Settings</h4>

            <div className={styles.inputGroup}>
              <label>Attack Speed (ms):</label>
              <input
                type="number"
                min="100"
                max="2000"
                step="50"
                value={debugSettings.playerAttackSpeed}
                onChange={(e) =>
                  onDebugChange("playerAttackSpeed", parseInt(e.target.value))
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Attack Range:</label>
              <input
                type="number"
                min="50"
                max="300"
                step="10"
                value={debugSettings.playerAttackRange}
                onChange={(e) =>
                  onDebugChange("playerAttackRange", parseInt(e.target.value))
                }
              />
            </div>
          </div>

          <div className={styles.debugSection}>
            <h4>Game Stats</h4>
            <div className={styles.statDisplay}>
              <span>Active Enemies: {debugSettings.activeEnemies}</span>
              <span>Player Health: {debugSettings.playerHealth}</span>
              <span>魂魄: {debugSettings.soulCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugMenu;
