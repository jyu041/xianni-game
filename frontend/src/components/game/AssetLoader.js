// frontend/src/components/game/AssetLoader.js
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
    this.scene.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
    this.scene.load.image('enemy', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
    this.scene.load.image('projectile', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
  }

  loadMainCharacterAssets() {
    // Main character sprite sheets - 768x80 = 8 frames of 96x80
    const mainCharAssets = [
      { key: 'mainChar_idle_down', path: '/assets/characters/mainCharacter/IDLE/idle_down.png' },
      { key: 'mainChar_run_down', path: '/assets/characters/mainCharacter/RUN/run_down.png' },
      { key: 'mainChar_run_up', path: '/assets/characters/mainCharacter/RUN/run_up.png' },
      { key: 'mainChar_run_left', path: '/assets/characters/mainCharacter/RUN/run_left.png' },
      { key: 'mainChar_run_right', path: '/assets/characters/mainCharacter/RUN/run_right.png' },
      { key: 'mainChar_attack1_down', path: '/assets/characters/mainCharacter/ATTACK 1/attack1_down.png' },
      { key: 'mainChar_attack1_up', path: '/assets/characters/mainCharacter/ATTACK 1/attack1_up.png' },
      { key: 'mainChar_attack1_left', path: '/assets/characters/mainCharacter/ATTACK 1/attack1_left.png' },
      { key: 'mainChar_attack1_right', path: '/assets/characters/mainCharacter/ATTACK 1/attack1_right.png' }
    ];

    mainCharAssets.forEach(asset => {
      this.scene.load.spritesheet(asset.key, asset.path, {
        frameWidth: 96,
        frameHeight: 80
      });
    });
  }

  loadEnemyAssets() {
    // EvilWizard1 sprites - 1200x150 = 8 frames of 150x150
    const evilWizardAssets = [
      { key: 'enemy_evilWizard1_idle', path: '/assets/characters/enemies/evilWizard1/Idle.png', frames: { width: 150, height: 150 } },
      { key: 'enemy_evilWizard1_move', path: '/assets/characters/enemies/evilWizard1/Move.png', frames: { width: 150, height: 150 } },
      { key: 'enemy_evilWizard1_attack', path: '/assets/characters/enemies/evilWizard1/Attack.png', frames: { width: 150, height: 150 } }
    ];

    // Fighter sprites - various dimensions
    const fighterAssets = [
      { key: 'enemy_fighter_idle', path: '/assets/characters/enemies/fighter/Idle.png', frames: { width: 128, height: 128 } },
      { key: 'enemy_fighter_run', path: '/assets/characters/enemies/fighter/Run.png', frames: { width: 128, height: 128 } },
      { key: 'enemy_fighter_attack1', path: '/assets/characters/enemies/fighter/Attack_1.png', frames: { width: 128, height: 128 } }
    ];

    [...evilWizardAssets, ...fighterAssets].forEach(asset => {
      this.scene.load.spritesheet(asset.key, asset.path, {
        frameWidth: asset.frames.width,
        frameHeight: asset.frames.height
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
  }
}

export default AssetLoader;