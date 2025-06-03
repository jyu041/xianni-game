// frontend/src/components/GameLevel/scripts/AnimationManager.js
import { getMainCharacterAnimations } from '../config/AnimationConfigs.js';

class AnimationManager {
  constructor(scene) {
    this.scene = scene;
  }

  createAllAnimations() {
    this.createMainCharacterAnimations();
    // No longer need to create enemy animations - they use GIF system
    console.log('Main character animations created (enemies now use GIF system)');
  }

  createMainCharacterAnimations() {
    const animations = getMainCharacterAnimations();
    
    Object.entries(animations).forEach(([key, config]) => {
      this.createAnimation(key, config);
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