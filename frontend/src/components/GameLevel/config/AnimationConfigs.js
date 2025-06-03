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

// Get all main character animations
export const getMainCharacterAnimations = () => MAIN_CHARACTER_ANIMATIONS;