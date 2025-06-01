// frontend/src/components/game/scripts/AnimationManager.js
import { getMainCharacterAnimations, ENEMY_ANIMATIONS } from '../config/AnimationConfigs.js';

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
    const animations = getMainCharacterAnimations();
    
    Object.entries(animations).forEach(([key, config]) => {
      this.createAnimation(key, config);
    });
  }

  createEnemyAnimations() {
    Object.entries(ENEMY_ANIMATIONS).forEach(([enemyType, animations]) => {
      Object.entries(animations).forEach(([key, config]) => {
        this.createAnimation(key, config);
      });
    });
  }

  createAnimation(key, config) {
    const { texture, frames, frameRate, repeat } = config;
    
    if (this.scene.textures.exists(texture)) {
      this.scene.anims.create({
        key: key,
        frames: this.scene.anims.generateFrameNumbers(texture, { 
          start: frames[0], 
          end: frames[1] 
        }),
        frameRate: frameRate,
        repeat: repeat
      });
      // console.log(`Created animation: ${key}`);
    } else {
      console.warn(`Texture not found for animation: ${key} (${texture})`);
    }
  }
}

export default AnimationManager;