// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import playerService from "../services/playerService";
import elementService from "../services/elementService";
import styles from "./HomePage.module.css";

const HomePage = ({ onNavigate }) => {
  const [saves, setSaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSaves();
  }, []);

  const loadSaves = async () => {
    try {
      setIsLoading(true);
      const playerSaves = await playerService.getAllPlayers();
      setSaves(playerSaves || []);
    } catch (error) {
      console.error("Failed to load saves:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSave = (save) => {
    onNavigate("gameHome", save);
  };

  const handleDeleteSave = async (saveId, e) => {
    e.stopPropagation();

    if (window.confirm("确定要删除这个存档吗？此操作无法撤销。")) {
      try {
        await playerService.deletePlayer(saveId);
        await loadSaves();
      } catch (error) {
        console.error("Failed to delete save:", error);
        alert("删除存档失败，请重试。");
      }
    }
  };

  const formatPlaytime = (seconds) => {
    if (!seconds) return "0分钟";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
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

  return (
    <ResponsiveLayout className={styles.homePage}>
      <div className={styles.header}>
        <h1>仙逆修炼系统</h1>
        <p>踏上逆天修仙之路，掌控五行之力</p>
      </div>

      <div className={styles.content}>
        {/* Game Introduction */}
        <div className={styles.gameIntro}>
          <Card variant="immortal" className={styles.introCard}>
            <h2>五行修炼体系</h2>
            <div className={styles.elementSystem}>
              <div className={styles.elementGrid}>
                <div
                  className={styles.elementItem}
                  style={{ color: "#DC2626" }}
                >
                  <span className={styles.elementIcon}>🔥</span>
                  <div>
                    <strong>火属性</strong>
                    <p>攻击伤害提高</p>
                  </div>
                </div>
                <div
                  className={styles.elementItem}
                  style={{ color: "#0EA5E9" }}
                >
                  <span className={styles.elementIcon}>💧</span>
                  <div>
                    <strong>水属性</strong>
                    <p>灵气恢复加速</p>
                  </div>
                </div>
                <div
                  className={styles.elementItem}
                  style={{ color: "#F59E0B" }}
                >
                  <span className={styles.elementIcon}>🏔️</span>
                  <div>
                    <strong>土属性</strong>
                    <p>受到伤害减少</p>
                  </div>
                </div>
                <div
                  className={styles.elementItem}
                  style={{ color: "#8B5CF6" }}
                >
                  <span className={styles.elementIcon}>⚔️</span>
                  <div>
                    <strong>金属性</strong>
                    <p>获得资源增加</p>
                  </div>
                </div>
                <div
                  className={styles.elementItem}
                  style={{ color: "#22C55E" }}
                >
                  <span className={styles.elementIcon}>🌿</span>
                  <div>
                    <strong>木属性</strong>
                    <p>生命值自动恢复</p>
                  </div>
                </div>
              </div>

              <div className={styles.tianniSwordInfo}>
                <h3>天逆剑系统</h3>
                <div className={styles.swordFeatures}>
                  <div className={styles.feature}>
                    <span>⚔️</span>
                    <p>随属性变化的剑气颜色</p>
                  </div>
                  <div className={styles.feature}>
                    <span>⬆️</span>
                    <p>10级升级系统</p>
                  </div>
                  <div className={styles.feature}>
                    <span>🌟</span>
                    <p>终极形态"五行寂灭"</p>
                  </div>
                  <div className={styles.feature}>
                    <span>🎯</span>
                    <p>按1-5键使用法宝技能</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Save Slots */}
        <div className={styles.saveSection}>
          <div className={styles.saveHeader}>
            <h2>选择存档</h2>
            <Button
              variant="primary"
              onClick={() => onNavigate("createSave")}
              className={styles.createButton}
            >
              创建新存档
            </Button>
          </div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner} />
              <p>加载存档中...</p>
            </div>
          ) : saves.length === 0 ? (
            <Card variant="dark" className={styles.emptyState}>
              <h3>暂无存档</h3>
              <p>创建你的第一个修仙者，开始修炼之路</p>
              <Button
                variant="primary"
                onClick={() => onNavigate("createSave")}
                className={styles.startButton}
              >
                开始修仙
              </Button>
            </Card>
          ) : (
            <div className={styles.saveGrid}>
              {saves.map((save) => {
                const cultivation = getCultivationLevel(save.level);
                const primaryElement = save.primaryElement || "fire";
                const elementColor =
                  elementService.getElementColor(primaryElement);
                const elementName =
                  elementService.getElementName(primaryElement);

                return (
                  <Card
                    key={save.id}
                    variant="dark"
                    className={styles.saveCard}
                    onClick={() => handleSelectSave(save)}
                  >
                    <div className={styles.saveHeader}>
                      <div className={styles.playerInfo}>
                        <div className={styles.avatar}>
                          <span className={styles.avatarIcon}>仙</span>
                          <div className={styles.levelBadge}>{save.level}</div>
                        </div>
                        <div className={styles.playerDetails}>
                          <h3 className={styles.playerName}>
                            {save.playerName}
                          </h3>
                          <div
                            className={styles.cultivation}
                            style={{ color: cultivation.color }}
                          >
                            {cultivation.name}
                          </div>
                          <div
                            className={styles.element}
                            style={{ color: elementColor }}
                          >
                            {elementName}属性 Lv.
                            {save.elementLevels?.[primaryElement] || 0}
                          </div>
                        </div>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDeleteSave(save.id, e)}
                        title="删除存档"
                      >
                        ×
                      </button>
                    </div>

                    <div className={styles.saveStats}>
                      <div className={styles.statGroup}>
                        <div className={styles.stat}>
                          <span className={styles.statLabel}>经验:</span>
                          <span className={styles.statValue}>
                            {save.experience || 0}
                          </span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statLabel}>金币:</span>
                          <span className={styles.statValue}>
                            {save.gold || 0}
                          </span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statLabel}>当前关卡:</span>
                          <span className={styles.statValue}>
                            {save.currentStage || 1}
                          </span>
                        </div>
                      </div>

                      <div className={styles.tianniSwordStatus}>
                        <div className={styles.swordInfo}>
                          <span className={styles.swordIcon}>⚔️</span>
                          <span className={styles.swordLevel}>
                            天逆剑 Lv.{save.tianniSwordLevel || 1}
                            {save.hasTianniSwordMutation && (
                              <span className={styles.mutationBadge}>★</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.saveFooter}>
                      <div className={styles.playTime}>
                        游戏时间: {formatPlaytime(save.totalPlaytimeSeconds)}
                      </div>
                      <div className={styles.lastPlayed}>
                        最后游戏:{" "}
                        {save.lastPlayed
                          ? new Date(save.lastPlayed).toLocaleDateString(
                              "zh-CN"
                            )
                          : "从未"}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Game Controls Info */}
        <Card variant="dark" className={styles.controlsCard}>
          <h3>游戏操作</h3>
          <div className={styles.controlsGrid}>
            <div className={styles.controlGroup}>
              <h4>移动控制</h4>
              <div className={styles.controls}>
                <div className={styles.control}>
                  <span className={styles.key}>WASD</span>
                  <span>移动角色</span>
                </div>
                <div className={styles.control}>
                  <span className={styles.key}>方向键</span>
                  <span>移动角色</span>
                </div>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <h4>法宝技能</h4>
              <div className={styles.controls}>
                <div className={styles.control}>
                  <span className={styles.key}>1-5</span>
                  <span>使用法宝技能</span>
                </div>
                <div className={styles.control}>
                  <span className={styles.key}>空格</span>
                  <span>天逆剑特殊技能</span>
                </div>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <h4>功法技能</h4>
              <div className={styles.controls}>
                <div className={styles.control}>
                  <span className={styles.key}>6-9,0</span>
                  <span>使用功法技能</span>
                </div>
                <div className={styles.control}>
                  <span className={styles.key}>ESC</span>
                  <span>暂停游戏</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default HomePage;
