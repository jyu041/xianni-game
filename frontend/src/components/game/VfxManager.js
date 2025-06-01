// frontend/src/components/game/VfxManager.js
import { getAllVfxConfigs, getVfxConfig } from './config/VfxConfigs.js';

class VfxManager {
  constructor(scene) {
    this.scene = scene;
    this.activeEffects = new Set();
  }

  // Preload VFX assets - GIFs need special handling
  preloadVfxAssets() {
    const configs = getAllVfxConfigs();
    
    configs.forEach(config => {
      // For now, load all as images since GIFs are complex to handle as spritesheets
      // The actual GIF animation will be handled by the browser's native GIF support
      this.scene.load.image(config.key, config.path);
    });

    console.log(`Preloading ${configs.length} VFX assets`);
  }

  // Create animations for VFX effects - simplified for GIF handling
  createVfxAnimations() {
    // Since we're loading GIFs as images, the browser will handle the animation automatically
    // No need to create Phaser animations for GIFs
    console.log('VFX animations ready - using native GIF animation');
  }

  // Play VFX effect at specified location
  playEffect(effectKey, x, y, options = {}) {
    const config = getVfxConfig(effectKey);
    if (!config) {
      console.warn(`VFX effect not found: ${effectKey}`);
      return null;
    }

    // Check if texture exists
    if (!this.scene.textures.exists(config.key)) {
      console.warn(`VFX texture not loaded: ${config.key}`);
      return null;
    }

    // Apply offset
    const finalX = x + (config.offset.x || 0);
    const finalY = y + (config.offset.y || 0);

    // Create the effect as an image - browser will handle GIF animation
    const effect = this.scene.add.image(finalX, finalY, config.key);
    
    // Apply scaling - use the original dimensions without aggressive scaling
    const baseScale = options.scale || 1.0;
    effect.setScale(baseScale);
    
    // Apply rotation if specified
    if (options.rotation !== undefined) {
      effect.setRotation(options.rotation);
    }

    // Apply alpha
    effect.setAlpha(options.alpha || 1.0);

    // Apply tint if specified
    if (options.tint !== undefined) {
      effect.setTint(options.tint);
    }

    // Add to active effects
    this.activeEffects.add(effect);

    // Auto destroy after duration (only if not looping)
    if (config.autoDestroy && !config.looping) {
      const destroyDelay = config.duration || 2000; // Default 2 seconds
      this.scene.time.delayedCall(destroyDelay, () => {
        this.destroyEffect(effect);
      });
    }

    console.log(`VFX effect created: ${effectKey} at (${finalX}, ${finalY}) with scale ${baseScale}`);
    return effect;
  }

  // Play effect at player location
  playEffectAtPlayer(effectKey, options = {}) {
    if (!this.scene.playerController || !this.scene.playerController.player) {
      console.warn('Player not available for VFX');
      return null;
    }

    const player = this.scene.playerController.player;
    return this.playEffect(effectKey, player.x, player.y, options);
  }

  // Play effect at target location
  playEffectAtTarget(effectKey, target, options = {}) {
    if (!target || !target.x || !target.y) {
      console.warn('Invalid target for VFX');
      return null;
    }

    return this.playEffect(effectKey, target.x, target.y, options);
  }

  // Destroy specific effect
  destroyEffect(effect) {
    if (effect && effect.active) {
      this.activeEffects.delete(effect);
      effect.destroy();
    }
  }

  // Clear all active effects
  clearAllEffects() {
    this.activeEffects.forEach(effect => {
      if (effect && effect.active) {
        effect.destroy();
      }
    });
    this.activeEffects.clear();
  }

  // Update method (called from scene)
  update() {
    // Remove destroyed effects from our tracking
    this.activeEffects.forEach(effect => {
      if (!effect.active) {
        this.activeEffects.delete(effect);
      }
    });
  }

  // Get all available effect keys for UI
  getAvailableEffects() {
    return getAllVfxConfigs().map(config => ({
      key: config.key,
      name: config.name,
      category: config.category
    }));
  }
}

export default VfxManager;