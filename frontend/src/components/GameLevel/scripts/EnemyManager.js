// frontend/src/components/GameLevel/scripts/EnemyManager.js
import { getAllEnemyTypes, getRandomEnemyType, getRandomAnimation, getEnemyAnimationPath } from '../config/EnemyTypes.js';

class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.maxEnemies = 100;
    this.attackRange = 60;
    this.attackCooldown = 2000;
    this.enemyTypes = getAllEnemyTypes();
    this.healthBars = [];
    this.showHealthBars = true;
    this.activeGifs = new Map(); // Track active GIF elements
  }

  update() {
    this.updateEnemyBehavior();
    this.updateHealthBars();
    this.updateDebugRanges();
    this.updateGifPositions(); // Update GIF positions
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
        if (enemy.active && !enemy.isDead) {
          this.debugGraphics.strokeCircle(enemy.x, enemy.y, this.attackRange);
        }
      });
    }
  }

  updateGifPositions() {
    // Clean up dead enemies first
    const toRemove = [];
    this.activeGifs.forEach((gifElement, enemy) => {
      if (!enemy.active || !gifElement.parentNode) {
        toRemove.push(enemy);
      }
    });
    
    toRemove.forEach(enemy => {
      console.log('Cleaning up orphaned GIF for destroyed enemy');
      this.removeEnemyGif(enemy);
    });
    
    // Update positions for active enemies
    this.activeGifs.forEach((gifElement, enemy) => {
      if (!enemy.active || enemy.isDead) return;

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

    this.updateEnemyAnimation(enemy, 'move');
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
    if (enemy.isDead || !enemy.enemyTypeData) return;

    // Don't change animation if already performing specific action (except for death)
    if (action === 'move' && enemy.isAttacking && action !== 'death') return;

    const animationFile = getRandomAnimation(enemy.enemyTypeData, action);
    if (animationFile && (animationFile !== enemy.currentAnimation || action === 'death')) {
      this.setEnemyAnimation(enemy, animationFile);
      enemy.currentAnimation = animationFile;
      console.log(`Enemy ${enemy.enemyTypeData.key} playing ${action}: ${animationFile}`);
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
    if (enemy.isDead) return;
    
    enemy.isAttacking = true;
    enemy.setVelocity(0, 0);
    
    // Play attack animation
    this.updateEnemyAnimation(enemy, 'attack');
    
    // Deal damage after animation delay
    this.scene.time.delayedCall(400, () => {
      if (!enemy.isDead && enemy.active) {
        this.dealAttackDamage(enemy, player);
      }
    });

    // Stop attacking after animation
    this.scene.time.delayedCall(800, () => {
      if (!enemy.isDead && enemy.active) {
        enemy.isAttacking = false;
        this.updateEnemyAnimation(enemy, 'idle');
      }
    });
  }

  dealAttackDamage(enemy, player) {
    if (enemy.isDead) return;
    
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
    if (this.scene.enemies.children.size >= this.maxEnemies) {
      console.log(`Max enemies reached: ${this.scene.enemies.children.size}/${this.maxEnemies}`);
      return;
    }

    const spawnPosition = this.getRandomSpawnPosition();
    const enemyType = getRandomEnemyType();
    
    console.log(`Spawning ${enemyType.key} at (${spawnPosition.x}, ${spawnPosition.y})`);
    this.createEnemy(spawnPosition, enemyType);
  }

  getRandomSpawnPosition() {
    const margin = 50;
    const camera = this.scene.cameras.main;
    
    // Get camera world bounds
    const worldLeft = camera.scrollX;
    const worldRight = camera.scrollX + camera.width;
    const worldTop = camera.scrollY;
    const worldBottom = camera.scrollY + camera.height;
    
    const spawnPositions = [
      { x: Phaser.Math.Between(worldLeft, worldRight), y: worldTop - margin }, // Top
      { x: worldRight + margin, y: Phaser.Math.Between(worldTop, worldBottom) }, // Right
      { x: Phaser.Math.Between(worldLeft, worldRight), y: worldBottom + margin }, // Bottom
      { x: worldLeft - margin, y: Phaser.Math.Between(worldTop, worldBottom) } // Left
    ];

    return Phaser.Utils.Array.GetRandom(spawnPositions);
  }

  createEnemy(spawnPos, enemyType) {
    // Create invisible Phaser sprite for physics and collision
    const enemy = this.scene.enemies.create(spawnPos.x, spawnPos.y, 'enemy');
    enemy.setDisplaySize(enemyType.size, enemyType.size);
    enemy.setAlpha(0); // Make invisible initially since we'll use GIF overlay
    
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

  // Fixed death sequence - completely rewritten
  startDeathSequence(enemy) {
    if (enemy.isDead) return;
    
    console.log(`Starting death sequence for enemy at (${enemy.x}, ${enemy.y})`);
    
    enemy.isDead = true;
    enemy.setVelocity(0, 0);
    enemy.isAttacking = false;
    
    // Hide health bar immediately
    this.hideEnemyHealthBar(enemy);
    
    const gifElement = this.activeGifs.get(enemy);
    if (!gifElement || !gifElement.parentNode) {
      console.warn('No GIF element found for dying enemy, creating soul directly');
      this.createSoulDrop(enemy.x, enemy.y);
      enemy.destroy();
      return;
    }
    
    // Step 1: Play death animation GIF (if available)
    const deathAnimation = getRandomAnimation(enemy.enemyTypeData, 'death');
    if (deathAnimation) {
      console.log(`Playing death animation: ${deathAnimation}`);
      this.setEnemyAnimation(enemy, deathAnimation);
      enemy.currentAnimation = deathAnimation;
    }
    
    // Step 2: Wait a moment for death animation, then start blue glow effect
    this.scene.time.delayedCall(200, () => {
      if (!gifElement.parentNode) return;
      
      console.log('Starting blue glow effect');
      
      // Apply blue tint effect to the GIF
      gifElement.style.filter = 'brightness(1.8) saturate(1.5) hue-rotate(180deg) drop-shadow(0 0 15px #00ffcc)';
      
      // Create pulsing scale effect
      let pulseCount = 0;
      const originalTransform = gifElement.style.transform || '';
      
      const pulseEffect = () => {
        if (!gifElement.parentNode || pulseCount >= 10) return;
        
        const scale = pulseCount % 2 === 0 ? 1.15 : 1.0;
        // Preserve any existing transforms and add scale
        const baseTransform = originalTransform.replace(/scale\([^)]*\)/g, '').trim();
        gifElement.style.transform = `${baseTransform} scale(${scale})`.trim();
        
        pulseCount++;
        if (pulseCount < 10) {
          setTimeout(pulseEffect, 100); // Pulse every 100ms for 1 second total
        } else {
          // Start shrinking phase
          this.startShrinkingPhase(enemy, gifElement, originalTransform);
        }
      };
      
      pulseEffect();
    });
  }

  startShrinkingPhase(enemy, gifElement, originalTransform) {
    if (!gifElement.parentNode) {
      this.createSoulDrop(enemy.x, enemy.y);
      enemy.destroy();
      return;
    }
    
    console.log('Starting shrinking phase');
    
    // Create explosion particles
    this.createDeathParticles(enemy);
    
    // Shrink the GIF to a tiny dot
    gifElement.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
    gifElement.style.transform = `${originalTransform} scale(0.05)`.trim();
    gifElement.style.opacity = '0.1';
    
    // After shrinking, create soul and cleanup
    this.scene.time.delayedCall(400, () => {
      console.log('Creating soul drop and cleaning up enemy');
      
      // Create the soul drop
      this.createSoulDrop(enemy.x, enemy.y);
      
      // Clean up
      this.removeEnemyGif(enemy);
      if (enemy.active) {
        enemy.destroy();
      }
      
      console.log(`Enemy destroyed. Active enemies: ${this.scene.enemies.children.size}, Active GIFs: ${this.activeGifs.size}`);
    });
  }

  createDeathParticles(enemy) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const particle = this.scene.add.circle(
        enemy.x,
        enemy.y,
        Phaser.Math.Between(2, 4),
        0x00ffcc,
        0.8
      );

      this.scene.tweens.add({
        targets: particle,
        x: enemy.x + Math.cos(angle) * Phaser.Math.Between(20, 40),
        y: enemy.y + Math.sin(angle) * Phaser.Math.Between(20, 40),
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: Phaser.Math.Between(200, 400),
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }

    this.scene.cameras.main.shake(100, 0.01);
  }

  showEnemyHitEffect(enemy) {
    // Flash effect for GIF enemies
    const gifElement = this.activeGifs.get(enemy);
    if (gifElement) {
      gifElement.style.filter = 'brightness(1.5) saturate(1.5)';
      setTimeout(() => {
        if (gifElement.parentNode) {
          gifElement.style.filter = 'none';
        }
      }, 100);
    }
    
    // Play hurt animation if available
    this.updateEnemyAnimation(enemy, 'hurt');
    
    // Return to appropriate animation after hit
    this.scene.time.delayedCall(300, () => {
      if (!enemy.isDead && enemy.active) {
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
    
    const soul = this.scene.add.circle(x, y, 8, 0x00ffcc, 0.9);
    soul.setStrokeStyle(2, 0x00ffff, 0.8);
    
    this.scene.physics.add.existing(soul);
    soul.body.setSize(32, 32);
    soul.body.setImmovable(true);
    
    // Ensure souls group exists
    if (!this.scene.souls) {
      this.scene.souls = this.scene.physics.add.group();
      console.log('Created souls group');
    }
    this.scene.souls.add(soul);
    
    soul.soulValue = 1;
    soul.isSoul = true;
    soul.isCollectable = true;
    
    console.log(`Soul created successfully. Total souls: ${this.scene.souls.children.size}`);
    
    // Gentle pulsing glow effect
    this.scene.tweens.add({
      targets: soul,
      alpha: 0.6,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Add subtle floating
    this.scene.tweens.add({
      targets: soul,
      y: soul.y - 3,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Auto-expire after 45 seconds with fade out
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
    
    console.log('EnemyManager destroyed, all GIF elements cleaned up');
  }
}

export default EnemyManager;