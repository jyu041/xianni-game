// frontend/src/components/GameLevel/scripts/EnemyManager.js
import { getAllEnemyTypes, getRandomEnemyType, getRandomAnimation, getEnemyAnimationPath } from '../config/EnemyTypes.js';

class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.maxEnemies = 25; // Default max enemies
    this.attackRange = 60;
    this.attackCooldown = 2000;
    this.enemyTypes = getAllEnemyTypes();
    this.healthBars = [];
    this.showHealthBars = true;
    this.activeGifs = new Map(); // Track active GIF elements
    this.dyingEnemies = new Set(); // Track enemies in death sequence
  }

  update() {
    this.updateEnemyBehavior();
    this.updateHealthBars();
    this.updateDebugRanges();
    this.updateGifPositions();
    this.cleanupDeadEnemies();
  }

  cleanupDeadEnemies() {
    // Remove dead enemies that have completed their death sequence
    const deadEnemies = this.scene.enemies.children.entries.filter(enemy => 
      enemy.isDead && !this.dyingEnemies.has(enemy)
    );
    
    deadEnemies.forEach(enemy => {
      this.removeEnemyGif(enemy);
      this.hideEnemyHealthBar(enemy);
      enemy.destroy();
    });
  }

  getActiveEnemyCount() {
    // Count only living enemies (not dead, not dying)
    return this.scene.enemies.children.entries.filter(enemy => 
      enemy.active && !enemy.isDead && !this.dyingEnemies.has(enemy)
    ).length;
  }

  updateEnemyBehavior() {
    this.scene.enemies.children.entries.forEach(enemy => {
      if (!enemy.active || enemy.isDead || this.dyingEnemies.has(enemy)) return;

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
      if (!enemy.active || enemy.isDead || this.dyingEnemies.has(enemy)) return;

      const healthPercent = enemy.health / enemy.maxHealth;
      
      if (healthPercent < 1.0 && this.showHealthBars) {
        this.showEnemyHealthBar(enemy, healthPercent);
      } else {
        this.hideEnemyHealthBar(enemy);
      }
    });
  }

  showEnemyHealthBar(enemy, healthPercent) {
    if (!enemy.healthBarBg) {
      enemy.healthBarBg = this.scene.add.rectangle(
        enemy.x, enemy.y - enemy.displayHeight/2 - 8,
        40, 6, 0x000000, 0.7
      );
      enemy.healthBarBg.setStrokeStyle(1, 0xffffff, 0.5);
      
      enemy.healthBarFill = this.scene.add.rectangle(
        enemy.x, enemy.y - enemy.displayHeight/2 - 8,
        38, 4, 0x00ff00
      );
    }

    enemy.healthBarBg.setPosition(enemy.x, enemy.y - enemy.displayHeight/2 - 8);
    enemy.healthBarFill.setPosition(enemy.x, enemy.y - enemy.displayHeight/2 - 8);
    
    const fillWidth = 38 * healthPercent;
    enemy.healthBarFill.setDisplaySize(fillWidth, 4);
    
    let color = 0x00ff00;
    if (healthPercent < 0.3) color = 0xff0000;
    else if (healthPercent < 0.6) color = 0xffff00;
    
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
    if (this.debugGraphics) {
      this.debugGraphics.clear();
    } else {
      this.debugGraphics = this.scene.add.graphics();
    }

    const debugSettings = this.scene.debugSettings;
    if (!debugSettings) return;

    if (debugSettings.showEnemyAttackRanges) {
      this.debugGraphics.lineStyle(2, 0xff0000, 0.3);
      this.scene.enemies.children.entries.forEach(enemy => {
        if (enemy.active && !enemy.isDead && !this.dyingEnemies.has(enemy)) {
          this.debugGraphics.strokeCircle(enemy.x, enemy.y, this.attackRange);
        }
      });
    }
  }

  updateGifPositions() {
    // Clean up orphaned GIFs first
    const toRemove = [];
    this.activeGifs.forEach((gifElement, enemy) => {
      if (!enemy.active || !gifElement.parentNode) {
        toRemove.push(enemy);
      }
    });
    
    toRemove.forEach(enemy => {
      this.removeEnemyGif(enemy);
    });
    
    // Update positions for active enemies (but NOT for dying enemies)
    this.activeGifs.forEach((gifElement, enemy) => {
      if (!enemy.active || enemy.isDead || this.dyingEnemies.has(enemy)) return;

      // Convert world coordinates to screen coordinates
      const screenPos = this.worldToScreen(enemy.x, enemy.y);
      const size = enemy.enemySize || 64;
      
      gifElement.style.left = `${screenPos.x - size/2}px`;
      gifElement.style.top = `${screenPos.y - size/2}px`;
    });
  }

  worldToScreen(worldX, worldY) {
    const camera = this.scene.cameras.main;
    const gameCanvas = this.scene.game.canvas;
    const canvasRect = gameCanvas.getBoundingClientRect();
    
    const screenX = (worldX - camera.scrollX) * camera.zoom + canvasRect.left;
    const screenY = (worldY - camera.scrollY) * camera.zoom + canvasRect.top;
    
    return { x: screenX, y: screenY };
  }

  moveTowardsPlayer(enemy, player) {
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    const speed = enemy.enemySpeed || 50;
    
    const direction = this.getDirectionFromPlayerPosition(enemy, player);
    enemy.currentDirection = direction;
    
    enemy.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );

    // Always use 'Run.gif' for movement - fixed animation switching issue
    this.updateEnemyAnimation(enemy, 'run');
    this.forceCorrectDirection(enemy, direction);
  }

  getDirectionFromPlayerPosition(enemy, player) {
    const deltaX = player.x - enemy.x;
    const deltaY = player.y - enemy.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  updateEnemyAnimation(enemy, action) {
    if (enemy.isDead || !enemy.enemyTypeData || this.dyingEnemies.has(enemy)) return;

    // Don't change animation if already performing specific action (except for death)
    if (action === 'run' && enemy.isAttacking) return;

    let animationFile;
    
    // Force specific animations for consistency
    if (action === 'run') {
      // Always prefer 'Run.gif' over 'Walk.gif' for movement
      const animations = enemy.enemyTypeData.animations.move || [];
      const runAnimation = animations.find(anim => anim.includes('Run.gif'));
      animationFile = runAnimation || animations[0]; // Fallback to first available
    } else {
      animationFile = getRandomAnimation(enemy.enemyTypeData, action);
    }
    
    if (animationFile && (animationFile !== enemy.currentAnimation || action === 'death')) {
      this.setEnemyAnimation(enemy, animationFile);
      enemy.currentAnimation = animationFile;
    }
  }

  setEnemyAnimation(enemy, animationFile) {
    if (!enemy.enemyTypeData) return;

    const gifPath = getEnemyAnimationPath(enemy.enemyTypeData, animationFile);
    const gifElement = this.activeGifs.get(enemy);
    
    if (gifElement) {
      // Change the GIF source to trigger new animation
      gifElement.src = gifPath + `?t=${Date.now()}`; // Cache busting
    }
  }

  forceCorrectDirection(enemy, direction) {
    const gifElement = this.activeGifs.get(enemy);
    if (!gifElement) return;

    switch (direction) {
      case 'left':
        gifElement.style.transform = 'scaleX(-1)';
        break;
      case 'right':
        gifElement.style.transform = 'scaleX(1)';
        break;
      case 'up':
      case 'down':
        if (enemy.lastHorizontalDirection === 'left') {
          gifElement.style.transform = 'scaleX(-1)';
        } else {
          gifElement.style.transform = 'scaleX(1)';
        }
        break;
    }
    
    if (direction === 'left' || direction === 'right') {
      enemy.lastHorizontalDirection = direction;
    }
  }

  tryAttack(enemy, player) {
    const currentTime = this.scene.time.now;
    
    if (!enemy.lastAttackTime || currentTime - enemy.lastAttackTime >= this.attackCooldown) {
      this.performAttack(enemy, player);
      enemy.lastAttackTime = currentTime;
    }
  }

  performAttack(enemy, player) {
    if (enemy.isDead || this.dyingEnemies.has(enemy)) return;
    
    enemy.isAttacking = true;
    enemy.setVelocity(0, 0);
    
    // Play attack animation
    this.updateEnemyAnimation(enemy, 'attack');
    
    // Deal damage after animation delay
    this.scene.time.delayedCall(400, () => {
      if (!enemy.isDead && enemy.active && !this.dyingEnemies.has(enemy)) {
        this.dealAttackDamage(enemy, player);
      }
    });

    // Stop attacking after animation
    this.scene.time.delayedCall(800, () => {
      if (!enemy.isDead && enemy.active && !this.dyingEnemies.has(enemy)) {
        enemy.isAttacking = false;
        this.updateEnemyAnimation(enemy, 'idle');
      }
    });
  }

  dealAttackDamage(enemy, player) {
    if (enemy.isDead || this.dyingEnemies.has(enemy)) return;
    
    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
    if (distance <= this.attackRange) {
      const damage = enemy.enemyDamage || 10;
      this.scene.playerController.takeDamage(damage);
      this.createAttackEffect(enemy, player);
      
      if (this.scene.damageNumberManager) {
        this.scene.damageNumberManager.showDamageNumber(
          player.x, 
          player.y - 20, 
          damage, 
          { 
            color: 0xff4444,
            isHeal: false
          }
        );
      }
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
    const currentActiveCount = this.getActiveEnemyCount();
    
    if (currentActiveCount >= this.maxEnemies) {
      return; // Don't spawn if at max capacity
    }

    const spawnPosition = this.getRandomSpawnPosition();
    const enemyType = getRandomEnemyType();
    
    console.log(`Spawning ${enemyType.key} at (${spawnPosition.x}, ${spawnPosition.y}). Active: ${currentActiveCount}/${this.maxEnemies}`);
    this.createEnemy(spawnPosition, enemyType);
  }

  getRandomSpawnPosition() {
    const margin = 100;
    const camera = this.scene.cameras.main;
    
    // Get camera world bounds
    const worldLeft = camera.scrollX - margin;
    const worldRight = camera.scrollX + camera.width + margin;
    const worldTop = camera.scrollY - margin;
    const worldBottom = camera.scrollY + camera.height + margin;
    
    // Ensure spawn positions are within world bounds
    const worldBounds = this.scene.physics.world.bounds;
    const constrainedLeft = Math.max(worldLeft, worldBounds.x);
    const constrainedRight = Math.min(worldRight, worldBounds.x + worldBounds.width);
    const constrainedTop = Math.max(worldTop, worldBounds.y);
    const constrainedBottom = Math.min(worldBottom, worldBounds.y + worldBounds.height);
    
    const spawnPositions = [
      { x: Phaser.Math.Between(constrainedLeft, constrainedRight), y: constrainedTop }, // Top
      { x: constrainedRight, y: Phaser.Math.Between(constrainedTop, constrainedBottom) }, // Right
      { x: Phaser.Math.Between(constrainedLeft, constrainedRight), y: constrainedBottom }, // Bottom
      { x: constrainedLeft, y: Phaser.Math.Between(constrainedTop, constrainedBottom) } // Left
    ];

    return Phaser.Utils.Array.GetRandom(spawnPositions);
  }

  createEnemy(spawnPos, enemyType) {
    // Create invisible Phaser sprite for physics and collision
    const enemy = this.scene.enemies.create(spawnPos.x, spawnPos.y, 'enemy');
    enemy.setDisplaySize(enemyType.size, enemyType.size);
    enemy.setAlpha(0); // Make invisible since we'll use GIF overlay
    
    // Store enemy type data
    enemy.enemyTypeData = enemyType;
    enemy.enemySpeed = Phaser.Math.Between(enemyType.speedRange[0], enemyType.speedRange[1]);
    enemy.health = enemyType.health;
    enemy.maxHealth = enemyType.health;
    enemy.enemyDamage = enemyType.damage;
    enemy.isAttacking = false;
    enemy.isDead = false;
    enemy.currentDirection = 'right';
    enemy.lastHorizontalDirection = 'right';
    enemy.lastAttackTime = 0;
    enemy.currentAnimation = null;
    enemy.enemySize = enemyType.size;

    enemy.setCollideWorldBounds(false);
    enemy.setBounce(0);
    enemy.setDrag(50);

    // Create GIF element overlay
    this.createEnemyGif(enemy, enemyType);
    
    // Start with idle animation
    this.updateEnemyAnimation(enemy, 'idle');

    return enemy;
  }

  createEnemyGif(enemy, enemyType) {
    const gifElement = document.createElement('img');
    const idleAnimation = getRandomAnimation(enemyType, 'idle');
    
    if (idleAnimation) {
      const gifPath = getEnemyAnimationPath(enemyType, idleAnimation);
      gifElement.src = gifPath;
    }
    
    gifElement.style.position = 'absolute';
    gifElement.style.pointerEvents = 'none';
    gifElement.style.zIndex = '10';
    gifElement.style.width = `${enemyType.size}px`;
    gifElement.style.height = `${enemyType.size}px`;
    
    // Add to DOM
    document.body.appendChild(gifElement);
    
    // Track the GIF element
    this.activeGifs.set(enemy, gifElement);
    
    return gifElement;
  }

  removeEnemyGif(enemy) {
    const gifElement = this.activeGifs.get(enemy);
    if (gifElement) {
      try {
        if (gifElement.parentNode) {
          gifElement.parentNode.removeChild(gifElement);
        }
      } catch (error) {
        console.warn('Error removing GIF element:', error);
      }
    }
    this.activeGifs.delete(enemy);
  }

  // Completely rewritten death sequence - FIXED
  startDeathSequence(enemy) {
    if (enemy.isDead || this.dyingEnemies.has(enemy)) return;
    
    console.log(`Starting death sequence for enemy at (${enemy.x}, ${enemy.y})`);
    
    // Mark enemy as dying immediately
    enemy.isDead = true;
    this.dyingEnemies.add(enemy);
    enemy.setVelocity(0, 0);
    enemy.isAttacking = false;
    
    // Hide health bar immediately
    this.hideEnemyHealthBar(enemy);
    
    const gifElement = this.activeGifs.get(enemy);
    if (!gifElement || !gifElement.parentNode) {
      console.warn('No GIF element found for dying enemy, creating soul directly');
      this.createSoulDrop(enemy.x, enemy.y);
      this.completeDeathSequence(enemy);
      return;
    }
    
    // CRITICAL FIX: Lock the GIF position in world space when death starts
    const finalScreenPos = this.worldToScreen(enemy.x, enemy.y);
    const size = enemy.enemySize || 64;
    gifElement.style.left = `${finalScreenPos.x - size/2}px`;
    gifElement.style.top = `${finalScreenPos.y - size/2}px`;
    
    // Make position fixed so it doesn't move with camera
    gifElement.style.position = 'fixed';
    
    // Phase 1: Play death animation (if available)
    const deathAnimation = getRandomAnimation(enemy.enemyTypeData, 'death');
    if (deathAnimation) {
      this.setEnemyAnimation(enemy, deathAnimation);
    }
    
    // Phase 2: Start glowing effect after brief delay
    this.scene.time.delayedCall(300, () => {
      if (!gifElement.parentNode || !this.dyingEnemies.has(enemy)) return;
      
      console.log('Starting aqua blue glow effect');
      
      // Apply aqua blue glow filter
      gifElement.style.filter = 'brightness(1.5) saturate(2.0) hue-rotate(180deg) drop-shadow(0 0 20px #00ffcc)';
      gifElement.style.transition = 'all 0.3s ease';
      
      // Pulsing glow effect
      let pulseCount = 0;
      const pulseInterval = setInterval(() => {
        if (!gifElement.parentNode || !this.dyingEnemies.has(enemy) || pulseCount >= 6) {
          clearInterval(pulseInterval);
          if (this.dyingEnemies.has(enemy)) {
            this.startShrinkingPhase(enemy, gifElement);
          }
          return;
        }
        
        const intensity = pulseCount % 2 === 0 ? 2.0 : 1.5;
        gifElement.style.filter = `brightness(${intensity}) saturate(2.0) hue-rotate(180deg) drop-shadow(0 0 ${20 + pulseCount * 5}px #00ffcc)`;
        pulseCount++;
      }, 200);
    });
  }

  startShrinkingPhase(enemy, gifElement) {
    if (!gifElement.parentNode || !this.dyingEnemies.has(enemy)) {
      this.completeDeathSequence(enemy);
      return;
    }
    
    console.log('Starting shrinking phase');
    
    // Create explosion particles
    this.createDeathParticles(enemy);
    
    // Shrink the GIF with enhanced visual effect
    gifElement.style.transition = 'transform 0.6s ease-in, opacity 0.6s ease-in, filter 0.6s ease-in';
    gifElement.style.transform = 'scale(0.05)';
    gifElement.style.opacity = '0.1';
    gifElement.style.filter = 'brightness(3.0) saturate(3.0) hue-rotate(180deg) drop-shadow(0 0 40px #00ffcc)';
    
    // Complete death sequence after shrinking
    this.scene.time.delayedCall(600, () => {
      this.createSoulDrop(enemy.x, enemy.y);
      this.completeDeathSequence(enemy);
    });
  }

  completeDeathSequence(enemy) {
    // Remove from dying enemies set
    this.dyingEnemies.delete(enemy);
    
    // Clean up GIF element
    this.removeEnemyGif(enemy);
    
    // Destroy the Phaser sprite
    if (enemy.active) {
      enemy.destroy();
    }
    
    console.log(`Death sequence complete. Active enemies: ${this.getActiveEnemyCount()}/${this.maxEnemies}, Dying: ${this.dyingEnemies.size}`);
  }

  createDeathParticles(enemy) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const particle = this.scene.add.circle(
        enemy.x,
        enemy.y,
        Phaser.Math.Between(3, 6),
        0x00ffcc,
        0.9
      );

      this.scene.tweens.add({
        targets: particle,
        x: enemy.x + Math.cos(angle) * Phaser.Math.Between(30, 50),
        y: enemy.y + Math.sin(angle) * Phaser.Math.Between(30, 50),
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: Phaser.Math.Between(300, 500),
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }

    // Enhanced screen shake for death
    this.scene.cameras.main.shake(150, 0.015);
  }

  showEnemyHitEffect(enemy) {
    // Flash effect for GIF enemies
    const gifElement = this.activeGifs.get(enemy);
    if (gifElement) {
      const originalFilter = gifElement.style.filter;
      gifElement.style.filter = 'brightness(1.8) saturate(1.5) contrast(1.3)';
      setTimeout(() => {
        if (gifElement.parentNode) {
          gifElement.style.filter = originalFilter;
        }
      }, 150);
    }
    
    // Play hurt animation if available
    this.updateEnemyAnimation(enemy, 'hurt');
    
    // Return to appropriate animation after hit
    this.scene.time.delayedCall(300, () => {
      if (!enemy.isDead && enemy.active && !this.dyingEnemies.has(enemy)) {
        if (enemy.isAttacking) {
          this.updateEnemyAnimation(enemy, 'attack');
        } else {
          this.updateEnemyAnimation(enemy, 'idle');
        }
      }
    });
    
    // Create hit spark effect
    const spark = this.scene.add.circle(enemy.x, enemy.y, 8, 0xffff00, 0.8);
    this.scene.tweens.add({
      targets: spark,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 200,
      onComplete: () => spark.destroy()
    });
  }

  createSoulDrop(x, y) {
    console.log(`Creating soul drop at (${x}, ${y})`);
    
    const soul = this.scene.add.circle(x, y, 10, 0x00ffcc, 0.9);
    soul.setStrokeStyle(2, 0x00ffff, 0.9);
    
    this.scene.physics.add.existing(soul);
    soul.body.setSize(24, 24);
    soul.body.setImmovable(true);
    
    // Ensure souls group exists
    if (!this.scene.souls) {
      this.scene.souls = this.scene.physics.add.group();
    }
    this.scene.souls.add(soul);
    
    soul.soulValue = 1;
    soul.isSoul = true;
    soul.isCollectable = true;
    
    // Enhanced soul animation
    this.scene.tweens.add({
      targets: soul,
      alpha: 0.6,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Floating animation
    this.scene.tweens.add({
      targets: soul,
      y: soul.y - 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Auto-expire after 45 seconds
    this.scene.time.delayedCall(45000, () => {
      if (soul && soul.active) {
        soul.isCollectable = false;
        this.scene.tweens.add({
          targets: soul,
          alpha: 0,
          scaleX: 0.1,
          scaleY: 0.1,
          duration: 2000,
          onComplete: () => {
            if (soul.body) {
              soul.body.destroy();
            }
            soul.destroy();
          }
        });
      }
    });
    
    console.log(`Soul created successfully. Total souls: ${this.scene.souls.children.size}`);
    return soul;
  }

  // Cleanup method to remove all GIF elements
  destroy() {
    // Create array copy to avoid modification during iteration
    const entries = Array.from(this.activeGifs.entries());
    
    entries.forEach(([enemy, gifElement]) => {
      this.removeEnemyGif(enemy);
    });
    
    this.activeGifs.clear();
    this.dyingEnemies.clear();
    
    console.log('EnemyManager destroyed, all GIF elements cleaned up');
  }
}

export default EnemyManager;