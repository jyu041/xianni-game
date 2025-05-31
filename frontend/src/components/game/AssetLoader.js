// frontend/src/components/game/AssetLoader.js
import { MAIN_CHARACTER_ASSETS, getAllEnemyAssets } from './config/AssetConfigs.js';

class AssetLoader {
  constructor(scene) {
    this.scene = scene;
  }

  loadAllAssets() {
    this.loadFallbackTextures();
    this.loadMainCharacterAssets();
    this.loadEnemyAssets();
    this.setupLoadEvents();
  }

  loadFallbackTextures() {
    // Create simple graphics as fallback textures
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
    MAIN_CHARACTER_ASSETS.forEach(asset => {
      this.scene.load.spritesheet(asset.key, asset.path, {
        frameWidth: asset.frameSize.width,
        frameHeight: asset.frameSize.height
      });
    });
  }

  loadEnemyAssets() {
    const allEnemyAssets = getAllEnemyAssets();
    
    allEnemyAssets.forEach(asset => {
      this.scene.load.spritesheet(asset.key, asset.path, {
        frameWidth: asset.frameSize.width,
        frameHeight: asset.frameSize.height
      });
    });
  }

  setupLoadEvents() {
    this.scene.load.on('filecomplete', (key, type, data) => {
      console.log('Loaded:', key);
    });

    this.scene.load.on('loaderror', (file) => {
      console.warn('Failed to load:', file.key, file.src);
    });

    this.scene.load.on('complete', () => {
      console.log('All assets loaded successfully');
    });
  }
}

export default AssetLoader;