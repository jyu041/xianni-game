// frontend/src/components/game/SaveSlotList.jsx
import Button from "../ui/Button";
import Card from "../ui/Card";
import styles from "./SaveSlotList.module.css";

const SaveSlotList = ({ saves, onContinue, onDelete, loading }) => {
  const formatPlaytime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时${minutes}分钟`;
  };

  const formatLastPlayed = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString("zh-CN");
  };

  const getCultivationLevel = (level) => {
    if (level <= 10) return { name: "练气期", color: "#8fbc8f" };
    if (level <= 20) return { name: "筑基期", color: "#4682b4" };
    if (level <= 30) return { name: "金丹期", color: "#daa520" };
    if (level <= 40) return { name: "元婴期", color: "#9370db" };
    if (level <= 50) return { name: "化神期", color: "#ff6347" };
    if (level <= 60) return { name: "炼虚期", color: "#ff1493" };
    if (level <= 70) return { name: "合体期", color: "#00ced1" };
    if (level <= 80) return { name: "大乘期", color: "#ffd700" };
    return { name: "渡劫期", color: "#ff4500" };
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>加载存档中...</p>
      </div>
    );
  }

  return (
    <div className={styles.saveSlotList}>
      {saves.map((save) => {
        const cultivation = getCultivationLevel(save.level || 1);

        return (
          <Card key={save.id} className={styles.saveSlot}>
            <div className={styles.saveInfo}>
              <div className={styles.avatar}>
                <div className={styles.avatarIcon}>仙</div>
                <div className={styles.levelBadge}>Lv.{save.level || 1}</div>
              </div>

              <div className={styles.details}>
                <h4 className={styles.playerName}>{save.playerName}</h4>
                <p
                  className={styles.cultivation}
                  style={{ color: cultivation.color }}
                >
                  {cultivation.name}
                </p>
                <div className={styles.stats}>
                  <span className={styles.stat}>
                    <strong>游戏时长:</strong>{" "}
                    {formatPlaytime(save.playtime || 0)}
                  </span>
                  <span className={styles.stat}>
                    <strong>最后游戏:</strong>{" "}
                    {formatLastPlayed(save.lastPlayed)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                variant="primary"
                onClick={() => onContinue(save)}
                className={styles.continueButton}
              >
                继续游戏
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => {
                  if (
                    window.confirm(
                      `确定要删除存档 "${save.playerName}" 吗？此操作不可撤销。`
                    )
                  ) {
                    onDelete(save.id);
                  }
                }}
                className={styles.deleteButton}
              >
                删除
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SaveSlotList;
