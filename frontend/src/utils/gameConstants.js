/**
 * Game Constants
 * Central location for all game constants and configuration
 */

// Game States
export const GAME_STATES = {
  HOME: 'home',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused'
};

// Cultivation Realms
export const CULTIVATION_REALMS = {
  QI_GATHERING: 'qi_gathering',
  FOUNDATION_BUILDING: 'foundation_building',
  CORE_FORMATION: 'core_formation',
  NASCENT_SOUL: 'nascent_soul',
  SOUL_TRANSFORMATION: 'soul_transformation',
  VOID_TRIBULATION: 'void_tribulation',
  GREAT_ASCENSION: 'great_ascension'
};

// Spiritual Root Elements
export const SPIRITUAL_ELEMENTS = {
  FIRE: 'fire',
  WATER: 'water',
  WOOD: 'wood',
  METAL: 'metal',
  EARTH: 'earth',
  THUNDER: 'thunder',
  WIND: 'wind',
  ICE: 'ice',
  DARK: 'dark',
  LIGHT: 'light'
};

// Item Types
export const ITEM_TYPES = {
  PILL: 'pill',
  TREASURE: 'treasure',
  WEAPON: 'weapon',
  ARMOR: 'armor',
  ACCESSORY: 'accessory',
  MATERIAL: 'material',
  CONSUMABLE: 'consumable',
  MISC: 'misc'
};

// Item Rarities
export const ITEM_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  MYTHICAL: 'mythical',
  IMMORTAL: 'immortal'
};

// Equipment Slots
export const EQUIPMENT_SLOTS = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  ACCESSORY: 'accessory',
  TREASURE: 'treasure'
};

// Sect Types
export const SECT_TYPES = {
  RIGHTEOUS: 'righteous',
  DEMONIC: 'demonic',
  NEUTRAL: 'neutral',
  ANCIENT: 'ancient'
};

// Sect Relationships
export const SECT_RELATIONSHIPS = {
  ALLIED: 'allied',
  FRIENDLY: 'friendly',
  NEUTRAL: 'neutral',
  HOSTILE: 'hostile',
  ENEMY: 'enemy'
};

// Weather Types
export const WEATHER_TYPES = {
  CLEAR: 'clear',
  CLOUDY: 'cloudy',
  RAIN: 'rain',
  STORM: 'storm',
  SNOW: 'snow',
  FOG: 'fog',
  SPIRITUAL_STORM: 'spiritual_storm'
};

// Time of Day
export const TIME_OF_DAY = {
  DAWN: 'dawn',
  MORNING: 'morning',
  NOON: 'noon',
  AFTERNOON: 'afternoon',
  DUSK: 'dusk',
  NIGHT: 'night',
  MIDNIGHT: 'midnight'
};

// Combat States
export const COMBAT_STATES = {
  IDLE: 'idle',
  COMBAT: 'combat',
  CASTING: 'casting',
  STUNNED: 'stunned',
  DEAD: 'dead'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  CULTIVATION: 'cultivation',
  COMBAT: 'combat',
  QUEST: 'quest'
};

// Audio Types
export const AUDIO_TYPES = {
  MUSIC: 'music',
  SFX: 'sfx',
  VOICE: 'voice'
};

// Technique Types
export const TECHNIQUE_TYPES = {
  CULTIVATION: 'cultivation',
  COMBAT: 'combat',
  MOVEMENT: 'movement',
  SUPPORT: 'support',
  SPECIAL: 'special'
};

// Tribulation Types
export const TRIBULATION_TYPES = {
  LIGHTNING: 'lightning',
  FIRE: 'fire',
  INNER_DEMON: 'inner_demon',
  VOID: 'void',
  CELESTIAL: 'celestial'
};

// World Regions
export const WORLD_REGIONS = {
  STARTING_VILLAGE: 'starting_village',
  MYSTIC_FOREST: 'mystic_forest',
  ANCIENT_RUINS: 'ancient_ruins',
  SPIRITUAL_MOUNTAIN: 'spiritual_mountain',
  DEMON_TERRITORY: 'demon_territory',
  SECT_GROUNDS: 'sect_grounds',
  HIDDEN_VALLEY: 'hidden_valley',
  CELESTIAL_REALM: 'celestial_realm'
};

// NPC Types
export const NPC_TYPES = {
  MERCHANT: 'merchant',
  ELDER: 'elder',
  DISCIPLE: 'disciple',
  MASTER: 'master',
  SECT_LEADER: 'sect_leader',
  ROGUE_CULTIVATOR: 'rogue_cultivator',
  ENEMY: 'enemy',
  SPIRIT_BEAST: 'spirit_beast'
};

// Quest Types
export const QUEST_TYPES = {
  MAIN: 'main',
  SIDE: 'side',
  SECT: 'sect',
  DAILY: 'daily',
  CHALLENGE: 'challenge',
  HIDDEN: 'hidden'
};

// Quest Status
export const QUEST_STATUS = {
  AVAILABLE: 'available',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
  LOCKED: 'locked'
};

// Alchemy Categories
export const ALCHEMY_CATEGORIES = {
  HEALING: 'healing',
  CULTIVATION: 'cultivation',
  ENHANCEMENT: 'enhancement',
  POISON: 'poison',
  UTILITY: 'utility',
  RARE: 'rare'
};

// Game Difficulty
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
  NIGHTMARE: 'nightmare'
};

// Save Slot Configuration
export const SAVE_CONFIG = {
  MAX_SLOTS: 5,
  AUTO_SAVE_SLOT: 1,
  QUICK_SAVE_SLOT: 1
};

// UI Configuration
export const UI_CONFIG = {
  NOTIFICATION_DURATION: {
    SHORT: 2000,
    MEDIUM: 3000,
    LONG: 5000,
    VERY_LONG: 8000
  },
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
  }
};

// Color Themes
export const COLOR_THEMES = {
  CULTIVATION: {
    QI_GATHERING: '#4A90E2',
    FOUNDATION_BUILDING: '#7ED321', 
    CORE_FORMATION: '#F5A623',
    NASCENT_SOUL: '#D0021B',
    SOUL_TRANSFORMATION: '#9013FE',
    VOID_TRIBULATION: '#000000',
    GREAT_ASCENSION: '#FFD700'
  },
  RARITY: {
    COMMON: '#FFFFFF',
    UNCOMMON: '#1EFF00',
    RARE: '#0099FF',
    EPIC: '#A335EE',
    LEGENDARY: '#FF8000',
    MYTHICAL: '#E6CC80',
    IMMORTAL: '#FFD700'
  },
  ELEMENTS: {
    FIRE: '#FF4444',
    WATER: '#4488FF',
    WOOD: '#44FF44',
    METAL: '#CCCCCC',
    EARTH: '#AA6C39',
    THUNDER: '#FFFF44',
    WIND: '#88FFAA',
    ICE: '#AAFFFF',
    DARK: '#444444',
    LIGHT: '#FFFFAA'
  }
};

// Game Balance Constants
export const BALANCE = {
  // Cultivation rates (points per second)
  BASE_CULTIVATION_RATE: 1,
  
  // Spiritual energy regeneration
  SPIRITUAL_ENERGY_REGEN: 0.1,
  
  // Health regeneration
  HEALTH_REGEN: 0.05,
  
  // Mana regeneration  
  MANA_REGEN: 0.2,
  
  // Energy regeneration
  ENERGY_REGEN: 1,
  
  // Breakthrough success rates
  STAGE_BREAKTHROUGH_BASE: 0.7,
  REALM_BREAKTHROUGH_BASE: 0.5,
  TRIBULATION_SUCCESS_BASE: 0.3,
  
  // Experience multipliers
  COMBAT_EXP_MULTIPLIER: 1.0,
  QUEST_EXP_MULTIPLIER: 1.5,
  CULTIVATION_EXP_MULTIPLIER: 0.5,
  
  // Item drop rates
  COMMON_DROP_RATE: 0.6,
  UNCOMMON_DROP_RATE: 0.25,
  RARE_DROP_RATE: 0.1,
  EPIC_DROP_RATE: 0.04,
  LEGENDARY_DROP_RATE: 0.01
};

// Default Settings
export const DEFAULT_SETTINGS = {
  language: 'zh-CN',
  musicVolume: 0.8,
  sfxVolume: 0.8,
  voiceVolume: 0.8,
  graphics: 'medium',
  autoSave: true,
  showDamageNumbers: true,
  showNotifications: true,
  difficulty: DIFFICULTY_LEVELS.NORMAL
};

// Export all constants as default object
export default {
  GAME_STATES,
  CULTIVATION_REALMS,
  SPIRITUAL_ELEMENTS,
  ITEM_TYPES,
  ITEM_RARITY,
  EQUIPMENT_SLOTS,
  SECT_TYPES,
  SECT_RELATIONSHIPS,
  WEATHER_TYPES,
  TIME_OF_DAY,
  COMBAT_STATES,
  NOTIFICATION_TYPES,
  AUDIO_TYPES,
  TECHNIQUE_TYPES,
  TRIBULATION_TYPES,
  WORLD_REGIONS,
  NPC_TYPES,
  QUEST_TYPES,
  QUEST_STATUS,
  ALCHEMY_CATEGORIES,
  DIFFICULTY_LEVELS,
  SAVE_CONFIG,
  UI_CONFIG,
  COLOR_THEMES,
  BALANCE,
  DEFAULT_SETTINGS
};