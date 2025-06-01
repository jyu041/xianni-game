// frontend/src/components/game/PlayerController.js
class PlayerController {
  constructor(scene) {
    this.scene = scene;
    this.player = null;
    this.cursors = null;
    this.wasd = null;
    this.attackRange = 150;
    this.iFrames = 1000; // Invincibility frames duration in ms
    this.lastHitTime = 0;
    this.debugGraphics = null;
    this.soulCollectionRange = 50; // Range for soul collection
    
    // Attack cooldown system
    this.lastAttackTime = 0;
    this.attackCooldown = 400; // milliseconds
    this.attackCooldownBar = null;
    this.attackCooldownBg = null;
    this.isInvincible = false; // Debug invincibility
    
    // 剑气 properties
    this.jianqiConfig = {
      size: 1.0,
      speed: 300,
      distance: 400,
      damage: 25,
      count: 1
    };
  }
  
  createPlayer() {
    // Create player sprite
    this.player = this.scene.physics.add.sprite(400, 300, 'player');
    this.player.setDisplaySize(49, 49); // Reduced by 10% from 54
    this.player.setCollideWorldBounds(true); // Prevent player from leaving world bounds
    this.player.setDrag(300);
    this.player.currentDirection = 'down';
    this.player.isAttacking = false;

    // Try to use actual sprite if loaded
    if (this.scene.textures.exists('mainChar_idle_down')) {
      this.player.setTexture('mainChar_idle_down');
      this.player.setDisplaySize(130, 130); // Reduced by 10% from 144
      this.player.play('mainChar_idle_down_anim');
      console.log('Using actual player sprite with animation');
    }

    // Create attack cooldown bar
    this.createAttackCooldownBar();

    // Store reference in scene for other managers
    this.scene.playerController = this;
  }

  createAttackCooldownBar() {
    // Create background bar
    this.attackCooldownBg = this.scene.add.rectangle(
      this.player.x, 
      this.player.y + this.player.displayHeight/2 + 10, 
      30, 4, 
      0x000000, 
      0.6
    );
    this.attackCooldownBg.setStrokeStyle(1, 0xffffff, 0.3);

    // Create fill bar - grey color, always visible
    this.attackCooldownBar = this.scene.add.rectangle(
      this.player.x, 
      this.player.y + this.player.displayHeight/2 + 10, 
      28, 2, 
      0x888888 // Grey color instead of green
    );
    
    // Always keep bars visible
    this.attackCooldownBg.setVisible(true);
    this.attackCooldownBar.setVisible(true);
  }

  updateAttackCooldownBar() {
    if (!this.attackCooldownBar || !this.attackCooldownBg) return;

    const currentTime = this.scene.time.now;
    const timeSinceAttack = currentTime - this.lastAttackTime;
    const debugSettings = this.scene.debugSettings;
    const cooldown = debugSettings?.playerAttackSpeed || this.attackCooldown;
    
    // Always show the bars and update progress
    const progress = Math.min(timeSinceAttack / cooldown, 1.0);
    const fillWidth = 28 * progress;
    
    this.attackCooldownBar.setDisplaySize(fillWidth, 2);
    
    // Update position to follow player
    this.attackCooldownBg.setPosition(
      this.player.x, 
      this.player.y + this.player.displayHeight/2 + 10
    );
    this.attackCooldownBar.setPosition(
      this.player.x, 
      this.player.y + this.player.displayHeight/2 + 10
    );
  }

  setupInput() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wasd = this.scene.input.keyboard.addKeys('W,S,A,D');

    // Make sure input is enabled
    this.scene.input.keyboard.enabled = true;
    this.scene.input.enabled = true;

    console.log('Input setup complete');
  }

  update() {
    this.handleInput();
    this.updateDebugRange();
    this.updateAttackRange();
    this.updateSoulCollectionRange();
    this.updateInvincibility();
    this.checkSoulCollection();
    this.updateAttackCooldownBar();
  }

  updateInvincibility() {
    // Update invincibility from debug settings
    const debugSettings = this.scene.debugSettings;
    if (debugSettings && debugSettings.invincibility !== undefined) {
      this.isInvincible = debugSettings.invincibility;
    }
  }

  updateDebugRange() {
    // Clear previous debug graphics
    if (this.debugGraphics) {
      this.debugGraphics.clear();
    } else {
      this.debugGraphics = this.scene.add.graphics();
    }

    const debugSettings = this.scene.debugSettings;
    if (!debugSettings) return;

    // Show player attack range
    if (debugSettings.showPlayerAttackRange) {
      this.debugGraphics.lineStyle(3, 0x00ff00, 0.4);
      this.debugGraphics.strokeCircle(this.player.x, this.player.y, this.attackRange);
    }

    // Show soul collection range
    if (debugSettings.showSoulCollectionRange) {
      this.debugGraphics.lineStyle(3, 0x00ffff, 0.6);
      this.debugGraphics.strokeCircle(this.player.x, this.player.y, this.soulCollectionRange);
    }
  }

  updateAttackRange() {
    // Update attack range from debug settings
    const debugSettings = this.scene.debugSettings;
    if (debugSettings && debugSettings.playerAttackRange) {
      this.attackRange = debugSettings.playerAttackRange;
    }
  }

  updateSoulCollectionRange() {
    // Update soul collection range from debug settings
    const debugSettings = this.scene.debugSettings;
    if (debugSettings && debugSettings.soulCollectionRange) {
      this.soulCollectionRange = debugSettings.soulCollectionRange;
    }
  }

  checkSoulCollection() {
    // Manually check for soul collection with improved detection
    if (!this.scene.souls || !this.scene.souls.children) return;

    const souls = this.scene.souls.children.entries.slice(); // Create copy to avoid modification during iteration
    
    souls.forEach(soul => {
      if (!soul.active || !soul.isSoul || !soul.isCollectable) return;
      
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, 
        soul.x, soul.y
      );
      
      if (distance <= this.soulCollectionRange) {
        this.collectSoul(soul);
      }
    });
  }

  handleInput() {
    if (!this.player) return;

    // Get movement speed from debug settings or default
    const baseSpeed = 200;
    const debugSettings = this.scene.debugSettings;
    const speed = debugSettings?.playerMovementSpeed || baseSpeed;
    
    let velocityX = 0;
    let velocityY = 0;
    let newDirection = this.player.currentDirection;
    let isMoving = false;

    // Check input
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocityX = -speed;
      newDirection = 'left';
      isMoving = true;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocityX = speed;
      newDirection = 'right';
      isMoving = true;
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocityY = -speed;
      newDirection = 'up';
      isMoving = true;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocityY = speed;
      newDirection = 'down';
      isMoving = true;
    }

    // Apply velocity
    this.player.setVelocity(velocityX, velocityY);

    // Update animations based on movement and direction
    this.updateAnimations(isMoving, newDirection);

    this.player.currentDirection = newDirection;
  }

  updateAnimations(isMoving, newDirection) {
    if (!this.player.isAttacking) {
      let animKey;
      
      if (isMoving) {
        // Moving - play run animation in the direction of movement
        animKey = `mainChar_run_${newDirection}_anim`;
      } else {
        // Idle - play idle animation in current direction
        animKey = `mainChar_idle_${this.player.currentDirection}_anim`;
        // Fallback to down direction if current direction idle doesn't exist
        if (!this.scene.anims.exists(animKey)) {
          animKey = `mainChar_idle_down_anim`;
        }
      }

      // Play animation if it exists and isn't already playing
      if (this.scene.anims.exists(animKey)) {
        if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== animKey) {
          this.player.play(animKey);
        }
      }
    }
  }

  canAttack() {
    const currentTime = this.scene.time.now;
    const debugSettings = this.scene.debugSettings;
    const cooldown = debugSettings?.playerAttackSpeed || this.attackCooldown;
    return currentTime - this.lastAttackTime >= cooldown;
  }

  autoFire() {
    if (!this.canAttack()) {
      console.log('Cannot attack - still on cooldown');
      return;
    }
    
    if (this.scene.enemies.children.size === 0) {
      console.log('No enemies to target');
      return;
    }

    // Find nearest ALIVE enemy within attack range
    let nearest = null;
    let nearestDistance = Infinity;

    this.scene.enemies.children.entries.forEach(enemy => {
      // Skip dead or dying enemies
      if (!enemy.active || enemy.isDead) return;
      
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, enemy.x, enemy.y
      );
      
      console.log(`Enemy at distance: ${distance}, attack range: ${this.attackRange}`);
      
      // Only target enemies within attack range
      if (distance < this.attackRange && distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    });

    if (!nearest) {
      console.log('No enemies in attack range');
      return; // No alive enemies in range
    }

    console.log(`Targeting enemy at distance: ${nearestDistance}`);

    // Update last attack time FIRST
    this.lastAttackTime = this.scene.time.now;

    // Create 剑气 projectiles IMMEDIATELY - don't wait for animation
    console.log('=== CALLING CREATE JIANQI ===');
    this.createJianqi(nearest);

    // Trigger attack animation AFTER creating projectile
    this.triggerAttackAnimation();
  }

  triggerAttackAnimation() {
    console.log('=== TRIGGERING ATTACK ANIMATION ===');
    
    if (!this.player.isAttacking) {
      this.player.isAttacking = true;
      
      const attackAnimKey = `mainChar_attack1_${this.player.currentDirection}_anim`;
      console.log('Trying to play animation:', attackAnimKey);
      
      if (this.scene.anims.exists(attackAnimKey)) {
        this.player.play(attackAnimKey);
        console.log('Playing attack animation:', attackAnimKey);
        
        // Reset attack state when animation completes
        this.player.once('animationcomplete', () => {
          console.log('Attack animation completed');
          this.player.isAttacking = false;
        });
      } else {
        console.log('Attack animation not found, using timer fallback');
        // If no attack animation, just reset attack state quickly
        this.scene.time.delayedCall(200, () => {
          this.player.isAttacking = false;
        });
      }
    } else {
      console.log('Player already attacking, skipping animation trigger');
    }
  }

  createJianqi(target) {
    // Create 剑气 texture first if it doesn't exist
    this.createJianqiTexture();
    
    for (let i = 0; i < this.jianqiConfig.count; i++) {
      // Create projectile at player's WORLD position
      const jianqi = this.scene.projectiles.create(this.player.x, this.player.y, 'jianqi');
      
      jianqi.setDisplaySize(20 * this.jianqiConfig.size, 40 * this.jianqiConfig.size);
      jianqi.setTint(0x88ddff); // Light blue sword energy color

      const angle = Phaser.Math.Angle.Between(
        this.player.x, this.player.y, target.x, target.y
      ) + (i * 0.2 - 0.1); // Slight spread for multiple projectiles

      // Rotate the sprite to match direction
      jianqi.setRotation(angle + Math.PI / 2);

      // Get speed from debug settings or use default
      const debugSettings = this.scene.debugSettings;
      const speed = debugSettings?.jianqiTravelSpeed || this.jianqiConfig.speed;

      jianqi.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      // Store jianqi properties
      jianqi.damage = this.jianqiConfig.damage;
      jianqi.maxDistance = this.jianqiConfig.distance;
      jianqi.startX = this.player.x; // Use world coordinates
      jianqi.startY = this.player.y; // Use world coordinates

      // Auto-destroy after max distance
      this.scene.time.delayedCall(this.jianqiConfig.distance / speed * 1000, () => {
        if (jianqi && jianqi.active) {
          jianqi.destroy();
        }
      });
    }
  }

  createJianqiTexture() {
    // Don't create texture here - it's now created at scene level
    // This method is kept for compatibility but texture creation moved to GameScene.create()
    if (!this.scene.textures.exists('jianqi')) {
      console.warn('Jianqi texture not found! This should have been created in scene.create()');
      // Emergency fallback - create simple colored rectangle
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0x00AAFF, 1.0);
      graphics.fillRect(0, 0, 20, 40);
      graphics.generateTexture('jianqi_fallback', 20, 40);
      graphics.destroy();
      return 'jianqi_fallback';
    }
    return 'jianqi';
  }

  takeDamage(damage) {
    // Check for debug invincibility
    if (this.isInvincible) {
      return; // No damage when invincible
    }
    
    const currentTime = this.scene.time.now;
    
    // Check invincibility frames
    if (currentTime - this.lastHitTime < this.iFrames) {
      return; // Still invincible
    }

    this.lastHitTime = currentTime;
    
    // Apply element effects to incoming damage
    let actualDamage = damage;
    if (this.scene.applyElementEffects) {
      actualDamage = this.scene.applyElementEffects(damage, false);
    }

    if (this.scene.gameStateRef) {
      this.scene.gameStateRef.player.health -= actualDamage;
      if (this.scene.gameStateRef.player.health <= 0) {
        this.scene.gameStateRef.player.health = 0;
        this.scene.gameStateRef.isGameOver = true;
        this.scene.gameStateRef.completed = false;
      }
    }

    // Flash player when hit using scale and alpha
    this.player.setScale(this.player.scaleX * 1.2, this.player.scaleY * 1.2);
    this.player.setAlpha(0.5);
    
    // Create flashing effect during invincibility
    this.createInvincibilityEffect();
    
    this.scene.time.delayedCall(100, () => {
      if (this.player.active) {
        this.player.setScale(this.player.scaleX / 1.2, this.player.scaleY / 1.2);
      }
    });
  }

  createInvincibilityEffect() {
    // Flash the player during invincibility frames
    const flashDuration = this.iFrames;
    const flashInterval = 100;
    let flashCount = 0;
    const maxFlashes = Math.floor(flashDuration / flashInterval);

    const flashTimer = this.scene.time.addEvent({
      delay: flashInterval,
      callback: () => {
        if (this.player.active) {
          this.player.setAlpha(this.player.alpha === 0.5 ? 1 : 0.5);
          flashCount++;
          
          if (flashCount >= maxFlashes) {
            this.player.setAlpha(1);
            flashTimer.destroy();
          }
        }
      },
      repeat: maxFlashes - 1
    });
  }

  collectSoul(soul) {
    if (!soul.isCollectable || !soul.isSoul) return;
    
    // Mark as not collectable immediately to prevent double collection
    soul.isCollectable = false;
    
    if (this.scene.gameStateRef) {
      this.scene.gameStateRef.soulCount = (this.scene.gameStateRef.soulCount || 0) + soul.soulValue;
    }
    
    // Create enhanced collection animation
    this.createSoulCollectionAnimation(soul);
  }

  createSoulCollectionAnimation(soul) {
    // Create a tiny glowing circle that moves to player
    const collectEffect = this.scene.add.circle(soul.x, soul.y, 6, 0x00ffff, 1);
    collectEffect.setStrokeStyle(2, 0xffffff, 0.8);
    
    // Add glow effect
    const glow = this.scene.add.circle(soul.x, soul.y, 12, 0x00ffcc, 0.4);
    
    // Move upward slightly, then move to player
    this.scene.tweens.add({
      targets: [collectEffect, glow],
      y: soul.y - 15,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 150,
      ease: 'Power2.easeOut',
      onComplete: () => {
        // Move to player center
        this.scene.tweens.add({
          targets: [collectEffect, glow],
          x: this.player.x,
          y: this.player.y,
          scaleX: 0.2,
          scaleY: 0.2,
          alpha: 0,
          duration: 250,
          ease: 'Power2.easeIn',
          onComplete: () => {
            collectEffect.destroy();
            glow.destroy();
          }
        });
      }
    });
    
    // Destroy the original soul after a small delay
    this.scene.time.delayedCall(50, () => {
      if (soul.body) {
        soul.body.destroy();
      }
      soul.destroy();
    });
  }

  hitPlayer() {
    // Legacy method - redirects to takeDamage
    this.takeDamage(10);
  }
}

export default PlayerController;