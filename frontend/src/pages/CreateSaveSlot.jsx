// frontend/src/pages/CreateSaveSlot.jsx
import { useState } from "react";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import elementService from "../services/elementService";
import playerService from "../services/playerService";
import styles from "./CreateSaveSlot.module.css";

const CreateSaveSlot = ({ onNavigate, onSaveCreated }) => {
  const [formData, setFormData] = useState({
    playerName: "",
    difficulty: "",
    cultivation: "",
    primaryElement: "fire", // Default to fire element
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const difficultyOptions = [
    { value: "easy", label: "简单 - 适合新手修仙者" },
    { value: "normal", label: "普通 - 平衡的修炼体验" },
    { value: "hard", label: "困难 - 挑战你的修仙意志" },
    { value: "nightmare", label: "噩梦 - 只有真正的仙者才能承受" },
  ];

  const cultivationOptions = [
    { value: "mortal", label: "凡人 - 刚踏上修仙之路" },
    { value: "talented", label: "天才 - 拥有修仙天赋" },
    { value: "prodigy", label: "奇才 - 万中无一的修仙奇才" },
    { value: "immortal", label: "仙体 - 天生的修仙体质" },
  ];

  const elementOptions = [
    {
      value: "fire",
      label: "火属性",
      description: "熔锋铸天命，烈炎炼道兵",
      color: "#DC2626",
      bonus: "攻击伤害提高 0-25%",
    },
    {
      value: "water",
      label: "水属性",
      description: "寒渊熄焚天，雨落烬成灰",
      color: "#0EA5E9",
      bonus: "灵气恢复速度提高 0-25%/秒",
    },
    {
      value: "earth",
      label: "土属性",
      description: "尘掩千江浪，沙葬深海怒",
      color: "#F59E0B",
      bonus: "受到伤害减少 0-25%",
    },
    {
      value: "metal",
      label: "金属性",
      description: "锋锐断生机，万刃摧古木",
      color: "#8B5CF6",
      bonus: "获得的游戏外部资源更多 0-100%",
    },
    {
      value: "wood",
      label: "木属性",
      description: "根须裂山岳，腐土化尘烟",
      color: "#22C55E",
      bonus: "每秒自动以已损失生命值进行生命恢复 0-25%",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.playerName.trim()) {
      setError("请输入修仙者名号");
      return;
    }

    if (!formData.difficulty) {
      setError("请选择修炼难度");
      return;
    }

    if (!formData.cultivation) {
      setError("请选择修仙天赋");
      return;
    }

    setIsCreating(true);

    try {
      const newPlayer = await playerService.createPlayer({
        playerName: formData.playerName.trim(),
        difficulty: formData.difficulty,
        cultivation: formData.cultivation,
        element: formData.primaryElement, // This will be mapped to primaryElement in backend
      });

      onSaveCreated(newPlayer);
    } catch (error) {
      console.error("Failed to create player:", error);
      setError("创建存档失败，请重试");
    } finally {
      setIsCreating(false);
    }
  };

  const getSelectedElementInfo = () => {
    return elementOptions.find((el) => el.value === formData.primaryElement);
  };

  return (
    <ResponsiveLayout className={styles.createSaveSlot}>
      <div className={styles.header}>
        <h1>创建新的修仙者</h1>
        <p>踏上你的修仙之路，选择你的修炼方式</p>
      </div>

      <div className={styles.content}>
        <Card variant="immortal" className={styles.formCard}>
          <h2>修仙者信息</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="playerName">修仙者名号</label>
              <Input
                id="playerName"
                type="text"
                value={formData.playerName}
                onChange={(e) =>
                  handleInputChange("playerName", e.target.value)
                }
                placeholder="输入你的修仙者名号"
                className={styles.nameInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="primaryElement">主要属性</label>
              <div className={styles.elementSelection}>
                {elementOptions.map((element) => (
                  <div
                    key={element.value}
                    className={`${styles.elementCard} ${
                      formData.primaryElement === element.value
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() =>
                      handleInputChange("primaryElement", element.value)
                    }
                    style={{
                      borderColor:
                        formData.primaryElement === element.value
                          ? element.color
                          : "rgba(255,255,255,0.2)",
                    }}
                  >
                    <div
                      className={styles.elementIcon}
                      style={{ backgroundColor: element.color }}
                    >
                      {elementService.getElementName(element.value)}
                    </div>
                    <div className={styles.elementInfo}>
                      <div
                        className={styles.elementName}
                        style={{ color: element.color }}
                      >
                        {element.label}
                      </div>
                      <div className={styles.elementDescription}>
                        {element.description}
                      </div>
                      <div className={styles.elementBonus}>{element.bonus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="difficulty">修炼难度</label>
                <Select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(value) => handleInputChange("difficulty", value)}
                  options={difficultyOptions}
                  placeholder="选择修炼难度"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cultivation">修仙天赋</label>
                <Select
                  id="cultivation"
                  value={formData.cultivation}
                  onChange={(value) => handleInputChange("cultivation", value)}
                  options={cultivationOptions}
                  placeholder="选择修仙天赋"
                />
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onNavigate("home")}
                disabled={isCreating}
              >
                返回
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isCreating}
                className={styles.createButton}
              >
                {isCreating ? "创建中..." : "开始修仙之路"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Element Information Panel */}
        {formData.primaryElement && (
          <Card variant="dark" className={styles.elementInfoCard}>
            <h3>选中属性详情</h3>
            {(() => {
              const selectedElement = getSelectedElementInfo();
              return (
                <div className={styles.selectedElementInfo}>
                  <div
                    className={styles.bigElementIcon}
                    style={{ backgroundColor: selectedElement.color }}
                  >
                    {elementService.getElementName(selectedElement.value)}
                  </div>
                  <div className={styles.elementDetails}>
                    <h4 style={{ color: selectedElement.color }}>
                      {selectedElement.label}
                    </h4>
                    <p className={styles.elementDesc}>
                      "{selectedElement.description}"
                    </p>
                    <div className={styles.bonusInfo}>
                      <strong>属性效果:</strong>
                      <p>{selectedElement.bonus}</p>
                    </div>
                    <div className={styles.elementNote}>
                      <p>
                        <strong>注意:</strong>{" "}
                        主要属性将获得更多经验，其他属性获得的经验为主要属性的20%。
                        你可以在游戏中随时更改主要属性。
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Card>
        )}

        {/* Tianni Sword Information */}
        <Card variant="primary" className={styles.tianniSwordCard}>
          <h3>天逆剑</h3>
          <div className={styles.swordLore}>
            <div className={styles.swordIcon}>⚔️</div>
            <div className={styles.swordDescription}>
              <p className={styles.swordQuote}>
                "一剑出，时流滞，五行寂灭；
                <br />
                再剑落，天机断，轮回逆生。
                <br />
                ——此剑，为悖逆之道。"
              </p>
              <div className={styles.swordFeatures}>
                <h4>天逆剑特性:</h4>
                <ul>
                  <li>根据你的主要属性发射对应颜色的剑气</li>
                  <li>可升级至10级，每级解锁新的技能</li>
                  <li>达到10级后可解锁终极形态"五行寂灭"</li>
                  <li>终极形态需要完成"大元素使"成就</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default CreateSaveSlot;
