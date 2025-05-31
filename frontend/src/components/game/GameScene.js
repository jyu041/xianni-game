// frontend/src/components/game/GameScene.js
import Phaser from "phaser";
import AssetLoader from "./AssetLoader";
import AnimationManager from "./AnimationManager";
import PlayerController from "./PlayerController";
import EnemyManager from "./EnemyManager";
import ProjectileManager from "./ProjectileManager";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.gameStateRef = null;
    this.updateGameState = null;
    this.stageData = null;
  }

  init(data) {
    this.gameStateRef = data.gameStateRef;
    this.updateGameState = data.updateGameState;
    this.stageData = data.stageData;
  }

  preload() {
    console.log('Preloading assets...');
    
    // Use AssetLoader to handle all asset loading
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAllAssets();
  }

  create() {
    console.log('Creating game scene...');

    // Enable world bounds
    this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Initialize managers
    this.animationManager = new AnimationManager(this);
    this.playerController = new PlayerController(this);
    this.enemyManager = new EnemyManager(this);
    this.projectileManager = new ProjectileManager(this);

    // Create animations first
    this.animationManager.createAllAnimations();

    // Create player
    this.playerController.createPlayer();

    // Create groups
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();

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

  setupStageSettings() {
    if (this.stageData && this.stageData.stageSettings) {
      const settings = this.stageData.stageSettings;
      
      // Apply stage-specific enemy settings
      if (this.stageData.enemySpawns) {
        const spawns = this.stageData.enemySpawns;
        this.enemyManager.maxEnemies = spawns.maxEnemies || 15;
        this.enemySpawnRate = spawns.baseSpawnRate * 1000 || 2000; // Convert to milliseconds
      }
      
      // Apply difficulty multiplier to player health
      if (settings.difficultyMultiplier && this.gameStateRef) {
        const baseDamage = 0.5;
        this.enemyDamageMultiplier = settings.difficultyMultiplier;
      }
    }
  }

  setupTimers() {
    // Auto-fire timer
    this.autoFireTimer = this.time.addEvent({
      delay: 400,
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
      this.projectileManager.hitEnemy(projectile, enemy);
    });

    // Player-Enemy collisions
    this.physics.add.overlap(this.playerController.player, this.enemies, (player, enemy) => {
      // Let the enemy manager handle the attack if enemy is in attack range
      const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
      if (distance <= this.enemyManager.attackRange) {
        // Enemy will handle attack through its update cycle
      } else {
        // Direct collision damage (for when enemy touches player while moving)
        this.playerController.takeDamage(5);
      }
    });
  }

  update() {
    if (!this.gameStateRef || this.gameStateRef.isPaused || this.gameStateRef.isGameOver) {
      return;
    }

    this.playerController.update();
    this.enemyManager.update();
    this.projectileManager.update();
    this.updateGameStateData();
  }

  updateGameStateData() {
    if (this.gameStateRef && this.updateGameState) {
      this.gameStateRef.time += 1/60; // Add time based on 60fps
      this.gameStateRef.enemies = this.enemies.children.entries;
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

      // Update the React state
      this.updateGameState({ ...this.gameStateRef });
    }
  }

  // Called when scene is paused
  pause() {
    console.log('Game scene paused');
  }

  // Called when scene is resumed
  resume() {
    console.log('Game scene resumed');
  }
}

export default GameScene;