// frontend/src/components/pages/HomePage.jsx
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import SaveSlotList from "../game/SaveSlotList";
import ResponsiveLayout from "../layout/ResponsiveLayout";
import playerService from "../services/playerService";
import styles from "./HomePage.module.css";

const HomePage = ({ onNavigate }) => {
  const [saveSlots, setSaveSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaveSlots();
  }, []);

  const loadSaveSlots = async () => {
    try {
      setLoading(true);
      const saves = await playerService.getAllPlayers();
      setSaveSlots(saves);
    } catch (error) {
      console.error("Failed to load save slots:", error);
      setSaveSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueGame = (saveData) => {
    onNavigate("gameHome", saveData);
  };

  const handleDeleteSave = async (saveId) => {
    try {
      await playerService.deletePlayer(saveId);
      setSaveSlots((prev) => prev.filter((save) => save.id !== saveId));
    } catch (error) {
      console.error("Failed to delete save:", error);
      alert("删除存档失败");
    }
  };

  return (
    <ResponsiveLayout className={styles.homePage}>
      <div className={styles.background}>
        <div className={styles.celestialElements}>
          <div className={styles.star}></div>
          <div className={styles.star}></div>
          <div className={styles.star}></div>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>
          <h1 className={styles.gameTitle}>仙逆：逆天改命</h1>
          <p className={styles.subtitle}>踏上修仙之路，逆天而行</p>
        </div>

        <Card className={styles.mainCard}>
          <div className={styles.mainMenu}>
            <Button
              variant="primary"
              size="large"
              onClick={() => onNavigate("createSave")}
              className={styles.newGameButton}
            >
              开始新游戏
            </Button>

            {saveSlots.length > 0 && (
              <div className={styles.saveSection}>
                <h3 className={styles.sectionTitle}>继续游戏</h3>
                <SaveSlotList
                  saves={saveSlots}
                  onContinue={handleContinueGame}
                  onDelete={handleDeleteSave}
                  loading={loading}
                />
              </div>
            )}

            <div className={styles.otherOptions}>
              <Button
                variant="secondary"
                onClick={() => alert("设置功能开发中...")}
              >
                游戏设置
              </Button>

              <Button
                variant="secondary"
                onClick={() => alert("关于游戏功能开发中...")}
              >
                关于游戏
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default HomePage;
