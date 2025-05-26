export const HEAVENLY_TRIBULATIONS_DATA = {
  'foundation_building_tribulation': {
    id: 'foundation_building_tribulation',
    name: '筑基天劫',
    nameEn: 'Foundation Building Tribulation',
    description: '筑基期的天劫，三道雷电',
    type: 'lightning',
    waves: 3,
    difficulty: 'easy',
    rewards: {
      experience: 5000,
      cultivationPoints: 2000,
      items: ['thunder_essence']
    },
    penalties: {
      healthLoss: 0.5,
      cultivationLoss: 0.3
    }
  },

  'core_formation_tribulation': {
    id: 'core_formation_tribulation',
    name: '结丹天劫',
    nameEn: 'Core Formation Tribulation',
    description: '结丹期的天劫，九道雷电加心魔',
    type: 'lightning',
    waves: 9,
    difficulty: 'medium',
    hasInnerDemon: true,
    rewards: {
      experience: 20000,
      cultivationPoints: 10000,
      items: ['tribulation_essence', 'lightning_crystal']
    },
    penalties: {
      healthLoss: 0.7,
      cultivationLoss: 0.5
    }
  },

  'nascent_soul_tribulation': {
    id: 'nascent_soul_tribulation',
    name: '化婴天劫',
    nameEn: 'Nascent Soul Tribulation',
    description: '化婴期的天劫，十八道雷电，威力巨大',
    type: 'lightning',
    waves: 18,
    difficulty: 'hard',
    hasInnerDemon: true,
    rewards: {
      experience: 100000,
      cultivationPoints: 50000,
      items: ['nascent_soul_essence', 'heaven_defying_pill']
    },
    penalties: {
      healthLoss: 0.9,
      cultivationLoss: 0.7
    }
  }
};