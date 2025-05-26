export const WORLD_LOCATIONS_DATA = {
  // Starting Village Locations
  'village_center': {
    id: 'village_center',
    name: '村中心',
    nameEn: 'Village Center',
    region: WORLD_REGIONS.STARTING_VILLAGE,
    description: '村子的中心广场，有一座古老的石碑',
    npcs: ['village_elder', 'merchant_chen'],
    features: ['notice_board', 'teleport_stone'],
    canCultivate: true,
    cultivationBonus: 0
  },

  'training_ground': {
    id: 'training_ground',
    name: '练功场',
    nameEn: 'Training Ground',
    region: WORLD_REGIONS.STARTING_VILLAGE,
    description: '村子的练功场所，适合初学者修炼',
    npcs: ['instructor_wang'],
    features: ['training_dummies', 'practice_area'],
    canCultivate: true,
    cultivationBonus: 0.1
  },

  // Mystic Forest Locations
  'forest_entrance': {
    id: 'forest_entrance',
    name: '森林入口',
    nameEn: 'Forest Entrance',
    region: WORLD_REGIONS.MYSTIC_FOREST,
    description: '迷雾森林的入口，古树参天',
    npcs: ['forest_guide'],
    features: ['ancient_trees', 'spirit_herbs'],
    canCultivate: true,
    cultivationBonus: 0.2,
    encounters: ['forest_wolf', 'spirit_rabbit']
  },

  'spirit_spring': {
    id: 'spirit_spring',
    name: '灵泉',
    nameEn: 'Spirit Spring',
    region: WORLD_REGIONS.MYSTIC_FOREST,
    description: '森林深处的灵泉，泉水蕴含纯净灵气',
    npcs: [],
    features: ['healing_spring', 'meditation_stones'],
    canCultivate: true,
    cultivationBonus: 0.5,
    specialEffects: {
      healingRate: 2.0,
      spiritualEnergyRegen: 1.5
    }
  }
};

export default WORLD_LOCATIONS_DATA;