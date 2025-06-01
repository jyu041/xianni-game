// frontend/src/services/elementService.js
import apiService from './apiService';

class ElementService {
  async getElementInfo() {
    try {
      return await apiService.get('/elements/info');
    } catch (error) {
      console.error('Failed to get element info:', error);
      throw error;
    }
  }

  async calculateElementInteraction(playerElement, playerLevel, stageElement, stageLevel) {
    try {
      return await apiService.post('/elements/interaction', {
        playerElement,
        playerLevel,
        stageElement,
        stageLevel
      });
    } catch (error) {
      console.error('Failed to calculate element interaction:', error);
      throw error;
    }
  }

  async updatePrimaryElement(playerId, primaryElement) {
    try {
      return await apiService.post(`/elements/player/${playerId}/primary-element`, {
        primaryElement
      });
    } catch (error) {
      console.error('Failed to update primary element:', error);
      throw error;
    }
  }

  async addElementExperience(playerId, elementExperience) {
    try {
      return await apiService.post(`/elements/player/${playerId}/experience`, {
        elementExperience
      });
    } catch (error) {
      console.error('Failed to add element experience:', error);
      throw error;
    }
  }

  async upgradeTianniSword(playerId) {
    try {
      return await apiService.post(`/elements/player/${playerId}/tianni-sword/upgrade`);
    } catch (error) {
      console.error('Failed to upgrade Tianni Sword:', error);
      throw error;
    }
  }

  async useMana(playerId, manaCost) {
    try {
      return await apiService.post(`/elements/player/${playerId}/mana/use`, {
        manaCost
      });
    } catch (error) {
      console.error('Failed to use mana:', error);
      throw error;
    }
  }

  async getPlayerPassives(playerId) {
    try {
      return await apiService.get(`/elements/player/${playerId}/passives`);
    } catch (error) {
      console.error('Failed to get player passives:', error);
      throw error;
    }
  }

  // Helper methods for element data
  getElementName(element) {
    const names = {
      metal: '金',
      wood: '木', 
      water: '水',
      fire: '火',
      earth: '土'
    };
    return names[element] || element;
  }

  getElementColor(element) {
    const colors = {
      metal: '#8B5CF6',  // 赛博蓝紫
      wood: '#22C55E',   // 沼泽绿
      water: '#0EA5E9',  // 深海蓝
      fire: '#DC2626',   // 暗黑红
      earth: '#F59E0B'   // 橙黄
    };
    return colors[element] || '#FFFFFF';
  }

  getSlashColorId(element) {
    const colorMap = {
      wood: 1,   // color1: 沼泽绿
      fire: 2,   // color2: 暗黑红
      metal: 3,  // color3: 赛博蓝紫
      earth: 4,  // color4: 橙黄
      water: 5   // color5: 深海蓝
    };
    return colorMap[element] || 1;
  }

  getTianniSwordAbilityInfo(level, hasMutation = false) {
    if (hasMutation) {
      return {
        level: 11,
        name: '天逆剑·五行寂灭',
        description: '终极形态：五行融合斩击',
        animationType: 'slash3_slash2_slash1_all_colors',
        aoeSize: '大型',
        damage: '75%最大生命值',
        effectFiles: ['slash3', 'slash2', 'slash1'].map(type => 
          [1,2,3,4,5].map(color => `${type}_color${color}.gif`)
        ).flat()
      };
    }

    const abilities = {
      1: { name: '天逆剑·初形', description: '无特殊技能', animationType: 'none' },
      2: { name: '天逆剑·小斩', description: '小型AOE斩击', animationType: 'slash3', aoeSize: '小型', damage: '20%最大生命值' },
      3: { name: '天逆剑·小斩', description: '小型AOE斩击', animationType: 'slash3', aoeSize: '小型', damage: '25%最大生命值' },
      4: { name: '天逆剑·中斩', description: '中小型AOE斩击', animationType: 'slash2', aoeSize: '中小型', damage: '30%最大生命值' },
      5: { name: '天逆剑·中斩', description: '中小型AOE斩击', animationType: 'slash2', aoeSize: '中小型', damage: '35%最大生命值' },
      6: { name: '天逆剑·大斩', description: '中型AOE斩击', animationType: 'slash1', aoeSize: '中型', damage: '40%最大生命值' },
      7: { name: '天逆剑·大斩', description: '中型AOE斩击', animationType: 'slash1', aoeSize: '中型', damage: '45%最大生命值' },
      8: { name: '天逆剑·大斩', description: '中型AOE斩击', animationType: 'slash1', aoeSize: '中型', damage: '50%最大生命值' },
      9: { name: '天逆剑·大斩', description: '中型AOE斩击', animationType: 'slash1', aoeSize: '中型', damage: '55%最大生命值' },
      10: { name: '天逆剑·连斩', description: '三连斩击', animationType: 'slash3_slash2_slash1', aoeSize: '中大型', damage: '60%最大生命值' }
    };

    return { level, ...abilities[level] };
  }

  calculateElementLevel(experience) {
    return Math.min(100, Math.floor(experience / 1000));
  }

  getRequiredExperienceForLevel(level) {
    return level * 1000;
  }

  // Helper method to calculate element experience gain distribution
  calculateElementExperienceGain(primaryElement, baseExperience) {
    const experienceGain = {};
    const elements = ['metal', 'wood', 'water', 'fire', 'earth'];
    
    elements.forEach(element => {
      if (element === primaryElement) {
        experienceGain[element] = baseExperience;
      } else {
        experienceGain[element] = Math.floor(baseExperience / 5); // 20% for non-primary
      }
    });
    
    return experienceGain;
  }

  // Helper method to get element passive bonus
  getElementPassiveBonus(element, level, isPrimary) {
    const baseBonus = this.getBaseElementBonus(element, level);
    return isPrimary ? baseBonus : baseBonus * 0.1; // 10% for non-primary
  }

  getBaseElementBonus(element, level) {
    const percentage = level / 100.0; // 0 to 1.0
    
    switch (element) {
      case 'metal':
        return percentage * 1.0; // 0-100% more external resources
      case 'wood':
        return percentage * 0.25; // 0-25% health regeneration based on missing health
      case 'water':
        return percentage * 0.25; // 0-25% mana per second
      case 'fire':
        return percentage * 0.25; // 0-25% damage increase
      case 'earth':
        return percentage * 0.25; // 0-25% damage reduction
      default:
        return 0.0;
    }
  }
}

export default new ElementService();