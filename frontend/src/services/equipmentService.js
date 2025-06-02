// frontend/src/services/equipmentService.js
import apiService from './apiService.js';

class EquipmentService {
  async getAvailableEquipment() {
    try {
      return await apiService.get('/equipment/available');
    } catch (error) {
      console.error('Failed to get available equipment:', error);
      throw error;
    }
  }

  async equipItem(playerId, itemId) {
    try {
      return await apiService.post(`/equipment/player/${playerId}/equip`, {
        itemId
      });
    } catch (error) {
      console.error('Failed to equip item:', error);
      throw error;
    }
  }

  async unequipItem(playerId, itemId) {
    try {
      return await apiService.post(`/equipment/player/${playerId}/unequip`, {
        itemId
      });
    } catch (error) {
      console.error('Failed to unequip item:', error);
      throw error;
    }
  }

  async getPlayerStats(playerId) {
    try {
      return await apiService.get(`/equipment/player/${playerId}/stats`);
    } catch (error) {
      console.error('Failed to get player stats:', error);
      throw error;
    }
  }

  // Helper methods for equipment data
  getRarityColor(rarity) {
    const colors = {
      common: "#9e9e9e",
      uncommon: "#4caf50",
      rare: "#2196f3",
      epic: "#9c27b0",
      legendary: "#ff9800"
    };
    return colors[rarity] || colors.common;
  }

  getRarityName(rarity) {
    const names = {
      common: "普通",
      uncommon: "优秀",
      rare: "稀有",
      epic: "史诗",
      legendary: "传说"
    };
    return names[rarity] || rarity;
  }

  getStatName(statKey) {
    const statNames = {
      attackPercent: "攻击力",
      healthPercent: "生命值",
      manaPercent: "灵气",
      defensePercent: "防御力",
      healthRegenPercent: "生命回复",
      manaRegenPercent: "灵气回复"
    };
    return statNames[statKey] || statKey;
  }

  formatStatBonus(statKey, value) {
    return `${this.getStatName(statKey)}: +${value}%`;
  }

  getCategoryIcon(category) {
    const icons = {
      weapon: "⚔️",
      armor: "🛡️",
      accessory: "💍",
      ring: "💍",
      amulet: "🔮",
      crown: "👑"
    };
    return icons[category] || "⚖️";
  }

  // Calculate total stat bonuses from equipped items
  calculateTotalBonuses(equippedItems) {
    const totals = {};
    
    if (!equippedItems || equippedItems.length === 0) {
      return totals;
    }

    equippedItems.forEach(item => {
      if (item.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          totals[stat] = (totals[stat] || 0) + value;
        });
      }
    });

    return totals;
  }

  // Check if an item can be equipped by a player
  canEquipItem(item, playerLevel) {
    return playerLevel >= (item.levelRequirement || 1);
  }

  // Get equipment by category
  filterEquipmentByCategory(equipment, category) {
    return equipment.filter(item => item.category === category);
  }

  // Sort equipment by rarity and level requirement
  sortEquipment(equipment) {
    const rarityOrder = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5
    };

    return equipment.sort((a, b) => {
      // First sort by rarity
      const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
      if (rarityDiff !== 0) return rarityDiff;
      
      // Then by level requirement
      return (a.levelRequirement || 1) - (b.levelRequirement || 1);
    });
  }
}

export default new EquipmentService();