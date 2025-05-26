import { ITEM_RARITY, ALCHEMY_CATEGORIES } from '../../utils/gameConstants.js';

export const PILLS_AND_MEDICINES_DATA = {
  'qi_gathering_pill': {
    id: 'qi_gathering_pill',
    name: '聚气丹',
    nameEn: 'Qi Gathering Pill',
    type: 'pill',
    rarity: ITEM_RARITY.COMMON,
    category: ALCHEMY_CATEGORIES.CULTIVATION,
    description: '最基础的修炼丹药，可增加修为',
    stackable: true,
    maxStack: 99,
    value: 10,
    effects: {
      cultivationPoints: 100,
      spiritualEnergy: 20
    },
    recipe: {
      materials: [
        { id: 'spirit_grass', quantity: 2 },
        { id: 'low_grade_spirit_stone', quantity: 1 }
      ],
      difficulty: 'easy',
      successRate: 0.8
    }
  },

  'healing_pill': {
    id: 'healing_pill',
    name: '疗伤丹',
    nameEn: 'Healing Pill',
    type: 'pill',
    rarity: ITEM_RARITY.COMMON,
    category: ALCHEMY_CATEGORIES.HEALING,
    description: '治疗外伤的基础丹药',
    stackable: true,
    maxStack: 50,
    value: 15,
    effects: {
      stats: {
        health: 50
      }
    },
    recipe: {
      materials: [
        { id: 'healing_herb', quantity: 3 },
        { id: 'spirit_water', quantity: 1 }
      ],
      difficulty: 'easy',
      successRate: 0.9
    }
  },

  'foundation_building_pill': {
    id: 'foundation_building_pill',
    name: '筑基丹',
    nameEn: 'Foundation Building Pill',
    type: 'pill',
    rarity: ITEM_RARITY.RARE,
    category: ALCHEMY_CATEGORIES.CULTIVATION,
    description: '助人筑基的珍贵丹药，可大幅增加筑基成功率',
    stackable: true,
    maxStack: 10,
    value: 1000,
    effects: {
      cultivationPoints: 5000,
      breakthroughBonus: 0.3
    },
    recipe: {
      materials: [
        { id: 'century_ginseng', quantity: 1 },
        { id: 'spirit_mushroom', quantity: 3 },
        { id: 'medium_grade_spirit_stone', quantity: 5 }
      ],
      difficulty: 'hard',
      successRate: 0.3
    }
  }
};