import { WORLD_REGIONS, WEATHER_TYPES, CULTIVATION_REALMS } from '../../utils/gameConstants.js';

export const WORLD_REGIONS_DATA = {
  [WORLD_REGIONS.STARTING_VILLAGE]: {
    id: WORLD_REGIONS.STARTING_VILLAGE,
    name: '新手村',
    nameEn: 'Starting Village',
    description: '修炼者的起始之地，灵气稀薄但安全',
    level: 1,
    defaultLocation: 'village_center',
    weatherPatterns: {
      [WEATHER_TYPES.CLEAR]: 0.5,
      [WEATHER_TYPES.CLOUDY]: 0.3,
      [WEATHER_TYPES.RAIN]: 0.2
    },
    effects: {
      spiritualEnergyMod: 1.0,
      dangerLevel: 0,
      cultivationBonus: 0
    },
    requirements: null,
    enterMessage: '来到了宁静的新手村'
  },

  [WORLD_REGIONS.MYSTIC_FOREST]: {
    id: WORLD_REGIONS.MYSTIC_FOREST,
    name: '迷雾森林',
    nameEn: 'Mystic Forest',
    description: '古老的森林，灵气浓郁，但有妖兽出没',
    level: 10,
    defaultLocation: 'forest_entrance',
    weatherPatterns: {
      [WEATHER_TYPES.CLEAR]: 0.3,
      [WEATHER_TYPES.CLOUDY]: 0.4,
      [WEATHER_TYPES.FOG]: 0.3
    },
    effects: {
      spiritualEnergyMod: 1.5,
      dangerLevel: 2,
      cultivationBonus: 0.2
    },
    requirements: {
      minRealm: CULTIVATION_REALMS.QI_GATHERING,
      minStage: 5
    },
    enterMessage: '进入了灵气浓郁的迷雾森林，小心妖兽！'
  },

  [WORLD_REGIONS.SPIRITUAL_MOUNTAIN]: {
    id: WORLD_REGIONS.SPIRITUAL_MOUNTAIN,
    name: '灵霄山',
    nameEn: 'Spiritual Mountain',
    description: '高耸入云的灵山，修炼圣地',
    level: 25,
    defaultLocation: 'mountain_base',
    weatherPatterns: {
      [WEATHER_TYPES.CLEAR]: 0.6,
      [WEATHER_TYPES.CLOUDY]: 0.2,
      [WEATHER_TYPES.SPIRITUAL_STORM]: 0.2
    },
    effects: {
      spiritualEnergyMod: 2.0,
      dangerLevel: 1,
      cultivationBonus: 0.5
    },
    requirements: {
      minRealm: CULTIVATION_REALMS.FOUNDATION_BUILDING,
      minStage: 1
    },
    enterMessage: '踏上了灵霄山，天地灵气扑面而来'
  }
};

export default WORLD_REGIONS_DATA;