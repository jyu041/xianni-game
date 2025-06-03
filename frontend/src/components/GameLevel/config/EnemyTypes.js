// frontend/src/components/GameLevel/config/EnemyTypes.js

export const ENEMY_TYPES = {
  boyFighter: {
    key: 'boyFighter',
    path: 'misc/boyFighter',
    size: 70,
    health: 50,
    speedRange: [50, 70],
    damage: 10,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Only use Run.gif for movement
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  evilWizard1: {
    key: 'evilWizard1',
    path: 'evilWizards/evilWizard1',
    size: 96,
    health: 75,
    speedRange: [40, 60],
    damage: 15,
    animations: {
      idle: ['Idle.gif'],
      move: ['Move.gif'], // Use Move.gif as run equivalent
      attack: ['Attack.gif'],
      death: ['Death.gif'],
      hurt: ['Hurt.gif']
    }
  },
  
  evilWizard2: {
    key: 'evilWizard2',
    path: 'evilWizards/evilWizard2',
    size: 102,
    health: 100,
    speedRange: [35, 55],
    damage: 20,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },
  
  evilWizard3: {
    key: 'evilWizard3',
    path: 'evilWizards/evilWizard3',
    size: 108,
    health: 120,
    speedRange: [30, 50],
    damage: 25,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Cast.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  girlKitsune: {
    key: 'girlKitsune',
    path: 'misc/girlKitsune',
    size: 70,
    health: 50,
    speedRange: [50, 70],
    damage: 10,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack.gif', 'Cast_1.gif', 'Cast_2.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  girlKunoichi: {
    key: 'girlKunoichi',
    path: 'misc/girlKunoichi',
    size: 70,
    health: 50,
    speedRange: [50, 70],
    damage: 10,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  girlShinobi: {
    key: 'girlShinobi',
    path: 'misc/girlShinobi',
    size: 70,
    health: 50,
    speedRange: [50, 70],
    damage: 10,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  gorgon1: {
    key: 'gorgon1',
    path: 'gorgons/gorgon1',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif', 'Idle_2.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  gorgon2: {
    key: 'gorgon2',
    path: 'gorgons/gorgon2',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif', 'Idle_2.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },
    
  martialHero1: {
    key: 'martialHero1',
    path: 'martialHeros/martialHero1',
    size: 113,
    health: 60,
    speedRange: [45, 65],
    damage: 12,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },
  
  martialHero2: {
    key: 'martialHero2',
    path: 'martialHeros/martialHero2',
    size: 113,
    health: 65,
    speedRange: [45, 65],
    damage: 14,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },
  
  martialHero3: {
    key: 'martialHero3',
    path: 'martialHeros/martialHero3',
    size: 105,
    health: 70,
    speedRange: [40, 60],
    damage: 16,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Death.gif'],
      hurt: ['Hurt.gif']
    }
  },

  samurai1: {
    key: 'samurai1',
    path: 'samurais/samurai1',
    size: 91,
    health: 55,
    speedRange: [50, 70],
    damage: 18,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack.gif'],
      death: null, // No death animation
      hurt: ['Hurt.gif']
    }
  },
  
  samurai2: {
    key: 'samurai2',
    path: 'samurais/samurai2',
    size: 98,
    health: 65,
    speedRange: [45, 65],
    damage: 20,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },
  
  skeletonArcher: {
    key: 'skeletonArcher',
    path: 'skeletons/skeletonArcher',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif'],
      move: ['Walk.gif'], // Only Walk available for this enemy
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  skeletonSpearman: {
    key: 'skeletonSpearman',
    path: 'skeletons/skeletonSpearman',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  skeletonWarrior: {
    key: 'skeletonWarrior',
    path: 'skeletons/skeletonWarrior',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  tenguKarasu: {
    key: 'tenguKarasu',
    path: 'tengus/tenguKarasu',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif', 'Idle_2.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  tenguYamabushi: {
    key: 'tenguYamabushi',
    path: 'tengus/tenguYamabushi',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif', 'Idle_2.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  werewolf1: {
    key: 'werewolf1',
    path: 'werewolfs/werewolf1',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  werewolf2: {
    key: 'werewolf2',
    path: 'werewolfs/werewolf2',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  },

  werewolf3: {
    key: 'werewolf3',
    path: 'werewolfs/werewolf3',
    size: 75,
    health: 45,
    speedRange: [60, 80],
    damage: 15,
    animations: {
      idle: ['Idle.gif'],
      move: ['Run.gif'], // Use only Run.gif
      attack: ['Attack_1.gif', 'Attack_2.gif', 'Attack_3.gif'],
      death: ['Dead.gif'],
      hurt: ['Hurt.gif']
    }
  }
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

// Get random animation for enemy action - FIXED for consistent movement
export const getRandomAnimation = (enemyType, action) => {
  const animations = enemyType.animations[action];
  if (!animations || animations.length === 0) return null;
  
  // For movement, always prefer Run.gif if available
  if (action === 'move') {
    const runAnimation = animations.find(anim => anim.includes('Run.gif'));
    if (runAnimation) return runAnimation;
    // Fallback to first available movement animation
    return animations[0];
  }
  
  // For other actions, pick randomly
  return animations[Math.floor(Math.random() * animations.length)];
};

// Get full path to enemy animation
export const getEnemyAnimationPath = (enemyType, animationFile) => {
  return `/assets/characters/enemies/${enemyType.path}/${animationFile}`;
};