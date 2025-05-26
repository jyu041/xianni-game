export const CULTIVATION_TECHNIQUES_DATA = {
  // Basic Techniques
  'basic_qi_cultivation': {
    id: 'basic_qi_cultivation',
    name: '基础练气法',
    nameEn: 'Basic Qi Cultivation',
    type: 'cultivation',
    rarity: 'common',
    description: '最基础的练气功法，适合初学者',
    efficiency: 1.0,
    elements: [],
    requiredRealm: CULTIVATION_REALMS.QI_GATHERING,
    requiredStage: 1,
    effects: {
      cultivationRate: 1.0,
      spiritualEnergyRegen: 0.1
    }
  },

  'five_elements_technique': {
    id: 'five_elements_technique',
    name: '五行练气诀',
    nameEn: 'Five Elements Technique',
    type: 'cultivation',
    rarity: 'uncommon',
    description: '融合五行之力的练气功法，修炼速度较快',
    efficiency: 1.5,
    elements: [SPIRITUAL_ELEMENTS.FIRE, SPIRITUAL_ELEMENTS.WATER, SPIRITUAL_ELEMENTS.WOOD, SPIRITUAL_ELEMENTS.METAL, SPIRITUAL_ELEMENTS.EARTH],
    requiredRealm: CULTIVATION_REALMS.QI_GATHERING,
    requiredStage: 3,
    requiredSpiritualRoots: {
      fire: 20,
      water: 20,
      wood: 20,
      metal: 20,
      earth: 20
    },
    effects: {
      cultivationRate: 1.5,
      spiritualEnergyRegen: 0.15,
      allElementsBonus: 0.1
    }
  },

  // Combat Techniques
  'basic_sword_technique': {
    id: 'basic_sword_technique',
    name: '基础剑法',
    nameEn: 'Basic Sword Technique',
    type: 'combat',
    rarity: 'common',
    description: '基础的剑术技巧',
    efficiency: 1.0,
    elements: [],
    requiredRealm: CULTIVATION_REALMS.FOUNDATION_BUILDING,
    requiredStage: 1,
    manaCost: 10,
    damage: 50,
    effects: {
      attackBonus: 10
    }
  },

  'flying_sword': {
    id: 'flying_sword',
    name: '御剑术',
    nameEn: 'Flying Sword',
    type: 'combat',
    rarity: 'rare',
    description: '御使飞剑攻击敌人，威力强大',
    efficiency: 2.0,
    elements: [SPIRITUAL_ELEMENTS.METAL],
    requiredRealm: CULTIVATION_REALMS.CORE_FORMATION,
    requiredStage: 1,
    manaCost: 50,
    damage: 200,
    effects: {
      attackBonus: 50,
      range: 'long'
    }
  },

  // Defensive Techniques
  'qi_shield': {
    id: 'qi_shield',
    name: '气盾术',
    nameEn: 'Qi Shield',
    type: 'defensive',
    rarity: 'common',
    description: '用灵气形成护盾，抵挡攻击',
    efficiency: 1.0,
    elements: [],
    requiredRealm: CULTIVATION_REALMS.FOUNDATION_BUILDING,
    requiredStage: 1,
    manaCost: 20,
    effects: {
      defenseBonus: 20,
      duration: 30
    }
  }
};