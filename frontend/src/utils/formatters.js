// ===================
// utils/formatters.js - Utility Functions
// ===================

/**
 * formatters
 * Text and number formatting
 */

// Format large numbers with appropriate suffixes
export const formatNumber = (num) => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
};

// Format cultivation points
export const formatCultivationPoints = (points) => {
  return formatNumber(points) + ' 修为';
};

// Format time duration
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}时${minutes}分`;
  } else if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  } else {
    return `${secs}秒`;
  }
};

// Format percentage
export const formatPercentage = (decimal, precision = 0) => {
  return (decimal * 100).toFixed(precision) + '%';
};

// Format cultivation realm display
export const formatRealmDisplay = (realm, stage) => {
  const realmNames = {
    qi_gathering: '练气期',
    foundation_building: '筑基期',
    core_formation: '金丹期',
    nascent_soul: '元婴期'
  };
  
  return `${realmNames[realm] || realm} 第${stage}层`;
};

// Format item rarity
export const formatRarity = (rarity) => {
  const rarityNames = {
    common: '普通',
    uncommon: '优秀',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
    mythical: '神话',
    immortal: '仙品'
  };
  
  return rarityNames[rarity] || rarity;
};

// Format spiritual root quality
export const formatSpiritualRoot = (value) => {
  if (value >= 90) return '天灵根';
  if (value >= 80) return '异灵根';
  if (value >= 60) return '上等';
  if (value >= 40) return '中等';
  if (value >= 20) return '下等';
  return '废灵根';
};

// Format sect relationship
export const formatRelationship = (relationship) => {
  const relationshipNames = {
    allied: '盟友',
    friendly: '友好',
    neutral: '中立',
    hostile: '敌对',
    enemy: '仇敌'
  };
  
  return relationshipNames[relationship] || relationship;
};

export default {
  formatNumber,
  formatCultivationPoints,
  formatDuration,
  formatPercentage,
  formatRealmDisplay,
  formatRarity,
  formatSpiritualRoot,
  formatRelationship
};