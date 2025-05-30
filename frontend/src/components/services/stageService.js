// frontend/src/services/stageService.js
import apiService from './apiService.js';

class StageService {
  async getAllStages() {
    try {
      return await apiService.get('/stages');
    } catch (error) {
      console.error('Failed to get stages:', error);
      // Return fallback data if backend is not available
      return this.getFallbackStages();
    }
  }

  async getStageById(stageId) {
    try {
      return await apiService.get(`/stages/${stageId}`);
    } catch (error) {
      console.error('Failed to get stage:', error);
      return this.getFallbackStages().find(stage => stage.stageId === stageId) || null;
    }
  }

  async createStage(stageConfig) {
    try {
      return await apiService.post('/stages', stageConfig);
    } catch (error) {
      console.error('Failed to create stage:', error);
      throw error;
    }
  }

  async updateStage(stageId, stageConfig) {
    try {
      return await apiService.put(`/stages/${stageId}`, stageConfig);
    } catch (error) {
      console.error('Failed to update stage:', error);
      throw error;
    }
  }

  // Fallback data for when backend is not available
  getFallbackStages() {
    return [
      {
        stageId: 1,
        name: "青云山脉",
        description: "修仙路上的第一步，山林间充满了野兽的咆哮。",
        difficulty: "简单",
        boss: "山林虎王",
        enemies: "野兽",
        background: "mountains",
        minLevel: 1,
        rewards: ["灵石 x50", "经验 x25"]
      },
      {
        stageId: 2,
        name: "幽暗森林",
        description: "阴暗的森林中潜伏着危险的妖兽。",
        difficulty: "简单",
        boss: "黑狼妖王",
        enemies: "妖兽",
        background: "forest",
        minLevel: 3,
        rewards: ["灵石 x75", "经验 x50"]
      },
      {
        stageId: 3,
        name: "迷雾沼泽",
        description: "迷雾缭绕的沼泽地，充满了毒虫和陷阱。",
        difficulty: "普通",
        boss: "毒蛛女王",
        enemies: "毒虫",
        background: "swamp",
        minLevel: 5,
        rewards: ["灵石 x100", "经验 x75"]
      },
      {
        stageId: 4,
        name: "烈焰峡谷",
        description: "炽热的峡谷中居住着强大的火系生物。",
        difficulty: "普通",
        boss: "炎龙",
        enemies: "火灵",
        background: "volcano",
        minLevel: 8,
        rewards: ["灵石 x150", "经验 x100"]
      },
      {
        stageId: 5,
        name: "冰霜雪域",
        description: "永恒的冰雪之地，考验着修仙者的意志。",
        difficulty: "困难",
        boss: "冰霜巨人",
        enemies: "冰妖",
        background: "ice",
        minLevel: 12,
        rewards: ["灵石 x200", "经验 x125"]
      },
      {
        stageId: 6,
        name: "雷电高原",
        description: "雷电不断的高原，蕴含着天地之力。",
        difficulty: "困难",
        boss: "雷鸟",
        enemies: "雷兽",
        background: "thunder",
        minLevel: 16,
        rewards: ["灵石 x300", "经验 x150"]
      },
      {
        stageId: 7,
        name: "暗影深渊",
        description: "无底的深渊中潜伏着来自地狱的魔物。",
        difficulty: "地狱",
        boss: "深渊领主",
        enemies: "魔物",
        background: "abyss",
        minLevel: 20,
        rewards: ["灵石 x500", "经验 x175"]
      },
      {
        stageId: 8,
        name: "天界云海",
        description: "云雾缭绕的天界，守护着神圣的力量。",
        difficulty: "地狱",
        boss: "天将",
        enemies: "天兵",
        background: "heaven",
        minLevel: 25,
        rewards: ["灵石 x750", "经验 x200"]
      },
      {
        stageId: 9,
        name: "混沌虚空",
        description: "混沌的虚空中存在着超越理解的生物。",
        difficulty: "噩梦",
        boss: "虚空君主",
        enemies: "虚空生物",
        background: "void",
        minLevel: 30,
        rewards: ["灵石 x1000", "经验 x250"]
      },
      {
        stageId: 10,
        name: "仙界禁地",
        description: "仙界的最高禁地，只有最强者才能踏足。",
        difficulty: "噩梦",
        boss: "仙帝",
        enemies: "仙人",
        background: "immortal",
        minLevel: 35,
        rewards: ["灵石 x1500", "经验 x300"]
      }
    ];
  }
}

export default new StageService();