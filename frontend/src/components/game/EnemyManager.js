// frontend/src/components/game/EnemyManager.js
import { getAllEnemyTypes, getRandomEnemyType } from './config/EnemyTypes.js';

class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.maxEnemies = 15;
    this.attackRange = 60;
    this.attackCooldown = 2000;
    this.enemyTypes = getAllEnemyTypes();
    this.healthBars = []; // Store health bar graphics
  }

  update() {
    this.updateEnemyBehavior();
    this.updateHealthBars();
    this.updateDebugRanges();
  }

  updateEnemyBehavior() {
    this.scene.enemies.children.entries.forEach(enemy => {
      if (!enemy.active || enemy.isDead) return;

      const player = this.scene.playerController.player;
      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
      
      if (distance <= this.attackRange && !enemy.isAttacking) {
        this.tryAttack(enemy, player);
      } else if (!enemy.isAttacking) {
        this.moveTowardsPlayer(enemy, player);
      }
    });
  }

  updateHealthBars() {
    this.scene.enemies.children.entries.forEach(enemy => {
      if (!enemy.active || enemy.isDead) return;

      const healthPercent = enemy.health / enemy.maxHealth;
      
      // Only show health bar if not at full health
      if (healthPercent < 1.0) {
        this.showEnemyHealthBar(enemy, healthPercent);
      } else {
        this.hideEnemyHealthBar(enemy);
      }
    });
  }

  showEnemyHealthBar(enemy, healthPercent) {
    if (!enemy.healthBarBg) {
      // Create health bar background
      enemy.healthBarBg = this.scene.add.rectangle(
        enemy.x, enemy.y - enemy.displayHeight/2 - 15, 
        40, 6, 0x000000, 0.7
      );
      enemy.healthBarBg.setStrokeStyle(1, 0xffffff, 0.5);
      
      // Create health bar fill
      enemy.healthBarFill = this.scene.add.rectangle(
        enemy.x, enemy.y - enemy.displayHeight/2 - 15, 
        38, 4, 0x00ff00
      );
    }

    // Update position
    enemy.healthBarBg.setPosition(enemy.x, enemy.y - enemy.displayHeight/2 - 15);
    enemy.healthBarFill.setPosition(enemy.x, enemy.y - enemy.displayHeight/2 - 15);
    
    // Update fill width and color based on health
    const fillWidth = 38 * healthPercent;
    enemy.healthBarFill.setDisplaySize(fillWidth, 4);
    
    // Color based on health percentage
    let color = 0x00ff00; // Green
    if (healthPercent < 0.3) color = 0xff0000; // Red
    else if (healthPercent < 0.6) color = 0xffff00; // Yellow
    
    enemy.healthBarFill.setFillStyle(color);
  }

  hideEnemyHealthBar(enemy) {
    if (enemy.healthBarBg) {
      enemy.healthBarBg.destroy();
      enemy.healthBarFill.destroy();
      enemy.healthBarBg = null;
      enemy.healthBarFill = null;
    }
  }

  updateDebugRanges() {
    // Clear previous debug graphics
    if (this.debugGraphics) {
      this.debugGraphics.clear();
    } else {
      this.debugGraphics = this.scene.add.graphics();
    }

    const debugSettings = this.scene.debugSettings;
    if (!debugSettings) return;

    // Show enemy attack ranges
    if (debugSettings.showEnemyAttackRanges) {
      this.debugGraphics.lineStyle(2, 0xff0000, 0.3);
      this.scene.enemies.children.entries.forEach(enemy => {
        if (enemy.active && !enemy.isDead) {
          this.debugGraphics.strokeCircle(enemy.x, enemy.y, this.attackRange);
        }
      });
    }
  }

  moveTowardsPlayer(enemy, player) {
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    const speed = enemy.enemySpeed || 50;
    
    // Force direction determination based on player position
    const direction = this.getDirectionFromPlayerPosition(enemy, player);
    enemy.currentDirection = direction;
    
    enemy.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );

    this.updateEnemyMovementAnimation(enemy, direction);
    this.forceCorrectDirection(enemy, direction);
  }

  getDirectionFromPlayerPosition(enemy, player) {
    const deltaX = player.x - enemy.x;
    const deltaY = player.y - enemy.y;
    
    // Prioritize horizontal movement for facing direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  getDirectionFromAngle(angle) {
    const normalizedAngle = Phaser.Math.Angle.Normalize(angle);
    
    if (normalizedAngle >= -Math.PI/4 && normalizedAngle <= Math.PI/4) {
      return 'right';
    } else if (normalizedAngle > Math.PI/4 && normalizedAngle < 3*Math.PI/4) {
      return 'down';
    } else if (normalizedAngle >= 3*Math.PI/4 || normalizedAngle <= -3*Math.PI/4) {
      return 'left';
    } else {
      return 'up';
    }
  }

  updateEnemyMovementAnimation(enemy, direction) {
    if (enemy.enemyType && !enemy.isAttacking && !enemy.isDead) {
      // Try movement animations in priority order
      const animKeys = [
        `enemy_${enemy.enemyType}_move_anim`,
        `enemy_${enemy.enemyType}_run_anim`,
        `enemy_${enemy.enemyType}_walk_anim`,
        `enemy_${enemy.enemyType}_idle_anim`
      ];
      
      const animKey = animKeys.find(key => this.scene.anims.exists(key));
      
      if (animKey && (!enemy.anims.isPlaying || enemy.anims.currentAnim.key !== animKey)) {
        enemy.play(animKey);
      }
    }
  }

  forceCorrectDirection(enemy, direction) {
    // Force sprite facing direction - prioritize left/right facing
    switch (direction) {
      case 'left':
        enemy.setFlipX(true);
        break;
      case 'right':
        enemy.setFlipX(false);
        break;
      case 'up':
      case 'down':
        // For up/down movement, maintain the flip based on last horizontal direction
        // If no previous horizontal direction, default to facing right (no flip)
        if (enemy.lastHorizontalDirection === 'left') {
          enemy.setFlipX(true);
        } else {
          enemy.setFlipX(false);
        }
        break;
    }
    
    // Store last horizontal direction for up/down movement
    if (direction === 'left' || direction === 'right') {
      enemy.lastHorizontalDirection = direction;
    }
  }

  updateSpriteDirection(enemy, direction) {
    // More precise direction handling with forced facing
    this.forceCorrectDirection(enemy, direction);
  }

  tryAttack(enemy, player) {
    const currentTime = this.scene.time.now;
    
    if (!enemy.lastAttackTime || currentTime - enemy.lastAttackTime >= this.attackCooldown) {
      this.performAttack(enemy, player);
      enemy.lastAttackTime = currentTime;
    }
  }

  performAttack(enemy, player) {
    if (enemy.isDead) return;
    
    enemy.isAttacking = true;
    enemy.setVelocity(0, 0);
    
    const attackAnimKey = `enemy_${enemy.enemyType}_attack_anim`;
    
    if (this.scene.anims.exists(attackAnimKey)) {
      enemy.play(attackAnimKey);
      enemy.once('animationcomplete', () => {
        if (!enemy.isDead) {
          this.dealAttackDamage(enemy, player);
          enemy.isAttacking = false;
        }
      });
    } else {
      this.dealAttackDamage(enemy, player);
      this.scene.time.delayedCall(500, () => {
        if (!enemy.isDead) {
          enemy.isAttacking = false;
        }
      });
    }
  }

  dealAttackDamage(enemy, player) {
    if (enemy.isDead) return;
    
    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
    if (distance <= this.attackRange) {
      const damage = enemy.enemyDamage || 10;
      this.scene.playerController.takeDamage(damage);
      this.createAttackEffect(enemy, player);
    }
  }

  createAttackEffect(enemy, player) {
    const effect = this.scene.add.circle(player.x, player.y, 20, 0xff0000, 0.5);
    this.scene.tweens.add({
      targets: effect,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 300,
      onComplete: () => effect.destroy()
    });
  }

  spawnEnemy() {
    if (this.scene.enemies.children.size >= this.maxEnemies) return;

    const spawnPosition = this.getRandomSpawnPosition();
    const enemyType = getRandomEnemyType();
    
    this.createEnemy(spawnPosition, enemyType);
  }

  getRandomSpawnPosition() {
    const margin = 50;
    const spawnPositions = [
      { x: Phaser.Math.Between(margin, this.scene.cameras.main.width - margin), y: -margin },
      { x: this.scene.cameras.main.width + margin, y: Phaser.Math.Between(margin, this.scene.cameras.main.height - margin) },
      { x: Phaser.Math.Between(margin, this.scene.cameras.main.width - margin), y: this.scene.cameras.main.height + margin },
      { x: -margin, y: Phaser.Math.Between(margin, this.scene.cameras.main.height - margin) }
    ];

    return Phaser.Utils.Array.GetRandom(spawnPositions);
  }

  createEnemy(spawnPos, enemyType) {
    let enemy;

    if (this.scene.textures.exists(enemyType.texture)) {
      enemy = this.scene.enemies.create(spawnPos.x, spawnPos.y, enemyType.texture);
      // Increased size for all enemies
      enemy.setDisplaySize(enemyType.size * 1.2, enemyType.size * 1.2);
      enemy.enemyType = enemyType.key;
      
      const idleAnimKey = `enemy_${enemyType.key}_idle_anim`;
      if (this.scene.anims.exists(idleAnimKey)) {
        enemy.play(idleAnimKey);
      }
    } else {
      enemy = this.scene.enemies.create(spawnPos.x, spawnPos.y, 'enemy');
      enemy.setDisplaySize(30, 30); // Increased from 25
      enemy.enemyType = 'basic';
    }

    // Set enemy properties from config
    enemy.enemySpeed = Phaser.Math.Between(enemyType.speedRange[0], enemyType.speedRange[1]);
    enemy.health = enemyType.health;
    enemy.maxHealth = enemyType.health;
    enemy.enemyDamage = enemyType.damage;
    enemy.isAttacking = false;
    enemy.isDead = false;
    enemy.currentDirection = 'right';
    enemy.lastHorizontalDirection = 'right'; // Default facing right
    enemy.lastAttackTime = 0;

    enemy.setCollideWorldBounds(false);
    enemy.setBounce(0);
    enemy.setDrag(50);

    return enemy;
  }

  destroyEnemy(enemy) {
    if (enemy && enemy.active && !enemy.isDead) {
      enemy.isDead = true;
      enemy.setVelocity(0, 0);
      enemy.isAttacking = false;
      
      // Hide health bar
      this.hideEnemyHealthBar(enemy);
      
      // Create soul drop using enemy sprite
      this.createSoulDrop(enemy);
      
      const deathAnimKey = `enemy_${enemy.enemyType}_death_anim`;
      if (this.scene.anims.exists(deathAnimKey)) {
        enemy.play(deathAnimKey);
        enemy.once('animationcomplete', () => {
          enemy.destroy();
        });
      } else {
        enemy.destroy();
      }
    }
  }

  createSoulDrop(enemy) {
    // Create soul using enemy's idle frame, rotated 90 degrees and tinted blue
    let soulTexture = enemy.texture.key;
    
    // Try to get the idle texture for this enemy type
    const idleTextureKey = `enemy_${enemy.enemyType}_idle`;
    if (this.scene.textures.exists(idleTextureKey)) {
      soulTexture = idleTextureKey;
    }
    
    const soul = this.scene.add.sprite(enemy.x, enemy.y, soulTexture);
    
    // Match enemy size and rotation
    soul.setDisplaySize(enemy.displayWidth * 0.8, enemy.displayHeight * 0.8);
    soul.setRotation(Math.PI / 2); // Rotate 90 degrees to lie down
    soul.setTint(0x4444ff); // Blue tint
    soul.setAlpha(0.8);
    
    // Add physics for collection
    this.scene.physics.add.existing(soul);
    soul.body.setSize(soul.displayWidth * 0.6, soul.displayHeight * 0.6); // Smaller collision box
    
    // Add to souls group for collection
    if (!this.scene.souls) {
      this.scene.souls = this.scene.physics.add.group();
    }
    this.scene.souls.add(soul);
    
    // Set soul properties
    soul.soulValue = 1;
    soul.isSoul = true;
    
    // Gentle pulsing glow effect
    this.scene.tweens.add({
      targets: soul,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Add subtle floating
    this.scene.tweens.add({
      targets: soul,
      y: soul.y - 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Auto-expire after 60 seconds
    this.scene.time.delayedCall(60000, () => {
      if (soul && soul.active) {
        this.scene.tweens.add({
          targets: soul,
          alpha: 0,
          duration: 2000,
          onComplete: () => soul.destroy()
        });
      }
    });
  }

  createDeathShadow(enemy) {
    // This method is now handled by createSoulDrop
    // Keep for compatibility but no longer used
  }
}

export default EnemyManager;