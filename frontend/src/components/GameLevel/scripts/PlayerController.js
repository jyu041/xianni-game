// frontend/src/components/game/scripts/PlayerController.js
class PlayerController {
  constructor(scene) {
    this.scene = scene;
    this.player = null;
    this.cursors = null;
    this.wasd = null;
    this.spaceKey = null; // Add space key for special ability
    this.attackRange = 150;
    this.iFrames = 1000;
    this.lastHitTime = 0;
    this.debugGraphics = null;
    this.soulCollectionRange = 50;
    
    // Attack cooldown system
    this.lastAttackTime = 0;
    this.attackCooldown = 400;
    this.attackCooldownBar = null;
    this.attackCooldownBg = null;
    this.isInvincible = false;
    
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
    this.player.setDisplaySize(49, 49);
    this.player.setCollideWorldBounds(false); // Allow free movement in world
    this.player.setDrag(300);
    this.player.currentDirection = 'down';
    this.player.isAttacking = false;

    // Try to use actual sprite if loaded
    if (this.scene.textures.exists('mainChar_idle_down')) {
      this.player.setTexture('mainChar_idle_down');
      this.player.setDisplaySize(130, 130);
      this.player.play('mainChar_idle_down_anim');
      console.log('Using actual player sprite with animation');
    }

    // Enable physics body
    this.player.body.setSize(32, 32); // Set collision box
    this.player.body.enable = true;

    this.createAttackCooldownBar();
    this.scene.playerController = this;
  }

  createAttackCooldownBar() {
    this.attackCooldownBg = this.scene.add.rectangle(
      this.player.x, 
      this.player.y + this.player.displayHeight/2 + 10, 
      30, 4, 
      0x000000, 
      0.6
    );
    this.attackCooldownBg.setStrokeStyle(1, 0xffffff, 0.3);

    this.attackCooldownBar = this.scene.add.rectangle(
      this.player.x, 
      this.player.y + this.player.displayHeight/2 + 10, 
      28, 2, 
      0x888888
    );
    
    this.attackCooldownBg.setVisible(true);
    this.attackCooldownBar.setVisible(true);
  }

  updateAttackCooldownBar() {
    if (!this.attackCooldownBar || !this.attackCooldownBg) return;

    const currentTime = this.scene.time.now;
    const timeSinceAttack = currentTime - this.lastAttackTime;
    const debugSettings = this.scene.debugSettings;
    const cooldown = debugSettings?.playerAttackSpeed || this.attackCooldown;
    
    const progress = Math.min(timeSinceAttack / cooldown, 1.0);
    const fillWidth = 28 * progress;
    
    this.attackCooldownBar.setDisplaySize(fillWidth, 2);
    
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
    this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Enable input
    this.scene.input.keyboard.enabled = true;
    this.scene.input.enabled = true;

    console.log('Input setup complete with space key for special ability');
  }

  update() {
    if (!this.player || !this.player.body) return;
    
    this.handleInput();
    this.handleSpecialAbility();
    this.updateDebugRange();
    this.updateAttackRange();
    this.updateSoulCollectionRange();
    this.updateInvincibility();
    this.checkSoulCollection();
    this.updateAttackCooldownBar();
  }

  handleSpecialAbility() {
    // Handle space key for Tianni Sword special ability
    if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      if (this.scene.triggerTianniSwordSkill) {
        const success = this.scene.triggerTianniSwordSkill();
        if (success) {
          console.log('Tianni Sword special ability activated!');
        }
      }
    }
  }

  updateInvincibility() {
    const debugSettings = this.scene.debugSettings;
    if (debugSettings && debugSettings.invincibility !== undefined) {
      this.isInvincible = debugSettings.invincibility;
    }
  }

  updateDebugRange() {
    if (this.debugGraphics) {
      this.debugGraphics.clear();
    } else {
      this.debugGraphics = this.scene.add.graphics();
    }

    const debugSettings = this.scene.debugSettings;
    if (!debugSettings) return;

    if (debugSettings.showPlayerAttackRange) {
      this.debugGraphics.lineStyle(3, 0x00ff00, 0.4);
      this.debugGraphics.strokeCircle(this.player.x, this.player.y, this.attackRange);
    }

    if (debugSettings.showSoulCollectionRange) {
      this.debugGraphics.lineStyle(3, 0x00ffff, 0.6);
      this.debugGraphics.strokeCircle(this.player.x, this.player.y, this.soulCollectionRange);
    }
  }

  updateAttackRange() {
    const debugSettings = this.scene.debugSettings;
    if (debugSettings && debugSettings.playerAttackRange) {
      this.attackRange = debugSettings.playerAttackRange;
    }
  }

  updateSoulCollectionRange() {
    const debugSettings = this.scene.debugSettings;
    if (debugSettings && debugSettings.soulCollectionRange) {
      this.soulCollectionRange = debugSettings.soulCollectionRange;
    }
  }

  checkSoulCollection() {
    if (!this.scene.souls || !this.scene.souls.children) return;

    const souls = this.scene.souls.children.entries.slice();
    
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
    if (!this.player || !this.player.body) return;

    // Get movement speed from debug settings or default
    const baseSpeed = 200;
    const debugSettings = this.scene.debugSettings;
    const speed = debugSettings?.playerMovementSpeed || baseSpeed;
    
    let velocityX = 0;
    let velocityY = 0;
    let newDirection = this.player.currentDirection;
    let isMoving = false;

    // Check WASD and arrow keys for movement
    if ((this.cursors.left && this.cursors.left.isDown) || (this.wasd.A && this.wasd.A.isDown)) {
      velocityX = -speed;
      newDirection = 'left';
      isMoving = true;
    } else if ((this.cursors.right && this.cursors.right.isDown) || (this.wasd.D && this.wasd.D.isDown)) {
      velocityX = speed;
      newDirection = 'right';
      isMoving = true;
    }

    if ((this.cursors.up && this.cursors.up.isDown) || (this.wasd.W && this.wasd.W.isDown)) {
      velocityY = -speed;
      newDirection = 'up';
      isMoving = true;
    } else if ((this.cursors.down && this.cursors.down.isDown) || (this.wasd.S && this.wasd.S.isDown)) {
      velocityY = speed;
      newDirection = 'down';
      isMoving = true;
    }

    // Apply velocity to physics body
    this.player.body.setVelocity(velocityX, velocityY);

    // Update animations based on movement and direction
    this.updateAnimations(isMoving, newDirection);
    this.player.currentDirection = newDirection;
  }

  updateAnimations(isMoving, newDirection) {
    if (!this.player.isAttacking) {
      let animKey;
      
      if (isMoving) {
        animKey = `mainChar_run_${newDirection}_anim`;
      } else {
        animKey = `mainChar_idle_${this.player.currentDirection}_anim`;
        if (!this.scene.anims.exists(animKey)) {
          animKey = `mainChar_idle_down_anim`;
        }
      }

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
    if (!this.canAttack()) return;
    
    if (this.scene.enemies.children.size === 0) return;

    let nearest = null;
    let nearestDistance = Infinity;

    this.scene.enemies.children.entries.forEach(enemy => {
      if (!enemy.active || enemy.isDead) return;
      
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, enemy.x, enemy.y
      );
      
      if (distance < this.attackRange && distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    });

    if (!nearest) return;

    this.lastAttackTime = this.scene.time.now;
    this.createJianqi(nearest);
    this.triggerAttackAnimation();
  }

  triggerAttackAnimation() {
    if (!this.player.isAttacking) {
      this.player.isAttacking = true;
      
      const attackAnimKey = `mainChar_attack1_${this.player.currentDirection}_anim`;
      
      if (this.scene.anims.exists(attackAnimKey)) {
        this.player.play(attackAnimKey);
        
        this.player.once('animationcomplete', () => {
          this.player.isAttacking = false;
        });
      } else {
        this.scene.time.delayedCall(200, () => {
          this.player.isAttacking = false;
        });
      }
    }
  }

  createJianqi(target) {
    this.createJianqiTexture();
    
    for (let i = 0; i < this.jianqiConfig.count; i++) {
      const jianqi = this.scene.projectiles.create(this.player.x, this.player.y, 'jianqi');
      
      jianqi.setDisplaySize(20 * this.jianqiConfig.size, 40 * this.jianqiConfig.size);
      jianqi.setTint(0x88ddff);

      const angle = Phaser.Math.Angle.Between(
        this.player.x, this.player.y, target.x, target.y
      ) + (i * 0.2 - 0.1);

      jianqi.setRotation(angle + Math.PI / 2);

      const debugSettings = this.scene.debugSettings;
      const speed = debugSettings?.jianqiTravelSpeed || this.jianqiConfig.speed;

      jianqi.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      jianqi.damage = this.jianqiConfig.damage;
      jianqi.maxDistance = this.jianqiConfig.distance;
      jianqi.startX = this.player.x;
      jianqi.startY = this.player.y;

      this.scene.time.delayedCall(this.jianqiConfig.distance / speed * 1000, () => {
        if (jianqi && jianqi.active) {
          jianqi.destroy();
        }
      });
    }
  }

  createJianqiTexture() {
    if (!this.scene.textures.exists('jianqi')) {
      console.warn('Jianqi texture not found! This should have been created in scene.create()');
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
    if (this.isInvincible) return;
    
    const currentTime = this.scene.time.now;
    
    if (currentTime - this.lastHitTime < this.iFrames) return;

    this.lastHitTime = currentTime;
    
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

    this.player.setScale(this.player.scaleX * 1.2, this.player.scaleY * 1.2);
    this.player.setAlpha(0.5);
    
    this.createInvincibilityEffect();
    
    this.scene.time.delayedCall(100, () => {
      if (this.player.active) {
        this.player.setScale(this.player.scaleX / 1.2, this.player.scaleY / 1.2);
      }
    });
  }

  createInvincibilityEffect() {
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
    
    soul.isCollectable = false;
    
    if (this.scene.gameStateRef) {
      this.scene.gameStateRef.soulCount = (this.scene.gameStateRef.soulCount || 0) + soul.soulValue;
    }
    
    this.createSoulCollectionAnimation(soul);
  }

  createSoulCollectionAnimation(soul) {
    const collectEffect = this.scene.add.circle(soul.x, soul.y, 6, 0x00ffff, 1);
    collectEffect.setStrokeStyle(2, 0xffffff, 0.8);
    
    const glow = this.scene.add.circle(soul.x, soul.y, 12, 0x00ffcc, 0.4);
    
    this.scene.tweens.add({
      targets: [collectEffect, glow],
      y: soul.y - 15,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 150,
      ease: 'Power2.easeOut',
      onComplete: () => {
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
    
    this.scene.time.delayedCall(50, () => {
      if (soul.body) {
        soul.body.destroy();
      }
      soul.destroy();
    });
  }

  hitPlayer() {
    this.takeDamage(10);
  }
}

export default PlayerController;