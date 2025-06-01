// frontend/src/components/game/HealthRegenManager.js
class HealthRegenManager {
  constructor(scene) {
    this.scene = scene;
    this.regenTimer = null;
    this.regenInterval = 1000; // 1 second
    this.baseRegenRate = 0.01; // 1% per second base
    this.enemyKillCounter = 0;
    this.healthDropInterval = 10; // Every 10 enemies drop health
  }

  initialize() {
    // Start regeneration timer
    this.regenTimer = this.scene.time.addEvent({
      delay: this.regenInterval,
      callback: () => this.regenerateHealth(),
      loop: true
    });
  }

  regenerateHealth() {
    if (!this.scene.gameStateRef || !this.scene.gameStateRef.player) return;
    
    const player = this.scene.gameStateRef.player;
    const playerData = this.scene.playerData;
    
    // Calculate wood element bonus (missing health regeneration)
    const woodLevel = playerData?.elementLevels?.wood || 0;
    const isPrimaryWood = playerData?.primaryElement === 'wood';
    const woodBonus = this.getWoodRegenBonus(woodLevel, isPrimaryWood);
    
    // Calculate missing health percentage
    const missingHealth = player.maxHealth - player.health;
    const missingHealthPercent = missingHealth / player.maxHealth;
    
    // Calculate regeneration amount
    let regenAmount = 0;
    
    // Base regeneration (small)
    regenAmount += player.maxHealth * this.baseRegenRate;
    
    // Wood element bonus (based on missing health)
    if (woodBonus > 0) {
      regenAmount += missingHealth * woodBonus;
    }
    
    // Apply regeneration
    if (regenAmount > 0 && player.health < player.maxHealth) {
      const newHealth = Math.min(player.maxHealth, player.health + regenAmount);
      player.health = Math.floor(newHealth);
      
      // Show healing number if significant
      if (regenAmount >= 1 && this.scene.damageNumberManager) {
        this.scene.damageNumberManager.showDamageNumber(
          this.scene.playerController.player.x,
          this.scene.playerController.player.y - 30,
          Math.floor(regenAmount),
          {
            color: 0x00ff00,
            isHeal: true
          }
        );
      }
    }
  }

  getWoodRegenBonus(woodLevel, isPrimary) {
    // Wood element: 0-25% health regeneration based on missing health
    const baseBonus = (woodLevel / 100) * 0.25; // 0 to 0.25 (25%)
    return isPrimary ? baseBonus : baseBonus * 0.1; // 10% for non-primary
  }

  onEnemyKilled() {
    this.enemyKillCounter++;
    
    // Every 10 enemies, drop a health orb
    if (this.enemyKillCounter % this.healthDropInterval === 0) {
      this.createHealthDrop();
    }
  }

  createHealthDrop() {
    if (!this.scene.playerController || !this.scene.playerController.player) return;
    
    // Create health orb near a random enemy or at player location
    const dropPosition = this.getRandomDropPosition();
    const healthOrb = this.scene.add.circle(dropPosition.x, dropPosition.y, 12, 0xff6b6b, 0.8);
    healthOrb.setStrokeStyle(2, 0xff0000, 0.9);
    
    // Add physics for collection
    this.scene.physics.add.existing(healthOrb);
    healthOrb.body.setSize(32, 32);
    healthOrb.body.setImmovable(true);
    
    // Add to health orbs group
    if (!this.scene.healthOrbs) {
      this.scene.healthOrbs = this.scene.physics.add.group();
    }
    this.scene.healthOrbs.add(healthOrb);
    
    // Set properties
    healthOrb.healthValue = 25; // Restore 25 health
    healthOrb.isHealthOrb = true;
    healthOrb.isCollectable = true;
    
    // Pulsing animation
    this.scene.tweens.add({
      targets: healthOrb,
      alpha: 0.4,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Floating animation
    this.scene.tweens.add({
      targets: healthOrb,
      y: healthOrb.y - 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Auto-expire after 30 seconds
    this.scene.time.delayedCall(30000, () => {
      if (healthOrb && healthOrb.active) {
        healthOrb.isCollectable = false;
        this.scene.tweens.add({
          targets: healthOrb,
          alpha: 0,
          scaleX: 0.1,
          scaleY: 0.1,
          duration: 1000,
          onComplete: () => {
            if (healthOrb.body) {
              healthOrb.body.destroy();
            }
            healthOrb.destroy();
          }
        });
      }
    });
    
    console.log('Health orb created after 10 enemy kills');
  }

  getRandomDropPosition() {
    const player = this.scene.playerController.player;
    
    // Try to find a position near enemies first
    if (this.scene.enemies && this.scene.enemies.children.size > 0) {
      const enemies = this.scene.enemies.children.entries.filter(e => e.active && !e.isDead);
      if (enemies.length > 0) {
        const randomEnemy = Phaser.Utils.Array.GetRandom(enemies);
        return { x: randomEnemy.x, y: randomEnemy.y };
      }
    }
    
    // Fallback to random position around player
    const angle = Math.random() * Math.PI * 2;
    const distance = Phaser.Math.Between(50, 150);
    return {
      x: player.x + Math.cos(angle) * distance,
      y: player.y + Math.sin(angle) * distance
    };
  }

  checkHealthOrbCollection() {
    if (!this.scene.healthOrbs || !this.scene.healthOrbs.children) return;
    
    const player = this.scene.playerController.player;
    const collectionRange = 50;
    
    this.scene.healthOrbs.children.entries.slice().forEach(orb => {
      if (!orb.active || !orb.isHealthOrb || !orb.isCollectable) return;
      
      const distance = Phaser.Math.Distance.Between(
        player.x, player.y,
        orb.x, orb.y
      );
      
      if (distance <= collectionRange) {
        this.collectHealthOrb(orb);
      }
    });
  }

  collectHealthOrb(orb) {
    if (!orb.isCollectable || !orb.isHealthOrb) return;
    
    orb.isCollectable = false;
    
    // Restore health
    if (this.scene.gameStateRef && this.scene.gameStateRef.player) {
      const player = this.scene.gameStateRef.player;
      const healAmount = orb.healthValue || 25;
      const newHealth = Math.min(player.maxHealth, player.health + healAmount);
      player.health = newHealth;
      
      // Show healing number
      if (this.scene.damageNumberManager) {
        this.scene.damageNumberManager.showDamageNumber(
          orb.x, orb.y - 20,
          healAmount,
          {
            color: 0x00ff00,
            isHeal: true
          }
        );
      }
    }
    
    // Collection animation
    this.createHealthCollectionAnimation(orb);
  }

  createHealthCollectionAnimation(orb) {
    const player = this.scene.playerController.player;
    
    // Create collection effect
    const collectEffect = this.scene.add.circle(orb.x, orb.y, 8, 0x00ff00, 1);
    collectEffect.setStrokeStyle(2, 0x00ff88, 0.8);
    
    // Move to player
    this.scene.tweens.add({
      targets: collectEffect,
      x: player.x,
      y: player.y - 20,
      scaleX: 0.3,
      scaleY: 0.3,
      alpha: 0,
      duration: 300,
      ease: 'Power2.easeIn',
      onComplete: () => {
        collectEffect.destroy();
      }
    });
    
    // Destroy the orb
    this.scene.time.delayedCall(50, () => {
      if (orb.body) {
        orb.body.destroy();
      }
      orb.destroy();
    });
  }

  update() {
    this.checkHealthOrbCollection();
  }

  destroy() {
    if (this.regenTimer) {
      this.regenTimer.destroy();
      this.regenTimer = null;
    }
  }
}

export default HealthRegenManager;