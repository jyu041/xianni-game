// frontend/src/components/game/DebugMenu.jsx
import { useState, useRef, useEffect } from "react";
import styles from "./DebugMenu.module.css";

const DebugMenu = ({
  isOpen,
  onClose,
  debugSettings,
  onDebugChange,
  onCastVfx,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [availableVfxEffects, setAvailableVfxEffects] = useState([]);
  const modalRef = useRef(null);

  // Load VFX effects when component mounts
  useEffect(() => {
    // Import VFX configs dynamically to avoid build issues
    import("./config/VfxConfigs.js")
      .then((module) => {
        const effects = module.getAllVfxConfigs();
        setAvailableVfxEffects(effects);

        // Set default selection if none exists
        if (!debugSettings.selectedVfxEffect && effects.length > 0) {
          onDebugChange("selectedVfxEffect", effects[0].key);
        }
      })
      .catch((error) => {
        console.warn("Could not load VFX configs:", error);
      });
  }, []);

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
    onDebugChange("soulCollectionRange", limitedValue);
  };

  const handleVfxScaleChange = (e) => {
    const value = parseFloat(e.target.value);
    onDebugChange("vfxScale", value);
  };

  const handleVfxRotationChange = (e) => {
    const value = parseFloat(e.target.value);
    onDebugChange("vfxRotation", value);
  };

  const handleVfxEffectChange = (e) => {
    onDebugChange("selectedVfxEffect", e.target.value);
  };

  const handleCastVfx = () => {
    if (debugSettings.selectedVfxEffect && onCastVfx) {
      const options = {
        scale: debugSettings.vfxScale || 1.0,
        rotation: debugSettings.vfxRotation || 0,
      };
      onCastVfx(debugSettings.selectedVfxEffect, options);
    }
  };

  // Group effects by category for better organization
  const groupedEffects = availableVfxEffects.reduce((groups, effect) => {
    const category = effect.category || "misc";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(effect);
    return groups;
  }, {});

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

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={debugSettings.showSoulCollectionRange ?? false}
                onChange={(e) => {
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
            <h4 className="game-text-large">VFX Effects</h4>

            <div className={styles.inputGroup}>
              <label className="game-text-small">Select Effect:</label>
              <select
                value={debugSettings.selectedVfxEffect || ""}
                onChange={handleVfxEffectChange}
                className={styles.vfxSelect}
              >
                <option value="">-- Select VFX Effect --</option>
                {Object.entries(groupedEffects).map(([category, effects]) => (
                  <optgroup key={category} label={category.toUpperCase()}>
                    {effects.map((effect) => (
                      <option key={effect.key} value={effect.key}>
                        {effect.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className={styles.sliderGroup}>
              <label className="game-text-small">
                VFX Scale: {(debugSettings.vfxScale || 1.0).toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={debugSettings.vfxScale || 1.0}
                onChange={handleVfxScaleChange}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span className="game-text-small">0.1x</span>
                <span className="game-text-small">3.0x</span>
              </div>
            </div>

            <div className={styles.sliderGroup}>
              <label className="game-text-small">
                VFX Rotation:{" "}
                {Math.round(((debugSettings.vfxRotation || 0) * 180) / Math.PI)}
                °
              </label>
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.1"
                value={debugSettings.vfxRotation || 0}
                onChange={handleVfxRotationChange}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span className="game-text-small">0°</span>
                <span className="game-text-small">360°</span>
              </div>
            </div>

            <button
              className={styles.castVfxButton}
              onClick={handleCastVfx}
              disabled={!debugSettings.selectedVfxEffect}
            >
              Cast VFX Effect
            </button>
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
              <span className="game-text-small">
                VFX Effects: {availableVfxEffects.length} loaded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugMenu;
