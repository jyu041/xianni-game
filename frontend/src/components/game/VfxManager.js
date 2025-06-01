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

  // Convert world coordinates to screen coordinates
  worldToScreen(worldX, worldY) {
    const camera = this.scene.cameras.main;
    const gameCanvas = this.scene.game.canvas;
    const canvasRect = gameCanvas.getBoundingClientRect();
    
    // Apply camera transformations
    const screenX = (worldX - camera.scrollX) * camera.zoom + canvasRect.left;
    const screenY = (worldY - camera.scrollY) * camera.zoom + canvasRect.top;
    
    return { x: screenX, y: screenY };
  }

  // Play VFX effect at specified world location
  playEffect(effectKey, worldX, worldY, options = {}) {
    const config = getVfxConfig(effectKey);
    if (!config) {
      console.warn(`VFX effect not found: ${effectKey}`);
      return null;
    }

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

    // Add to DOM
    document.body.appendChild(gifElement);

    // Create a wrapper object to track this effect
    const effect = {
      domElement: gifElement,
      worldX: worldX, // Store world coordinates
      worldY: worldY,
      offsetX: config.offset.x || 0, // Static offset from config
      offsetY: config.offset.y || 0,
      followTarget: options.followTarget || null, // Object to follow (like player)
      isRelativeToTarget: options.followTarget !== null, // Whether to follow target
      scaledWidth: scaledWidth,
      scaledHeight: scaledHeight,
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

    // Initial position update
    this.updateEffectPosition(effect);

    // Auto destroy after duration (only if not looping)
    if (config.autoDestroy && !config.looping) {
      const destroyDelay = config.duration || 2000; // Default 2 seconds
      this.scene.time.delayedCall(destroyDelay, () => {
        this.destroyEffect(effect);
      });
    }

    console.log(`VFX effect created: ${effectKey} at world (${worldX}, ${worldY}) with scale ${baseScale}${options.followTarget ? ' (following target)' : ''}`);
    return effect;
  }

  // Play effect at player location that follows the player
  playEffectAtPlayer(effectKey, options = {}) {
    if (!this.scene.playerController || !this.scene.playerController.player) {
      console.warn('Player not available for VFX');
      return null;
    }

    const player = this.scene.playerController.player;
    
    // Set the player as the follow target
    options.followTarget = player;
    
    // Use player's world coordinates
    return this.playEffect(effectKey, player.x, player.y, options);
  }

  // Play effect at target location that follows the target
  playEffectAtTarget(effectKey, target, options = {}) {
    if (!target || !target.x || !target.y) {
      console.warn('Invalid target for VFX');
      return null;
    }

    // Set the target as the follow target
    options.followTarget = target;

    // Use target's world coordinates
    return this.playEffect(effectKey, target.x, target.y, options);
  }

  // Play effect at static location (doesn't follow anything)
  playEffectAtLocation(effectKey, worldX, worldY, options = {}) {
    // Explicitly don't follow any target
    options.followTarget = null;
    return this.playEffect(effectKey, worldX, worldY, options);
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

  // Update method (called from scene) - Update positions for following effects
  update() {
    // Remove destroyed effects from our tracking and update positions
    this.activeEffects.forEach(effect => {
      if (!effect.active) {
        this.activeEffects.delete(effect);
      } else {
        // Update position - either following target or static
        this.updateEffectPosition(effect);
      }
    });
  }

  // Update effect position relative to game canvas and target
  updateEffectPosition(effect) {
    if (!effect.domElement || !effect.domElement.parentNode) {
      effect.active = false;
      return;
    }

    let worldX, worldY;

    if (effect.isRelativeToTarget && effect.followTarget && effect.followTarget.active) {
      // Follow the target (like player) - update world position based on target's current position
      worldX = effect.followTarget.x + effect.offsetX;
      worldY = effect.followTarget.y + effect.offsetY;
    } else {
      // Static position - use original world coordinates
      worldX = effect.worldX + effect.offsetX;
      worldY = effect.worldY + effect.offsetY;
    }

    // Convert world coordinates to screen coordinates and center the effect
    const screenPos = this.worldToScreen(worldX, worldY);
    const screenX = screenPos.x - effect.scaledWidth / 2;
    const screenY = screenPos.y - effect.scaledHeight / 2;
    
    effect.domElement.style.left = `${screenX}px`;
    effect.domElement.style.top = `${screenY}px`;
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