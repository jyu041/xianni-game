// frontend/src/components/game/VfxManager.js
import { getAllVfxConfigs, getVfxConfig } from './config/VfxConfigs.js';

class VfxManager {
  constructor(scene) {
    this.scene = scene;
    this.activeEffects = new Set();
  }

  // Preload VFX assets - Load GIFs as DOM elements for animation
  preloadVfxAssets() {
    const configs = getAllVfxConfigs();
    
    configs.forEach(config => {
      // Load as HTML file to get around CORS issues, then we'll create DOM elements
      this.scene.load.html(config.key, config.path);
    });

    console.log(`Preloading ${configs.length} VFX assets`);
  }

  // Create animations for VFX effects - Use DOM elements for GIF animation
  createVfxAnimations() {
    console.log('VFX animations ready - using DOM elements for GIF animation');
  }

  // Play VFX effect at specified location
  playEffect(effectKey, x, y, options = {}) {
    const config = getVfxConfig(effectKey);
    if (!config) {
      console.warn(`VFX effect not found: ${effectKey}`);
      return null;
    }

    // Apply offset
    const finalX = x + (config.offset.x || 0);
    const finalY = y + (config.offset.y || 0);

    // Create DOM element for GIF animation
    const gifElement = document.createElement('img');
    gifElement.src = config.path;
    gifElement.style.position = 'absolute';
    gifElement.style.pointerEvents = 'none';
    gifElement.style.zIndex = '1000';
    
    // Apply scaling
    const baseScale = options.scale || 1.0;
    const scaledWidth = (config.dimensions[0] || 128) * baseScale;
    const scaledHeight = (config.dimensions[1] || 128) * baseScale;
    
    gifElement.style.width = `${scaledWidth}px`;
    gifElement.style.height = `${scaledHeight}px`;
    
    // Apply rotation if specified
    if (options.rotation !== undefined) {
      gifElement.style.transform = `rotate(${options.rotation}rad)`;
    }
    
    // Apply alpha
    if (options.alpha !== undefined) {
      gifElement.style.opacity = options.alpha;
    }

    // Position the element relative to the game canvas
    const gameCanvas = this.scene.game.canvas;
    const canvasRect = gameCanvas.getBoundingClientRect();
    
    gifElement.style.left = `${canvasRect.left + finalX - scaledWidth / 2}px`;
    gifElement.style.top = `${canvasRect.top + finalY - scaledHeight / 2}px`;

    // Add to DOM
    document.body.appendChild(gifElement);

    // Create a wrapper object to track this effect
    const effect = {
      domElement: gifElement,
      x: finalX,
      y: finalY,
      active: true,
      destroy: () => {
        if (gifElement.parentNode) {
          gifElement.parentNode.removeChild(gifElement);
        }
        effect.active = false;
      }
    };

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

  // Update method (called from scene) - Update positions relative to camera
  update() {
    // Remove destroyed effects from our tracking
    this.activeEffects.forEach(effect => {
      if (!effect.active) {
        this.activeEffects.delete(effect);
      } else {
        // Update position relative to canvas if canvas moved
        this.updateEffectPosition(effect);
      }
    });
  }

  // Update effect position relative to game canvas
  updateEffectPosition(effect) {
    if (!effect.domElement || !effect.domElement.parentNode) {
      effect.active = false;
      return;
    }

    const gameCanvas = this.scene.game.canvas;
    const canvasRect = gameCanvas.getBoundingClientRect();
    
    const elementWidth = parseFloat(effect.domElement.style.width);
    const elementHeight = parseFloat(effect.domElement.style.height);
    
    effect.domElement.style.left = `${canvasRect.left + effect.x - elementWidth / 2}px`;
    effect.domElement.style.top = `${canvasRect.top + effect.y - elementHeight / 2}px`;
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