// frontend/src/components/GameLevel/scripts/GameScene.js
import Phaser from "phaser";
import AssetLoader from "./AssetLoader";
import AnimationManager from "./AnimationManager";
import PlayerController from "./PlayerController";
import EnemyManager from "./EnemyManager";
import ProjectileManager from "./ProjectileManager";
import VfxManager from "./VfxManager";
import DamageNumberManager from "./DamageNumberManager";
import TianniSwordManager from "./TianniSwordManager";
import HealthRegenManager from "./HealthRegenManager";
import elementService from "/src/services/elementService";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.gameStateRef = null;
    this.updateGameState = null;
    this.stageData = null;
    this.playerData = null;
    this.elementInteraction = null;
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
      showEnemyHealthBars: true,
      critChance: 15,
      critDamageMultiplier: 1.5,
      playerMovementSpeed: 200,
      jianqiTravelSpeed: 300,
      enemySpawnInterval: 2000,
      invincibility: false
    };
    
    this.worldSize = { width: 4800, height: 3600 };
    this.viewportSize = { width: 0, height: 0 };
    this.cameraFollowBorder = 150;
  }

  init(data) {
    this.gameStateRef = data.gameStateRef;
    this.updateGameState = data.updateGameState;
    this.stageData = data.stageData;
    this.playerData = data.playerData;
    this.onDebugChange = data.onDebugChange;
    
    if (this.gameStateRef) {
      this.gameStateRef.soulCount = this.gameStateRef.soulCount || 0;
    }
  }

  preload() {
    console.log('Preloading assets...');
    
    this.load.bitmapFont('vonwaon16', '/assets/fonts/vonwaon-bitmap.ttf/VonwaonBitmap-16px.ttf');
    this.load.bitmapFont('vonwaon12', '/assets/fonts/vonwaon-bitmap.ttf/VonwaonBitmap-12px.ttf');
    
    this.vfxManager = new VfxManager(this);
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAllAssets();
  }

  async create() {
    console.log('Creating game scene with GIF enemy system...');

    this.viewportSize.width = this.cameras.main.width;
    this.viewportSize.height = this.cameras.main.height;
    this.physics.world.setBounds(0, 0, this.worldSize.width, this.worldSize.height);

    this.createCheckerboardBackground();
    this.createJianqiTexture();

    // Initialize managers
    this.animationManager = new AnimationManager(this);
    this.playerController = new PlayerController(this);
    this.enemyManager = new EnemyManager(this);
    this.projectileManager = new ProjectileManager(this);
    this.damageNumberManager = new DamageNumberManager(this);
    this.tianniSwordManager = new TianniSwordManager(this);
    this.healthRegenManager = new HealthRegenManager(this);

    // Only create main character animations (enemies use GIF system)
    this.animationManager.createAllAnimations();
    
    console.log('VFX Manager ready for DOM-based GIF effects');

    this.playerController.createPlayer();
    this.playerController.player.setPosition(
      this.worldSize.width / 2, 
      this.worldSize.height / 2
    );

    this.setupCamera();

    // Create groups
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.souls = this.physics.add.group();
    this.healthOrbs = this.physics.add.group();

    this.playerController.setupInput();
    
    await this.calculateElementEffects();
    
    this.setupStageSettings();
    this.setupTimers();
    this.setupCollisions();
    
    this.healthRegenManager.initialize();

    console.log('Scene creation complete with GIF enemy system');
  }

  async calculateElementEffects() {
    if (!this.playerData || !this.stageData) return;
    
    try {
      const playerElement = this.playerData.primaryElement || 'fire';
      const playerLevel = this.playerData.elementLevels?.[playerElement] || 0;
      const stageElement = this.stageData.stageElement || 'neutral';
      const stageLevel = this.stageData.elementLevel || 0;
      
      this.elementInteraction = await elementService.calculateElementInteraction(
        playerElement, playerLevel, stageElement, stageLevel
      );
      
      console.log('Element interaction calculated:', this.elementInteraction);
      
      this.applyElementPassives();
      
    } catch (error) {
      console.error('Failed to calculate element effects:', error);
      this.elementInteraction = { effectType: 'neutral' };
    }
  }

  applyElementPassives() {
    if (!this.playerData) return;
    
    const primaryElement = this.playerData.primaryElement || 'fire';
    const elementLevels = this.playerData.elementLevels || {};
    
    Object.keys(elementLevels).forEach(element => {
      const level = elementLevels[element] || 0;
      const isPrimary = element === primaryElement;
      const bonus = elementService.getElementPassiveBonus(element, level, isPrimary);
      
      switch (element) {
        case 'fire':
          this.fireDamageBonus = bonus;
          break;
        case 'earth':
          this.earthDamageReduction = bonus;
          break;
        case 'water':
          this.waterManaRegen = bonus;
          break;
        case 'wood':
          this.woodHealthRegen = bonus;
          break;
        case 'metal':
          this.metalResourceBonus = bonus;
          break;
      }
    });
  }

  onEnemyKilled() {
    if (this.healthRegenManager) {
      this.healthRegenManager.onEnemyKilled();
    }
  }
  
  triggerTianniSwordSkill() {
    if (!this.playerData || !this.tianniSwordManager) return;
    
    const swordLevel = this.playerData.tianniSwordLevel || 1;
    const primaryElement = this.playerData.primaryElement || 'fire';
    const hasMutation = this.playerData.hasTianniSwordMutation || false;
    
    if (!this.tianniSwordManager.canUseSkill(swordLevel)) {
      console.log('Tianni Sword skill on cooldown');
      return false;
    }
    
    const manaCost = this.tianniSwordManager.getManaCost(swordLevel);
    if (manaCost > 0) {
      console.log(`Tianni Sword skill requires ${manaCost} mana`);
    }
    
    return this.tianniSwordManager.useSkill(swordLevel, primaryElement, hasMutation);
  }

  applyElementEffects(baseDamage, isPlayerDealing = true) {
    if (!this.elementInteraction || this.elementInteraction.effectType === 'neutral') {
      return baseDamage;
    }
    
    let modifiedDamage = baseDamage;
    
    if (isPlayerDealing) {
      modifiedDamage *= this.elementInteraction.damageMultiplier || 1.0;
      
      if (this.fireDamageBonus) {
        modifiedDamage *= (1 + this.fireDamageBonus);
      }
    } else {
      const reduction = this.elementInteraction.damageReduction || 0;
      modifiedDamage *= (1 + reduction);
      
      if (this.earthDamageReduction) {
        modifiedDamage *= (1 - this.earthDamageReduction);
      }
    }
    
    return Math.max(1, Math.floor(modifiedDamage));
  }

  createJianqiTexture() {
    if (this.textures.exists('jianqi')) {
      console.log('Jianqi texture already exists');
      return;
    }
    
    try {
      const canvas = this.textures.createCanvas('jianqi', 20, 40);
      const context = canvas.getContext('2d');
      
      context.clearRect(0, 0, 20, 40);
      
      context.fillStyle = '#00AAFF';
      context.fillRect(8, 5, 4, 30);
      
      context.fillStyle = '#88DDFF';
      context.fillRect(7, 2, 6, 8);
      
      context.fillStyle = '#44BBFF';
      context.fillRect(5, 8, 2, 24);
      context.fillRect(13, 8, 2, 24);
      
      context.fillStyle = 'rgba(170, 238, 255, 0.6)';
      context.fillRect(4, 6, 12, 28);
      
      canvas.refresh();
      
      console.log('Successfully created jianqi texture using canvas method');
    } catch (error) {
      console.error('Failed to create jianqi texture:', error);
      
      const graphics = this.add.graphics();
      graphics.fillStyle(0x00AAFF, 1.0);
      graphics.fillRect(8, 5, 4, 30);
      graphics.fillStyle(0x88DDFF, 1.0);
      graphics.fillRect(7, 2, 6, 8);
      graphics.fillStyle(0x44BBFF, 0.8);
      graphics.fillRect(5, 8, 2, 24);
      graphics.fillRect(13, 8, 2, 24);
      graphics.generateTexture('jianqi', 20, 40);
      graphics.destroy();
      
      console.log('Created jianqi texture using fallback graphics method');
    }
  }

  createCheckerboardBackground() {
    const graphics = this.add.graphics();
    
    const tileSize = 64;
    const color1 = 0x001122;
    const color2 = 0x002244;
    
    for (let x = 0; x < this.worldSize.width; x += tileSize) {
      for (let y = 0; y < this.worldSize.height; y += tileSize) {
        const isEven = ((x / tileSize) + (y / tileSize)) % 2 === 0;
        graphics.fillStyle(isEven ? color1 : color2);
        graphics.fillRect(x, y, tileSize, tileSize);
      }
    }
    
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
    
    graphics.setDepth(-1000);
  }

  setupCamera() {
    const camera = this.cameras.main;
    
    camera.setBounds(0, 0, this.worldSize.width, this.worldSize.height);
    camera.startFollow(this.playerController.player);
    camera.setLerp(0.1, 0.1);
    camera.setZoom(1.0);
    
    this.constrainPlayerToBounds();
    
    console.log(`Camera setup: World ${this.worldSize.width}x${this.worldSize.height}, Viewport ${this.viewportSize.width}x${this.viewportSize.height}`);
  }

  constrainPlayerToBounds() {
    const player = this.playerController.player;
    const margin = 32;
    
    this.physics.world.on('worldbounds', (event, body) => {
      if (body.gameObject === player) {
        player.x = Phaser.Math.Clamp(player.x, margin, this.worldSize.width - margin);
        player.y = Phaser.Math.Clamp(player.y, margin, this.worldSize.height - margin);
      }
    });
  }

  updateDebugSettings(key, value) {
    this.debugSettings[key] = value;
    
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
    
    if (key === 'showDamageNumbers' && this.damageNumberManager) {
      this.damageNumberManager.setShowDamageNumbers(value);
    }
    
    if (key === 'enemySpawnInterval' && this.enemySpawnTimer) {
      const limitedValue = Math.max(100, value);
      this.enemySpawnTimer.delay = limitedValue;
      this.debugSettings[key] = limitedValue;
    }
    
    if (key === 'invincibility' && this.playerController) {
      this.playerController.isInvincible = value;
    }
    
    if (key === 'showEnemyHealthBars' && this.enemyManager) {
      this.enemyManager.showHealthBars = value;
    }
  }

  castVfxEffect(effectKey, options = {}) {
    if (!this.vfxManager || !effectKey) {
      console.warn('Cannot cast VFX effect - manager not ready or no effect specified');
      return;
    }

    options.scale = options.scale || this.debugSettings.vfxScale || 1.0;
    options.rotation = options.rotation !== undefined ? options.rotation : this.debugSettings.vfxRotation || 0;

    const effect = this.vfxManager.playEffectAtPlayer(effectKey, options);
    
    if (effect) {
      console.log(`Cast VFX effect: ${effectKey} at player location`);
    }
  }

  setupStageSettings() {
    if (this.stageData && this.stageData.stageSettings) {
      const settings = this.stageData.stageSettings;
      
      if (this.stageData.enemySpawns) {
        const spawns = this.stageData.enemySpawns;
        this.enemyManager.maxEnemies = spawns.maxEnemies || 25;
        this.enemySpawnRate = spawns.baseSpawnRate * 1000 || 2000;
      }
      
      if (settings.difficultyMultiplier && this.gameStateRef) {
        this.enemyDamageMultiplier = settings.difficultyMultiplier;
      }
    }
  }

  setupTimers() {
    const attackSpeed = Math.max(50, this.debugSettings.playerAttackSpeed);
    this.autoFireTimer = this.time.addEvent({
      delay: attackSpeed,
      callback: () => this.playerController.autoFire(),
      loop: true
    });

    const baseSpawnRate = this.enemySpawnRate || 2000;
    const spawnRate = this.debugSettings.enemySpawnInterval || baseSpawnRate;
    this.enemySpawnTimer = this.time.addEvent({
      delay: spawnRate,
      callback: () => this.enemyManager.spawnEnemy(),
      loop: true
    });

    this.difficultyTimer = this.time.addEvent({
      delay: 30000,
      callback: () => {
        if (this.enemySpawnTimer.delay > 800) {
          this.enemySpawnTimer.delay = Math.max(800, this.enemySpawnTimer.delay * 0.9);
          console.log('Increased difficulty - new spawn rate:', this.enemySpawnTimer.delay);
        }
      },
      loop: true
    });
  }

  setupCollisions() {
    this.physics.add.overlap(this.projectiles, this.enemies, (projectile, enemy) => {
      if (!enemy.isDead && !this.enemyManager.dyingEnemies.has(enemy)) {
        this.projectileManager.hitEnemy(projectile, enemy);
      }
    });

    this.physics.add.overlap(this.playerController.player, this.enemies, (player, enemy) => {
      if (!enemy.isDead && !this.enemyManager.dyingEnemies.has(enemy)) {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
        if (distance <= this.enemyManager.attackRange) {
          // Enemy will handle attack through its update cycle
        } else {
          this.playerController.takeDamage(5);
        }
      }
    });
  }

  update() {
    if (!this.gameStateRef || this.gameStateRef.isPaused || this.gameStateRef.isGameOver) {
      return;
    }

    const limitedAttackSpeed = Math.max(50, this.debugSettings.playerAttackSpeed);
    if (this.autoFireTimer) {
      this.autoFireTimer.delay = limitedAttackSpeed;
    }
    
    const limitedSpawnInterval = Math.max(100, this.debugSettings.enemySpawnInterval);
    if (this.enemySpawnTimer) {
      this.enemySpawnTimer.delay = limitedSpawnInterval;
    }

    this.playerController.update();
    this.enemyManager.update();
    this.projectileManager.update();
    this.vfxManager.update();
    this.damageNumberManager.update();
    
    if (this.healthRegenManager) {
      this.healthRegenManager.update();
    }
    
    this.enforcePlayerBounds();
    
    this.updateGameStateData();
    this.updateDebugStats();
  }

  enforcePlayerBounds() {
    const player = this.playerController.player;
    const margin = 64;
    
    if (player.x < margin) {
      player.x = margin;
      player.setVelocityX(0);
    }
    if (player.x > this.worldSize.width - margin) {
      player.x = this.worldSize.width - margin;
      player.setVelocityX(0);
    }
    if (player.y < margin) {
      player.y = margin;
      player.setVelocityY(0);
    }
    if (player.y > this.worldSize.height - margin) {
      player.y = this.worldSize.height - margin;
      player.setVelocityY(0);
    }
  }

  updateDebugStats() {
    this.debugSettings.activeEnemies = this.enemyManager.getActiveEnemyCount();
    this.debugSettings.playerHealth = this.gameStateRef?.player?.health || 0;
    this.debugSettings.soulCount = this.gameStateRef?.soulCount || 0;
  }

  updateGameStateData() {
    if (this.gameStateRef && this.updateGameState) {
      this.gameStateRef.time += 1/60;
      this.gameStateRef.enemies = this.enemies.children.entries.filter(e => 
        e.active && !e.isDead && !this.enemyManager.dyingEnemies.has(e)
      );
      this.gameStateRef.projectiles = this.projectiles.children.entries;

      const stageSettings = this.stageData?.stageSettings;
      if (stageSettings) {
        const duration = stageSettings.duration || 300;
        
        if (this.gameStateRef.time >= duration) {
          this.gameStateRef.isGameOver = true;
          this.gameStateRef.completed = true;
        }
      } else {
        if (this.gameStateRef.time >= 300) {
          this.gameStateRef.isGameOver = true;
          this.gameStateRef.completed = true;
        }
      }

      if (this.gameStateRef.player.health <= 0) {
        this.gameStateRef.isGameOver = true;
        this.gameStateRef.completed = false;
        
        if (this.autoFireTimer) this.autoFireTimer.paused = true;
        if (this.enemySpawnTimer) this.enemySpawnTimer.paused = true;
        if (this.difficultyTimer) this.difficultyTimer.paused = true;
        
        this.enemies.children.entries.forEach(enemy => {
          if (enemy.active && !enemy.isDead) {
            enemy.setVelocity(0, 0);
            enemy.isAttacking = false;
          }
        });
        
        if (this.playerController.player) {
          this.playerController.player.setVelocity(0, 0);
        }
      }

      this.updateGameState({ ...this.gameStateRef });
    }
  }

  pause() {
    console.log('Game scene paused');
    if (this.autoFireTimer) this.autoFireTimer.paused = true;
    if (this.enemySpawnTimer) this.enemySpawnTimer.paused = true;
    if (this.difficultyTimer) this.difficultyTimer.paused = true;
  }

  resume() {
    console.log('Game scene resumed');
    if (this.autoFireTimer) this.autoFireTimer.paused = false;
    if (this.enemySpawnTimer) this.enemySpawnTimer.paused = false;
    if (this.difficultyTimer) this.difficultyTimer.paused = false;
  }

  shutdown() {
    if (this.vfxManager) {
      this.vfxManager.clearAllEffects();
    }
    
    // Clean up GIF elements when scene is destroyed
    if (this.enemyManager) {
      this.enemyManager.destroy();
    }
  }
}

export default GameScene;