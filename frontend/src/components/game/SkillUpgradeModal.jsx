// src/components/game/SkillUpgradeModal.jsx
import { useState } from "react";
import Button from "../ui/Button";
import styles from "./SkillUpgradeModal.module.css";

const SkillUpgradeModal = ({ isOpen, onClose, onSkillSelect }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Placeholder skills - will be replaced with actual skill system
  const availableSkills = [
    {
      id: "attack_speed",
      name: "疾风术",
      description: "提升攻击速度 20%",
      icon: "⚡",
      effect: "attackSpeed",
    },
    {
      id: "attack_range",
      name: "千里眼",
      description: "增加攻击范围 30%",
      icon: "👁️",
      effect: "attackRange",
    },
    {
      id: "soul_range",
      name: "吸魂术",
      description: "扩大魂魄收集范围 50%",
      icon: "🌀",
      effect: "soulRange",
    },
  ];

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
  };

  const handleConfirm = () => {
    if (selectedSkill) {
      onSkillSelect(selectedSkill);
      setSelectedSkill(null);
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <span className={styles.titleIcon}>✨</span>
            选择修仙技能
          </h2>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.description}>
            恭喜！你已收集足够魂魄，可以领悟一门新的修仙技能。
          </p>

          <div className={styles.skillGrid}>
            {availableSkills.map((skill) => (
              <div
                key={skill.id}
                className={`${styles.skillCard} ${
                  selectedSkill?.id === skill.id ? styles.selected : ""
                }`}
                onClick={() => handleSkillSelect(skill)}
              >
                <div className={styles.skillIcon}>{skill.icon}</div>
                <h3 className={styles.skillName}>{skill.name}</h3>
                <p className={styles.skillDescription}>{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.modalActions}>
          <Button
            variant="secondary"
            onClick={onClose}
            className={styles.cancelButton}
          >
            稍后选择
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedSkill}
            className={styles.confirmButton}
          >
            领悟技能
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillUpgradeModal;
