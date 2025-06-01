// frontend/src/components/game/scripts/DamageNumberManager.js
class DamageNumberManager {
  constructor(scene) {
    this.scene = scene;
    this.damageNumbers = [];
    this.showDamageNumbers = true; // Default enabled
  }

  // Convert number to Chinese characters
  convertToChineseNumber(number) {
    if (number === 0) return '零';
    
    const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];
    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    
    if (number < 10) {
      return digits[number];
    }
    
    if (number < 100) {
      const tens = Math.floor(number / 10);
      const ones = number % 10;
      if (tens === 1) {
        return ones === 0 ? '十' : '十' + digits[ones];
      }
      return digits[tens] + '十' + (ones === 0 ? '' : digits[ones]);
    }
    
    if (number < 1000) {
      const hundreds = Math.floor(number / 100);
      const remainder = number % 100;
      let result = digits[hundreds] + '百';
      if (remainder === 0) return result;
      if (remainder < 10) {
        result += '零' + digits[remainder];
      } else {
        result += this.convertToChineseNumber(remainder);
      }
      return result;
    }
    
    if (number < 10000) {
      const thousands = Math.floor(number / 1000);
      const remainder = number % 1000;
      let result = digits[thousands] + '千';
      if (remainder === 0) return result;
      if (remainder < 100) {
        result += '零' + this.convertToChineseNumber(remainder);
      } else {
        result += this.convertToChineseNumber(remainder);
      }
      return result;
    }
    
    if (number < 100000000) {
      const wan = Math.floor(number / 10000);
      const remainder = number % 10000;
      let result = this.convertToChineseNumber(wan) + '万';
      if (remainder === 0) return result;
      if (remainder < 1000) {
        result += '零' + this.convertToChineseNumber(remainder);
      } else {
        result += this.convertToChineseNumber(remainder);
      }
      return result;
    }
    
    // For very large numbers, use 亿
    const yi = Math.floor(number / 100000000);
    const remainder = number % 100000000;
    let result = this.convertToChineseNumber(yi) + '亿';
    if (remainder === 0) return result;
    if (remainder < 10000000) {
      result += '零' + this.convertToChineseNumber(remainder);
    } else {
      result += this.convertToChineseNumber(remainder);
    }
    return result;
  }

  // Show damage number at specified location
  showDamageNumber(x, y, damage, options = {}) {
    if (!this.showDamageNumbers) return;

    const {
      color = 0xffff00, // Default yellow
      fontSize = 16,
      isCritical = false,
      isHeal = false
    } = options;

    // Convert damage to Chinese number
    const chineseDamage = this.convertToChineseNumber(Math.floor(damage));
    
    // Create text object
    const damageText = this.scene.add.text(x, y, chineseDamage, {
      fontSize: isCritical ? fontSize * 1.5 : fontSize,
      fill: isHeal ? '#00ff00' : (isCritical ? '#ff4444' : '#ffff00'),
      stroke: '#000000',
      strokeThickness: 2,
      fontWeight: 'bold',
      fontFamily: 'Arial'
    });

    damageText.setOrigin(0.5, 0.5);
    
    // Add to tracking array
    this.damageNumbers.push(damageText);

    // Animate the damage number
    this.animateDamageNumber(damageText, isCritical);
  }

  animateDamageNumber(damageText, isCritical = false) {
    const startY = damageText.y;
    const endY = startY - (isCritical ? 80 : 60);
    const duration = isCritical ? 1500 : 1200;

    // Initial pop effect for critical hits
    if (isCritical) {
      damageText.setScale(0.5);
      this.scene.tweens.add({
        targets: damageText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        ease: 'Back.easeOut',
        yoyo: true,
        onComplete: () => {
          damageText.setScale(1);
        }
      });
    }

    // Float upward and fade
    this.scene.tweens.add({
      targets: damageText,
      y: endY,
      alpha: 0,
      duration: duration,
      ease: 'Power2.easeOut',
      onComplete: () => {
        // Remove from tracking array
        const index = this.damageNumbers.indexOf(damageText);
        if (index > -1) {
          this.damageNumbers.splice(index, 1);
        }
        damageText.destroy();
      }
    });

    // Slight horizontal drift for visual appeal
    const driftX = Phaser.Math.Between(-10, 10);
    this.scene.tweens.add({
      targets: damageText,
      x: damageText.x + driftX,
      duration: duration,
      ease: 'Power1.easeOut'
    });
  }

  // Toggle damage numbers on/off
  setShowDamageNumbers(show) {
    this.showDamageNumbers = show;
    
    // If hiding, clear all existing damage numbers
    if (!show) {
      this.clearAllDamageNumbers();
    }
  }

  // Clear all active damage numbers
  clearAllDamageNumbers() {
    this.damageNumbers.forEach(damageText => {
      damageText.destroy();
    });
    this.damageNumbers = [];
  }

  // Update method (if needed for future features)
  update() {
    // Currently no per-frame updates needed
    // Could be used for screen-relative positioning in the future
  }
}

export default DamageNumberManager;