// frontend/src/components/saves/SaveSlotModal.jsx
import { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import elementService from "../../services/elementService";
import styles from "./SaveSlotModal.module.css";

const SaveSlotModal = ({
  isOpen,
  onClose,
  saves,
  onSelectSave,
  onDeleteSave,
}) => {
  const [selectedSave, setSelectedSave] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (!isOpen) return null;

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

  const handleDeleteClick = (save, e) => {
    e.stopPropagation();
    setConfirmDelete(save.id);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      onDeleteSave(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const formatPlaytime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>选择存档</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.savesList}>
          {saves.length === 0 ? (
            <div className={styles.noSaves}>
              <p>暂无存档</p>
              <p>请先创建角色开始游戏</p>
            </div>
          ) : (
            saves.map((save) => {
              const cultivation = getCultivationLevel(save.level);
              const primaryElement = save.primaryElement || "fire";

              return (
                <Card
                  key={save.id}
                  variant="default"
                  className={`${styles.saveCard} ${
                    selectedSave === save.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedSave(save.id)}
                >
                  <div className={styles.saveInfo}>
                    <div className={styles.saveHeader}>
                      <div className={styles.playerInfo}>
                        <h3 className={styles.playerName}>{save.playerName}</h3>
                        <div
                          className={styles.cultivation}
                          style={{ color: cultivation.color }}
                        >
                          {cultivation.name}
                        </div>
                      </div>
                      <div className={styles.levelBadge}>Lv.{save.level}</div>
                    </div>

                    <div className={styles.saveStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>主要属性:</span>
                        <span
                          className={styles.statValue}
                          style={{
                            color:
                              elementService.getElementColor(primaryElement),
                          }}
                        >
                          {elementService.getElementName(primaryElement)}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>天逆剑:</span>
                        <span className={styles.statValue}>
                          Lv.{save.tianniSwordLevel || 1}
                          {save.hasTianniSwordMutation && " ★"}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>游戏时长:</span>
                        <span className={styles.statValue}>
                          {formatPlaytime(save.totalPlaytimeSeconds || 0)}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>最后游戏:</span>
                        <span className={styles.statValue}>
                          {new Date(save.lastPlayed).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.saveActions}>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={(e) => handleDeleteClick(save, e)}
                    >
                      删除
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          {selectedSave && (
            <Button
              variant="primary"
              onClick={() => {
                const save = saves.find((s) => s.id === selectedSave);
                if (save) onSelectSave(save);
              }}
            >
              加载存档
            </Button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className={styles.confirmOverlay}>
            <Card variant="dark" className={styles.confirmModal}>
              <h3>确认删除</h3>
              <p>确定要删除这个存档吗？此操作无法撤销。</p>
              <div className={styles.confirmActions}>
                <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                  取消
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                  确认删除
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveSlotModal;
