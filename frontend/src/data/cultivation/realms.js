import { CULTIVATION_REALMS, SPIRITUAL_ELEMENTS } from '../../utils/gameConstants.js';

export const CULTIVATION_REALMS_DATA = {
  [CULTIVATION_REALMS.QI_GATHERING]: {
    id: CULTIVATION_REALMS.QI_GATHERING,
    name: '练气期',
    nameEn: 'Qi Gathering',
    description: '修炼的第一个境界，感应天地灵气，开始修炼之路',
    maxStages: 12,
    baseSpiritualEnergy: 100,
    cultivationRate: 1.0,
    nextRealm: CULTIVATION_REALMS.FOUNDATION_BUILDING,
    requiresTribulation: false,
    stages: [
      { stage: 1, requiredPoints: 100, description: '初窥门径' },
      { stage: 2, requiredPoints: 200, description: '略有小成' },
      { stage: 3, requiredPoints: 350, description: '渐入佳境' },
      { stage: 4, requiredPoints: 550, description: '小有成就' },
      { stage: 5, requiredPoints: 800, description: '精进不已' },
      { stage: 6, requiredPoints: 1100, description: '登堂入室' },
      { stage: 7, requiredPoints: 1450, description: '炉火纯青' },
      { stage: 8, requiredPoints: 1850, description: '出神入化' },
      { stage: 9, requiredPoints: 2300, description: '随心所欲' },
      { stage: 10, requiredPoints: 2800, description: '返璞归真' },
      { stage: 11, requiredPoints: 3350, description: '近乎大道' },
      { stage: 12, requiredPoints: 3950, description: '圆满无缺' }
    ],
    bonuses: {
      stats: {
        maxHealth: 50,
        maxMana: 30,
        attack: 5,
        defense: 3
      }
    }
  },
  
  [CULTIVATION_REALMS.FOUNDATION_BUILDING]: {
    id: CULTIVATION_REALMS.FOUNDATION_BUILDING,
    name: '筑基期',
    nameEn: 'Foundation Building',
    description: '筑建修炼基础，丹田凝实，法力大增',
    maxStages: 9,
    baseSpiritualEnergy: 300,
    cultivationRate: 0.8,
    nextRealm: CULTIVATION_REALMS.CORE_FORMATION,
    requiresTribulation: false,
    stages: [
      { stage: 1, requiredPoints: 5000, description: '筑基初期' },
      { stage: 2, requiredPoints: 7000, description: '根基渐稳' },
      { stage: 3, requiredPoints: 9500, description: '筑基中期' },
      { stage: 4, requiredPoints: 12500, description: '法力精纯' },
      { stage: 5, requiredPoints: 16000, description: '筑基后期' },
      { stage: 6, requiredPoints: 20000, description: '基础牢固' },
      { stage: 7, requiredPoints: 24500, description: '筑基大成' },
      { stage: 8, requiredPoints: 29500, description: '圆满在即' },
      { stage: 9, requiredPoints: 35000, description: '筑基圆满' }
    ],
    bonuses: {
      stats: {
        maxHealth: 150,
        maxMana: 100,
        attack: 20,
        defense: 15
      },
      techniques: ['basic_sword_technique', 'qi_shield']
    }
  },

  [CULTIVATION_REALMS.CORE_FORMATION]: {
    id: CULTIVATION_REALMS.CORE_FORMATION,
    name: '金丹期',
    nameEn: 'Core Formation',
    description: '凝结金丹，寿元大增，已是修炼界的强者',
    maxStages: 6,
    baseSpiritualEnergy: 800,
    cultivationRate: 0.6,
    nextRealm: CULTIVATION_REALMS.NASCENT_SOUL,
    requiresTribulation: true,
    stages: [
      { stage: 1, requiredPoints: 50000, description: '金丹初期' },
      { stage: 2, requiredPoints: 75000, description: '金丹稳固' },
      { stage: 3, requiredPoints: 105000, description: '金丹中期' },
      { stage: 4, requiredPoints: 140000, description: '丹华初现' },
      { stage: 5, requiredPoints: 180000, description: '金丹后期' },
      { stage: 6, requiredPoints: 225000, description: '金丹圆满' }
    ],
    bonuses: {
      stats: {
        maxHealth: 400,
        maxMana: 300,
        attack: 60,
        defense: 40
      },
      techniques: ['flying_sword', 'core_explosion', 'spiritual_armor']
    }
  },

  [CULTIVATION_REALMS.NASCENT_SOUL]: {
    id: CULTIVATION_REALMS.NASCENT_SOUL,
    name: '元婴期',
    nameEn: 'Nascent Soul',
    description: '元婴出窍，神识强大，可称一方老祖',
    maxStages: 6,
    baseSpiritualEnergy: 2000,
    cultivationRate: 0.4,
    nextRealm: null, // Max realm for now
    requiresTribulation: true,
    stages: [
      { stage: 1, requiredPoints: 300000, description: '元婴初期' },
      { stage: 2, requiredPoints: 450000, description: '元婴稳固' },
      { stage: 3, requiredPoints: 650000, description: '元婴中期' },
      { stage: 4, requiredPoints: 900000, description: '神识大成' },
      { stage: 5, requiredPoints: 1200000, description: '元婴后期' },
      { stage: 6, requiredPoints: 1550000, description: '元婴圆满' }
    ],
    bonuses: {
      stats: {
        maxHealth: 1000,
        maxMana: 800,
        attack: 150,
        defense: 100
      },
      techniques: ['nascent_soul_escape', 'divine_sense', 'soul_attack']
    }
  }
};