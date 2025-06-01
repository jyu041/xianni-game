// frontend/src/components/GameHome/SidebarMenu.jsx
import { useState } from "react";
import styles from "./SidebarMenu.module.css";

const SidebarMenu = ({ activeMenu, onMenuSelect, playerData }) => {
  const menuItems = [
    {
      id: "stages",
      label: "关卡选择",
      icon: "⚔️",
      className: "stages",
    },
    {
      id: "inventory",
      label: "法宝背包",
      icon: "🎒",
      className: "inventory",
    },
    {
      id: "cultivation",
      label: "修为境界",
      icon: "🧘",
      className: "cultivation",
    },
    {
      id: "upgrades",
      label: "元素修炼",
      icon: "📚",
      className: "upgrades",
    },
    {
      id: "store",
      label: "修仙商店",
      icon: "🏪",
      className: "store",
    },
    {
      id: "gacha",
      label: "天机抽取",
      icon: "🎲",
      className: "gacha",
    },
    {
      id: "achievements",
      label: "修仙成就",
      icon: "🏆",
      className: "achievements",
    },
  ];

  return (
    <div className={styles.sidebarMenu}>
      <div className={styles.menuHeader}>
        <h3 className={styles.menuTitle}>
          <span className={styles.menuTitleIcon}>⚡</span>
          功能菜单
        </h3>
      </div>

      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.menuItem} ${styles[item.className]} ${
              activeMenu === item.id ? styles.active : ""
            }`}
            onClick={() => onMenuSelect(item.id)}
          >
            <span className={styles.itemIcon}>{item.icon}</span>
            <span className={styles.itemLabel}>{item.label}</span>
            <span className={styles.itemArrow}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarMenu;
