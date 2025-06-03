// frontend/src/components/GameLevel/scripts/AssetLoader.js
import { MAIN_CHARACTER_ASSETS } from '../config/AssetConfigs.js';

class AssetLoader {
  constructor(scene) {
    this.scene = scene;
  }

  loadAllAssets() {
    this.loadFallbackTextures();
    this.loadMainCharacterAssets();
    // No longer need to load enemy assets - they're GIFs loaded directly via DOM
    this.loadVfxAssets();
    this.setupLoadEvents();
  }

  loadFallbackTextures() {
    // Create simple graphics as fallback textures for basic elements
    const fallbackTextures = [
      { key: 'player', data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' },
      { key: 'enemy', data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' },
      { key: 'projectile', data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' }
    ];

    fallbackTextures.forEach(texture => {
      this.scene.load.image(texture.key, texture.data);
    });
  }

  loadMainCharacterAssets() {
    // Only load main character sprites - enemies are now GIFs
    MAIN_CHARACTER_ASSETS.forEach(asset => {
      this.scene.load.spritesheet(asset.key, asset.path, {
        frameWidth: asset.frameSize.width,
        frameHeight: asset.frameSize.height
      });
    });
  }

  loadVfxAssets() {
    // VfxManager handles its own asset loading using DOM elements
    console.log('VFX assets will be loaded by VfxManager using DOM elements');
  }

  setupLoadEvents() {
    this.scene.load.on('filecomplete', (key, type, data) => {
      // console.log('Loaded:', key);
    });

    this.scene.load.on('loaderror', (file) => {
      console.warn('Failed to load:', file.key, file.src);
    });

    this.scene.load.on('complete', () => {
      console.log('Assets loaded successfully (enemies now use GIF system)');
    });
  }
}

export default AssetLoader;