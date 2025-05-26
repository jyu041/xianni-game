/**
 * CultivationManager
 * Cultivation system logic
 */

import useGameStore from './StateManager.js';
import { CULTIVATION_REALMS } from '../utils/gameConstants.js';
import { CULTIVATION_REALMS_DATA } from '../data/cultivation/realms.js';
import { CULTIVATION_TECHNIQUES_DATA } from '../data/cultivation/techniques.js';
import { HEAVENLY_TRIBULATIONS_DATA } from '../data/cultivation/tribulations.js';

class CultivationManager {
  constructor() {
    this.cultivationTimer = null;
    this.breakthroughInProgress = false;
    this.tribulationActive = false;
  }

  // Start cultivation session
  startCultivation(techniqueId = null) {
    const gameState = useGameStore.getState();
    const { player } = gameState;
    
    if (this.cultivationTimer) {
      console.log('Cultivation already in progress');
      return false;
    }

    // Check if player has enough spiritual energy
    if (player.stats.energy < 10) {
      gameState.addNotification({
        type: 'warning',
        message: '修炼需要消耗体力',
        duration: 3000
      });
      return false;
    }

    // Determine cultivation technique
    const technique = techniqueId 
      ? this.getTechniqueById(techniqueId)
      : player.cultivation.currentTechnique;

    if (!technique) {
      gameState.addNotification({
        type: 'warning',
        message: '请选择修炼功法',
        duration: 3000
      });
      return false;
    }

    // Start cultivation timer
    this.cultivationTimer = setInterval(() => {
      this.processCultivationTick(technique);
    }, 1000); // Process every second

    gameState.addNotification({
      type: 'info',
      message: `开始修炼 ${technique.name}`,
      duration: 2000
    });

    return true;
  }

  // Stop cultivation session
  stopCultivation() {
    if (this.cultivationTimer) {
      clearInterval(this.cultivationTimer);
      this.cultivationTimer = null;
      
      useGameStore.getState().addNotification({
        type: 'info',
        message: '停止修炼',
        duration: 2000
      });
    }
  }

  // Process a single cultivation tick
  processCultivationTick(technique) {
    const gameState = useGameStore.getState();
    const { player } = gameState;
    
    // Check if player still has energy
    if (player.stats.energy <= 0) {
      this.stopCultivation();
      gameState.addNotification({
        type: 'warning',
        message: '体力不足，停止修炼',
        duration: 3000
      });
      return;
    }

    // Calculate cultivation gains
    const gains = this.calculateCultivationGains(technique, player);
    
    // Apply gains
    const newCultivationPoints = player.cultivation.cultivationPoints + gains.cultivationPoints;
    const newSpiritualEnergy = Math.min(
      player.cultivation.maxSpiritualEnergy,
      player.cultivation.spiritualEnergy + gains.spiritualEnergy
    );
    
    // Update player state
    gameState.updateCultivation({
      cultivationPoints: newCultivationPoints,
      spiritualEnergy: newSpiritualEnergy
    });

    // Consume energy
    gameState.updateStats({
      energy: Math.max(0, player.stats.energy - gains.energyCost)
    });

    // Check for stage advancement
    this.checkStageAdvancement();
  }

  // Calculate cultivation gains per tick
  calculateCultivationGains(technique, player) {
    const baseGain = 1;
    
    // Technique multiplier
    const techniqueMultiplier = technique.efficiency || 1;
    
    // Spiritual root affinity bonus
    const affinityBonus = this.calculateAffinityBonus(technique, player.cultivation.spiritualRoots);
    
    // Realm multiplier (higher realms gain more slowly but with bigger impact)
    const realmData = this.getRealmData(player.cultivation.realm);
    const realmMultiplier = realmData.cultivationRate || 1;
    
    const cultivationPoints = Math.floor(
      baseGain * techniqueMultiplier * affinityBonus * realmMultiplier
    );

    return {
      cultivationPoints,
      spiritualEnergy: Math.floor(cultivationPoints * 0.1),
      energyCost: 1
    };
  }

  // Calculate spiritual root affinity bonus
  calculateAffinityBonus(technique, spiritualRoots) {
    if (!technique.elements || technique.elements.length === 0) {
      return 1; // Neutral technique
    }

    let totalAffinity = 0;
    technique.elements.forEach(element => {
      totalAffinity += spiritualRoots[element] || 0;
    });

    const averageAffinity = totalAffinity / technique.elements.length;
    return 1 + (averageAffinity / 100); // Convert percentage to multiplier
  }

  // Check if player can advance to next stage
  checkStageAdvancement() {
    const gameState = useGameStore.getState();
    const { player } = gameState;
    const { cultivation } = player;
    
    const realmData = this.getRealmData(cultivation.realm);
    const stageData = realmData.stages[cultivation.stage - 1];
    
    if (!stageData) return;

    // Check if player has enough cultivation points to advance
    if (cultivation.cultivationPoints >= stageData.requiredPoints) {
      this.attemptStageBreakthrough();
    }
  }

  // Attempt breakthrough to next stage
  attemptStageBreakthrough() {
    if (this.breakthroughInProgress) return;
    
    const gameState = useGameStore.getState();
    const { player } = gameState;
    const { cultivation } = player;
    
    this.breakthroughInProgress = true;
    
    // Stop current cultivation
    this.stopCultivation();
    
    const realmData = this.getRealmData(cultivation.realm);
    const currentStage = cultivation.stage;
    
    // Check if this is the last stage of the realm (realm breakthrough)
    if (currentStage >= cultivation.maxStage) {
      this.attemptRealmBreakthrough();
      return;
    }
    
    // Regular stage breakthrough
    const success = this.calculateBreakthroughSuccess(player, 'stage');
    
    setTimeout(() => {
      if (success) {
        gameState.updateCultivation({
          stage: currentStage + 1,
          cultivationPoints: 0 // Reset points for next stage
        });
        
        // Apply stage breakthrough bonuses
        this.applyStageBreakthroughBonuses(currentStage + 1);
        
        gameState.addNotification({
          type: 'success',
          message: `突破成功！${realmData.name} 第 ${currentStage + 1} 层`,
          duration: 5000
        });
      } else {
        // Failure penalty
        gameState.updateCultivation({
          cultivationPoints: Math.floor(cultivation.cultivationPoints * 0.8)
        });
        
        gameState.addNotification({
          type: 'error',
          message: '突破失败，修为受损',
          duration: 5000
        });
      }
      
      this.breakthroughInProgress = false;
    }, 3000); // 3 second breakthrough process
  }

  // Attempt breakthrough to next realm
  attemptRealmBreakthrough() {
    const gameState = useGameStore.getState();
    const { player } = gameState;
    const { cultivation } = player;
    
    const currentRealmData = this.getRealmData(cultivation.realm);
    const nextRealm = currentRealmData.nextRealm;
    
    if (!nextRealm) {
      gameState.addNotification({
        type: 'info',
        message: '已达到最高境界',
        duration: 3000
      });
      this.breakthroughInProgress = false;
      return;
    }
    
    // Check if tribulation is required
    const nextRealmData = this.getRealmData(nextRealm);
    if (nextRealmData.requiresTribulation) {
      this.initiateTribulation(nextRealm);
      return;
    }
    
    // Direct realm breakthrough
    const success = this.calculateBreakthroughSuccess(player, 'realm');
    
    setTimeout(() => {
      if (success) {
        this.advanceToRealm(nextRealm);
      } else {
        gameState.updateCultivation({
          cultivationPoints: Math.floor(cultivation.cultivationPoints * 0.5)
        });
        
        gameState.addNotification({
          type: 'error',
          message: '境界突破失败，修为大损',
          duration: 5000
        });
      }
      
      this.breakthroughInProgress = false;
    }, 5000); // 5 second realm breakthrough process
  }

  // Initiate heavenly tribulation
  initiateTribulation(targetRealm) {
    if (this.tribulationActive) return;
    
    this.tribulationActive = true;
    const gameState = useGameStore.getState();
    
    gameState.addNotification({
      type: 'warning',
      message: '天劫降临！',
      duration: 5000
    });
    
    // TODO: Implement tribulation mini-game
    // For now, simulate tribulation
    setTimeout(() => {
      const success = this.calculateTribulationSuccess();
      
      if (success) {
        this.advanceToRealm(targetRealm);
        gameState.addNotification({
          type: 'success',
          message: '度过天劫，境界突破！',
          duration: 5000
        });
      } else {
        const gameState = useGameStore.getState();
        const { player } = gameState;
        
        // Severe penalty for tribulation failure
        gameState.updateStats({
          health: Math.floor(player.stats.health * 0.1)
        });
        
        gameState.updateCultivation({
          cultivationPoints: Math.floor(player.cultivation.cultivationPoints * 0.3)
        });
        
        gameState.addNotification({
          type: 'error',
          message: '天劫失败，重伤濒死',
          duration: 8000
        });
      }
      
      this.tribulationActive = false;
      this.breakthroughInProgress = false;
    }, 10000); // 10 second tribulation process
  }

  // Advance player to new realm
  advanceToRealm(newRealm) {
    const gameState = useGameStore.getState();
    const newRealmData = this.getRealmData(newRealm);
    
    gameState.updateCultivation({
      realm: newRealm,
      stage: 1,
      maxStage: newRealmData.maxStages,
      cultivationPoints: 0,
      maxSpiritualEnergy: newRealmData.baseSpiritualEnergy
    });
    
    // Apply realm breakthrough bonuses
    this.applyRealmBreakthroughBonuses(newRealm);
    
    gameState.addNotification({
      type: 'success',
      message: `突破至 ${newRealmData.name}！`,
      duration: 8000
    });
  }

  // Calculate breakthrough success rate
  calculateBreakthroughSuccess(player, type) {
    let baseSuccessRate = 0.7; // 70% base success rate
    
    if (type === 'realm') {
      baseSuccessRate = 0.5; // 50% for realm breakthrough
    }
    
    // Spiritual root quality bonus
    const avgSpiritualRoot = Object.values(player.cultivation.spiritualRoots)
      .reduce((sum, val) => sum + val, 0) / 5;
    const spiritualRootBonus = (avgSpiritualRoot - 20) / 100; // -20 to 80 becomes -0.2 to 0.8
    
    // Current technique bonus
    const technique = player.cultivation.currentTechnique;
    const techniqueBonus = technique ? (technique.breakthroughBonus || 0) : 0;
    
    const finalSuccessRate = Math.max(0.1, Math.min(0.95, 
      baseSuccessRate + spiritualRootBonus + techniqueBonus
    ));
    
    return Math.random() < finalSuccessRate;
  }

  // Calculate tribulation success rate
  calculateTribulationSuccess() {
    // Tribulations are harder - base 30% success rate
    const baseSuccessRate = 0.3;
    const gameState = useGameStore.getState();
    const { player } = gameState;
    
    // Health affects tribulation survival
    const healthBonus = (player.stats.health / player.stats.maxHealth) * 0.3;
    
    // Spiritual energy affects tribulation power
    const spiritualEnergyBonus = (player.cultivation.spiritualEnergy / player.cultivation.maxSpiritualEnergy) * 0.2;
    
    const finalSuccessRate = Math.max(0.1, Math.min(0.8,
      baseSuccessRate + healthBonus + spiritualEnergyBonus
    ));
    
    return Math.random() < finalSuccessRate;
  }

  // Apply bonuses for stage breakthrough
  applyStageBreakthroughBonuses(newStage) {
    const gameState = useGameStore.getState();
    const { player } = gameState;
    
    // Base stat increases per stage
    const statIncrease = {
      maxHealth: 10,
      maxMana: 5,
      attack: 2,
      defense: 1,
      maxSpiritualEnergy: 20
    };
    
    gameState.updateStats({
      maxHealth: player.stats.maxHealth + statIncrease.maxHealth,
      health: player.stats.maxHealth + statIncrease.maxHealth, // Full heal
      maxMana: player.stats.maxMana + statIncrease.maxMana,
      mana: player.stats.maxMana + statIncrease.maxMana,
      attack: player.stats.attack + statIncrease.attack,
      defense: player.stats.defense + statIncrease.defense
    });
    
    gameState.updateCultivation({
      maxSpiritualEnergy: player.cultivation.maxSpiritualEnergy + statIncrease.maxSpiritualEnergy,
      spiritualEnergy: player.cultivation.maxSpiritualEnergy + statIncrease.maxSpiritualEnergy
    });
  }

  // Apply bonuses for realm breakthrough
  applyRealmBreakthroughBonuses(newRealm) {
    const gameState = useGameStore.getState();
    const { player } = gameState;
    const realmData = this.getRealmData(newRealm);
    
    if (realmData.bonuses) {
      // Apply stat bonuses
      if (realmData.bonuses.stats) {
        const currentStats = { ...player.stats };
        Object.keys(realmData.bonuses.stats).forEach(stat => {
          currentStats[stat] = (currentStats[stat] || 0) + realmData.bonuses.stats[stat];
        });
        gameState.updateStats(currentStats);
      }
      
      // Unlock new techniques
      if (realmData.bonuses.techniques) {
        const currentTechniques = [...player.cultivation.techniques];
        realmData.bonuses.techniques.forEach(techniqueId => {
          if (!currentTechniques.includes(techniqueId)) {
            currentTechniques.push(techniqueId);
          }
        });
        gameState.updateCultivation({ techniques: currentTechniques });
      }
    }
    
    // Full restore on realm breakthrough
    gameState.updateStats({
      health: player.stats.maxHealth,
      mana: player.stats.maxMana,
      energy: player.stats.maxEnergy
    });
    
    gameState.updateCultivation({
      spiritualEnergy: player.cultivation.maxSpiritualEnergy
    });
  }

  // Learn new technique
  learnTechnique(techniqueId) {
    const gameState = useGameStore.getState();
    const { player } = gameState;
    const technique = this.getTechniqueById(techniqueId);
    
    if (!technique) {
      gameState.addNotification({
        type: 'error',
        message: '功法不存在',
        duration: 3000
      });
      return false;
    }
    
    // Check requirements
    if (!this.checkTechniqueRequirements(technique, player)) {
      gameState.addNotification({
        type: 'warning',
        message: '不满足学习条件',
        duration: 3000
      });
      return false;
    }
    
    // Check if already learned
    if (player.cultivation.techniques.includes(techniqueId)) {
      gameState.addNotification({
        type: 'info',
        message: '已学会此功法',
        duration: 3000
      });
      return false;
    }
    
    // Learn technique
    const newTechniques = [...player.cultivation.techniques, techniqueId];
    gameState.updateCultivation({ techniques: newTechniques });
    
    gameState.addNotification({
      type: 'success',
      message: `学会功法：${technique.name}`,
      duration: 5000
    });
    
    return true;
  }

  // Set current cultivation technique
  setCurrentTechnique(techniqueId) {
    const gameState = useGameStore.getState();
    const { player } = gameState;
    
    if (!player.cultivation.techniques.includes(techniqueId)) {
      gameState.addNotification({
        type: 'warning',
        message: '尚未学会此功法',
        duration: 3000
      });
      return false;
    }
    
    const technique = this.getTechniqueById(techniqueId);
    gameState.updateCultivation({ currentTechnique: technique });
    
    gameState.addNotification({
      type: 'info',
      message: `切换功法：${technique.name}`,
      duration: 3000
    });
    
    return true;
  }

  // Check if player meets technique requirements
  checkTechniqueRequirements(technique, player) {
    // Check realm requirement
    if (technique.requiredRealm) {
      const playerRealmLevel = this.getRealmLevel(player.cultivation.realm);
      const requiredRealmLevel = this.getRealmLevel(technique.requiredRealm);
      
      if (playerRealmLevel < requiredRealmLevel) {
        return false;
      }
    }
    
    // Check stage requirement
    if (technique.requiredStage && player.cultivation.stage < technique.requiredStage) {
      return false;
    }
    
    // Check spiritual root requirements
    if (technique.requiredSpiritualRoots) {
      for (const [element, minValue] of Object.entries(technique.requiredSpiritualRoots)) {
        if ((player.cultivation.spiritualRoots[element] || 0) < minValue) {
          return false;
        }
      }
    }
    
    return true;
  }

  // Get realm level for comparison
  getRealmLevel(realmId) {
    const realmOrder = [
      CULTIVATION_REALMS.QI_GATHERING,
      CULTIVATION_REALMS.FOUNDATION_BUILDING,
      CULTIVATION_REALMS.CORE_FORMATION,
      CULTIVATION_REALMS.NASCENT_SOUL
    ];
    
    return realmOrder.indexOf(realmId) + 1;
  }

  // Get realm data
  getRealmData(realmId) {
    return CULTIVATION_REALMS_DATA[realmId] || CULTIVATION_REALMS_DATA[CULTIVATION_REALMS.QI_GATHERING];
  }

  // Get technique by ID
  getTechniqueById(techniqueId) {
    return CULTIVATION_TECHNIQUES_DATA[techniqueId];
  }

  // Get all available techniques for current realm
  getAvailableTechniques(player) {
    return Object.values(CULTIVATION_TECHNIQUES_DATA).filter(technique => 
      this.checkTechniqueRequirements(technique, player)
    );
  }

  // Consume pill for cultivation boost
  consumePill(pillId) {
    const gameState = useGameStore.getState();
    const { player, inventory } = gameState;
    
    // Find pill in inventory
    const pillItem = inventory.items.find(item => 
      item.type === 'pill' && item.id === pillId
    );
    
    if (!pillItem) {
      gameState.addNotification({
        type: 'warning',
        message: '丹药不存在',
        duration: 3000
      });
      return false;
    }
    
    // Apply pill effects
    if (pillItem.effects) {
      if (pillItem.effects.cultivationPoints) {
        gameState.updateCultivation({
          cultivationPoints: player.cultivation.cultivationPoints + pillItem.effects.cultivationPoints
        });
      }
      
      if (pillItem.effects.spiritualEnergy) {
        gameState.updateCultivation({
          spiritualEnergy: Math.min(
            player.cultivation.maxSpiritualEnergy,
            player.cultivation.spiritualEnergy + pillItem.effects.spiritualEnergy
          )
        });
      }
      
      if (pillItem.effects.stats) {
        const newStats = { ...player.stats };
        Object.keys(pillItem.effects.stats).forEach(stat => {
          newStats[stat] = Math.min(
            newStats[`max${stat.charAt(0).toUpperCase() + stat.slice(1)}`] || newStats[stat] + 1000,
            newStats[stat] + pillItem.effects.stats[stat]
          );
        });
        gameState.updateStats(newStats);
      }
    }
    
    // Remove pill from inventory
    gameState.removeItem(pillItem.id);
    
    gameState.addNotification({
      type: 'success',
      message: `服用 ${pillItem.name}`,
      duration: 3000
    });
    
    return true;
  }

  // Get cultivation progress info
  getCultivationProgress() {
    const gameState = useGameStore.getState();
    const { player } = gameState;
    const { cultivation } = player;
    
    const realmData = this.getRealmData(cultivation.realm);
    const stageData = realmData.stages[cultivation.stage - 1];
    
    return {
      realm: realmData.name,
      stage: cultivation.stage,
      maxStage: cultivation.maxStage,
      cultivationPoints: cultivation.cultivationPoints,
      requiredPoints: stageData ? stageData.requiredPoints : 0,
      progress: stageData ? cultivation.cultivationPoints / stageData.requiredPoints : 0,
      canBreakthrough: stageData ? cultivation.cultivationPoints >= stageData.requiredPoints : false,
      isMaxStage: cultivation.stage >= cultivation.maxStage
    };
  }

  // Clean up when manager is destroyed
  destroy() {
    if (this.cultivationTimer) {
      clearInterval(this.cultivationTimer);
      this.cultivationTimer = null;
    }
  }
}

export default new CultivationManager();