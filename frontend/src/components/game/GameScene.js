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
  }

  init(data) {
    this.gameStateRef = data.gameStateRef;
    this.updateGameState = data.updateGameState;
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

    // Setup timers
    this.setupTimers();

    // Setup collisions
    this.setupCollisions();

    console.log('Scene creation complete');
  }

  setupTimers() {
    // Auto-fire timer - reduced range
    this.autoFireTimer = this.time.addEvent({
      delay: 400, // Slightly slower firing rate
      callback: () => this.playerController.autoFire(),
      loop: true
    });

    // Enemy spawn timer
    this.enemySpawnTimer = this.time.addEvent({
      delay: 2000,
      callback: () => this.enemyManager.spawnEnemy(),
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
      this.playerController.hitPlayer();
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
      this.gameStateRef.time += 1/60;
      this.gameStateRef.enemies = this.enemies.children.entries;
      this.gameStateRef.projectiles = this.projectiles.children.entries;

      // Win condition - survive 5 minutes
      if (this.gameStateRef.time >= 300) {
        this.gameStateRef.isGameOver = true;
        this.gameStateRef.completed = true;
      }

      this.updateGameState({ ...this.gameStateRef });
    }
  }
}

export default GameScene;