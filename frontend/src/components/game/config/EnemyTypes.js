// frontend/src/components/game/config/EnemyTypes.js

export const ENEMY_TYPES = {
  boyFighter: {
    key: 'boyFighter',
    texture: 'enemy_boyFighter_idle',
    size: 70,
    health: 50,
    speedRange: [50, 70],
    damage: 10,
    frameSize: { width: 128, height: 128 }
  },

  evilWizard1: {
    key: 'evilWizard1',
    texture: 'enemy_evilWizard1_idle',
    size: 96, // Increased by 20% from 80
    health: 75,
    speedRange: [40, 60],
    damage: 15,
    frameSize: { width: 150, height: 150 }
  },
  
  evilWizard2: {
    key: 'evilWizard2',
    texture: 'enemy_evilWizard2_idle',
    size: 102, // Increased by 20% from 85
    health: 100,
    speedRange: [35, 55],
    damage: 20,
    frameSize: { width: 250, height: 250 }
  },
  
  evilWizard3: {
    key: 'evilWizard3',
    texture: 'enemy_evilWizard3_idle',
    size: 108, // Increased by 20% from 90
    health: 120,
    speedRange: [30, 50],
    damage: 25,
    frameSize: { width: 140, height: 140 }
  },

  girlKitsune: {
    key: 'girlKitsune',
    texture: 'enemy_girlKitsune_idle',
    size: 70,
    health: 50,
    speedRange: [50, 70],
    damage: 10,
    frameSize: { width: 128, height: 128 }
  },

  girlKunoichi: {
    key: 'girlKunoichi',
    texture: 'enemy_girlKunoichi_idle',
    size: 70,
    health: 50,
    speedRange: [50, 70],
    damage: 10,
    frameSize: { width: 128, height: 128 }
  },

  girlShinobi: {
    key: 'girlShinobi',
    texture: 'enemy_girlShinobi_idle',
    size: 70,
    health: 50,
    speedRange: [50, 70],
    damage: 10,
    frameSize: { width: 128, height: 128 }
  },
    
  martialHero1: {
    key: 'martialHero1',
    texture: 'enemy_martialHero1_idle',
    size: 113, // Increased by 50% from 75
    health: 60,
    speedRange: [45, 65],
    damage: 12,
    frameSize: { width: 200, height: 200 }
  },
  
  martialHero2: {
    key: 'martialHero2',
    texture: 'enemy_martialHero2_idle',
    size: 113, // Increased by 50% from 75
    health: 65,
    speedRange: [45, 65],
    damage: 14,
    frameSize: { width: 200, height: 200 }
  },
  
  martialHero3: {
    key: 'martialHero3',
    texture: 'enemy_martialHero3_idle',
    size: 105, // Increased by 50% from 70
    health: 70,
    speedRange: [40, 60],
    damage: 16,
    frameSize: { width: 126, height: 126 }
  },
  
  ninjaMonk: {
    key: 'ninjaMonk',
    texture: 'enemy_ninjaMonk_idle',
    size: 91, // Increased by 40% from 65
    health: 55,
    speedRange: [50, 70],
    damage: 18,
    frameSize: { width: 96, height: 96 }
  },

  ninjaPeasant: {
    key: 'ninjaPeasant',
    texture: 'enemy_ninjaPeasant_idle',
    size: 91, // Increased by 40% from 65
    health: 55,
    speedRange: [50, 70],
    damage: 18,
    frameSize: { width: 96, height: 96 }
  },

  samurai1: {
    key: 'samurai1',
    texture: 'enemy_samurai1_idle',
    size: 91, // Increased by 40% from 65
    health: 55,
    speedRange: [50, 70],
    damage: 18,
    frameSize: { width: 96, height: 96 }
  },
  
  samurai2: {
    key: 'samurai2',
    texture: 'enemy_samurai2_idle',
    size: 98, // Increased by 40% from 70
    health: 65,
    speedRange: [45, 65],
    damage: 20,
    frameSize: { width: 128, height: 128 }
  },
  
  skeletonArcher: {
    key: 'skeletonArcher',
    texture: 'enemy_skeletonArcher_idle',
    size: 75, // Increased by 15% from 65
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    frameSize: { width: 128, height: 128 }
  },

  skeletonSpearman: {
    key: 'skeletonSpearman',
    texture: 'enemy_skeletonSpearman_idle',
    size: 75, // Increased by 15% from 65
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    frameSize: { width: 128, height: 128 }
  },

  skeletonWarrior: {
    key: 'skeletonWarrior',
    texture: 'enemy_skeletonWarrior_idle',
    size: 75, // Increased by 15% from 65
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    frameSize: { width: 128, height: 128 }
  },

  tenguKarasu: {
    key: 'tenguKarasu',
    texture: 'enemy_tenguKarasu_idle',
    size: 75, // Increased by 15% from 65
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    frameSize: { width: 128, height: 128 }
  },

  tenguYamabushi: {
    key: 'tenguYamabushi',
    texture: 'enemy_tenguYamabushi_idle',
    size: 75, // Increased by 15% from 65
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    frameSize: { width: 128, height: 128 }
  },

  werewolf1: {
    key: 'werewolf1',
    texture: 'enemy_werewolf1_idle',
    size: 75, // Increased by 15% from 65
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    frameSize: { width: 128, height: 128 }
  },

  werewolf2: {
    key: 'werewolf2',
    texture: 'enemy_werewolf2_idle',
    size: 75, // Increased by 15% from 65
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    frameSize: { width: 128, height: 128 }
  },

  werewolf3: {
    key: 'werewolf3',
    texture: 'enemy_werewolf3_idle',
    size: 75, // Increased by 15% from 65
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    frameSize: { width: 128, height: 128 }
  },

  
};

// Get array of all enemy types for random selection
export const getAllEnemyTypes = () => Object.values(ENEMY_TYPES);

// Get enemy type by key
export const getEnemyType = (key) => ENEMY_TYPES[key];

// Get random enemy type
export const getRandomEnemyType = () => {
  const types = getAllEnemyTypes();
  return types[Math.floor(Math.random() * types.length)];
};