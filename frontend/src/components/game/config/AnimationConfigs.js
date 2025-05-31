// frontend/src/components/game/config/AnimationConfigs.js

// Main character animation configurations
export const MAIN_CHARACTER_ANIMATIONS = {
  // Idle animations
  'mainChar_idle_down_anim': { texture: 'mainChar_idle_down', frames: [0, 7], frameRate: 8, repeat: -1 },
  'mainChar_idle_up_anim': { texture: 'mainChar_idle_up', frames: [0, 7], frameRate: 8, repeat: -1 },
  'mainChar_idle_left_anim': { texture: 'mainChar_idle_left', frames: [0, 7], frameRate: 8, repeat: -1 },
  'mainChar_idle_right_anim': { texture: 'mainChar_idle_right', frames: [0, 7], frameRate: 8, repeat: -1 },

  // Run animations
  'mainChar_run_down_anim': { texture: 'mainChar_run_down', frames: [0, 7], frameRate: 12, repeat: -1 },
  'mainChar_run_up_anim': { texture: 'mainChar_run_up', frames: [0, 7], frameRate: 12, repeat: -1 },
  'mainChar_run_left_anim': { texture: 'mainChar_run_left', frames: [0, 7], frameRate: 12, repeat: -1 },
  'mainChar_run_right_anim': { texture: 'mainChar_run_right', frames: [0, 7], frameRate: 12, repeat: -1 },

  // Attack animations
  'mainChar_attack1_down_anim': { texture: 'mainChar_attack1_down', frames: [0, 7], frameRate: 15, repeat: 0 },
  'mainChar_attack1_up_anim': { texture: 'mainChar_attack1_up', frames: [0, 7], frameRate: 15, repeat: 0 },
  'mainChar_attack1_left_anim': { texture: 'mainChar_attack1_left', frames: [0, 7], frameRate: 15, repeat: 0 },
  'mainChar_attack1_right_anim': { texture: 'mainChar_attack1_right', frames: [0, 7], frameRate: 15, repeat: 0 },

  'mainChar_attack2_down_anim': { texture: 'mainChar_attack2_down', frames: [0, 7], frameRate: 15, repeat: 0 },
  'mainChar_attack2_up_anim': { texture: 'mainChar_attack2_up', frames: [0, 7], frameRate: 15, repeat: 0 },
  'mainChar_attack2_left_anim': { texture: 'mainChar_attack2_left', frames: [0, 7], frameRate: 15, repeat: 0 },
  'mainChar_attack2_right_anim': { texture: 'mainChar_attack2_right', frames: [0, 7], frameRate: 15, repeat: 0 }
};

// Enemy animation configurations organized by enemy type
export const ENEMY_ANIMATIONS = {
  boyFighter: {
    'enemy_boyFighter_idle_anim': {texture: 'enemy_boyFighter_idle', frames: [0, 5], frameRate: 8, repeat: -1},
    'enemy_boyFighter_run_anim': {texture: 'enemy_boyFighter_run', frames: [0, 7], frameRate: 10, repeat: -1},
    'enemy_boyFighter_walk_anim': {texture: 'enemy_boyFighter_walk', frames: [0, 7], frameRate: 8, repeat: -1},
    'enemy_boyFighter_attack1_anim': {texture: 'enemy_boyFighter_attack1', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_boyFighter_attack2_anim': {texture: 'enemy_boyFighter_attack2', frames: [0, 2], frameRate: 12, repeat: 0},
    'enemy_boyFighter_attack3_anim': {texture: 'enemy_boyFighter_attack3', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_boyFighter_death_anim': {texture: 'enemy_boyFighter_death', frames: [0, 2], frameRate: 8, repeat: 0},
    'enemy_boyFighter_hurt_anim': {texture: 'enemy_boyFighter_hurt', frames: [0, 2], frameRate: 10, repeat: 0},
  },

  evilWizard1: {
    'enemy_evilWizard1_idle_anim': { texture: 'enemy_evilWizard1_idle', frames: [0, 7], frameRate: 8, repeat: -1 },
    'enemy_evilWizard1_move_anim': { texture: 'enemy_evilWizard1_move', frames: [0, 7], frameRate: 10, repeat: -1 },
    'enemy_evilWizard1_attack_anim': { texture: 'enemy_evilWizard1_attack', frames: [0, 7], frameRate: 12, repeat: 0 },
    'enemy_evilWizard1_death_anim': { texture: 'enemy_evilWizard1_death', frames: [0, 4], frameRate: 8, repeat: 0 },
    'enemy_evilWizard1_hit_anim': { texture: 'enemy_evilWizard1_hit', frames: [0, 3], frameRate: 10, repeat: 0 }
  },

  evilWizard2: {
    'enemy_evilWizard2_idle_anim': { texture: 'enemy_evilWizard2_idle', frames: [0, 7], frameRate: 8, repeat: -1 },
    'enemy_evilWizard2_run_anim': { texture: 'enemy_evilWizard2_run', frames: [0, 7], frameRate: 10, repeat: -1 },
    'enemy_evilWizard2_attack1_anim': { texture: 'enemy_evilWizard2_attack1', frames: [0, 7], frameRate: 12, repeat: 0 },
    'enemy_evilWizard2_attack2_anim': { texture: 'enemy_evilWizard2_attack2', frames: [0, 7], frameRate: 12, repeat: 0 },
    'enemy_evilWizard2_death_anim': { texture: 'enemy_evilWizard2_death', frames: [0, 6], frameRate: 8, repeat: 0 },
    'enemy_evilWizard2_hit_anim': { texture: 'enemy_evilWizard2_hit', frames: [0, 2], frameRate: 10, repeat: 0 }
  },

  evilWizard3: {
    'enemy_evilWizard3_idle_anim': { texture: 'enemy_evilWizard3_idle', frames: [0, 9], frameRate: 8, repeat: -1 },
    'enemy_evilWizard3_run_anim': { texture: 'enemy_evilWizard3_run', frames: [0, 7], frameRate: 10, repeat: -1 },
    'enemy_evilWizard3_walk_anim': { texture: 'enemy_evilWizard3_walk', frames: [0, 7], frameRate: 8, repeat: -1 },
    'enemy_evilWizard3_attack_anim': { texture: 'enemy_evilWizard3_attack', frames: [0, 12], frameRate: 12, repeat: 0 },
    'enemy_evilWizard3_death_anim': { texture: 'enemy_evilWizard3_death', frames: [0, 17], frameRate: 8, repeat: 0 },
    'enemy_evilWizard3_hit_anim': { texture: 'enemy_evilWizard3_hit', frames: [0, 2], frameRate: 10, repeat: 0 }
  },

  girlKitsune: {
    'enemy_girlKitsune_attack1_anim': {texture: 'enemy_girlKitsune_attack1', frames: [0, 9], frameRate: 12, repeat: 0},
    'enemy_girlKitsune_attack2_anim': {texture: 'enemy_girlKitsune_attack2', frames: [0, 9], frameRate: 12, repeat: 0},
    'enemy_girlKitsune_attack3_anim': {texture: 'enemy_girlKitsune_attack3', frames: [0, 6], frameRate: 12, repeat: 0},
    'enemy_girlKitsune_death_anim': {texture: 'enemy_girlKitsune_death', frames: [0, 9], frameRate: 8, repeat: 0},
    'enemy_girlKitsune_hit_anim': {texture: 'enemy_girlKitsune_hit', frames: [0, 1], frameRate: 10, repeat: 0},
    'enemy_girlKitsune_idle_anim': {texture: 'enemy_girlKitsune_idle', frames: [0, 7], frameRate: 8, repeat: -1},
    'enemy_girlKitsune_run_anim': {texture: 'enemy_girlKitsune_run', frames: [0, 7], frameRate: 10, repeat: -1},
    'enemy_girlKitsune_walk_anim': {texture: 'enemy_girlKitsune_walk', frames: [0, 7], frameRate: 8, repeat: -1},
  },

  girlKunoichi: {
    'enemy_girlKunoichi_attack1_anim': {texture: 'enemy_girlKunoichi_attack1', frames: [0, 5], frameRate: 12, repeat: 0},
    'enemy_girlKunoichi_attack2_anim': {texture: 'enemy_girlKunoichi_attack2', frames: [0, 7], frameRate: 12, repeat: 0},
    'enemy_girlKunoichi_death_anim': {texture: 'enemy_girlKunoichi_death', frames: [0, 4], frameRate: 8, repeat: 0},
    'enemy_girlKunoichi_hit_anim': {texture: 'enemy_girlKunoichi_hit', frames: [0, 1], frameRate: 10, repeat: 0},
    'enemy_girlKunoichi_idle_anim': {texture: 'enemy_girlKunoichi_idle', frames: [0, 8], frameRate: 8, repeat: -1},
    'enemy_girlKunoichi_run_anim': {texture: 'enemy_girlKunoichi_run', frames: [0, 7], frameRate: 10, repeat: -1},
    'enemy_girlKunoichi_walk_anim': {texture: 'enemy_girlKunoichi_walk', frames: [0, 7], frameRate: 8, repeat: -1},
  },

  girlShinobi: {
    'enemy_girlShinobi_attack1_anim': {texture: 'enemy_girlShinobi_attack1', frames: [0, 4], frameRate: 12, repeat: 0},
    'enemy_girlShinobi_attack2_anim': {texture: 'enemy_girlShinobi_attack2', frames: [0, 2], frameRate: 12, repeat: 0},
    'enemy_girlShinobi_attack3_anim': {texture: 'enemy_girlShinobi_attack3', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_girlShinobi_death_anim': {texture: 'enemy_girlShinobi_death', frames: [0, 3], frameRate: 8, repeat: 0},
    'enemy_girlShinobi_hit_anim': {texture: 'enemy_girlShinobi_hit', frames: [0, 1], frameRate: 10, repeat: 0},
    'enemy_girlShinobi_idle_anim': {texture: 'enemy_girlShinobi_idle', frames: [0, 5], frameRate: 8, repeat: -1},
    'enemy_girlShinobi_run_anim': {texture: 'enemy_girlShinobi_run', frames: [0, 7], frameRate: 10, repeat: -1},
    'enemy_girlShinobi_walk_anim': {texture: 'enemy_girlShinobi_walk', frames: [0, 7], frameRate: 8, repeat: -1},
  },

  gorgon1: {
    'enemy_gorgon1_attack1_anim': {texture: 'enemy_gorgon1_attack1', frames: [0, 15], frameRate: 12, repeat:0},
    'enemy_gorgon1_attack2_anim': {texture: 'enemy_gorgon1_attack2', frames: [0, 6], frameRate: 12, repeat:0},
    'enemy_gorgon1_attack3_anim': {texture: 'enemy_gorgon1_attack3', frames: [0, 9], frameRate: 12, repeat:0},
    'enemy_gorgon1_death_anim': {texture: 'enemy_gorgon1_death', frames: [0, 2], frameRate: 8, repeat:0},
    'enemy_gorgon1_hit_anim': {texture: 'enemy_gorgon1_hit', frames: [0, 2], frameRate: 10, repeat:0},
    'enemy_gorgon1_idle_anim': {texture: 'enemy_gorgon1_idle', frames: [0, 6], frameRate: 8, repeat:-1},
    'enemy_gorgon1_run_anim': {texture: 'enemy_gorgon1_run', frames: [0, 6], frameRate: 10, repeat:-1},
    'enemy_gorgon1_walk_anim': {texture: 'enemy_gorgon1_walk', frames: [0, 12], frameRate: 8, repeat:-1},
  },

  gorgon2: {
    'enemy_gorgon2_attack1_anim': {texture: 'enemy_gorgon2_attack1', frames: [0, 15], frameRate: 12, repeat:0},
    'enemy_gorgon2_attack2_anim': {texture: 'enemy_gorgon2_attack2', frames: [0, 6], frameRate: 12, repeat:0},
    'enemy_gorgon2_attack3_anim': {texture: 'enemy_gorgon2_attack3', frames: [0, 9], frameRate: 12, repeat:0},
    'enemy_gorgon2_death_anim': {texture: 'enemy_gorgon2_death', frames: [0, 2], frameRate: 8, repeat:0},
    'enemy_gorgon2_hit_anim': {texture: 'enemy_gorgon2_hit', frames: [0, 2], frameRate: 10, repeat:0},
    'enemy_gorgon2_idle_anim': {texture: 'enemy_gorgon2_idle', frames: [0, 6], frameRate: 8, repeat:-1},
    'enemy_gorgon2_run_anim': {texture: 'enemy_gorgon2_run', frames: [0, 6], frameRate: 10, repeat:-1},
    'enemy_gorgon2_walk_anim': {texture: 'enemy_gorgon2_walk', frames: [0, 12], frameRate: 8, repeat:-1},
  },

  martialHero1: {
    'enemy_martialHero1_idle_anim': { texture: 'enemy_martialHero1_idle', frames: [0, 7], frameRate: 8, repeat: -1 },
    'enemy_martialHero1_run_anim': { texture: 'enemy_martialHero1_run', frames: [0, 7], frameRate: 10, repeat: -1 },
    'enemy_martialHero1_attack1_anim': { texture: 'enemy_martialHero1_attack1', frames: [0, 5], frameRate: 12, repeat: 0 },
    'enemy_martialHero1_attack2_anim': { texture: 'enemy_martialHero1_attack2', frames: [0, 5], frameRate: 12, repeat: 0 },
    'enemy_martialHero1_death_anim': { texture: 'enemy_martialHero1_death', frames: [0, 5], frameRate: 8, repeat: 0 },
    'enemy_martialHero1_hit_anim': { texture: 'enemy_martialHero1_hit', frames: [0, 3], frameRate: 10, repeat: 0 }
  },

  martialHero2: {
    'enemy_martialHero2_idle_anim': { texture: 'enemy_martialHero2_idle', frames: [0, 3], frameRate: 8, repeat: -1 },
    'enemy_martialHero2_run_anim': { texture: 'enemy_martialHero2_run', frames: [0, 7], frameRate: 10, repeat: -1 },
    'enemy_martialHero2_attack1_anim': { texture: 'enemy_martialHero2_attack1', frames: [0, 3], frameRate: 12, repeat: 0 },
    'enemy_martialHero2_attack2_anim': { texture: 'enemy_martialHero2_attack2', frames: [0, 3], frameRate: 12, repeat: 0 },
    'enemy_martialHero2_death_anim': { texture: 'enemy_martialHero2_death', frames: [0, 6], frameRate: 8, repeat: 0 },
    'enemy_martialHero2_hurt_anim': { texture: 'enemy_martialHero2_hurt', frames: [0, 2], frameRate: 10, repeat: 0 }
  },

  martialHero3: {
    'enemy_martialHero3_idle_anim': { texture: 'enemy_martialHero3_idle', frames: [0, 9], frameRate: 8, repeat: -1 },
    'enemy_martialHero3_run_anim': { texture: 'enemy_martialHero3_run', frames: [0, 7], frameRate: 10, repeat: -1 },
    'enemy_martialHero3_attack1_anim': { texture: 'enemy_martialHero3_attack1', frames: [0, 6], frameRate: 12, repeat: 0 },
    'enemy_martialHero3_attack2_anim': { texture: 'enemy_martialHero3_attack2', frames: [0, 5], frameRate: 12, repeat: 0 },
    'enemy_martialHero3_attack3_anim': { texture: 'enemy_martialHero3_attack3', frames: [0, 8], frameRate: 12, repeat: 0 },
    'enemy_martialHero3_death_anim': { texture: 'enemy_martialHero3_death', frames: [0, 10], frameRate: 8, repeat: 0 },
    'enemy_martialHero3_hit_anim': { texture: 'enemy_martialHero3_hit', frames: [0, 2], frameRate: 10, repeat: 0 }
  },

  samurai1: {
    'enemy_samurai1_idle_anim': { texture: 'enemy_samurai1_idle', frames: [0, 9], frameRate: 8, repeat: -1 },
    'enemy_samurai1_run_anim': { texture: 'enemy_samurai1_run', frames: [0, 15], frameRate: 10, repeat: -1 },
    'enemy_samurai1_attack_anim': { texture: 'enemy_samurai1_attack', frames: [0, 6], frameRate: 12, repeat: 0 },
    'enemy_samurai1_hurt_anim': { texture: 'enemy_samurai1_hurt', frames: [0, 3], frameRate: 10, repeat: 0 }
  },

  samurai2: {
    'enemy_samurai2_idle_anim': { texture: 'enemy_samurai2_idle', frames: [0, 5], frameRate: 8, repeat: -1 },
    'enemy_samurai2_run_anim': { texture: 'enemy_samurai2_run', frames: [0, 7], frameRate: 10, repeat: -1 },
    'enemy_samurai2_walk_anim': { texture: 'enemy_samurai2_walk', frames: [0, 7], frameRate: 8, repeat: -1 },
    'enemy_samurai2_attack1_anim': { texture: 'enemy_samurai2_attack1', frames: [0, 5], frameRate: 12, repeat: 0 },
    'enemy_samurai2_attack2_anim': { texture: 'enemy_samurai2_attack2', frames: [0, 3], frameRate: 12, repeat: 0 },
    'enemy_samurai2_attack3_anim': { texture: 'enemy_samurai2_attack3', frames: [0, 2], frameRate: 12, repeat: 0 },
    'enemy_samurai2_death_anim': { texture: 'enemy_samurai2_death', frames: [0, 2], frameRate: 8, repeat: 0 },
    'enemy_samurai2_hurt_anim': { texture: 'enemy_samurai2_hurt', frames: [0, 1], frameRate: 10, repeat: 0 }
  },

  skeletonArcher: {
    'enemy_skeletonArcher_attack1_anim':{ texture: 'enemy_skeletonArcher_attack1', frames: [0, 4], frameRate: 12, repeat: 0},
    'enemy_skeletonArcher_attack2_anim':{ texture: 'enemy_skeletonArcher_attack2', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_skeletonArcher_attack3_anim':{ texture: 'enemy_skeletonArcher_attack3', frames: [0, 2], frameRate: 12, repeat: 0},
    'enemy_skeletonArcher_death_anim':{ texture: 'enemy_skeletonArcher_death', frames: [0, 4], frameRate: 8, repeat: 0},
    'enemy_skeletonArcher_hurt_anim':{ texture: 'enemy_skeletonArcher_hurt', frames: [0, 1], frameRate: 10, repeat: 0},
    'enemy_skeletonArcher_idle_anim':{ texture: 'enemy_skeletonArcher_idle', frames: [0, 6], frameRate: 8, repeat: -1},
    'enemy_skeletonArcher_shot1_anim':{ texture: 'enemy_skeletonArcher_shot1', frames: [0, 14], frameRate: 10, repeat: 0},
    'enemy_skeletonArcher_shot2_anim':{ texture: 'enemy_skeletonArcher_shot2', frames: [0, 14], frameRate: 10, repeat: 0},
    'enemy_skeletonArcher_walk_anim':{ texture: 'enemy_skeletonArcher_walk', frames: [0, 7], frameRate: 8, repeat: -1},
  },

  skeletonSpearman: {
    'enemy_skeletonSpearman_attack1_anim': {texture: 'enemy_skeletonSpearman_attack1', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_skeletonSpearman_attack2_anim': {texture: 'enemy_skeletonSpearman_attack2', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_skeletonSpearman_death_anim': {texture: 'enemy_skeletonSpearman_death', frames: [0, 4], frameRate: 8, repeat: 0},
    'enemy_skeletonSpearman_hurt_anim': {texture: 'enemy_skeletonSpearman_hurt', frames: [0, 2], frameRate: 10, repeat: 0},
    'enemy_skeletonSpearman_idle_anim': {texture: 'enemy_skeletonSpearman_idle', frames: [0, 6], frameRate: 8, repeat: -1},
    'enemy_skeletonSpearman_run_anim': {texture: 'enemy_skeletonSpearman_run', frames: [0, 5], frameRate: 10, repeat: -1},
    'enemy_skeletonSpearman_walk_anim': {texture: 'enemy_skeletonSpearman_walk', frames: [0, 6], frameRate: 8, repeat: -1},
  },

  skeletonWarrior: {
    'enemy_skeletonWarrior_attack1_anim': {texture: 'enemy_skeletonWarrior_attack1', frames: [0, 4], frameRate: 12, repeat: 0},
    'enemy_skeletonWarrior_attack2_anim': {texture: 'enemy_skeletonWarrior_attack2', frames: [0, 5], frameRate: 12, repeat: 0},
    'enemy_skeletonWarrior_attack3_anim': {texture: 'enemy_skeletonWarrior_attack3', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_skeletonWarrior_death_anim': {texture: 'enemy_skeletonWarrior_death', frames: [0, 3], frameRate: 8, repeat: 0},
    'enemy_skeletonWarrior_hurt_anim': {texture: 'enemy_skeletonWarrior_hurt', frames: [0, 1], frameRate: 10, repeat: 0},
    'enemy_skeletonWarrior_idle_anim': {texture: 'enemy_skeletonWarrior_idle', frames: [0, 6], frameRate: 8, repeat: -1},
    'enemy_skeletonWarrior_run_anim': {texture: 'enemy_skeletonWarrior_run', frames: [0, 7], frameRate: 10, repeat: -1},
    'enemy_skeletonWarrior_walk_anim': {texture: 'enemy_skeletonWarrior_walk', frames: [0, 6], frameRate: 8, repeat: -1},
  },

  tenguKarasu: {
    'enemy_tenguKarasu_attack1_anim': {texture: 'enemy_tenguKarasu_attack1', frames: [0, 5], frameRate: 12, repeat: 0},
    'enemy_tenguKarasu_attack2_anim': {texture: 'enemy_tenguKarasu_attack2', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_tenguKarasu_attack3_anim': {texture: 'enemy_tenguKarasu_attack3', frames: [0, 2], frameRate: 12, repeat: 0},
    'enemy_tenguKarasu_death_anim': {texture: 'enemy_tenguKarasu_death', frames: [0, 5], frameRate: 8, repeat: 0},
    'enemy_tenguKarasu_hurt_anim': {texture: 'enemy_tenguKarasu_hurt', frames: [0, 2], frameRate: 10, repeat: 0},
    'enemy_tenguKarasu_idle_anim': {texture: 'enemy_tenguKarasu_idle', frames: [0, 5], frameRate: 8, repeat: -1},
    'enemy_tenguKarasu_run_anim': {texture: 'enemy_tenguKarasu_run', frames: [0, 7], frameRate: 10, repeat: -1},
    'enemy_tenguKarasu_walk_anim': {texture: 'enemy_tenguKarasu_walk', frames: [0, 7], frameRate: 8, repeat: -1},
  },

  tenguYamabushi: {
    'enemy_tenguYamabushi_attack1_anim': {texture: 'enemy_tenguYamabushi_attack1', frames: [0, 2], frameRate: 12, repeat: 0},
    'enemy_tenguYamabushi_attack2_anim': {texture: 'enemy_tenguYamabushi_attack2', frames: [0, 5], frameRate: 12, repeat: 0},
    'enemy_tenguYamabushi_attack3_anim': {texture: 'enemy_tenguYamabushi_attack3', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_tenguYamabushi_death_anim': {texture: 'enemy_tenguYamabushi_death', frames: [0, 5], frameRate: 8, repeat: 0},
    'enemy_tenguYamabushi_hurt_anim': {texture: 'enemy_tenguYamabushi_hurt', frames: [0, 2], frameRate: 10, repeat: 0},
    'enemy_tenguYamabushi_idle_anim': {texture: 'enemy_tenguYamabushi_idle', frames: [0, 5], frameRate: 8, repeat: -1},
    'enemy_tenguYamabushi_run_anim': {texture: 'enemy_tenguYamabushi_run', frames: [0, 7], frameRate: 10, repeat: -1},
    'enemy_tenguYamabushi_walk_anim': {texture: 'enemy_tenguYamabushi_walk', frames: [0, 7], frameRate: 8, repeat: -1},
  },

  werewolf1: {
    'enemy_werewolf1_attack1_anim': {texture: 'enemy_werewolf1_attack1', frames: [0, 5], frameRate: 12, repeat: 0},
    'enemy_werewolf1_attack2_anim': {texture: 'enemy_werewolf1_attack2', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_werewolf1_attack3_anim': {texture: 'enemy_werewolf1_attack3', frames: [0, 4], frameRate: 12, repeat: 0},
    'enemy_werewolf1_death_anim': {texture: 'enemy_werewolf1_death', frames: [0, 1], frameRate: 8, repeat: 0},
    'enemy_werewolf1_hurt_anim': {texture: 'enemy_werewolf1_hurt', frames: [0, 1], frameRate: 10, repeat: 0},
    'enemy_werewolf1_idle_anim': {texture: 'enemy_werewolf1_idle', frames: [0, 7], frameRate: 8, repeat: -1},
    'enemy_werewolf1_run_anim': {texture: 'enemy_werewolf1_run', frames: [0, 8], frameRate: 10, repeat: -1},
    'enemy_werewolf1_walk_anim': {texture: 'enemy_werewolf1_walk', frames: [0, 10], frameRate: 8, repeat: -1},
  },

  werewolf2: {
    'enemy_werewolf2_attack1_anim': {texture: 'enemy_werewolf2_attack1', frames: [0, 5], frameRate: 12, repeat: 0},
    'enemy_werewolf2_attack2_anim': {texture: 'enemy_werewolf2_attack2', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_werewolf2_attack3_anim': {texture: 'enemy_werewolf2_attack3', frames: [0, 4], frameRate: 12, repeat: 0},
    'enemy_werewolf2_death_anim': {texture: 'enemy_werewolf2_death', frames: [0, 1], frameRate: 8, repeat: 0},
    'enemy_werewolf2_hurt_anim': {texture: 'enemy_werewolf2_hurt', frames: [0, 1], frameRate: 10, repeat: 0},
    'enemy_werewolf2_idle_anim': {texture: 'enemy_werewolf2_idle', frames: [0, 7], frameRate: 8, repeat: -1},
    'enemy_werewolf2_run_anim': {texture: 'enemy_werewolf2_run', frames: [0, 8], frameRate: 10, repeat: -1},
    'enemy_werewolf2_walk_anim': {texture: 'enemy_werewolf2_walk', frames: [0, 10], frameRate: 8, repeat: -1},
  },

  werewolf3: {
    'enemy_werewolf3_attack1_anim': {texture: 'enemy_werewolf3_attack1', frames: [0, 5], frameRate: 12, repeat: 0},
    'enemy_werewolf3_attack2_anim': {texture: 'enemy_werewolf3_attack2', frames: [0, 3], frameRate: 12, repeat: 0},
    'enemy_werewolf3_attack3_anim': {texture: 'enemy_werewolf3_attack3', frames: [0, 4], frameRate: 12, repeat: 0},
    'enemy_werewolf3_death_anim': {texture: 'enemy_werewolf3_death', frames: [0, 1], frameRate: 8, repeat: 0},
    'enemy_werewolf3_hurt_anim': {texture: 'enemy_werewolf3_hurt', frames: [0, 1], frameRate: 10, repeat: 0},
    'enemy_werewolf3_idle_anim': {texture: 'enemy_werewolf3_idle', frames: [0, 7], frameRate: 8, repeat: -1},
    'enemy_werewolf3_run_anim': {texture: 'enemy_werewolf3_run', frames: [0, 8], frameRate: 10, repeat: -1},
    'enemy_werewolf3_walk_anim': {texture: 'enemy_werewolf3_walk', frames: [0, 10], frameRate: 8, repeat: -1},
  }
};

// Get all animations for a specific enemy type
export const getEnemyAnimations = (enemyType) => ENEMY_ANIMATIONS[enemyType] || {};

// Get all main character animations
export const getMainCharacterAnimations = () => MAIN_CHARACTER_ANIMATIONS;