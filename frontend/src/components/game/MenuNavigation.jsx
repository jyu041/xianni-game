import Card from "../ui/Card";
import styles from "./MenuNavigation.module.css";

const MenuNavigation = ({ activeMenu, onMenuSelect }) => {
  const menuItems = [
    {
      id: "stages",
      label: "关卡选择",
      icon: "⚔️",
      description: "选择关卡进行战斗",
    },
    {
      id: "inventory",
      label: "法宝背包",
      icon: "🎒",
      description: "查看装备和道具",
    },
    {
      id: "store",
      label: "修仙商店",
      icon: "🏪",
      description: "购买装备和消耗品",
    },
    {
      id: "upgrades",
      label: "功法升级",
      icon: "📚",
      description: "提升技能和属性",
    },
    { id: "gacha", label: "天机抽取", icon: "🎲", description: "抽取稀有法宝" },
    {
      id: "achievements",
      label: "修仙成就",
      icon: "🏆",
      description: "查看获得的成就",
    },
  ];

  return (
    <Card className={styles.menuNavigation} variant="glass">
      <div className={styles.menuHeader}>
        <h3 className={styles.menuTitle}>功能菜单</h3>
      </div>

      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.menuItem} ${
              activeMenu === item.id ? styles.active : ""
            }`}
            onClick={() => onMenuSelect(item.id)}
          >
            <div className={styles.menuIcon}>{item.icon}</div>
            <div className={styles.menuContent}>
              <div className={styles.menuLabel}>{item.label}</div>
              <div className={styles.menuDescription}>{item.description}</div>
            </div>
            <div className={styles.menuArrow}>›</div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default MenuNavigation;
