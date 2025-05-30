// frontend/src/components/game/SidebarMenu.jsx
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
      id: "store",
      label: "修仙商店",
      icon: "🏪",
      className: "store",
    },
    {
      id: "upgrades",
      label: "功法升级",
      icon: "📚",
      className: "upgrades",
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

  const cultivation = getCultivationLevel(playerData?.level || 1);

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

      <div className={styles.menuFooter}>
        <div className={styles.playerStatus}>
          <div className={styles.statusIcon}>🧘</div>
          <div className={styles.statusInfo}>
            <div className={styles.statusLabel}>修为境界</div>
            <div
              className={styles.statusValue}
              style={{ color: cultivation.color }}
            >
              {cultivation.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
