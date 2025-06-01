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

      // Remove projectiles that have traveled max distance (for 剑气)
      if (projectile.maxDistance && projectile.startX !== undefined && projectile.startY !== undefined) {
        const traveledDistance = Phaser.Math.Distance.Between(
          projectile.startX, projectile.startY,
          projectile.x, projectile.y
        );
        
        if (traveledDistance >= projectile.maxDistance) {
          projectile.destroy();
        }
      }
    });
  }

  hitEnemy(projectile, enemy) {
    // Don't hit dead or dying enemies
    if (enemy.isDead) return;
    
    // Destroy projectile immediately
    projectile.destroy();
    
    // Get damage amount (from projectile or default)
    const damage = projectile.damage || this.projectileDamage;
    
    // Get crit values from debug settings or defaults
    const debugSettings = this.scene.debugSettings;
    const critChance = debugSettings?.critChance !== undefined ? debugSettings.critChance / 100 : 0.15;
    const critDamageMultiplier = debugSettings?.critDamageMultiplier || 1.5;
    
    // Calculate critical hit
    const isCritical = Math.random() < critChance;
    const actualDamage = isCritical ? damage * critDamageMultiplier : damage;
    
    // Deal damage to enemy
    enemy.health -= actualDamage;
    
    // Show damage number
    if (this.scene.damageNumberManager) {
      this.scene.damageNumberManager.showDamageNumber(
        enemy.x, 
        enemy.y - 20, 
        actualDamage, 
        { 
          isCritical: isCritical,
          color: isCritical ? 0xff4444 : 0xffff00
        }
      );
    }
    
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
        
        // Use timer instead of animation complete to prevent freezing
        this.scene.time.delayedCall(400, () => {
          if (!enemy.isDead && enemy.active) {
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

    // Start the new death sequence
    this.startDeathSequence(enemy);
  }

  startDeathSequence(enemy) {
    // Stop all enemy animations and movement
    enemy.anims.stop();
    enemy.setVelocity(0, 0);
    
    // Phase 1: Glow aqua blue for 500ms
    enemy.setTint(0x00ffcc);
    
    // Add pulsing glow effect
    const glowTween = this.scene.tweens.add({
      targets: enemy,
      alpha: 0.7,
      scaleX: enemy.scaleX * 1.1,
      scaleY: enemy.scaleY * 1.1,
      duration: 100,
      yoyo: true,
      repeat: 4, // 5 total pulses over 500ms
      ease: 'Sine.easeInOut'
    });

    // Phase 2: After 500ms, shrink to a glowing dot and create soul
    this.scene.time.delayedCall(500, () => {
      if (!enemy.active) return;
      
      // Create explosion particles before shrinking
      this.createDeathParticles(enemy);
      
      // Shrink enemy to a tiny glowing dot
      this.scene.tweens.add({
        targets: enemy,
        scaleX: 0.1,
        scaleY: 0.1,
        alpha: 0.8,
        duration: 300,
        ease: 'Power2.easeIn',
        onComplete: () => {
          // Create soul drop at enemy position
          if (this.scene.enemyManager) {
            this.scene.enemyManager.createSoulDrop(enemy.x, enemy.y);
          }
          
          // Destroy the enemy
          enemy.destroy();
        }
      });
    });
  }

  createDeathParticles(enemy) {
    // Create simple particle burst effect
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

    // Screen shake effect
    this.scene.cameras.main.shake(100, 0.01);
  }

  createDeathEffect(enemy) {
    // Legacy method - now handled by startDeathSequence
    this.startDeathSequence(enemy);
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