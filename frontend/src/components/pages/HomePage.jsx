import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import SaveSlotList from "../game/SaveSlotList";
import styles from "./HomePage.module.css";

const HomePage = ({ onNavigate }) => {
  const [saveSlots, setSaveSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaveSlots();
  }, []);

  const loadSaveSlots = async () => {
    try {
      // API call to backend to get save slots
      const response = await fetch("/api/saves");
      if (response.ok) {
        const saves = await response.json();
        setSaveSlots(saves);
      }
    } catch (error) {
      console.error("Failed to load save slots:", error);
      // For now, use mock data
      setSaveSlots([
        {
          id: 1,
          playerName: "逆天修士",
          level: 15,
          cultivation: "筑基期",
          lastPlayed: "2024-01-20T10:30:00Z",
          playtime: 7200,
        },
        {
          id: 2,
          playerName: "仙道至尊",
          level: 8,
          cultivation: "练气期",
          lastPlayed: "2024-01-19T14:20:00Z",
          playtime: 3600,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueGame = (saveData) => {
    onNavigate("gameHome");
  };

  const handleDeleteSave = async (saveId) => {
    try {
      const response = await fetch(`/api/saves/${saveId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSaveSlots((prev) => prev.filter((save) => save.id !== saveId));
      }
    } catch (error) {
      console.error("Failed to delete save:", error);
    }
  };

  return (
    <div className={styles.homePage}>
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
    </div>
  );
};

export default HomePage;
