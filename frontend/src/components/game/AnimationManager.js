// frontend/src/components/game/AnimationManager.js
class AnimationManager {
  constructor(scene) {
    this.scene = scene;
  }

  createAllAnimations() {
    this.createMainCharacterAnimations();
    this.createEnemyAnimations();
    console.log('All animations created');
  }

  createMainCharacterAnimations() {
    // Idle animations
    this.createAnimation('mainChar_idle_down_anim', 'mainChar_idle_down', 0, 7, 8, -1);

    // Run animations
    this.createAnimation('mainChar_run_down_anim', 'mainChar_run_down', 0, 7, 12, -1);
    this.createAnimation('mainChar_run_up_anim', 'mainChar_run_up', 0, 7, 12, -1);
    this.createAnimation('mainChar_run_left_anim', 'mainChar_run_left', 0, 7, 12, -1);
    this.createAnimation('mainChar_run_right_anim', 'mainChar_run_right', 0, 7, 12, -1);

    // Attack animations
    this.createAnimation('mainChar_attack1_down_anim', 'mainChar_attack1_down', 0, 7, 15, 0);
    this.createAnimation('mainChar_attack1_up_anim', 'mainChar_attack1_up', 0, 7, 15, 0);
    this.createAnimation('mainChar_attack1_left_anim', 'mainChar_attack1_left', 0, 7, 15, 0);
    this.createAnimation('mainChar_attack1_right_anim', 'mainChar_attack1_right', 0, 7, 15, 0);
  }

  createEnemyAnimations() {
    // EvilWizard1 animations
    this.createAnimation('enemy_evilWizard1_idle_anim', 'enemy_evilWizard1_idle', 0, 7, 8, -1);
    this.createAnimation('enemy_evilWizard1_move_anim', 'enemy_evilWizard1_move', 0, 7, 10, -1);
    this.createAnimation('enemy_evilWizard1_attack_anim', 'enemy_evilWizard1_attack', 0, 7, 12, 0);

    // Fighter animations
    this.createAnimation('enemy_fighter_idle_anim', 'enemy_fighter_idle', 0, 5, 8, -1);
    this.createAnimation('enemy_fighter_run_anim', 'enemy_fighter_run', 0, 7, 10, -1);
    this.createAnimation('enemy_fighter_attack1_anim', 'enemy_fighter_attack1', 0, 3, 12, 0);
  }

  createAnimation(key, textureKey, startFrame, endFrame, frameRate, repeat) {
    if (this.scene.textures.exists(textureKey)) {
      this.scene.anims.create({
        key: key,
        frames: this.scene.anims.generateFrameNumbers(textureKey, { 
          start: startFrame, 
          end: endFrame 
        }),
        frameRate: frameRate,
        repeat: repeat
      });
    }
  }
}

export default AnimationManager;