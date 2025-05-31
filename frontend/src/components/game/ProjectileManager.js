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
      if (projectile.x < -50 || projectile.x > this.scene.cameras.main.width + 50 ||
          projectile.y < -50 || projectile.y > this.scene.cameras.main.height + 50) {
        projectile.destroy();
      }
    });
  }

  hitEnemy(projectile, enemy) {
    projectile.destroy();
    
    enemy.health -= this.projectileDamage;
    
    if (enemy.health <= 0) {
      this.destroyEnemy(enemy);
      this.addScore();
    } else {
      this.showEnemyHitEffect(enemy);
    }
  }

  destroyEnemy(enemy) {
    enemy.destroy();
    if (this.scene.gameStateRef) {
      this.scene.gameStateRef.score += 10;
      this.scene.gameStateRef.experience += 5;
    }
  }

  addScore() {
    if (this.scene.gameStateRef) {
      this.scene.gameStateRef.score += 10;
      this.scene.gameStateRef.experience += 5;
    }
  }

  showEnemyHitEffect(enemy) {
    // Flash enemy when hit using scale instead of color tint
    enemy.setScale(enemy.scaleX * 1.2, enemy.scaleY * 1.2);
    this.scene.time.delayedCall(100, () => {
      if (enemy.active) {
        enemy.setScale(enemy.scaleX / 1.2, enemy.scaleY / 1.2);
      }
    });
  }
}

export default ProjectileManager;