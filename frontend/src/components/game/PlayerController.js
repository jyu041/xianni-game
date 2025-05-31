// frontend/src/components/game/PlayerController.js
class PlayerController {
  constructor(scene) {
    this.scene = scene;
    this.player = null;
    this.cursors = null;
    this.wasd = null;
    this.attackRange = 150; // Reduced attack range
  }

  createPlayer() {
    // Create player sprite
    this.player = this.scene.physics.add.sprite(400, 300, 'player');
    this.player.setDisplaySize(30, 30);
    this.player.setCollideWorldBounds(true);
    this.player.setDrag(300);
    this.player.currentDirection = 'down';
    this.player.isAttacking = false;

    // Try to use actual sprite if loaded (removed color tint)
    if (this.scene.textures.exists('mainChar_idle_down')) {
      this.player.setTexture('mainChar_idle_down');
      this.player.setDisplaySize(80, 80);
      this.player.play('mainChar_idle_down_anim');
      console.log('Using actual player sprite with animation');
    }

    // Store reference in scene for other managers
    this.scene.playerController = this;
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
  }

  handleInput() {
    if (!this.player) return;

    const speed = 200;
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
        // Moving - play run animation
        animKey = `mainChar_run_${newDirection}_anim`;
      } else {
        // Idle - play idle animation
        animKey = `mainChar_idle_down_anim`;
      }

      // Play animation if it exists and isn't already playing
      if (this.scene.anims.exists(animKey)) {
        if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== animKey) {
          this.player.play(animKey);
        }
      }
    }
  }

  autoFire() {
    if (this.scene.enemies.children.size === 0) return;

    // Find nearest enemy within attack range
    let nearest = null;
    let nearestDistance = Infinity;

    this.scene.enemies.children.entries.forEach(enemy => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, enemy.x, enemy.y
      );
      
      // Only target enemies within attack range
      if (distance < this.attackRange && distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    });

    if (!nearest) return; // No enemies in range

    // Trigger attack animation
    this.triggerAttackAnimation();

    // Create projectile
    this.createProjectile(nearest);
  }

  triggerAttackAnimation() {
    if (!this.player.isAttacking) {
      this.player.isAttacking = true;
      
      const attackAnimKey = `mainChar_attack1_${this.player.currentDirection}_anim`;
      if (this.scene.anims.exists(attackAnimKey)) {
        this.player.play(attackAnimKey);
        
        // Reset attack state when animation completes
        this.player.once('animationcomplete', () => {
          this.player.isAttacking = false;
        });
      } else {
        // If no attack animation, just reset attack state quickly
        this.scene.time.delayedCall(200, () => {
          this.player.isAttacking = false;
        });
      }
    }
  }

  createProjectile(target) {
    const projectile = this.scene.projectiles.create(this.player.x, this.player.y, 'projectile');
    projectile.setDisplaySize(8, 8);
    projectile.setTint(0xffff00);

    const angle = Phaser.Math.Angle.Between(
      this.player.x, this.player.y, target.x, target.y
    );

    projectile.setVelocity(
      Math.cos(angle) * 300, // Reduced projectile speed
      Math.sin(angle) * 300
    );

    // Auto-destroy after 2 seconds (reduced time)
    this.scene.time.delayedCall(2000, () => {
      if (projectile && projectile.active) {
        projectile.destroy();
      }
    });
  }

  hitPlayer() {
    if (this.scene.gameStateRef) {
      this.scene.gameStateRef.player.health -= 0.5;
      if (this.scene.gameStateRef.player.health <= 0) {
        this.scene.gameStateRef.isGameOver = true;
      }
    }

    // Flash player when hit (removed color tint, using scale instead)
    this.player.setScale(this.player.scaleX * 1.1, this.player.scaleY * 1.1);
    this.scene.time.delayedCall(100, () => {
      if (this.player.active) {
        this.player.setScale(this.player.scaleX / 1.1, this.player.scaleY / 1.1);
      }
    });
  }
}

export default PlayerController;