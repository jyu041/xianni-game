import { SECT_TYPES, SECT_RELATIONSHIPS } from '../../utils/gameConstants.js';

export const SECT_INFORMATION_DATA = {
  'azure_cloud_sect': {
    id: 'azure_cloud_sect',
    name: '青云门',
    nameEn: 'Azure Cloud Sect',
    type: SECT_TYPES.RIGHTEOUS,
    description: '正道大派，以剑修闻名天下',
    reputation: 0,
    location: 'azure_mountains',
    specialties: ['sword_cultivation', 'flying_techniques'],
    requirements: {
      minRealm: CULTIVATION_REALMS.QI_GATHERING,
      minStage: 5,
      spiritRootRequirement: {
        any: 30
      }
    },
    benefits: {
      techniques: ['azure_sword_art', 'cloud_stepping'],
      resources: ['sect_library', 'spirit_spring'],
      protection: 'high'
    },
    relationships: {
      'demon_heart_sect': SECT_RELATIONSHIPS.ENEMY,
      'mystic_valley': SECT_RELATIONSHIPS.ALLIED
    }
  },

  'demon_heart_sect': {
    id: 'demon_heart_sect',
    name: '魔心宗',
    nameEn: 'Demon Heart Sect',
    type: SECT_TYPES.DEMONIC,
    description: '魔道宗门，修炼速度极快但风险极高',
    reputation: 0,
    location: 'shadow_peaks',
    specialties: ['demon_cultivation', 'soul_techniques'],
    requirements: {
      minRealm: CULTIVATION_REALMS.QI_GATHERING,
      minStage: 3,
      spiritRootRequirement: {
        dark: 25
      }
    },
    benefits: {
      techniques: ['demon_heart_sutra', 'soul_devouring'],
      resources: ['demon_pool', 'soul_chamber'],
      protection: 'medium'
    },
    relationships: {
      'azure_cloud_sect': SECT_RELATIONSHIPS.ENEMY,
      'blood_moon_cult': SECT_RELATIONSHIPS.ALLIED
    }
  }
};

export default {
  CULTIVATION_REALMS_DATA,
  CULTIVATION_TECHNIQUES_DATA,
  HEAVENLY_TRIBULATIONS_DATA,
  PILLS_AND_MEDICINES_DATA,
  TREASURES_AND_ARTIFACTS_DATA,
  SECT_INFORMATION_DATA
};