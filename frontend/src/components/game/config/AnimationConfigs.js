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

  fighter: {
    'enemy_fighter_idle_anim': { texture: 'enemy_fighter_idle', frames: [0, 5], frameRate: 8, repeat: -1 },
    'enemy_fighter_run_anim': { texture: 'enemy_fighter_run', frames: [0, 7], frameRate: 10, repeat: -1 },
    'enemy_fighter_walk_anim': { texture: 'enemy_fighter_walk', frames: [0, 7], frameRate: 8, repeat: -1 },
    'enemy_fighter_attack1_anim': { texture: 'enemy_fighter_attack1', frames: [0, 3], frameRate: 12, repeat: 0 },
    'enemy_fighter_attack2_anim': { texture: 'enemy_fighter_attack2', frames: [0, 2], frameRate: 12, repeat: 0 },
    'enemy_fighter_attack3_anim': { texture: 'enemy_fighter_attack3', frames: [0, 3], frameRate: 12, repeat: 0 },
    'enemy_fighter_dead_anim': { texture: 'enemy_fighter_dead', frames: [0, 2], frameRate: 8, repeat: 0 },
    'enemy_fighter_hurt_anim': { texture: 'enemy_fighter_hurt', frames: [0, 2], frameRate: 10, repeat: 0 }
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
    'enemy_martialHero2_hit_anim': { texture: 'enemy_martialHero2_hit', frames: [0, 2], frameRate: 10, repeat: 0 }
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
    'enemy_samurai2_dead_anim': { texture: 'enemy_samurai2_dead', frames: [0, 2], frameRate: 8, repeat: 0 },
    'enemy_samurai2_hurt_anim': { texture: 'enemy_samurai2_hurt', frames: [0, 1], frameRate: 10, repeat: 0 }
  },

  shinobi: {
    'enemy_shinobi_idle_anim': { texture: 'enemy_shinobi_idle', frames: [0, 5], frameRate: 8, repeat: -1 },
    'enemy_shinobi_run_anim': { texture: 'enemy_shinobi_run', frames: [0, 7], frameRate: 10, repeat: -1 },
    'enemy_shinobi_walk_anim': { texture: 'enemy_shinobi_walk', frames: [0, 7], frameRate: 8, repeat: -1 },
    'enemy_shinobi_attack1_anim': { texture: 'enemy_shinobi_attack1', frames: [0, 4], frameRate: 12, repeat: 0 },
    'enemy_shinobi_attack2_anim': { texture: 'enemy_shinobi_attack2', frames: [0, 2], frameRate: 12, repeat: 0 },
    'enemy_shinobi_attack3_anim': { texture: 'enemy_shinobi_attack3', frames: [0, 3], frameRate: 12, repeat: 0 },
    'enemy_shinobi_dead_anim': { texture: 'enemy_shinobi_dead', frames: [0, 3], frameRate: 8, repeat: 0 },
    'enemy_shinobi_hurt_anim': { texture: 'enemy_shinobi_hurt', frames: [0, 1], frameRate: 10, repeat: 0 }
  }
};

// Get all animations for a specific enemy type
export const getEnemyAnimations = (enemyType) => ENEMY_ANIMATIONS[enemyType] || {};

// Get all main character animations
export const getMainCharacterAnimations = () => MAIN_CHARACTER_ANIMATIONS;