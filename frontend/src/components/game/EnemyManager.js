// frontend/src/components/game/EnemyManager.js
import { getAllEnemyTypes, getRandomEnemyType } from './config/EnemyTypes.js';

class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.maxEnemies = 15;
    this.attackRange = 60;
    this.attackCooldown = 2000;
    this.enemyTypes = getAllEnemyTypes();
  }

  update() {
    this.updateEnemyBehavior();
  }

  updateEnemyBehavior() {
    this.scene.enemies.children.entries.forEach(enemy => {
      if (!enemy.active) return;

      const player = this.scene.playerController.player;
      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
      
      if (distance <= this.attackRange && !enemy.isAttacking) {
        this.tryAttack(enemy, player);
      } else if (!enemy.isAttacking) {
        this.moveTowardsPlayer(enemy, player);
      }
    });
  }

  moveTowardsPlayer(enemy, player) {
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    const speed = enemy.enemySpeed || 50;
    
    const direction = this.getDirectionFromAngle(angle);
    enemy.currentDirection = direction;
    
    enemy.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );

    this.updateEnemyMovementAnimation(enemy, direction);
  }

  getDirectionFromAngle(angle) {
    const normalizedAngle = Phaser.Math.Angle.Normalize(angle);
    
    if (normalizedAngle >= -Math.PI/4 && normalizedAngle <= Math.PI/4) {
      return 'right';
    } else if (normalizedAngle > Math.PI/4 && normalizedAngle < 3*Math.PI/4) {
      return 'down';
    } else if (normalizedAngle >= 3*Math.PI/4 || normalizedAngle <= -3*Math.PI/4) {
      return 'left';
    } else {
      return 'up';
    }
  }

  updateEnemyMovementAnimation(enemy, direction) {
    if (enemy.enemyType && !enemy.isAttacking) {
      // Try movement animations in priority order
      const animKeys = [
        `enemy_${enemy.enemyType}_move_anim`,
        `enemy_${enemy.enemyType}_run_anim`,
        `enemy_${enemy.enemyType}_walk_anim`,
        `enemy_${enemy.enemyType}_idle_anim`
      ];
      
      const animKey = animKeys.find(key => this.scene.anims.exists(key));
      
      if (animKey && (!enemy.anims.isPlaying || enemy.anims.currentAnim.key !== animKey)) {
        enemy.play(animKey);
      }

      this.updateSpriteDirection(enemy, direction);
    }
  }

  updateSpriteDirection(enemy, direction) {
    switch (direction) {
      case 'left':
        enemy.setFlipX(true);
        break;
      case 'right':
        enemy.setFlipX(false);
        break;
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
    enemy.isAttacking = true;
    enemy.setVelocity(0, 0);
    
    const attackAnimKey = `enemy_${enemy.enemyType}_attack_anim`;
    
    if (this.scene.anims.exists(attackAnimKey)) {
      enemy.play(attackAnimKey);
      enemy.once('animationcomplete', () => {
        this.dealAttackDamage(enemy, player);
        enemy.isAttacking = false;
      });
    } else {
      this.dealAttackDamage(enemy, player);
      this.scene.time.delayedCall(500, () => {
        enemy.isAttacking = false;
      });
    }
  }

  dealAttackDamage(enemy, player) {
    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
    if (distance <= this.attackRange) {
      const damage = enemy.enemyDamage || 10;
      this.scene.playerController.takeDamage(damage);
      this.createAttackEffect(enemy, player);
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
    if (this.scene.enemies.children.size >= this.maxEnemies) return;

    const spawnPosition = this.getRandomSpawnPosition();
    const enemyType = getRandomEnemyType();
    
    this.createEnemy(spawnPosition, enemyType);
  }

  getRandomSpawnPosition() {
    const margin = 50;
    const spawnPositions = [
      { x: Phaser.Math.Between(margin, this.scene.cameras.main.width - margin), y: -margin },
      { x: this.scene.cameras.main.width + margin, y: Phaser.Math.Between(margin, this.scene.cameras.main.height - margin) },
      { x: Phaser.Math.Between(margin, this.scene.cameras.main.width - margin), y: this.scene.cameras.main.height + margin },
      { x: -margin, y: Phaser.Math.Between(margin, this.scene.cameras.main.height - margin) }
    ];

    return Phaser.Utils.Array.GetRandom(spawnPositions);
  }

  createEnemy(spawnPos, enemyType) {
    let enemy;

    if (this.scene.textures.exists(enemyType.texture)) {
      enemy = this.scene.enemies.create(spawnPos.x, spawnPos.y, enemyType.texture);
      enemy.setDisplaySize(enemyType.size, enemyType.size);
      enemy.enemyType = enemyType.key;
      
      const idleAnimKey = `enemy_${enemyType.key}_idle_anim`;
      if (this.scene.anims.exists(idleAnimKey)) {
        enemy.play(idleAnimKey);
      }
    } else {
      enemy = this.scene.enemies.create(spawnPos.x, spawnPos.y, 'enemy');
      enemy.setDisplaySize(25, 25);
      enemy.enemyType = 'basic';
    }

    // Set enemy properties from config
    enemy.enemySpeed = Phaser.Math.Between(enemyType.speedRange[0], enemyType.speedRange[1]);
    enemy.health = enemyType.health;
    enemy.maxHealth = enemyType.health;
    enemy.enemyDamage = enemyType.damage;
    enemy.isAttacking = false;
    enemy.currentDirection = 'right';
    enemy.lastAttackTime = 0;

    enemy.setCollideWorldBounds(false);
    enemy.setBounce(0);
    enemy.setDrag(50);

    return enemy;
  }

  destroyEnemy(enemy) {
    if (enemy && enemy.active) {
      const deathAnimKey = `enemy_${enemy.enemyType}_death_anim`;
      if (this.scene.anims.exists(deathAnimKey)) {
        enemy.setVelocity(0, 0);
        enemy.play(deathAnimKey);
        enemy.once('animationcomplete', () => {
          enemy.destroy();
        });
      } else {
        enemy.destroy();
      }
    }
  }
}

export default EnemyManager;