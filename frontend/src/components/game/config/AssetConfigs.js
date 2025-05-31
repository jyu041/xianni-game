// frontend/src/components/game/config/AssetConfigs.js

// Main character asset configurations
export const MAIN_CHARACTER_ASSETS = [
  // Idle animations
  { key: 'mainChar_idle_down', path: '/assets/characters/mainCharacter/IDLE/idle_down.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_idle_up', path: '/assets/characters/mainCharacter/IDLE/idle_up.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_idle_left', path: '/assets/characters/mainCharacter/IDLE/idle_left.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_idle_right', path: '/assets/characters/mainCharacter/IDLE/idle_right.png', frameSize: { width: 96, height: 80 } },
  
  // Run animations
  { key: 'mainChar_run_down', path: '/assets/characters/mainCharacter/RUN/run_down.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_run_up', path: '/assets/characters/mainCharacter/RUN/run_up.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_run_left', path: '/assets/characters/mainCharacter/RUN/run_left.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_run_right', path: '/assets/characters/mainCharacter/RUN/run_right.png', frameSize: { width: 96, height: 80 } },
  
  // Attack 1 animations
  { key: 'mainChar_attack1_down', path: '/assets/characters/mainCharacter/ATTACK 1/attack1_down.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_attack1_up', path: '/assets/characters/mainCharacter/ATTACK 1/attack1_up.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_attack1_left', path: '/assets/characters/mainCharacter/ATTACK 1/attack1_left.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_attack1_right', path: '/assets/characters/mainCharacter/ATTACK 1/attack1_right.png', frameSize: { width: 96, height: 80 } },
  
  // Attack 2 animations
  { key: 'mainChar_attack2_down', path: '/assets/characters/mainCharacter/ATTACK 2/attack2_down.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_attack2_up', path: '/assets/characters/mainCharacter/ATTACK 2/attack2_up.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_attack2_left', path: '/assets/characters/mainCharacter/ATTACK 2/attack2_left.png', frameSize: { width: 96, height: 80 } },
  { key: 'mainChar_attack2_right', path: '/assets/characters/mainCharacter/ATTACK 2/attack2_right.png', frameSize: { width: 96, height: 80 } }
];

// Enemy asset configurations organized by enemy type
export const ENEMY_ASSETS = {
  evilWizard1: [
    { key: 'enemy_evilWizard1_idle', path: '/assets/characters/enemies/evilWizard1/Idle.png' },
    { key: 'enemy_evilWizard1_move', path: '/assets/characters/enemies/evilWizard1/Move.png' },
    { key: 'enemy_evilWizard1_attack', path: '/assets/characters/enemies/evilWizard1/Attack.png' },
    { key: 'enemy_evilWizard1_death', path: '/assets/characters/enemies/evilWizard1/Death.png' },
    { key: 'enemy_evilWizard1_hit', path: '/assets/characters/enemies/evilWizard1/Take Hit.png' }
  ],

  evilWizard2: [
    { key: 'enemy_evilWizard2_idle', path: '/assets/characters/enemies/evilWizard2/Idle.png' },
    { key: 'enemy_evilWizard2_run', path: '/assets/characters/enemies/evilWizard2/Run.png' },
    { key: 'enemy_evilWizard2_attack1', path: '/assets/characters/enemies/evilWizard2/Attack1.png' },
    { key: 'enemy_evilWizard2_attack2', path: '/assets/characters/enemies/evilWizard2/Attack2.png' },
    { key: 'enemy_evilWizard2_death', path: '/assets/characters/enemies/evilWizard2/Death.png' },
    { key: 'enemy_evilWizard2_hit', path: '/assets/characters/enemies/evilWizard2/Take hit.png' },
    { key: 'enemy_evilWizard2_jump', path: '/assets/characters/enemies/evilWizard2/Jump.png' },
    { key: 'enemy_evilWizard2_fall', path: '/assets/characters/enemies/evilWizard2/Fall.png' }
  ],

  evilWizard3: [
    { key: 'enemy_evilWizard3_idle', path: '/assets/characters/enemies/evilWizard3/Idle.png' },
    { key: 'enemy_evilWizard3_run', path: '/assets/characters/enemies/evilWizard3/Run.png' },
    { key: 'enemy_evilWizard3_walk', path: '/assets/characters/enemies/evilWizard3/Walk.png' },
    { key: 'enemy_evilWizard3_attack', path: '/assets/characters/enemies/evilWizard3/Attack.png' },
    { key: 'enemy_evilWizard3_death', path: '/assets/characters/enemies/evilWizard3/Death.png' },
    { key: 'enemy_evilWizard3_hit', path: '/assets/characters/enemies/evilWizard3/Get hit.png' },
    { key: 'enemy_evilWizard3_jump', path: '/assets/characters/enemies/evilWizard3/Jump.png' },
    { key: 'enemy_evilWizard3_fall', path: '/assets/characters/enemies/evilWizard3/Fall.png' }
  ],

  fighter: [
    { key: 'enemy_fighter_idle', path: '/assets/characters/enemies/fighter/Idle.png' },
    { key: 'enemy_fighter_run', path: '/assets/characters/enemies/fighter/Run.png' },
    { key: 'enemy_fighter_walk', path: '/assets/characters/enemies/fighter/Walk.png' },
    { key: 'enemy_fighter_attack1', path: '/assets/characters/enemies/fighter/Attack_1.png' },
    { key: 'enemy_fighter_attack2', path: '/assets/characters/enemies/fighter/Attack_2.png' },
    { key: 'enemy_fighter_attack3', path: '/assets/characters/enemies/fighter/Attack_3.png' },
    { key: 'enemy_fighter_dead', path: '/assets/characters/enemies/fighter/Dead.png' },
    { key: 'enemy_fighter_hurt', path: '/assets/characters/enemies/fighter/Hurt.png' },
    { key: 'enemy_fighter_jump', path: '/assets/characters/enemies/fighter/Jump.png' },
    { key: 'enemy_fighter_shield', path: '/assets/characters/enemies/fighter/Shield.png' }
  ],

  martialHero1: [
    { key: 'enemy_martialHero1_idle', path: '/assets/characters/enemies/martialHero1/Idle.png' },
    { key: 'enemy_martialHero1_run', path: '/assets/characters/enemies/martialHero1/Run.png' },
    { key: 'enemy_martialHero1_attack1', path: '/assets/characters/enemies/martialHero1/Attack1.png' },
    { key: 'enemy_martialHero1_attack2', path: '/assets/characters/enemies/martialHero1/Attack2.png' },
    { key: 'enemy_martialHero1_death', path: '/assets/characters/enemies/martialHero1/Death.png' },
    { key: 'enemy_martialHero1_hit', path: '/assets/characters/enemies/martialHero1/Take Hit.png' },
    { key: 'enemy_martialHero1_jump', path: '/assets/characters/enemies/martialHero1/Jump.png' },
    { key: 'enemy_martialHero1_fall', path: '/assets/characters/enemies/martialHero1/Fall.png' }
  ],

  martialHero2: [
    { key: 'enemy_martialHero2_idle', path: '/assets/characters/enemies/martialHero2/Idle.png' },
    { key: 'enemy_martialHero2_run', path: '/assets/characters/enemies/martialHero2/Run.png' },
    { key: 'enemy_martialHero2_attack1', path: '/assets/characters/enemies/martialHero2/Attack1.png' },
    { key: 'enemy_martialHero2_attack2', path: '/assets/characters/enemies/martialHero2/Attack2.png' },
    { key: 'enemy_martialHero2_death', path: '/assets/characters/enemies/martialHero2/Death.png' },
    { key: 'enemy_martialHero2_hit', path: '/assets/characters/enemies/martialHero2/Take hit.png' },
    { key: 'enemy_martialHero2_jump', path: '/assets/characters/enemies/martialHero2/Jump.png' },
    { key: 'enemy_martialHero2_fall', path: '/assets/characters/enemies/martialHero2/Fall.png' }
  ],

  martialHero3: [
    { key: 'enemy_martialHero3_idle', path: '/assets/characters/enemies/martialHero3/Idle.png' },
    { key: 'enemy_martialHero3_run', path: '/assets/characters/enemies/martialHero3/Run.png' },
    { key: 'enemy_martialHero3_attack1', path: '/assets/characters/enemies/martialHero3/Attack1.png' },
    { key: 'enemy_martialHero3_attack2', path: '/assets/characters/enemies/martialHero3/Attack2.png' },
    { key: 'enemy_martialHero3_attack3', path: '/assets/characters/enemies/martialHero3/Attack3.png' },
    { key: 'enemy_martialHero3_death', path: '/assets/characters/enemies/martialHero3/Death.png' },
    { key: 'enemy_martialHero3_hit', path: '/assets/characters/enemies/martialHero3/Take Hit.png' },
    { key: 'enemy_martialHero3_up', path: '/assets/characters/enemies/martialHero3/Going Up.png' },
    { key: 'enemy_martialHero3_down', path: '/assets/characters/enemies/martialHero3/Going Down.png' }
  ],

  samurai1: [
    { key: 'enemy_samurai1_idle', path: '/assets/characters/enemies/samurai1/IDLE.png' },
    { key: 'enemy_samurai1_run', path: '/assets/characters/enemies/samurai1/RUN.png' },
    { key: 'enemy_samurai1_attack', path: '/assets/characters/enemies/samurai1/ATTACK 1.png' },
    { key: 'enemy_samurai1_hurt', path: '/assets/characters/enemies/samurai1/HURT.png' }
  ],

  samurai2: [
    { key: 'enemy_samurai2_idle', path: '/assets/characters/enemies/samurai2/Idle.png' },
    { key: 'enemy_samurai2_run', path: '/assets/characters/enemies/samurai2/Run.png' },
    { key: 'enemy_samurai2_walk', path: '/assets/characters/enemies/samurai2/Walk.png' },
    { key: 'enemy_samurai2_attack1', path: '/assets/characters/enemies/samurai2/Attack_1.png' },
    { key: 'enemy_samurai2_attack2', path: '/assets/characters/enemies/samurai2/Attack_2.png' },
    { key: 'enemy_samurai2_attack3', path: '/assets/characters/enemies/samurai2/Attack_3.png' },
    { key: 'enemy_samurai2_dead', path: '/assets/characters/enemies/samurai2/Dead.png' },
    { key: 'enemy_samurai2_hurt', path: '/assets/characters/enemies/samurai2/Hurt.png' },
    { key: 'enemy_samurai2_jump', path: '/assets/characters/enemies/samurai2/Jump.png' },
    { key: 'enemy_samurai2_shield', path: '/assets/characters/enemies/samurai2/Shield.png' }
  ],

  shinobi: [
    { key: 'enemy_shinobi_idle', path: '/assets/characters/enemies/shinobi/Idle.png' },
    { key: 'enemy_shinobi_run', path: '/assets/characters/enemies/shinobi/Run.png' },
    { key: 'enemy_shinobi_walk', path: '/assets/characters/enemies/shinobi/Walk.png' },
    { key: 'enemy_shinobi_attack1', path: '/assets/characters/enemies/shinobi/Attack_1.png' },
    { key: 'enemy_shinobi_attack2', path: '/assets/characters/enemies/shinobi/Attack_2.png' },
    { key: 'enemy_shinobi_attack3', path: '/assets/characters/enemies/shinobi/Attack_3.png' },
    { key: 'enemy_shinobi_dead', path: '/assets/characters/enemies/shinobi/Dead.png' },
    { key: 'enemy_shinobi_hurt', path: '/assets/characters/enemies/shinobi/Hurt.png' },
    { key: 'enemy_shinobi_jump', path: '/assets/characters/enemies/shinobi/Jump.png' },
    { key: 'enemy_shinobi_shield', path: '/assets/characters/enemies/shinobi/Shield.png' }
  ]
};

// Get all enemy asset arrays flattened with frame sizes
export const getAllEnemyAssets = () => {
  const allAssets = [];
  
  Object.entries(ENEMY_ASSETS).forEach(([enemyType, assets]) => {
    const frameSize = getEnemyFrameSize(enemyType);
    assets.forEach(asset => {
      allAssets.push({
        ...asset,
        frameSize
      });
    });
  });
  
  return allAssets;
};

// Get frame size for specific enemy type
export const getEnemyFrameSize = (enemyType) => {
  const frameSizes = {
    evilWizard1: { width: 150, height: 150 },
    evilWizard2: { width: 250, height: 250 },
    evilWizard3: { width: 140, height: 140 },
    fighter: { width: 128, height: 128 },
    martialHero1: { width: 200, height: 200 },
    martialHero2: { width: 200, height: 200 },
    martialHero3: { width: 126, height: 126 },
    samurai1: { width: 96, height: 96 },
    samurai2: { width: 128, height: 128 },
    shinobi: { width: 128, height: 128 }
  };
  
  return frameSizes[enemyType] || { width: 128, height: 128 };
};

// Get assets for specific enemy type
export const getEnemyAssets = (enemyType) => {
  const assets = ENEMY_ASSETS[enemyType] || [];
  const frameSize = getEnemyFrameSize(enemyType);
  
  return assets.map(asset => ({
    ...asset,
    frameSize
  }));
};