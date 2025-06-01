// frontend/src/pages/CreateSaveSlot.jsx
import { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import elementService from "../services/elementService";
import playerService from "../services/playerService";
import styles from "./CreateSaveSlot.module.css";

const CreateSaveSlot = ({ onNavigate, onSaveCreated }) => {
  const [playerName, setPlayerName] = useState("");
  const [selectedElement, setSelectedElement] = useState("fire");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const elements = [
    { value: "fire", label: "火属性 - 熔锋铸天命，烈炎炼道兵" },
    { value: "water", label: "水属性 - 寒渊熄焚天，雨落烬成灰" },
    { value: "earth", label: "土属性 - 尘掩千江浪，沙葬深海怒" },
    { value: "wood", label: "木属性 - 根须裂山岳，腐土化尘烟" },
    { value: "metal", label: "金属性 - 锋锐断生机，万刃摧古木" },
  ];

  const handleCreateSave = async () => {
    if (!playerName.trim()) {
      setError("请输入角色名称");
      return;
    }

    if (playerName.trim().length < 2) {
      setError("角色名称至少需要2个字符");
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      const playerData = {
        playerName: playerName.trim(),
        element: selectedElement,
      };

      const newPlayer = await playerService.createPlayer(playerData);
      onSaveCreated(newPlayer);
    } catch (error) {
      console.error("Failed to create save:", error);
      setError("创建角色失败，请重试");
    } finally {
      setIsCreating(false);
    }
  };

  const getElementInfo = (element) => {
    return {
      name: elementService.getElementName(element),
      color: elementService.getElementColor(element),
      description:
        elements.find((e) => e.value === element)?.label.split(" - ")[1] || "",
    };
  };

  const selectedElementInfo = getElementInfo(selectedElement);

  return (
    <ResponsiveLayout className={styles.createSave}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className={styles.backButton}
          >
            ← 返回主页
          </Button>
          <h1 className={styles.title}>创建修仙者</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.leftSection}>
            <Card variant="immortal" className={styles.formCard}>
              <h2>角色信息</h2>

              <div className={styles.formGroup}>
                <label>角色名称</label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="输入你的道号..."
                  maxLength={20}
                  className={styles.nameInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>主要属性</label>
                <Select
                  value={selectedElement}
                  onChange={setSelectedElement}
                  options={elements}
                  className={styles.elementSelect}
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <Button
                variant="primary"
                size="large"
                onClick={handleCreateSave}
                disabled={isCreating || !playerName.trim()}
                className={styles.createButton}
              >
                {isCreating ? "创建中..." : "开始修仙之旅"}
              </Button>
            </Card>
          </div>

          <div className={styles.rightSection}>
            <Card variant="glass" className={styles.detailsCard}>
              <h3>选中属性详情</h3>
              <div className={styles.elementDetails}>
                <div
                  className={styles.elementIcon}
                  style={{ backgroundColor: selectedElementInfo.color }}
                >
                  {selectedElementInfo.name}
                </div>
                <div className={styles.elementInfo}>
                  <h4 style={{ color: selectedElementInfo.color }}>
                    {selectedElementInfo.name}属性
                  </h4>
                  <p className={styles.elementDescription}>
                    {selectedElementInfo.description}
                  </p>
                </div>
              </div>

              <div className={styles.passiveEffects}>
                <h4>属性效果 (满级)</h4>
                <div className={styles.effectsList}>
                  {selectedElement === "fire" && (
                    <div className={styles.effect}>
                      <span className={styles.effectName}>攻击伤害</span>
                      <span className={styles.effectValue}>+25%</span>
                    </div>
                  )}
                  {selectedElement === "water" && (
                    <div className={styles.effect}>
                      <span className={styles.effectName}>灵气恢复</span>
                      <span className={styles.effectValue}>+25%/秒</span>
                    </div>
                  )}
                  {selectedElement === "earth" && (
                    <div className={styles.effect}>
                      <span className={styles.effectName}>伤害减免</span>
                      <span className={styles.effectValue}>-25%</span>
                    </div>
                  )}
                  {selectedElement === "wood" && (
                    <div className={styles.effect}>
                      <span className={styles.effectName}>生命恢复</span>
                      <span className={styles.effectValue}>25%/秒</span>
                    </div>
                  )}
                  {selectedElement === "metal" && (
                    <div className={styles.effect}>
                      <span className={styles.effectName}>资源获取</span>
                      <span className={styles.effectValue}>+100%</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card variant="primary" className={styles.swordCard}>
              <h3>天逆剑</h3>
              <div className={styles.swordInfo}>
                <div className={styles.swordIcon}>⚔️</div>
                <div className={styles.swordDetails}>
                  <h4>天逆剑·初形</h4>
                  <p>等级 1/10</p>
                  <p className={styles.swordDescription}>
                    "一剑出，时流滞，五行寂灭； 再剑落，天机断，轮回逆生。
                    ——此剑，为悖逆之道。"
                  </p>
                  <div className={styles.swordElement}>
                    <span>剑气属性: </span>
                    <span style={{ color: selectedElementInfo.color }}>
                      {selectedElementInfo.name}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default CreateSaveSlot;
