// frontend/src/components/GameHome/AchievementsDisplay.jsx
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import sharedStyles from "./SharedDisplay.module.css";

const AchievementsDisplay = ({ playerData, onClaimReward }) => {
  const [selectedCategory, setSelectedCategory] = useState("cultivation");
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Helper function to check if player has all elements at max level
  const hasGreatElementMasterAchievement = (elementLevels) => {
    if (!elementLevels) return false;
    const elements = ["metal", "wood", "water", "fire", "earth"];
    return elements.every((element) => (elementLevels[element] || 0) >= 100);
  };

  const achievementCategories = [
    { id: "cultivation", name: "修炼成就", icon: "🧘" },
    { id: "combat", name: "战斗成就", icon: "⚔️" },
    { id: "collection", name: "收集成就", icon: "📚" },
    { id: "elements", name: "元素成就", icon: "🌟" },
    { id: "special", name: "特殊成就", icon: "👑" },
  ];

  const achievements = {
    cultivation: [
      {
        id: "first_step",
        name: "初入仙途",
        description: "开始你的修仙之路",
        icon: "🌱",
        requirement: "创建角色",
        progress: { current: 1, max: 1 },
        completed: true,
        rewards: { gold: 100, experience: 50 },
        rarity: "common",
      },
      {
        id: "foundation_building",
        name: "筑基成功",
        description: "达到筑基期境界",
        icon: "🏗️",
        requirement: "达到等级11",
        progress: { current: Math.min(playerData?.level || 1, 11), max: 11 },
        completed: (playerData?.level || 1) >= 11,
        rewards: { gold: 500, experience: 200, gems: 10 },
        rarity: "uncommon",
      },
      {
        id: "golden_core",
        name: "金丹凝聚",
        description: "成功凝聚金丹",
        icon: "⚜️",
        requirement: "达到等级21",
        progress: { current: Math.min(playerData?.level || 1, 21), max: 21 },
        completed: (playerData?.level || 1) >= 21,
        rewards: { gold: 1000, experience: 500, gems: 25 },
        rarity: "rare",
      },
      {
        id: "nascent_soul",
        name: "元婴出世",
        description: "元婴期突破",
        icon: "👶",
        requirement: "达到等级31",
        progress: { current: Math.min(playerData?.level || 1, 31), max: 31 },
        completed: (playerData?.level || 1) >= 31,
        rewards: { gold: 2000, experience: 1000, gems: 50 },
        rarity: "epic",
      },
      {
        id: "spirit_transformation",
        name: "化神大成",
        description: "踏入化神期境界",
        icon: "🌠",
        requirement: "达到等级50",
        progress: { current: Math.min(playerData?.level || 1, 50), max: 50 },
        completed: (playerData?.level || 1) >= 50,
        rewards: { gold: 5000, experience: 2000, gems: 100 },
        rarity: "legendary",
      },
    ],
    combat: [
      {
        id: "first_kill",
        name: "初战告捷",
        description: "击败第一个敌人",
        icon: "⚔️",
        requirement: "击败1个敌人",
        progress: {
          current: Math.min(playerData?.totalEnemiesKilled || 0, 1),
          max: 1,
        },
        completed: (playerData?.totalEnemiesKilled || 0) >= 1,
        rewards: { gold: 50, experience: 25 },
        rarity: "common",
      },
      {
        id: "slayer",
        name: "斩妖除魔",
        description: "击败100个敌人",
        icon: "🗡️",
        requirement: "击败100个敌人",
        progress: {
          current: Math.min(playerData?.totalEnemiesKilled || 0, 100),
          max: 100,
        },
        completed: (playerData?.totalEnemiesKilled || 0) >= 100,
        rewards: { gold: 1000, experience: 300, gems: 15 },
        rarity: "uncommon",
      },
      {
        id: "destroyer",
        name: "毁灭者",
        description: "击败1000个敌人",
        icon: "💀",
        requirement: "击败1000个敌人",
        progress: {
          current: Math.min(playerData?.totalEnemiesKilled || 0, 1000),
          max: 1000,
        },
        completed: (playerData?.totalEnemiesKilled || 0) >= 1000,
        rewards: { gold: 5000, experience: 1000, gems: 50 },
        rarity: "epic",
      },
      {
        id: "stage_master",
        name: "关卡大师",
        description: "通关所有关卡",
        icon: "🏆",
        requirement: "通关第10关",
        progress: {
          current: Math.min(playerData?.currentStage || 1, 10),
          max: 10,
        },
        completed: (playerData?.currentStage || 1) >= 10,
        rewards: { gold: 10000, experience: 2000, gems: 100 },
        rarity: "legendary",
      },
    ],
    collection: [
      {
        id: "wealth_accumulator",
        name: "财富积累者",
        description: "积累10000灵石",
        icon: "💰",
        requirement: "拥有10000灵石",
        progress: {
          current: Math.min(playerData?.gold || 0, 10000),
          max: 10000,
        },
        completed: (playerData?.gold || 0) >= 10000,
        rewards: { experience: 500, gems: 20 },
        rarity: "uncommon",
      },
      {
        id: "soul_collector",
        name: "魂魄收集者",
        description: "收集1000个魂魄",
        icon: "👻",
        requirement: "收集1000个魂魄",
        progress: {
          current: Math.min(playerData?.totalSoulsCollected || 0, 1000),
          max: 1000,
        },
        completed: (playerData?.totalSoulsCollected || 0) >= 1000,
        rewards: { gold: 2000, gems: 30 },
        rarity: "rare",
      },
      {
        id: "gem_hoarder",
        name: "宝石囤积者",
        description: "拥有500仙石",
        icon: "💎",
        requirement: "拥有500仙石",
        progress: { current: Math.min(playerData?.gems || 0, 500), max: 500 },
        completed: (playerData?.gems || 0) >= 500,
        rewards: { gold: 5000, experience: 1000 },
        rarity: "epic",
      },
    ],
    elements: [
      {
        id: "element_initiate",
        name: "元素入门",
        description: "任意元素达到10级",
        icon: "🔥",
        requirement: "任意元素等级10",
        progress: {
          current: Math.max(
            ...Object.values(playerData?.elementLevels || {}),
            0
          ),
          max: 10,
        },
        completed:
          Math.max(...Object.values(playerData?.elementLevels || {}), 0) >= 10,
        rewards: { gold: 500, experience: 200, gems: 15 },
        rarity: "uncommon",
      },
      {
        id: "element_master",
        name: "元素精通",
        description: "任意元素达到50级",
        icon: "⚡",
        requirement: "任意元素等级50",
        progress: {
          current: Math.max(
            ...Object.values(playerData?.elementLevels || {}),
            0
          ),
          max: 50,
        },
        completed:
          Math.max(...Object.values(playerData?.elementLevels || {}), 0) >= 50,
        rewards: { gold: 2000, experience: 800, gems: 40 },
        rarity: "rare",
      },
      {
        id: "great_element_master",
        name: "大元素使",
        description: "所有元素达到满级",
        icon: "🌟",
        requirement: "所有元素等级100",
        progress: {
          current: Object.values(playerData?.elementLevels || {}).filter(
            (level) => level >= 100
          ).length,
          max: 5,
        },
        completed: hasGreatElementMasterAchievement(
          playerData?.elementLevels || {}
        ),
        rewards: { gold: 50000, experience: 10000, gems: 500 },
        rarity: "legendary",
      },
    ],
    special: [
      {
        id: "tianni_sword_max",
        name: "天逆剑神",
        description: "天逆剑达到满级",
        icon: "⚔️",
        requirement: "天逆剑等级10",
        progress: {
          current: Math.min(playerData?.tianniSwordLevel || 1, 10),
          max: 10,
        },
        completed: (playerData?.tianniSwordLevel || 1) >= 10,
        rewards: { gold: 10000, gems: 100 },
        rarity: "epic",
      },
      {
        id: "tianni_sword_mutation",
        name: "五行寂灭",
        description: "解锁天逆剑终极形态",
        icon: "💫",
        requirement: "天逆剑突变",
        progress: {
          current: playerData?.hasTianniSwordMutation ? 1 : 0,
          max: 1,
        },
        completed: playerData?.hasTianniSwordMutation || false,
        rewards: { gold: 100000, experience: 50000, gems: 1000 },
        rarity: "legendary",
      },
      {
        id: "immortal_cultivator",
        name: "仙道至尊",
        description: "完成所有主要成就",
        icon: "👑",
        requirement: "获得所有传说成就",
        progress: { current: 0, max: 5 },
        completed: false,
        rewards: { title: "仙道至尊", gold: 1000000, gems: 10000 },
        rarity: "legendary",
      },
    ],
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: "#9e9e9e",
      uncommon: "#4caf50",
      rare: "#2196f3",
      epic: "#9c27b0",
      legendary: "#ff9800",
    };
    return colors[rarity] || colors.common;
  };

  const getProgressPercent = (achievement) => {
    return Math.min(
      (achievement.progress.current / achievement.progress.max) * 100,
      100
    );
  };

  const canClaimReward = (achievement) => {
    return achievement.completed && !achievement.claimed;
  };

  const handleClaimReward = (achievement) => {
    if (canClaimReward(achievement) && onClaimReward) {
      onClaimReward(achievement);
    }
  };

  const currentAchievements = achievements[selectedCategory] || [];
  const completedCount = currentAchievements.filter((a) => a.completed).length;
  const totalCount = currentAchievements.length;

  return (
    <div className={sharedStyles.displayContainer}>
      <div className={sharedStyles.displayHeader}>
        <h2>修仙成就</h2>
        <p>查看你的修炼成就和里程碑</p>
        <div
          style={{
            display: "inline-block",
            background: "rgba(0,0,0,0.6)",
            padding: "0.75rem 1.5rem",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.2)",
            minWidth: "200px",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "0.9rem",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            总体进度: {completedCount}/{totalCount}
          </span>
          <div className={sharedStyles.progressBar}>
            <div
              className={sharedStyles.progressFill}
              style={{
                width: `${(completedCount / totalCount) * 100}%`,
                backgroundColor: "#ffc107",
              }}
            />
          </div>
        </div>
      </div>

      <div className={sharedStyles.tabContainer}>
        {achievementCategories.map((category) => (
          <button
            key={category.id}
            className={`${sharedStyles.tab} ${
              selectedCategory === category.id ? sharedStyles.active : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className={sharedStyles.tabIcon}>{category.icon}</span>
            <span className={sharedStyles.tabLabel}>{category.name}</span>
            <span className={sharedStyles.tabCounter}>
              {achievements[category.id].filter((a) => a.completed).length}/
              {achievements[category.id].length}
            </span>
          </button>
        ))}
      </div>

      <div className={`${sharedStyles.gridContainer} ${sharedStyles.grid3Col}`}>
        {currentAchievements.map((achievement) => {
          const progressPercent = getProgressPercent(achievement);
          const claimable = canClaimReward(achievement);

          return (
            <Card
              key={achievement.id}
              variant={achievement.completed ? "primary" : "default"}
              className={`${sharedStyles.itemCard} ${
                achievement.completed ? sharedStyles.equipped : ""
              } ${claimable ? sharedStyles.claimableBadge : ""}`}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <div className={sharedStyles.itemHeader}>
                <div
                  className={sharedStyles.itemIcon}
                  style={{ color: getRarityColor(achievement.rarity) }}
                >
                  {achievement.icon}
                </div>
                <div
                  className={sharedStyles.rarityBadge}
                  style={{
                    backgroundColor: getRarityColor(achievement.rarity),
                  }}
                >
                  {achievement.rarity}
                </div>
                {achievement.completed && (
                  <div
                    className={`${sharedStyles.statusBadge} ${sharedStyles.completedBadge}`}
                  >
                    ✓
                  </div>
                )}
              </div>

              <div className={sharedStyles.itemInfo}>
                <h4
                  className={sharedStyles.itemName}
                  style={{ color: getRarityColor(achievement.rarity) }}
                >
                  {achievement.name}
                </h4>
                <p className={sharedStyles.itemDescription}>
                  {achievement.description}
                </p>

                <div className={sharedStyles.progressContainer}>
                  <div className={sharedStyles.progressLabel}>
                    进度: {achievement.progress.current}/
                    {achievement.progress.max}
                  </div>
                  <div className={sharedStyles.progressBar}>
                    <div
                      className={sharedStyles.progressFill}
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: getRarityColor(achievement.rarity),
                      }}
                    />
                  </div>
                </div>

                <div className={sharedStyles.itemDetails}>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                      background: "rgba(0,0,0,0.4)",
                      padding: "0.4rem 0.6rem",
                      borderRadius: "6px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {achievement.requirement}
                  </span>
                </div>
              </div>

              {claimable && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClaimReward(achievement);
                  }}
                >
                  领取奖励
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {selectedAchievement && (
        <div className={sharedStyles.modalOverlay}>
          <Card variant="glass" className={sharedStyles.modalPanel}>
            <div className={sharedStyles.modalHeader}>
              <div
                className={sharedStyles.modalIcon}
                style={{ color: getRarityColor(selectedAchievement.rarity) }}
              >
                {selectedAchievement.icon}
              </div>
              <div className={sharedStyles.modalInfo}>
                <h3
                  style={{ color: getRarityColor(selectedAchievement.rarity) }}
                >
                  {selectedAchievement.name}
                </h3>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    opacity: "0.8",
                    color: getRarityColor(selectedAchievement.rarity),
                  }}
                >
                  {selectedAchievement.rarity}
                </div>
                {selectedAchievement.completed && (
                  <div
                    style={{
                      background: "#4caf50",
                      color: "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                      display: "inline-block",
                    }}
                  >
                    已完成
                  </div>
                )}
              </div>
              <button
                className={sharedStyles.closeButton}
                onClick={() => setSelectedAchievement(null)}
              >
                ×
              </button>
            </div>

            <p className={sharedStyles.modalDescription}>
              {selectedAchievement.description}
            </p>

            <div
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h4
                style={{
                  color: "#ffffff",
                  margin: "0 0 0.75rem 0",
                  fontSize: "1rem",
                }}
              >
                完成进度
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  {selectedAchievement.progress.current}/
                  {selectedAchievement.progress.max}
                </span>
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  {getProgressPercent(selectedAchievement).toFixed(1)}%
                </span>
              </div>
              <div className={sharedStyles.progressBar}>
                <div
                  className={sharedStyles.progressFill}
                  style={{
                    width: `${getProgressPercent(selectedAchievement)}%`,
                    backgroundColor: getRarityColor(selectedAchievement.rarity),
                  }}
                />
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,193,7,0.1)",
                border: "1px solid rgba(255,193,7,0.3)",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h4
                style={{
                  color: "#ffc107",
                  margin: "0 0 0.75rem 0",
                  fontSize: "1rem",
                  textShadow: "0 0 10px rgba(255,193,7,0.5)",
                }}
              >
                奖励
              </h4>
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
              >
                {selectedAchievement.rewards.gold && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "rgba(0,0,0,0.6)",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>💰</span>
                    <span
                      style={{
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      {selectedAchievement.rewards.gold} 灵石
                    </span>
                  </div>
                )}
                {selectedAchievement.rewards.experience && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "rgba(0,0,0,0.6)",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>📚</span>
                    <span
                      style={{
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      {selectedAchievement.rewards.experience} 经验
                    </span>
                  </div>
                )}
                {selectedAchievement.rewards.gems && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "rgba(0,0,0,0.6)",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>💎</span>
                    <span
                      style={{
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      {selectedAchievement.rewards.gems} 仙石
                    </span>
                  </div>
                )}
                {selectedAchievement.rewards.title && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "rgba(0,0,0,0.6)",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>👑</span>
                    <span
                      style={{
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      称号: {selectedAchievement.rewards.title}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={sharedStyles.modalActions}>
              <Button
                variant="ghost"
                onClick={() => setSelectedAchievement(null)}
              >
                关闭
              </Button>
              {canClaimReward(selectedAchievement) && (
                <Button
                  variant="primary"
                  onClick={() => handleClaimReward(selectedAchievement)}
                >
                  领取奖励
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AchievementsDisplay;
