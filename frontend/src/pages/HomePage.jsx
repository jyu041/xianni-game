// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import playerService from "../services/playerService";
import SaveSlotModal from "../components/saves/SaveSlotModal";
import GameControlsModal from "../components/modals/GameControlsModal";
import styles from "./HomePage.module.css";

const HomePage = ({ onNavigate }) => {
  const [saves, setSaves] = useState([]);
  const [latestSave, setLatestSave] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaves();
  }, []);

  const loadSaves = async () => {
    try {
      setLoading(true);
      const playerSaves = await playerService.getAllPlayers();
      setSaves(playerSaves);

      // Find the most recently played save
      if (playerSaves.length > 0) {
        const mostRecent = playerSaves.reduce((latest, current) => {
          return new Date(current.lastPlayed) > new Date(latest.lastPlayed)
            ? current
            : latest;
        });
        setLatestSave(mostRecent);
      }
    } catch (error) {
      console.error("Failed to load saves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayNow = () => {
    if (latestSave) {
      // Play with latest save
      onNavigate("gameHome", latestSave);
    } else {
      // No saves found, create character
      onNavigate("createSave");
    }
  };

  const handleLoadSave = () => {
    setShowSaveModal(true);
  };

  const handleSaveSelect = (save) => {
    setShowSaveModal(false);
    onNavigate("gameHome", save);
  };

  const handleDeleteSave = async (saveId) => {
    try {
      await playerService.deletePlayer(saveId);
      await loadSaves(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete save:", error);
    }
  };

  return (
    <ResponsiveLayout className={styles.homePage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>仙逆：逆天改命</h1>
          <p className={styles.subtitle}>踏上逆天仙途，掌控五行之力</p>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <Card variant="immortal" className={styles.mainCard}>
            <div className={styles.gameInfo}>
              <div className={styles.gameDescription}>
                <h2>修仙之路</h2>
                <p>
                  在这个充满危险的修仙世界中，你将扮演一位逆天修士，
                  掌握五行之力，斩杀无数妖魔，最终逆天改命！
                </p>

                {latestSave && (
                  <div className={styles.latestSaveInfo}>
                    <h3>最近存档</h3>
                    <div className={styles.savePreview}>
                      <span className={styles.saveName}>
                        {latestSave.playerName}
                      </span>
                      <span className={styles.saveLevel}>
                        等级 {latestSave.level}
                      </span>
                      <span className={styles.saveTime}>
                        {new Date(latestSave.lastPlayed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.actionButtons}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handlePlayNow}
                  className={styles.playButton}
                  disabled={loading}
                >
                  {latestSave ? "继续修炼" : "开始修炼"}
                </Button>

                <div className={styles.secondaryButtons}>
                  <Button
                    variant="secondary"
                    onClick={handleLoadSave}
                    disabled={loading}
                  >
                    加载存档
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => onNavigate("createSave")}
                  >
                    创建角色
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setShowControlsModal(true)}
                  >
                    游戏控制
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Game Stats (if latest save exists) */}
          {latestSave && (
            <div className={styles.gameStats}>
              <Card variant="glass" className={styles.statCard}>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>⚔️</span>
                  <span className={styles.statLabel}>天逆剑</span>
                  <span className={styles.statValue}>
                    Lv.{latestSave.tianniSwordLevel || 1}
                    {latestSave.hasTianniSwordMutation && " ★"}
                  </span>
                </div>
              </Card>

              <Card variant="glass" className={styles.statCard}>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>🔮</span>
                  <span className={styles.statLabel}>魂魄</span>
                  <span className={styles.statValue}>
                    {latestSave.soulCount || 0}
                  </span>
                </div>
              </Card>

              <Card variant="glass" className={styles.statCard}>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>⏱️</span>
                  <span className={styles.statLabel}>游戏时长</span>
                  <span className={styles.statValue}>
                    {Math.floor((latestSave.totalPlaytimeSeconds || 0) / 60)}
                    分钟
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.version}>Version 1.0.0</p>
        </div>
      </div>

      {/* Modals */}
      <SaveSlotModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        saves={saves}
        onSelectSave={handleSaveSelect}
        onDeleteSave={handleDeleteSave}
      />

      <GameControlsModal
        isOpen={showControlsModal}
        onClose={() => setShowControlsModal(false)}
      />
    </ResponsiveLayout>
  );
};

export default HomePage;
