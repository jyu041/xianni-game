export const TREASURES_AND_ARTIFACTS_DATA = {
  'novice_sword': {
    id: 'novice_sword',
    name: '新手剑',
    nameEn: 'Novice Sword',
    type: 'weapon',
    rarity: ITEM_RARITY.COMMON,
    description: '普通的铁剑，适合初学者使用',
    slot: 'weapon',
    level: 1,
    stats: {
      attack: 10,
      durability: 100
    },
    requirements: {
      realm: CULTIVATION_REALMS.QI_GATHERING,
      stage: 1
    }
  },

  'spirit_sword': {
    id: 'spirit_sword',
    name: '灵剑',
    nameEn: 'Spirit Sword',
    type: 'weapon',
    rarity: ITEM_RARITY.UNCOMMON,
    description: '蕴含灵气的宝剑，锋利无比',
    slot: 'weapon',
    level: 10,
    stats: {
      attack: 50,
      mana: 20,
      durability: 200
    },
    requirements: {
      realm: CULTIVATION_REALMS.FOUNDATION_BUILDING,
      stage: 1
    },
    special: {
      ability: 'spirit_strike',
      chance: 0.15
    }
  },

  'cultivator_robe': {
    id: 'cultivator_robe',
    name: '修士袍',
    nameEn: 'Cultivator Robe',
    type: 'armor',
    rarity: ITEM_RARITY.COMMON,
    description: '修炼者穿着的长袍，可提升灵气运转',
    slot: 'armor',
    level: 5,
    stats: {
      defense: 15,
      maxSpiritualEnergy: 50,
      spiritualEnergyRegen: 0.1
    },
    requirements: {
      realm: CULTIVATION_REALMS.QI_GATHERING,
      stage: 3
    }
  }
};