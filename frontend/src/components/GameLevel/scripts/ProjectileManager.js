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
    if (enemy.isDead || this.scene.enemyManager.dyingEnemies.has(enemy)) return;
    
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
    if (enemy.isDead || this.scene.enemyManager.dyingEnemies.has(enemy)) return;
    
    console.log(`Enemy destroyed via projectile hit at (${enemy.x}, ${enemy.y})`);
    
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

    // Notify health regen manager of enemy kill
    if (this.scene.onEnemyKilled) {
      this.scene.onEnemyKilled();
    }

    // Use enemy manager's proper death sequence
    if (this.scene.enemyManager && this.scene.enemyManager.startDeathSequence) {
      this.scene.enemyManager.startDeathSequence(enemy);
    } else {
      console.warn('EnemyManager not available, using fallback death sequence');
      this.fallbackDeathSequence(enemy);
    }
  }

  playEnemyHitAnimation(enemy) {
    // Delegate to enemy manager for proper GIF animation handling
    if (this.scene.enemyManager && this.scene.enemyManager.updateEnemyAnimation) {
      this.scene.enemyManager.updateEnemyAnimation(enemy, 'hurt');
      
      // Return to appropriate animation after hit
      this.scene.time.delayedCall(400, () => {
        if (!enemy.isDead && enemy.active && !this.scene.enemyManager.dyingEnemies.has(enemy)) {
          if (enemy.isAttacking) {
            this.scene.enemyManager.updateEnemyAnimation(enemy, 'attack');
          } else {
            this.scene.enemyManager.updateEnemyAnimation(enemy, 'idle');
          }
        }
      });
    }
  }

  showEnemyHitEffect(enemy) {
    // Delegate to enemy manager for proper hit effect
    if (this.scene.enemyManager && this.scene.enemyManager.showEnemyHitEffect) {
      this.scene.enemyManager.showEnemyHitEffect(enemy);
    } else {
      // Fallback for hit effect
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
  }

  // Fallback death sequence if enemy manager is not available
  fallbackDeathSequence(enemy) {
    enemy.isDead = true;
    enemy.setVelocity(0, 0);
    enemy.isAttacking = false;
    
    // Simple fade out and create soul
    this.scene.tweens.add({
      targets: enemy,
      alpha: 0,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 500,
      onComplete: () => {
        // Create soul drop
        if (this.scene.enemyManager && this.scene.enemyManager.createSoulDrop) {
          this.scene.enemyManager.createSoulDrop(enemy.x, enemy.y);
        }
        enemy.destroy();
      }
    });
  }

  // Legacy methods kept for compatibility
  createDeathParticles(enemy) {
    // Delegate to enemy manager
    if (this.scene.enemyManager && this.scene.enemyManager.createDeathParticles) {
      this.scene.enemyManager.createDeathParticles(enemy);
    }
  }

  startDeathSequence(enemy) {
    // Delegate to enemy manager
    if (this.scene.enemyManager && this.scene.enemyManager.startDeathSequence) {
      this.scene.enemyManager.startDeathSequence(enemy);
    } else {
      this.fallbackDeathSequence(enemy);
    }
  }

  createDeathEffect(enemy) {
    // Legacy method - redirect to proper death sequence
    this.startDeathSequence(enemy);
  }
}

export default ProjectileManager;