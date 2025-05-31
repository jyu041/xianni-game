// frontend/src/components/game/EnemyManager.js
class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.maxEnemies = 15;
    this.enemyTypes = [
      { 
        key: 'evilWizard1', 
        texture: 'enemy_evilWizard1_idle',
        size: 80,
        health: 75,
        speedRange: [40, 60]
      },
      { 
        key: 'fighter', 
        texture: 'enemy_fighter_idle',
        size: 70,
        health: 50,
        speedRange: [50, 70]
      }
    ];
  }

  update() {
    this.updateEnemyBehavior();
  }

  updateEnemyBehavior() {
    this.scene.enemies.children.entries.forEach(enemy => {
      if (!enemy.active) return;

      // Move towards player
      const player = this.scene.playerController.player;
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
      const speed = enemy.enemySpeed || 50;
      
      enemy.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      // Play movement animation if available
      this.updateEnemyAnimation(enemy);
    });
  }

  updateEnemyAnimation(enemy) {
    if (enemy.enemyType && !enemy.isAttacking) {
      const moveAnimKey = `enemy_${enemy.enemyType}_move_anim`;
      const idleAnimKey = `enemy_${enemy.enemyType}_idle_anim`;
      
      // Use move animation if available, otherwise idle
      let animKey = this.scene.anims.exists(moveAnimKey) ? moveAnimKey : idleAnimKey;
      
      if (this.scene.anims.exists(animKey)) {
        if (!enemy.anims.isPlaying || enemy.anims.currentAnim.key !== animKey) {
          enemy.play(animKey);
        }
      }
    }
  }

  spawnEnemy() {
    if (this.scene.enemies.children.size >= this.maxEnemies) return;

    const spawnPosition = this.getRandomSpawnPosition();
    const enemyType = this.getRandomEnemyType();
    
    this.createEnemy(spawnPosition, enemyType);
  }

  getRandomSpawnPosition() {
    const spawnPositions = [
      { x: Phaser.Math.Between(0, this.scene.cameras.main.width), y: -30 }, // Top
      { x: this.scene.cameras.main.width + 30, y: Phaser.Math.Between(0, this.scene.cameras.main.height) }, // Right
      { x: Phaser.Math.Between(0, this.scene.cameras.main.width), y: this.scene.cameras.main.height + 30 }, // Bottom
      { x: -30, y: Phaser.Math.Between(0, this.scene.cameras.main.height) } // Left
    ];

    return Phaser.Utils.Array.GetRandom(spawnPositions);
  }

  getRandomEnemyType() {
    return Phaser.Utils.Array.GetRandom(this.enemyTypes);
  }

  createEnemy(spawnPos, enemyType) {
    let enemy;

    // Create enemy with appropriate texture
    if (this.scene.textures.exists(enemyType.texture)) {
      enemy = this.scene.enemies.create(spawnPos.x, spawnPos.y, enemyType.texture);
      enemy.setDisplaySize(enemyType.size, enemyType.size);
      enemy.enemyType = enemyType.key;
      
      // Start with idle animation
      const idleAnimKey = `enemy_${enemyType.key}_idle_anim`;
      if (this.scene.anims.exists(idleAnimKey)) {
        enemy.play(idleAnimKey);
      }
      
      console.log(`Spawned ${enemyType.key} enemy with animation`);
    } else {
      // Fallback to colored square (removed color tint)
      enemy = this.scene.enemies.create(spawnPos.x, spawnPos.y, 'enemy');
      enemy.setDisplaySize(25, 25);
      enemy.enemyType = 'basic';
    }

    // Set enemy properties
    enemy.enemySpeed = Phaser.Math.Between(enemyType.speedRange[0], enemyType.speedRange[1]);
    enemy.health = enemyType.health;
    enemy.maxHealth = enemyType.health;
    enemy.isAttacking = false;

    return enemy;
  }

  destroyEnemy(enemy) {
    if (enemy && enemy.active) {
      enemy.destroy();
    }
  }
}

export default EnemyManager;