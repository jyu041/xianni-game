// frontend/src/components/game/GameScene.js
import Phaser from "phaser";
import AssetLoader from "./AssetLoader";
import AnimationManager from "./AnimationManager";
import PlayerController from "./PlayerController";
import EnemyManager from "./EnemyManager";
import ProjectileManager from "./ProjectileManager";
import VfxManager from "./VfxManager";
import DamageNumberManager from "./DamageNumberManager";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.gameStateRef = null;
    this.updateGameState = null;
    this.stageData = null;
    this.debugSettings = {
      showPlayerAttackRange: false,
      showEnemyAttackRanges: false,
      showSoulCollectionRange: false,
      playerAttackSpeed: 400,
      playerAttackRange: 150,
      soulCollectionRange: 50,
      activeEnemies: 0,
      playerHealth: 100,
      soulCount: 0,
      selectedVfxEffect: '',
      vfxScale: 1.0,
      vfxRotation: 0,
      showDamageNumbers: true,
      critChance: 15, // Percentage (0-100)
      critDamageMultiplier: 1.5,
      playerMovementSpeed: 200,
      jianqiTravelSpeed: 300
    };
    
    // World settings
    this.worldSize = { width: 2400, height: 1800 }; // Larger virtual world
    this.viewportSize = { width: 0, height: 0 }; // Will be set in create()
    this.cameraFollowBorder = 150; // How close to edge before camera moves
  }

  init(data) {
    this.gameStateRef = data.gameStateRef;
    this.updateGameState = data.updateGameState;
    this.stageData = data.stageData;
    this.onDebugChange = data.onDebugChange;
    
    // Initialize soul count in game state
    if (this.gameStateRef) {
      this.gameStateRef.soulCount = this.gameStateRef.soulCount || 0;
    }
  }

  preload() {
    console.log('Preloading assets...');
    
    // Load custom fonts
    this.load.bitmapFont('vonwaon16', '/assets/fonts/vonwaon-bitmap.ttf/VonwaonBitmap-16px.ttf');
    this.load.bitmapFont('vonwaon12', '/assets/fonts/vonwaon-bitmap.ttf/VonwaonBitmap-12px.ttf');
    
    // Initialize VFX manager before asset loading
    this.vfxManager = new VfxManager(this);
    
    // Use AssetLoader to handle all asset loading
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAllAssets();
  }

  create() {
    console.log('Creating game scene...');

    // Set viewport size based on available space (accounting for sidebars)
    this.viewportSize.width = this.cameras.main.width;
    this.viewportSize.height = this.cameras.main.height;

    // Set world bounds to larger virtual world
    this.physics.world.setBounds(0, 0, this.worldSize.width, this.worldSize.height);

    // Create checkerboard background for explorable area
    this.createCheckerboardBackground();

    // Initialize managers
    this.animationManager = new AnimationManager(this);
    this.playerController = new PlayerController(this);
    this.enemyManager = new EnemyManager(this);
    this.projectileManager = new ProjectileManager(this);
    this.damageNumberManager = new DamageNumberManager(this);
    // VfxManager is already initialized in preload

    // Create animations first
    this.animationManager.createAllAnimations();
    
    console.log('VFX Manager ready for DOM-based GIF effects');

    // Create player in center of world
    this.playerController.createPlayer();
    this.playerController.player.setPosition(
      this.worldSize.width / 2, 
      this.worldSize.height / 2
    );

    // Setup camera to follow player with bounds
    this.setupCamera();

    // Create groups
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.souls = this.physics.add.group();

    // Setup input
    this.playerController.setupInput();

    // Setup stage-specific settings
    this.setupStageSettings();

    // Setup timers
    this.setupTimers();

    // Setup collisions
    this.setupCollisions();

    console.log('Scene creation complete');
  }

  createCheckerboardBackground() {
    // Create graphics for checkerboard pattern
    const graphics = this.add.graphics();
    
    // Checkerboard settings
    const tileSize = 64;
    const color1 = 0x001122; // Dark blue
    const color2 = 0x002244; // Slightly lighter blue
    
    // Draw checkerboard pattern across the entire world
    for (let x = 0; x < this.worldSize.width; x += tileSize) {
      for (let y = 0; y < this.worldSize.height; y += tileSize) {
        const isEven = ((x / tileSize) + (y / tileSize)) % 2 === 0;
        graphics.fillStyle(isEven ? color1 : color2);
        graphics.fillRect(x, y, tileSize, tileSize);
      }
    }
    
    // Add subtle grid lines
    graphics.lineStyle(1, 0x003366, 0.3);
    for (let x = 0; x <= this.worldSize.width; x += tileSize) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, this.worldSize.height);
    }
    for (let y = 0; y <= this.worldSize.height; y += tileSize) {
      graphics.moveTo(0, y);
      graphics.lineTo(this.worldSize.width, y);
    }
    graphics.strokePath();
    
    // Set depth to be behind everything else
    graphics.setDepth(-1000);
  }

  setupCamera() {
    const camera = this.cameras.main;
    
    // Set camera bounds to world size
    camera.setBounds(0, 0, this.worldSize.width, this.worldSize.height);
    
    // Start following player
    camera.startFollow(this.playerController.player);
    
    // Set smooth following
    camera.setLerp(0.1, 0.1);
    
    // Set zoom level for better view
    camera.setZoom(1.0);
    
    console.log(`Camera setup: World ${this.worldSize.width}x${this.worldSize.height}, Viewport ${this.viewportSize.width}x${this.viewportSize.height}`);
  }

  updateDebugSettings(key, value) {
    this.debugSettings[key] = value;
    
    // Apply real-time changes
    if (key === 'playerAttackSpeed' && this.autoFireTimer) {
      const limitedValue = Math.max(50, value);
      this.autoFireTimer.delay = limitedValue;
      this.debugSettings[key] = limitedValue;
    }
    
    if (key === 'soulCollectionRange' && this.playerController) {
      this.playerController.soulCollectionRange = value;
    }
    
    if (key === 'playerAttackRange' && this.playerController) {
      this.playerController.attackRange = value;
    }
    
    // Handle damage numbers toggle
    if (key === 'showDamageNumbers' && this.damageNumberManager) {
      this.damageNumberManager.setShowDamageNumbers(value);
    }
  }

  // New method to cast VFX effect from debug menu
  castVfxEffect(effectKey, options = {}) {
    if (!this.vfxManager || !effectKey) {
      console.warn('Cannot cast VFX effect - manager not ready or no effect specified');
      return;
    }

    // Apply debug settings to options
    options.scale = options.scale || this.debugSettings.vfxScale || 1.0;
    options.rotation = options.rotation !== undefined ? options.rotation : this.debugSettings.vfxRotation || 0;

    // Cast at player location
    const effect = this.vfxManager.playEffectAtPlayer(effectKey, options);
    
    if (effect) {
      console.log(`Cast VFX effect: ${effectKey} at player location`);
    }
  }

  setupStageSettings() {
    if (this.stageData && this.stageData.stageSettings) {
      const settings = this.stageData.stageSettings;
      
      // Apply stage-specific enemy settings
      if (this.stageData.enemySpawns) {
        const spawns = this.stageData.enemySpawns;
        this.enemyManager.maxEnemies = spawns.maxEnemies || 15;
        this.enemySpawnRate = spawns.baseSpawnRate * 1000 || 2000;
      }
      
      // Apply difficulty multiplier
      if (settings.difficultyMultiplier && this.gameStateRef) {
        this.enemyDamageMultiplier = settings.difficultyMultiplier;
      }
    }
  }

  setupTimers() {
    // Auto-fire timer with debug settings and minimum limit
    const attackSpeed = Math.max(50, this.debugSettings.playerAttackSpeed);
    this.autoFireTimer = this.time.addEvent({
      delay: attackSpeed,
      callback: () => this.playerController.autoFire(),
      loop: true
    });

    // Enemy spawn timer with stage-specific rate
    const spawnRate = this.enemySpawnRate || 2000;
    this.enemySpawnTimer = this.time.addEvent({
      delay: spawnRate,
      callback: () => this.enemyManager.spawnEnemy(),
      loop: true
    });

    // Gradually increase spawn rate over time
    this.difficultyTimer = this.time.addEvent({
      delay: 30000, // Every 30 seconds
      callback: () => {
        if (this.enemySpawnTimer.delay > 800) { // Minimum spawn rate
          this.enemySpawnTimer.delay = Math.max(800, this.enemySpawnTimer.delay * 0.9);
          console.log('Increased difficulty - new spawn rate:', this.enemySpawnTimer.delay);
        }
      },
      loop: true
    });
  }

  setupCollisions() {
    // Projectile-Enemy collisions
    this.physics.add.overlap(this.projectiles, this.enemies, (projectile, enemy) => {
      if (!enemy.isDead) {
        this.projectileManager.hitEnemy(projectile, enemy);
      }
    });

    // Player-Enemy collisions
    this.physics.add.overlap(this.playerController.player, this.enemies, (player, enemy) => {
      if (!enemy.isDead) {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
        if (distance <= this.enemyManager.attackRange) {
          // Enemy will handle attack through its update cycle
        } else {
          // Direct collision damage
          this.playerController.takeDamage(5);
        }
      }
    });
  }

  update() {
    if (!this.gameStateRef || this.gameStateRef.isPaused || this.gameStateRef.isGameOver) {
      return;
    }

    // Update debug settings real-time with minimum enforcement
    const limitedAttackSpeed = Math.max(50, this.debugSettings.playerAttackSpeed);
    this.autoFireTimer.delay = limitedAttackSpeed;

    this.playerController.update();
    this.enemyManager.update();
    this.projectileManager.update();
    this.vfxManager.update();
    this.damageNumberManager.update();
    this.updateGameStateData();
    this.updateDebugStats();
  }

  updateDebugStats() {
    this.debugSettings.activeEnemies = this.enemies.children.entries.filter(e => e.active && !e.isDead).length;
    this.debugSettings.playerHealth = this.gameStateRef?.player?.health || 0;
    this.debugSettings.soulCount = this.gameStateRef?.soulCount || 0;
  }

  updateGameStateData() {
    if (this.gameStateRef && this.updateGameState) {
      this.gameStateRef.time += 1/60; // Add time based on 60fps
      this.gameStateRef.enemies = this.enemies.children.entries.filter(e => e.active && !e.isDead);
      this.gameStateRef.projectiles = this.projectiles.children.entries;

      // Stage completion conditions
      const stageSettings = this.stageData?.stageSettings;
      if (stageSettings) {
        const duration = stageSettings.duration || 300; // Default 5 minutes
        
        // Win condition - survive for stage duration
        if (this.gameStateRef.time >= duration) {
          this.gameStateRef.isGameOver = true;
          this.gameStateRef.completed = true;
        }
      } else {
        // Default win condition - survive 5 minutes
        if (this.gameStateRef.time >= 300) {
          this.gameStateRef.isGameOver = true;
          this.gameStateRef.completed = true;
        }
      }

      // Loss condition - player health reaches 0
      if (this.gameStateRef.player.health <= 0) {
        this.gameStateRef.isGameOver = true;
        this.gameStateRef.completed = false;
        
        // Stop all timers and physics to prevent further updates
        if (this.autoFireTimer) this.autoFireTimer.paused = true;
        if (this.enemySpawnTimer) this.enemySpawnTimer.paused = true;
        if (this.difficultyTimer) this.difficultyTimer.paused = true;
        
        // Stop all enemy movement
        this.enemies.children.entries.forEach(enemy => {
          if (enemy.active) {
            enemy.setVelocity(0, 0);
            enemy.isAttacking = false;
          }
        });
        
        // Stop player movement
        if (this.playerController.player) {
          this.playerController.player.setVelocity(0, 0);
        }
      }

      // Update the React state
      this.updateGameState({ ...this.gameStateRef });
    }
  }

  // Called when scene is paused
  pause() {
    console.log('Game scene paused');
    if (this.autoFireTimer) this.autoFireTimer.paused = true;
    if (this.enemySpawnTimer) this.enemySpawnTimer.paused = true;
    if (this.difficultyTimer) this.difficultyTimer.paused = true;
  }

  // Called when scene is resumed
  resume() {
    console.log('Game scene resumed');
    if (this.autoFireTimer) this.autoFireTimer.paused = false;
    if (this.enemySpawnTimer) this.enemySpawnTimer.paused = false;
    if (this.difficultyTimer) this.difficultyTimer.paused = false;
  }

  // Cleanup method to handle VFX when scene is destroyed
  shutdown() {
    if (this.vfxManager) {
      this.vfxManager.clearAllEffects();
    }
  }
}

export default GameScene;