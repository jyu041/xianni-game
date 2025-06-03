// frontend/src/components/GameLevel/scripts/ProjectileManager.js
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

      const margin = 100;
      const worldBounds = this.scene.physics.world.bounds;
      
      if (projectile.x < worldBounds.x - margin || 
          projectile.x > worldBounds.x + worldBounds.width + margin ||
          projectile.y < worldBounds.y - margin || 
          projectile.y > worldBounds.y + worldBounds.height + margin) {
        projectile.destroy();
        return;
      }

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
    if (enemy.isDead) return;
    
    projectile.destroy();
    
    let damage = projectile.damage || this.projectileDamage;
    
    if (this.scene.applyElementEffects) {
      damage = this.scene.applyElementEffects(damage, true);
    }
    
    const debugSettings = this.scene.debugSettings;
    const critChance = debugSettings?.critChance !== undefined ? debugSettings.critChance / 100 : 0.15;
    const critDamageMultiplier = debugSettings?.critDamageMultiplier || 1.5;
    
    const isCritical = Math.random() < critChance;
    const actualDamage = isCritical ? damage * critDamageMultiplier : damage;
    
    enemy.health -= actualDamage;
    
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

  destroyEnemy(enemy) {
    if (enemy.isDead) return;
    
    // Mark as dead immediately to prevent multiple hits
    enemy.isDead = true;
    enemy.setVelocity(0, 0);
    enemy.isAttacking = false;
    
    // Add score and experience immediately
    if (this.scene.gameStateRef) {
      let baseScore = 10;
      let baseExp = 5;
      
      if (this.scene.metalResourceBonus) {
        baseScore = Math.floor(baseScore * (1 + this.scene.metalResourceBonus));
        baseExp = Math.floor(baseExp * (1 + this.scene.metalResourceBonus));
      }
      
      this.scene.gameStateRef.score += baseScore;
      this.scene.gameStateRef.experience += baseExp;
    }

    // Hide health bar if it exists
    if (this.scene.enemyManager && this.scene.enemyManager.hideEnemyHealthBar) {
      this.scene.enemyManager.hideEnemyHealthBar(enemy);
    }

    // Notify health regen manager of enemy kill
    if (this.scene.onEnemyKilled) {
      this.scene.onEnemyKilled();
    }

    // Use enemy manager's death sequence for proper soul drop animation
    if (this.scene.enemyManager && this.scene.enemyManager.startDeathSequence) {
      this.scene.enemyManager.startDeathSequence(enemy);
    } else {
      // Fallback to old death sequence
      this.startDeathSequence(enemy);
    }
  }

  playEnemyHitAnimation(enemy) {
    // For GIF enemies, delegate to enemy manager
    if (this.scene.enemyManager && this.scene.enemyManager.updateEnemyAnimation) {
      this.scene.enemyManager.updateEnemyAnimation(enemy, 'hurt');
      
      // Return to appropriate animation after hit
      this.scene.time.delayedCall(400, () => {
        if (!enemy.isDead && enemy.active) {
          if (enemy.isAttacking) {
            this.scene.enemyManager.updateEnemyAnimation(enemy, 'attack');
          } else {
            this.scene.enemyManager.updateEnemyAnimation(enemy, 'idle');
          }
        }
      });
    }
  }

  startDeathSequence(enemy) {
    // Fallback death sequence if enemy manager doesn't handle it
    enemy.setVelocity(0, 0);
    
    // Phase 1: Glow effect
    enemy.setTint(0x00ffcc);
    
    const glowTween = this.scene.tweens.add({
      targets: enemy,
      alpha: 0.7,
      scaleX: enemy.scaleX * 1.1,
      scaleY: enemy.scaleY * 1.1,
      duration: 100,
      yoyo: true,
      repeat: 4,
      ease: 'Sine.easeInOut'
    });

    this.scene.time.delayedCall(500, () => {
      if (!enemy.active) return;
      
      this.createDeathParticles(enemy);
      
      this.scene.tweens.add({
        targets: enemy,
        scaleX: 0.1,
        scaleY: 0.1,
        alpha: 0.8,
        duration: 300,
        ease: 'Power2.easeIn',
        onComplete: () => {
          if (this.scene.enemyManager) {
            this.scene.enemyManager.createSoulDrop(enemy.x, enemy.y);
          }
          
          // Remove GIF if it exists
          if (this.scene.enemyManager && this.scene.enemyManager.removeEnemyGif) {
            this.scene.enemyManager.removeEnemyGif(enemy);
          }
          
          enemy.destroy();
        }
      });
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

  createDeathEffect(enemy) {
    // Legacy method - now handled by startDeathSequence
    this.startDeathSequence(enemy);
  }

  showEnemyHitEffect(enemy) {
    // Delegate to enemy manager for GIF enemies
    if (this.scene.enemyManager && this.scene.enemyManager.showEnemyHitEffect) {
      this.scene.enemyManager.showEnemyHitEffect(enemy);
    } else {
      // Fallback for non-GIF enemies
      const originalScale = { x: enemy.scaleX, y: enemy.scaleY };
      enemy.setScale(enemy.scaleX * 1.2, enemy.scaleY * 1.2);
      
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
}

export default ProjectileManager;