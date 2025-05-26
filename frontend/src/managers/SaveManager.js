/**
 * SaveManager
 * Save/Load system with multiple slots
 */

import useGameStore from './StateManager.js';

class SaveManager {
  constructor() {
    this.maxSlots = 5;
    this.saveKeyPrefix = 'xianni-save-slot-';
    this.metadataKey = 'xianni-save-metadata';
  }

  // Get all save slots with metadata
  getAllSaves() {
    const saves = [];
    for (let i = 1; i <= this.maxSlots; i++) {
      const save = this.loadSlot(i);
      saves.push({
        slot: i,
        exists: !!save,
        data: save,
        metadata: save ? this.getSaveMetadata(save) : null
      });
    }
    return saves;
  }

  // Get save metadata for display
  getSaveMetadata(saveData) {
    if (!saveData || !saveData.state) return null;
    
    const { player, world } = saveData.state;
    return {
      playerName: player?.name || '未知修士',
      level: player?.level || 1,
      realm: player?.cultivation?.realm || 'qi_gathering',
      stage: player?.cultivation?.stage || 1,
      region: world?.currentRegion || 'unknown',
      playTime: saveData.playTime || 0,
      timestamp: saveData.timestamp || Date.now(),
      version: saveData.version || '1.0.0'
    };
  }

  // Save game to specific slot
  saveToSlot(slot, additionalData = {}) {
    if (slot < 1 || slot > this.maxSlots) {
      throw new Error(`Invalid save slot: ${slot}. Must be between 1 and ${this.maxSlots}`);
    }

    try {
      const gameState = useGameStore.getState();
      
      const saveData = {
        version: '1.0.0',
        timestamp: Date.now(),
        playTime: this.calculatePlayTime(),
        state: {
          player: gameState.player,
          inventory: gameState.inventory,
          sect: gameState.sect,
          world: gameState.world,
          settings: gameState.settings
        },
        metadata: {
          slot,
          playerName: gameState.player?.name || '未知修士',
          level: gameState.player?.level || 1,
          realm: gameState.player?.cultivation?.realm || 'qi_gathering'
        },
        ...additionalData
      };

      const saveKey = this.saveKeyPrefix + slot;
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      
      // Update save metadata index
      this.updateSaveMetadata(slot, saveData);
      
      console.log(`Game saved to slot ${slot}`);
      
      // Add notification
      useGameStore.getState().addNotification({
        type: 'success',
        message: `游戏已保存到槽位 ${slot}`,
        duration: 3000
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to save to slot ${slot}:`, error);
      
      useGameStore.getState().addNotification({
        type: 'error',
        message: `保存失败: ${error.message}`,
        duration: 5000
      });
      
      return false;
    }
  }

  // Load game from specific slot
  loadFromSlot(slot) {
    if (slot < 1 || slot > this.maxSlots) {
      throw new Error(`Invalid save slot: ${slot}. Must be between 1 and ${this.maxSlots}`);
    }

    try {
      const saveData = this.loadSlot(slot);
      
      if (!saveData) {
        throw new Error(`No save data found in slot ${slot}`);
      }

      // Validate save data
      if (!this.validateSaveData(saveData)) {
        throw new Error('Save data is corrupted or invalid');
      }

      // Load state into game
      const gameStore = useGameStore.getState();
      
      // Update game state with saved data
      if (saveData.state.player) {
        gameStore.updatePlayer(saveData.state.player);
      }
      
      if (saveData.state.inventory) {
        gameStore.inventory = saveData.state.inventory;
      }
      
      if (saveData.state.sect) {
        gameStore.updateSect(saveData.state.sect);
      }
      
      if (saveData.state.world) {
        gameStore.updateWorld(saveData.state.world);
      }
      
      if (saveData.state.settings) {
        gameStore.updateSettings(saveData.state.settings);
      }

      console.log(`Game loaded from slot ${slot}`);
      
      useGameStore.getState().addNotification({
        type: 'success',
        message: `已从槽位 ${slot} 加载游戏`,
        duration: 3000
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to load from slot ${slot}:`, error);
      
      useGameStore.getState().addNotification({
        type: 'error',
        message: `加载失败: ${error.message}`,
        duration: 5000
      });
      
      return false;
    }
  }

  // Load raw save data from slot
  loadSlot(slot) {
    try {
      const saveKey = this.saveKeyPrefix + slot;
      const saveData = localStorage.getItem(saveKey);
      return saveData ? JSON.parse(saveData) : null;
    } catch (error) {
      console.error(`Failed to load slot ${slot}:`, error);
      return null;
    }
  }

  // Delete save from specific slot
  deleteSlot(slot) {
    if (slot < 1 || slot > this.maxSlots) {
      throw new Error(`Invalid save slot: ${slot}`);
    }

    try {
      const saveKey = this.saveKeyPrefix + slot;
      localStorage.removeItem(saveKey);
      
      // Remove from metadata
      this.removeSaveMetadata(slot);
      
      console.log(`Save slot ${slot} deleted`);
      
      useGameStore.getState().addNotification({
        type: 'info',
        message: `槽位 ${slot} 已删除`,
        duration: 3000
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to delete slot ${slot}:`, error);
      return false;
    }
  }

  // Auto save to specific slot (usually slot 1)
  autoSave() {
    const settings = useGameStore.getState().settings;
    if (!settings.autoSave) return false;
    
    return this.saveToSlot(1, { isAutoSave: true });
  }

  // Export save data as JSON file
  exportSave(slot) {
    const saveData = this.loadSlot(slot);
    if (!saveData) {
      throw new Error(`No save data in slot ${slot}`);
    }

    const exportData = {
      ...saveData,
      exportedAt: Date.now(),
      gameVersion: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xianni-save-slot-${slot}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    useGameStore.getState().addNotification({
      type: 'success',
      message: `存档已导出`,
      duration: 3000
    });
  }

  // Import save data from JSON file
  async importSave(file, targetSlot) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          // Validate imported data
          if (!this.validateSaveData(importData)) {
            throw new Error('Invalid save file format');
          }

          // Save to target slot
          const saveKey = this.saveKeyPrefix + targetSlot;
          localStorage.setItem(saveKey, JSON.stringify(importData));
          
          this.updateSaveMetadata(targetSlot, importData);
          
          useGameStore.getState().addNotification({
            type: 'success',
            message: `存档已导入到槽位 ${targetSlot}`,
            duration: 3000
          });
          
          resolve(true);
        } catch (error) {
          useGameStore.getState().addNotification({
            type: 'error',
            message: `导入失败: ${error.message}`,
            duration: 5000
          });
          
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  // Validate save data structure
  validateSaveData(saveData) {
    if (!saveData || typeof saveData !== 'object') return false;
    if (!saveData.state || typeof saveData.state !== 'object') return false;
    if (!saveData.timestamp || typeof saveData.timestamp !== 'number') return false;
    
    // Check required state properties
    const requiredProps = ['player', 'inventory', 'world'];
    for (const prop of requiredProps) {
      if (!saveData.state[prop]) return false;
    }
    
    return true;
  }

  // Update save metadata index
  updateSaveMetadata(slot, saveData) {
    try {
      const metadata = JSON.parse(localStorage.getItem(this.metadataKey) || '{}');
      metadata[slot] = this.getSaveMetadata(saveData);
      localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to update save metadata:', error);
    }
  }

  // Remove save metadata
  removeSaveMetadata(slot) {
    try {
      const metadata = JSON.parse(localStorage.getItem(this.metadataKey) || '{}');
      delete metadata[slot];
      localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to remove save metadata:', error);
    }
  }

  // Calculate total play time (placeholder)
  calculatePlayTime() {
    // This would be calculated based on actual game session tracking
    // For now, return a placeholder
    return Date.now() - (Date.now() - 3600000); // 1 hour placeholder
  }

  // Get quick save slot (slot 1 by default)
  quickSave() {
    return this.saveToSlot(1, { isQuickSave: true });
  }

  // Quick load from slot 1
  quickLoad() {
    return this.loadFromSlot(1);
  }

  // Check if slot has save data
  hasSlot(slot) {
    return !!this.loadSlot(slot);
  }

  // Get save slots usage info
  getSlotsInfo() {
    return {
      maxSlots: this.maxSlots,
      usedSlots: this.getAllSaves().filter(save => save.exists).length,
      emptySlots: this.getAllSaves().filter(save => !save.exists).length
    };
  }
}

export default new SaveManager();