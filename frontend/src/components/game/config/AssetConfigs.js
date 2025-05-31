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
  boyFighter: [
    { key: 'enemy_boyFighter_idle', path: '/assets/characters/enemies/boyFighter/Idle.png' },
    { key: 'enemy_boyFighter_run', path: '/assets/characters/enemies/boyFighter/Run.png' },
    { key: 'enemy_boyFighter_walk', path: '/assets/characters/enemies/boyFighter/Walk.png' },
    { key: 'enemy_boyFighter_attack1', path: '/assets/characters/enemies/boyFighter/Attack_1.png' },
    { key: 'enemy_boyFighter_attack2', path: '/assets/characters/enemies/boyFighter/Attack_2.png' },
    { key: 'enemy_boyFighter_attack3', path: '/assets/characters/enemies/boyFighter/Attack_3.png' },
    { key: 'enemy_boyFighter_death', path: '/assets/characters/enemies/boyFighter/Dead.png' },
    { key: 'enemy_boyFighter_hurt', path: '/assets/characters/enemies/boyFighter/Hurt.png' },
  ],

  evilWizard1: [
    { key: 'enemy_evilWizard1_attack', path: '/assets/characters/enemies/evilWizard1/Attack.png' },
    { key: 'enemy_evilWizard1_death', path: '/assets/characters/enemies/evilWizard1/Death.png' },
    { key: 'enemy_evilWizard1_idle', path: '/assets/characters/enemies/evilWizard1/Idle.png' },
    { key: 'enemy_evilWizard1_move', path: '/assets/characters/enemies/evilWizard1/Move.png' },
    { key: 'enemy_evilWizard1_hit', path: '/assets/characters/enemies/evilWizard1/Take Hit.png' }
  ],

  evilWizard2: [
    { key: 'enemy_evilWizard2_attack1', path: '/assets/characters/enemies/evilWizard2/Attack1.png' },
    { key: 'enemy_evilWizard2_attack2', path: '/assets/characters/enemies/evilWizard2/Attack2.png' },
    { key: 'enemy_evilWizard2_death', path: '/assets/characters/enemies/evilWizard2/Death.png' },
    { key: 'enemy_evilWizard2_idle', path: '/assets/characters/enemies/evilWizard2/Idle.png' },
    { key: 'enemy_evilWizard2_hit', path: '/assets/characters/enemies/evilWizard2/Take hit.png' },
    { key: 'enemy_evilWizard2_run', path: '/assets/characters/enemies/evilWizard2/Run.png' },
  ],

  evilWizard3: [
    { key: 'enemy_evilWizard3_attack', path: '/assets/characters/enemies/evilWizard3/Attack.png' },
    { key: 'enemy_evilWizard3_death', path: '/assets/characters/enemies/evilWizard3/Death.png' },
    { key: 'enemy_evilWizard3_hit', path: '/assets/characters/enemies/evilWizard3/Get hit.png' },
    { key: 'enemy_evilWizard3_idle', path: '/assets/characters/enemies/evilWizard3/Idle.png' },
    { key: 'enemy_evilWizard3_run', path: '/assets/characters/enemies/evilWizard3/Run.png' },
    { key: 'enemy_evilWizard3_walk', path: '/assets/characters/enemies/evilWizard3/Walk.png' },
  ],

  girlKitsune: [
    { key: 'enemy_girlKitsune_attack1', path: '/assets/characters/enemies/girlKitsune/Attack_1.png' },
    { key: 'enemy_girlKitsune_attack2', path: '/assets/characters/enemies/girlKitsune/Attack_2.png' },
    { key: 'enemy_girlKitsune_attack3', path: '/assets/characters/enemies/girlKitsune/Attack_3.png' },
    { key: 'enemy_girlKitsune_death', path: '/assets/characters/enemies/girlKitsune/Dead.png' },
    { key: 'enemy_girlKitsune_hit', path: '/assets/characters/enemies/girlKitsune/Hurt.png' },
    { key: 'enemy_girlKitsune_idle', path: '/assets/characters/enemies/girlKitsune/Idle.png' },
    { key: 'enemy_girlKitsune_run', path: '/assets/characters/enemies/girlKitsune/Run.png' },
    { key: 'enemy_girlKitsune_walk', path: '/assets/characters/enemies/girlKitsune/Walk.png' },
  ],

  girlKunoichi: [
    { key: 'enemy_girlKunoichi_attack1', path: '/assets/characters/enemies/girlKunoichi/Attack_1.png' },
    { key: 'enemy_girlKunoichi_attack2', path: '/assets/characters/enemies/girlKunoichi/Attack_2.png' },
    { key: 'enemy_girlKunoichi_death', path: '/assets/characters/enemies/girlKunoichi/Dead.png' },
    { key: 'enemy_girlKunoichi_hit', path: '/assets/characters/enemies/girlKunoichi/Hurt.png' },
    { key: 'enemy_girlKunoichi_idle', path: '/assets/characters/enemies/girlKunoichi/Idle.png' },
    { key: 'enemy_girlKunoichi_run', path: '/assets/characters/enemies/girlKunoichi/Run.png' },
    { key: 'enemy_girlKunoichi_walk', path: '/assets/characters/enemies/girlKunoichi/Walk.png' },
  ],

  girlShinobi: [
    { key: 'enemy_girlShinobi_attack1', path: '/assets/characters/enemies/girlShinobi/Attack_1.png' },
    { key: 'enemy_girlShinobi_attack2', path: '/assets/characters/enemies/girlShinobi/Attack_2.png' },
    { key: 'enemy_girlShinobi_attack3', path: '/assets/characters/enemies/girlShinobi/Attack_3.png' },
    { key: 'enemy_girlShinobi_death', path: '/assets/characters/enemies/girlShinobi/Dead.png' },
    { key: 'enemy_girlShinobi_hit', path: '/assets/characters/enemies/girlShinobi/Hurt.png' },
    { key: 'enemy_girlShinobi_idle', path: '/assets/characters/enemies/girlShinobi/Idle.png' },
    { key: 'enemy_girlShinobi_run', path: '/assets/characters/enemies/girlShinobi/Run.png' },
    { key: 'enemy_girlShinobi_walk', path: '/assets/characters/enemies/girlShinobi/Walk.png' },
  ],

  gorgon1: [
    { key: 'enemy_gorgon1_attack1', path: '/assets/characters/enemies/gorgon1/Attack_1.png' },
    { key: 'enemy_gorgon1_attack2', path: '/assets/characters/enemies/gorgon1/Attack_2.png' },
    { key: 'enemy_gorgon1_attack3', path: '/assets/characters/enemies/gorgon1/Attack_3.png' },
    { key: 'enemy_gorgon1_death', path: '/assets/characters/enemies/gorgon1/Dead.png' },
    { key: 'enemy_gorgon1_hit', path: '/assets/characters/enemies/gorgon1/Hurt.png' },
    { key: 'enemy_gorgon1_idle', path: '/assets/characters/enemies/gorgon1/Idle.png' },
    { key: 'enemy_gorgon1_run', path: '/assets/characters/enemies/gorgon1/Run.png' },
    { key: 'enemy_gorgon1_walk', path: '/assets/characters/enemies/gorgon1/Walk.png' },
  ],

  gorgon2: [
    { key: 'enemy_gorgon2_attack1', path: '/assets/characters/enemies/gorgon2/Attack_1.png' },
    { key: 'enemy_gorgon2_attack2', path: '/assets/characters/enemies/gorgon2/Attack_2.png' },
    { key: 'enemy_gorgon2_attack3', path: '/assets/characters/enemies/gorgon2/Attack_3.png' },
    { key: 'enemy_gorgon2_death', path: '/assets/characters/enemies/gorgon2/Dead.png' },
    { key: 'enemy_gorgon2_hit', path: '/assets/characters/enemies/gorgon2/Hurt.png' },
    { key: 'enemy_gorgon2_idle', path: '/assets/characters/enemies/gorgon2/Idle.png' },
    { key: 'enemy_gorgon2_run', path: '/assets/characters/enemies/gorgon2/Run.png' },
    { key: 'enemy_gorgon2_walk', path: '/assets/characters/enemies/gorgon2/Walk.png' },
  ],

  gorgon3: [
    { key: 'enemy_gorgon3_attack1', path: '/assets/characters/enemies/gorgon3/Attack_1.png' },
    { key: 'enemy_gorgon3_attack2', path: '/assets/characters/enemies/gorgon3/Attack_2.png' },
    { key: 'enemy_gorgon3_attack3', path: '/assets/characters/enemies/gorgon3/Attack_3.png' },
    { key: 'enemy_gorgon3_death', path: '/assets/characters/enemies/gorgon3/Dead.png' },
    { key: 'enemy_gorgon3_hit', path: '/assets/characters/enemies/gorgon3/Hurt.png' },
    { key: 'enemy_gorgon3_idle', path: '/assets/characters/enemies/gorgon3/Idle.png' },
    { key: 'enemy_gorgon3_run', path: '/assets/characters/enemies/gorgon3/Run.png' },
    { key: 'enemy_gorgon3_walk', path: '/assets/characters/enemies/gorgon3/Walk.png' },
  ],

  martialHero1: [
    { key: 'enemy_martialHero1_attack1', path: '/assets/characters/enemies/martialHero1/Attack1.png' },
    { key: 'enemy_martialHero1_attack2', path: '/assets/characters/enemies/martialHero1/Attack2.png' },
    { key: 'enemy_martialHero1_death', path: '/assets/characters/enemies/martialHero1/Death.png' },
    { key: 'enemy_martialHero1_fall', path: '/assets/characters/enemies/martialHero1/Fall.png' },
    { key: 'enemy_martialHero1_idle', path: '/assets/characters/enemies/martialHero1/Idle.png' },
    { key: 'enemy_martialHero1_run', path: '/assets/characters/enemies/martialHero1/Run.png' },
    { key: 'enemy_martialHero1_hit', path: '/assets/characters/enemies/martialHero1/Take Hit.png' },
  ],

  martialHero2: [
    { key: 'enemy_martialHero2_attack1', path: '/assets/characters/enemies/martialHero2/Attack1.png' },
    { key: 'enemy_martialHero2_attack2', path: '/assets/characters/enemies/martialHero2/Attack2.png' },
    { key: 'enemy_martialHero2_death', path: '/assets/characters/enemies/martialHero2/Death.png' },
    { key: 'enemy_martialHero2_fall', path: '/assets/characters/enemies/martialHero2/Fall.png' },
    { key: 'enemy_martialHero2_idle', path: '/assets/characters/enemies/martialHero2/Idle.png' },
    { key: 'enemy_martialHero2_run', path: '/assets/characters/enemies/martialHero2/Run.png' },
    { key: 'enemy_martialHero2_hurt', path: '/assets/characters/enemies/martialHero2/Hurt.png' },
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
    { key: 'enemy_samurai1_attack', path: '/assets/characters/enemies/samurai1/ATTACK 1.png' },
    { key: 'enemy_samurai1_hurt', path: '/assets/characters/enemies/samurai1/HURT.png' },
    { key: 'enemy_samurai1_idle', path: '/assets/characters/enemies/samurai1/IDLE.png' },
    { key: 'enemy_samurai1_run', path: '/assets/characters/enemies/samurai1/RUN.png' },
  ],

  samurai2: [
    { key: 'enemy_samurai2_attack1', path: '/assets/characters/enemies/samurai2/Attack_1.png' },
    { key: 'enemy_samurai2_attack2', path: '/assets/characters/enemies/samurai2/Attack_2.png' },
    { key: 'enemy_samurai2_attack3', path: '/assets/characters/enemies/samurai2/Attack_3.png' },
    { key: 'enemy_samurai2_death', path: '/assets/characters/enemies/samurai2/Dead.png' },
    { key: 'enemy_samurai2_hurt', path: '/assets/characters/enemies/samurai2/Hurt.png' },
    { key: 'enemy_samurai2_idle', path: '/assets/characters/enemies/samurai2/Idle.png' },
    { key: 'enemy_samurai2_run', path: '/assets/characters/enemies/samurai2/Run.png' },
    { key: 'enemy_samurai2_walk', path: '/assets/characters/enemies/samurai2/Walk.png' },
  ],

  skeletonArcher: [
    { key: 'enemy_skeletonArcher_attack1', path: '/assets/characters/enemies/skeletonArcher/Attack_1.png' },
    { key: 'enemy_skeletonArcher_attack2', path: '/assets/characters/enemies/skeletonArcher/Attack_2.png' },
    { key: 'enemy_skeletonArcher_attack3', path: '/assets/characters/enemies/skeletonArcher/Attack_3.png' },
    { key: 'enemy_skeletonArcher_death', path: '/assets/characters/enemies/skeletonArcher/Dead.png' },
    { key: 'enemy_skeletonArcher_hurt', path: '/assets/characters/enemies/skeletonArcher/Hurt.png' },
    { key: 'enemy_skeletonArcher_idle', path: '/assets/characters/enemies/skeletonArcher/Idle.png' },
    { key: 'enemy_skeletonArcher_shot1', path: '/assets/characters/enemies/skeletonArcher/Shot_1.png' },
    { key: 'enemy_skeletonArcher_shot2', path: '/assets/characters/enemies/skeletonArcher/Shot_2.png' },
    { key: 'enemy_skeletonArcher_walk', path: '/assets/characters/enemies/skeletonArcher/Walk.png' },
  ],

  skeletonSpearman: [
    { key: 'enemy_skeletonSpearman_attack1', path: '/assets/characters/enemies/skeletonSpearman/Attack_1.png' },
    { key: 'enemy_skeletonSpearman_attack2', path: '/assets/characters/enemies/skeletonSpearman/Attack_2.png' },
    { key: 'enemy_skeletonSpearman_death', path: '/assets/characters/enemies/skeletonSpearman/Dead.png' },
    { key: 'enemy_skeletonSpearman_hurt', path: '/assets/characters/enemies/skeletonSpearman/Hurt.png' },
    { key: 'enemy_skeletonSpearman_idle', path: '/assets/characters/enemies/skeletonSpearman/Idle.png' },
    { key: 'enemy_skeletonSpearman_run', path: '/assets/characters/enemies/skeletonSpearman/Run.png' },
    { key: 'enemy_skeletonSpearman_walk', path: '/assets/characters/enemies/skeletonSpearman/Walk.png' },
  ],

  skeletonWarrior: [
    { key: 'enemy_skeletonWarrior_attack1', path: '/assets/characters/enemies/skeletonWarrior/Attack_1.png' },
    { key: 'enemy_skeletonWarrior_attack2', path: '/assets/characters/enemies/skeletonWarrior/Attack_2.png' },
    { key: 'enemy_skeletonWarrior_attack3', path: '/assets/characters/enemies/skeletonWarrior/Attack_3.png' },
    { key: 'enemy_skeletonWarrior_death', path: '/assets/characters/enemies/skeletonWarrior/Dead.png' },
    { key: 'enemy_skeletonWarrior_hurt', path: '/assets/characters/enemies/skeletonWarrior/Hurt.png' },
    { key: 'enemy_skeletonWarrior_idle', path: '/assets/characters/enemies/skeletonWarrior/Idle.png' },
    { key: 'enemy_skeletonWarrior_run', path: '/assets/characters/enemies/skeletonWarrior/Run.png' },
    { key: 'enemy_skeletonWarrior_walk', path: '/assets/characters/enemies/skeletonWarrior/Walk.png' },
  ],

  tenguKarasu: [
    { key: 'enemy_tenguKarasu_attack1', path: '/assets/characters/enemies/tenguKarasu/Attack_1.png' },
    { key: 'enemy_tenguKarasu_attack2', path: '/assets/characters/enemies/tenguKarasu/Attack_2.png' },
    { key: 'enemy_tenguKarasu_attack3', path: '/assets/characters/enemies/tenguKarasu/Attack_3.png' },
    { key: 'enemy_tenguKarasu_death', path: '/assets/characters/enemies/tenguKarasu/Dead.png' },
    { key: 'enemy_tenguKarasu_hurt', path: '/assets/characters/enemies/tenguKarasu/Hurt.png' },
    { key: 'enemy_tenguKarasu_idle', path: '/assets/characters/enemies/tenguKarasu/Idle.png' },
    { key: 'enemy_tenguKarasu_run', path: '/assets/characters/enemies/tenguKarasu/Run.png' },
    { key: 'enemy_tenguKarasu_walk', path: '/assets/characters/enemies/tenguKarasu/Walk.png' },
  ],

  tenguYamabushi: [
    { key: 'enemy_tenguYamabushi_attack1', path: '/assets/characters/enemies/tenguYamabushi/Attack_1.png' },
    { key: 'enemy_tenguYamabushi_attack2', path: '/assets/characters/enemies/tenguYamabushi/Attack_2.png' },
    { key: 'enemy_tenguYamabushi_attack3', path: '/assets/characters/enemies/tenguYamabushi/Attack_3.png' },
    { key: 'enemy_tenguYamabushi_death', path: '/assets/characters/enemies/tenguYamabushi/Dead.png' },
    { key: 'enemy_tenguYamabushi_hurt', path: '/assets/characters/enemies/tenguYamabushi/Hurt.png' },
    { key: 'enemy_tenguYamabushi_idle', path: '/assets/characters/enemies/tenguYamabushi/Idle.png' },
    { key: 'enemy_tenguYamabushi_run', path: '/assets/characters/enemies/tenguYamabushi/Run.png' },
    { key: 'enemy_tenguYamabushi_walk', path: '/assets/characters/enemies/tenguYamabushi/Walk.png' },
  ],

  werewolf1: [
    { key: 'enemy_werewolf1_attack1', path: '/assets/characters/enemies/werewolf1/Attack_1.png' },
    { key: 'enemy_werewolf1_attack2', path: '/assets/characters/enemies/werewolf1/Attack_2.png' },
    { key: 'enemy_werewolf1_attack3', path: '/assets/characters/enemies/werewolf1/Attack_3.png' },
    { key: 'enemy_werewolf1_death', path: '/assets/characters/enemies/werewolf1/Dead.png' },
    { key: 'enemy_werewolf1_hurt', path: '/assets/characters/enemies/werewolf1/Hurt.png' },
    { key: 'enemy_werewolf1_idle', path: '/assets/characters/enemies/werewolf1/Idle.png' },
    { key: 'enemy_werewolf1_run', path: '/assets/characters/enemies/werewolf1/Run.png' },
    { key: 'enemy_werewolf1_walk', path: '/assets/characters/enemies/werewolf1/Walk.png' },
  ],

  werewolf2: [
    { key: 'enemy_werewolf2_attack1', path: '/assets/characters/enemies/werewolf2/Attack_1.png' },
    { key: 'enemy_werewolf2_attack2', path: '/assets/characters/enemies/werewolf2/Attack_2.png' },
    { key: 'enemy_werewolf2_attack3', path: '/assets/characters/enemies/werewolf2/Attack_3.png' },
    { key: 'enemy_werewolf2_death', path: '/assets/characters/enemies/werewolf2/Dead.png' },
    { key: 'enemy_werewolf2_hurt', path: '/assets/characters/enemies/werewolf2/Hurt.png' },
    { key: 'enemy_werewolf2_idle', path: '/assets/characters/enemies/werewolf2/Idle.png' },
    { key: 'enemy_werewolf2_run', path: '/assets/characters/enemies/werewolf2/Run.png' },
    { key: 'enemy_werewolf2_walk', path: '/assets/characters/enemies/werewolf2/Walk.png' },
  ],

  werewolf3: [
    { key: 'enemy_werewolf3_attack1', path: '/assets/characters/enemies/werewolf3/Attack_1.png' },
    { key: 'enemy_werewolf3_attack2', path: '/assets/characters/enemies/werewolf3/Attack_2.png' },
    { key: 'enemy_werewolf3_attack3', path: '/assets/characters/enemies/werewolf3/Attack_3.png' },
    { key: 'enemy_werewolf3_death', path: '/assets/characters/enemies/werewolf3/Dead.png' },
    { key: 'enemy_werewolf3_hurt', path: '/assets/characters/enemies/werewolf3/Hurt.png' },
    { key: 'enemy_werewolf3_idle', path: '/assets/characters/enemies/werewolf3/Idle.png' },
    { key: 'enemy_werewolf3_run', path: '/assets/characters/enemies/werewolf3/Run.png' },
    { key: 'enemy_werewolf3_walk', path: '/assets/characters/enemies/werewolf3/Walk.png' },
  ],
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
    boyFighter: { width: 128, height: 128 },
    evilWizard1: { width: 150, height: 150 },
    evilWizard2: { width: 250, height: 250 },
    evilWizard3: { width: 140, height: 140 },
    girlKitsune: { width: 128, height: 128 },
    girlKunoichi: { width: 128, height: 128 },
    girlShinobi: { width: 128, height: 128 },
    gorgon1: { width: 128, height: 128 },
    gorgon2: { width: 128, height: 128 },
    martialHero1: { width: 200, height: 200 },
    martialHero2: { width: 200, height: 200 },
    martialHero3: { width: 126, height: 126 },
    samurai1: { width: 96, height: 96 },
    samurai2: { width: 128, height: 128 },
    skeletonArcher: { width: 128, height: 128 },
    skeletonSpearman: { width: 128, height: 128 },
    skeletonWarrior: { width: 128, height: 128 },
    tenguKarasu: { width: 128, height: 128 },
    tenguYamabushi: { width: 128, height: 128 },
    werewolf1: { width: 128, height: 128 },
    werewolf2: { width: 128, height: 128 },
    werewolf3: { width: 128, height: 128 },
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