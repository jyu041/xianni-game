// frontend/src/components/modals/GameControlsModal.jsx
import Card from "../ui/Card";
import Button from "../ui/Button";
import styles from "./GameControlsModal.module.css";

const GameControlsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const controls = [
    {
      category: "移动控制",
      items: [
        { key: "WASD / 方向键", description: "角色移动" },
        { key: "鼠标", description: "自动瞄准最近敌人" },
      ],
    },
    {
      category: "战斗技能",
      items: [
        { key: "自动攻击", description: "持续发射剑气攻击敌人" },
        { key: "空格键", description: "天逆剑特殊技能" },
        { key: "1-5", description: "使用法宝技能" },
        { key: "6-9, 0", description: "使用功法技能" },
      ],
    },
    {
      category: "游戏控制",
      items: [
        { key: "ESC / P", description: "暂停游戏" },
        { key: "TAB", description: "显示统计信息" },
        { key: "F1", description: "显示帮助" },
      ],
    },
    {
      category: "收集系统",
      items: [
        { key: "自动收集", description: "靠近魂魄和道具自动拾取" },
        { key: "经验值", description: "击杀敌人获得修炼经验" },
        { key: "魂魄", description: "用于解锁技能和升级" },
      ],
    },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>游戏控制说明</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.controlsList}>
          {controls.map((section, index) => (
            <Card key={index} variant="glass" className={styles.controlSection}>
              <h3 className={styles.sectionTitle}>{section.category}</h3>
              <div className={styles.controlItems}>
                {section.items.map((control, itemIndex) => (
                  <div key={itemIndex} className={styles.controlItem}>
                    <div className={styles.controlKey}>{control.key}</div>
                    <div className={styles.controlDescription}>
                      {control.description}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.gameInfo}>
            <h4>游戏提示</h4>
            <ul>
              <li>击杀敌人会掉落魂魄，收集25个魂魄可解锁新技能</li>
              <li>天逆剑等级越高，特殊技能威力越强</li>
              <li>每个元素都有独特的被动效果，合理搭配属性</li>
              <li>关卡难度会随时间逐渐增加</li>
            </ul>
          </div>

          <Button variant="primary" onClick={onClose}>
            开始修炼
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameControlsModal;
