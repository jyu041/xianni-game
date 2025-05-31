// src/pages/CreateSaveSlot.jsx
import { useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import playerService from "../services/playerService";
import styles from "./CreateSaveSlot.module.css";

const CreateSaveSlot = ({ onNavigate, onSaveCreated }) => {
  const [formData, setFormData] = useState({
    playerName: "",
    difficulty: "normal",
    cultivation: "mortal",
    element: "none",
  });
  const [isCreating, setIsCreating] = useState(false);

  const difficulties = [
    { value: "easy", label: "简单 - 适合新手修士" },
    { value: "normal", label: "正常 - 平衡的修仙体验" },
    { value: "hard", label: "困难 - 真正的逆天之路" },
    { value: "nightmare", label: "噩梦 - 九死一生" },
  ];

  const cultivationBackgrounds = [
    { value: "mortal", label: "凡人 - 从零开始" },
    { value: "talented", label: "天才 - 修炼天赋异禀" },
    { value: "noble", label: "世家子弟 - 资源丰富" },
    { value: "outcast", label: "散修 - 孤身一人但意志坚定" },
  ];

  const elementalAffinities = [
    { value: "none", label: "无属性 - 平衡发展" },
    { value: "fire", label: "火系 - 攻击力强" },
    { value: "water", label: "水系 - 恢复能力强" },
    { value: "earth", label: "土系 - 防御力强" },
    { value: "wood", label: "木系 - 生命力强" },
    { value: "metal", label: "金系 - 穿透力强" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateSave = async () => {
    if (!formData.playerName.trim()) {
      alert("请输入修士名称");
      return;
    }

    setIsCreating(true);
    try {
      const createdPlayer = await playerService.createPlayer(formData);
      onSaveCreated(createdPlayer);
    } catch (error) {
      console.error("Failed to create save:", error);
      alert("创建存档失败，请检查修士名称是否已存在");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.createSavePage}>
      <div className={styles.background}>
        <div className={styles.mysticalElements}>
          <div className={styles.rune}></div>
          <div className={styles.rune}></div>
          <div className={styles.energy}></div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className={styles.backButton}
          >
            ← 返回
          </Button>
          <h1 className={styles.title}>创建修士档案</h1>
        </div>

        <Card className={styles.formCard}>
          <div className={styles.form}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>基本信息</h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>修士名称</label>
                <Input
                  type="text"
                  value={formData.playerName}
                  onChange={(e) =>
                    handleInputChange("playerName", e.target.value)
                  }
                  placeholder="输入你的修士名称..."
                  maxLength={20}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>难度选择</label>
                <Select
                  value={formData.difficulty}
                  onChange={(value) => handleInputChange("difficulty", value)}
                  options={difficulties}
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>修士背景</h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>出身背景</label>
                <Select
                  value={formData.cultivation}
                  onChange={(value) => handleInputChange("cultivation", value)}
                  options={cultivationBackgrounds}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>元素亲和</label>
                <Select
                  value={formData.element}
                  onChange={(value) => handleInputChange("element", value)}
                  options={elementalAffinities}
                />
              </div>
            </div>

            <div className={styles.preview}>
              <h3 className={styles.sectionTitle}>修士预览</h3>
              <div className={styles.previewCard}>
                <div className={styles.avatar}>
                  <div className={styles.avatarIcon}>仙</div>
                </div>
                <div className={styles.previewInfo}>
                  <h4>{formData.playerName || "未命名修士"}</h4>
                  <p className={styles.previewDetail}>
                    {
                      cultivationBackgrounds.find(
                        (c) => c.value === formData.cultivation
                      )?.label
                    }
                  </p>
                  <p className={styles.previewDetail}>
                    {
                      elementalAffinities.find(
                        (e) => e.value === formData.element
                      )?.label
                    }
                  </p>
                  <p className={styles.previewDetail}>
                    难度:{" "}
                    {
                      difficulties.find((d) => d.value === formData.difficulty)
                        ?.label
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={() => onNavigate("home")}
                disabled={isCreating}
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateSave}
                disabled={isCreating}
                className={styles.createButton}
              >
                {isCreating ? "创建中..." : "开始修仙之路"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateSaveSlot;
