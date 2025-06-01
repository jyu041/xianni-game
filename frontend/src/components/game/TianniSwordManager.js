// frontend/src/components/game/TianniSwordManager.js
import elementService from '../../services/elementService';

class TianniSwordManager {
  constructor(scene) {
    this.scene = scene;
    this.skillCooldown = 5000; // 5 seconds cooldown for special skills
    this.lastSkillTime = 0;
    this.manaCosts = {
      2: 20,  // Small slash
      4: 35,  // Medium slash
      6: 50,  // Large slash
      10: 75, // Triple slash
      11: 100 // Five elements annihilation
    };
  }

  canUseSkill(swordLevel) {
    if (swordLevel <= 1) return true; // Basic attack has no cooldown
    
    const currentTime = this.scene.time.now;
    return currentTime - this.lastSkillTime >= this.skillCooldown;
  }

  getManaCost(swordLevel) {
    return this.manaCosts[swordLevel] || 0;
  }

  useSkill(swordLevel, playerElement, hasMutation = false) {
    if (!this.canUseSkill(swordLevel)) {
      console.log('Skill on cooldown');
      return false;
    }

    const manaCost = this.getManaCost(swordLevel);
    
    // Check mana (this would integrate with player mana system)
    if (manaCost > 0) {
      console.log(`Using ${manaCost} mana for Tianni Sword skill level ${swordLevel}`);
      // TODO: Integrate with player mana system
    }

    this.lastSkillTime = this.scene.time.now;
    
    // Execute skill based on level
    this.executeSkill(swordLevel, playerElement, hasMutation);
    
    return true;
  }

  executeSkill(swordLevel, playerElement, hasMutation) {
    const player = this.scene.playerController.player;
    const colorId = elementService.getSlashColorId(playerElement);
    
    if (hasMutation && swordLevel >= 10) {
      this.executeFiveElementsAnnihilation(player);
    } else {
      switch (swordLevel) {
        case 2:
        case 3:
          this.executeSlash3(player, colorId, swordLevel);
          break;
        case 4:
        case 5:
          this.executeSlash2(player, colorId, swordLevel);
          break;
        case 6:
        case 7:
        case 8:
        case 9:
          this.executeSlash1(player, colorId, swordLevel);
          break;
        case 10:
          this.executeTripleSlash(player, colorId);
          break;
        default:
          console.log('No special skill for this level');
          break;
      }
    }
  }

  executeSlash3(player, colorId, level) {
    const effectKey = `slash_slash3_color${colorId}`;
    
    // Cast VFX effect
    if (this.scene.vfxManager) {
      this.scene.vfxManager.playEffectAtPlayer(effectKey, {
        scale: 1.2,
        rotation: 0
      });
    }
    
    // Damage calculation
    const baseDamage = this.getSkillDamage(level);
    this.dealAOEDamage(player, 80, baseDamage, 'small'); // Small AOE
    
    console.log(`Tianni Sword Slash3 Level ${level}: ${baseDamage}% max health damage`);
  }

  executeSlash2(player, colorId, level) {
    const effectKey = `slash_slash2_color${colorId}`;
    
    if (this.scene.vfxManager) {
      this.scene.vfxManager.playEffectAtPlayer(effectKey, {
        scale: 1.4,
        rotation: 0
      });
    }
    
    const baseDamage = this.getSkillDamage(level);
    this.dealAOEDamage(player, 100, baseDamage, 'medium'); // Medium AOE
    
    console.log(`Tianni Sword Slash2 Level ${level}: ${baseDamage}% max health damage`);
  }

  executeSlash1(player, colorId, level) {
    const effectKey = `slash_slash1_color${colorId}`;
    
    if (this.scene.vfxManager) {
      this.scene.vfxManager.playEffectAtPlayer(effectKey, {
        scale: 1.6,
        rotation: 0
      });
    }
    
    const baseDamage = this.getSkillDamage(level);
    this.dealAOEDamage(player, 120, baseDamage, 'large'); // Large AOE
    
    console.log(`Tianni Sword Slash1 Level ${level}: ${baseDamage}% max health damage`);
  }

  executeTripleSlash(player, colorId) {
    // Execute three slashes in sequence
    this.executeSlash3(player, colorId, 10);
    
    this.scene.time.delayedCall(500, () => {
      this.executeSlash2(player, colorId, 10);
    });
    
    this.scene.time.delayedCall(1000, () => {
      this.executeSlash1(player, colorId, 10);
    });
    
    console.log('Tianni Sword Triple Slash: 60% max health damage');
  }

  executeFiveElementsAnnihilation(player) {
    // Cast all five element slashes simultaneously
    const elements = ['wood', 'fire', 'metal', 'earth', 'water'];
    const slashTypes = ['slash3', 'slash2', 'slash1'];
    
    let delay = 0;
    slashTypes.forEach(slashType => {
      elements.forEach((element, index) => {
        const colorId = elementService.getSlashColorId(element);
        const effectKey = `slash_${slashType}_color${colorId}`;
        
        this.scene.time.delayedCall(delay, () => {
          if (this.scene.vfxManager) {
            this.scene.vfxManager.playEffectAtPlayer(effectKey, {
              scale: 2.0,
              rotation: (index * Math.PI * 2) / 5 // Spread in circle
            });
          }
        });
        
        delay += 100; // 100ms between each effect
      });
    });
    
    // Massive AOE damage
    this.dealAOEDamage(player, 200, 75, 'massive'); // Massive AOE, 75% damage
    
    console.log('Tianni Sword Five Elements Annihilation: 75% max health damage');
  }

  getSkillDamage(level) {
    const damageTable = {
      2: 20, 3: 25,
      4: 30, 5: 35,
      6: 40, 7: 45, 8: 50, 9: 55,
      10: 60,
      11: 75 // Mutation level
    };
    return damageTable[level] || 0;
  }

  dealAOEDamage(player, radius, percentDamage, size) {
    if (!this.scene.enemies || !this.scene.enemies.children) return;
    
    let enemiesHit = 0;
    
    this.scene.enemies.children.entries.forEach(enemy => {
      if (!enemy.active || enemy.isDead) return;
      
      const distance = Phaser.Math.Distance.Between(
        player.x, player.y,
        enemy.x, enemy.y
      );
      
      if (distance <= radius) {
        // Calculate percentage-based damage
        const damage = Math.floor(enemy.maxHealth * (percentDamage / 100));
        
        // Deal damage
        enemy.health -= damage;
        enemiesHit++;
        
        // Show damage number
        if (this.scene.damageNumberManager) {
          this.scene.damageNumberManager.showDamageNumber(
            enemy.x, 
            enemy.y - 20, 
            damage, 
            { 
              isCritical: true,
              color: 0xff4444
            }
          );
        }
        
        // Check if enemy is defeated
        if (enemy.health <= 0) {
          this.scene.projectileManager.destroyEnemy(enemy);
        } else {
          this.scene.projectileManager.showEnemyHitEffect(enemy);
          this.scene.projectileManager.playEnemyHitAnimation(enemy);
        }
      }
    });
    
    // Create visual AOE indicator
    this.createAOEIndicator(player, radius, size);
    
    console.log(`AOE skill hit ${enemiesHit} enemies with ${percentDamage}% damage`);
  }

  createAOEIndicator(player, radius, size) {
    // Create a temporary visual circle to show AOE range
    const indicator = this.scene.add.circle(player.x, player.y, radius, 0xffffff, 0.2);
    indicator.setStrokeStyle(3, 0xffffff, 0.8);
    
    // Animate the indicator
    this.scene.tweens.add({
      targets: indicator,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0,
      duration: 500,
      ease: 'Power2.easeOut',
      onComplete: () => indicator.destroy()
    });
    
    // Screen shake effect based on skill size
    const shakeIntensity = size === 'massive' ? 0.02 : size === 'large' ? 0.015 : 0.01;
    const shakeDuration = size === 'massive' ? 300 : size === 'large' ? 200 : 150;
    this.scene.cameras.main.shake(shakeDuration, shakeIntensity);
  }

  // Check if player can use skill based on mana
  hasEnoughMana(playerId, swordLevel) {
    const manaCost = this.getManaCost(swordLevel);
    // This would check player's current mana
    // For now, return true - integrate with player mana system later
    return true;
  }
}

export default TianniSwordManager;