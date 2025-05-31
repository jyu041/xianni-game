// frontend/src/components/game/ProjectileManager.js
class ProjectileManager {
  constructor(scene) {
    this.scene = scene;
    this.projectileDamage = 25;
  }

  update() {
    this.cleanupProjectiles();
  }

  cleanupProjectiles() {
    this.scene.projectiles.children.entries.forEach(projectile => {
      if (!projectile.active) return;

      // Remove projectiles that go off screen
      const margin = 100;
      if (projectile.x < -margin || projectile.x > this.scene.cameras.main.width + margin ||
          projectile.y < -margin || projectile.y > this.scene.cameras.main.height + margin) {
        projectile.destroy();
      }
    });
  }

  hitEnemy(projectile, enemy) {
    // Don't hit dead or dying enemies
    if (enemy.isDead) return;
    
    // Destroy projectile immediately
    projectile.destroy();
    
    // Deal damage to enemy
    enemy.health -= this.projectileDamage;
    
    if (enemy.health <= 0) {
      this.destroyEnemy(enemy);
    } else {
      this.showEnemyHitEffect(enemy);
      this.playEnemyHitAnimation(enemy);
    }
  }

  playEnemyHitAnimation(enemy) {
    if (enemy.enemyType && !enemy.isDead) {
      const hitAnimKey = `enemy_${enemy.enemyType}_hit_anim`;
      const hurtAnimKey = `enemy_${enemy.enemyType}_hurt_anim`;
      
      // Try hit animation first, then hurt animation
      let animKey = this.scene.anims.exists(hitAnimKey) ? hitAnimKey : 
                   this.scene.anims.exists(hurtAnimKey) ? hurtAnimKey : null;
      
      if (animKey) {
        // Temporarily stop current animation and play hit animation
        const wasAttacking = enemy.isAttacking;
        enemy.isAttacking = true; // Prevent movement during hit
        
        enemy.play(animKey);
        enemy.once('animationcomplete', () => {
          if (!enemy.isDead) {
            enemy.isAttacking = wasAttacking; // Restore previous state
          }
        });
      }
    }
  }

  destroyEnemy(enemy) {
    if (enemy.isDead) return; // Already dead
    
    // Mark as dead immediately to prevent multiple hits
    enemy.isDead = true;
    enemy.setVelocity(0, 0);
    enemy.isAttacking = false;
    
    // Add score and experience immediately
    if (this.scene.gameStateRef) {
      this.scene.gameStateRef.score += 10;
      this.scene.gameStateRef.experience += 5;
    }

    // Hide health bar if it exists
    if (this.scene.enemyManager && this.scene.enemyManager.hideEnemyHealthBar) {
      this.scene.enemyManager.hideEnemyHealthBar(enemy);
    }

    // Play death animation if available
    if (enemy.enemyType) {
      const deathAnimKey = `enemy_${enemy.enemyType}_death_anim`;
      const deadAnimKey = `enemy_${enemy.enemyType}_dead_anim`;
      
      // Try death animation first, then dead animation
      let animKey = this.scene.anims.exists(deathAnimKey) ? deathAnimKey : 
                   this.scene.anims.exists(deadAnimKey) ? deadAnimKey : null;
      
      if (animKey) {
        enemy.play(animKey);
        
        // Create death effect immediately
        this.createDeathEffect(enemy);
        
        enemy.once('animationcomplete', () => {
          // Create soul drop and death shadow
          this.scene.enemyManager.createSoulDrop(enemy.x, enemy.y);
          this.scene.enemyManager.createDeathShadow(enemy);
          enemy.destroy();
        });
      } else {
        // No death animation, destroy immediately with effects
        this.createDeathEffect(enemy);
        this.scene.enemyManager.createSoulDrop(enemy.x, enemy.y);
        this.scene.enemyManager.createDeathShadow(enemy);
        enemy.destroy();
      }
    } else {
      // Basic enemy, destroy immediately
      this.createDeathEffect(enemy);
      this.scene.enemyManager.createSoulDrop(enemy.x, enemy.y);
      this.scene.enemyManager.createDeathShadow(enemy);
      enemy.destroy();
    }
  }

  createDeathEffect(enemy) {
    // Create explosion effect
    const explosion = this.scene.add.circle(enemy.x, enemy.y, 10, 0xff4444, 0.8);
    
    this.scene.tweens.add({
      targets: explosion,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => explosion.destroy()
    });

    // Create particles effect
    for (let i = 0; i < 6; i++) {
      const particle = this.scene.add.circle(
        enemy.x + Phaser.Math.Between(-10, 10),
        enemy.y + Phaser.Math.Between(-10, 10),
        Phaser.Math.Between(2, 5),
        0xffaa00,
        0.7
      );

      this.scene.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-30, 30),
        y: particle.y + Phaser.Math.Between(-30, 30),
        alpha: 0,
        duration: Phaser.Math.Between(300, 600),
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }

    // Screen shake effect
    this.scene.cameras.main.shake(100, 0.01);
  }

  showEnemyHitEffect(enemy) {
    // Flash enemy when hit using scale instead of color tint
    const originalScale = { x: enemy.scaleX, y: enemy.scaleY };
    enemy.setScale(enemy.scaleX * 1.2, enemy.scaleY * 1.2);
    
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
    
    this.scene.time.delayedCall(100, () => {
      if (enemy.active && !enemy.isDead) {
        enemy.setScale(originalScale.x, originalScale.y);
      }
    });
  }
}

export default ProjectileManager;