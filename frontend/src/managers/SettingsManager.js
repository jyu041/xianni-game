import useGameStore from './StateManager.js';
import AudioManager from './AudioManager.js';
import LocalizationManager from './LocalizationManager.js';
import { DEFAULT_SETTINGS } from '../utils/gameConstants.js';

class SettingsManager {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.settingsKey = 'xianni-game-settings';
  }

  // Initialize settings
  initialize() {
    this.loadSettings();
    this.applySettings();
    console.log('SettingsManager initialized');
  }

  // Load settings from localStorage
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.settingsKey);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        this.settings = { ...DEFAULT_SETTINGS, ...parsed };
        
        // Update game store
        useGameStore.getState().updateSettings(this.settings);
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
      this.resetToDefaults();
    }
  }

  // Save settings to localStorage
  saveSettings() {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
      console.log('Settings saved');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  // Apply settings to game systems
  applySettings() {
    // Audio settings
    if (AudioManager.isInitialized) {
      AudioManager.musicVolume = this.settings.musicVolume;
      AudioManager.sfxVolume = this.settings.sfxVolume;
      AudioManager.voiceVolume = this.settings.voiceVolume;
      AudioManager.updateAllVolumes();
    }
    
    // Language setting
    LocalizationManager.setLanguage(this.settings.language);
    
    // Graphics settings
    this.applyGraphicsSettings();
    
    // UI settings
    this.applyUISettings();
  }

  // Apply graphics settings
  applyGraphicsSettings() {
    const root = document.documentElement;
    
    switch (this.settings.graphics) {
      case 'low':
        root.style.setProperty('--animation-duration', '0ms');
        root.style.setProperty('--particle-count', '0');
        break;
      case 'medium':
        root.style.setProperty('--animation-duration', '300ms');
        root.style.setProperty('--particle-count', '50');
        break;
      case 'high':
        root.style.setProperty('--animation-duration', '500ms');
        root.style.setProperty('--particle-count', '100');
        break;
      case 'ultra':
        root.style.setProperty('--animation-duration', '800ms');
        root.style.setProperty('--particle-count', '200');
        break;
    }
  }

  // Apply UI settings
  applyUISettings() {
    const gameContainer = document.querySelector('.game-container');
    if (!gameContainer) return;
    
    // Damage numbers
    if (this.settings.showDamageNumbers) {
      gameContainer.classList.add('show-damage-numbers');
    } else {
      gameContainer.classList.remove('show-damage-numbers');
    }
    
    // Notifications
    if (this.settings.showNotifications) {
      gameContainer.classList.add('show-notifications');
    } else {
      gameContainer.classList.remove('show-notifications');
    }
  }

  // Update specific setting
  updateSetting(key, value) {
    if (!(key in DEFAULT_SETTINGS)) {
      console.warn(`Unknown setting: ${key}`);
      return false;
    }
    
    this.settings[key] = value;
    
    // Update game store
    useGameStore.getState().updateSettings({ [key]: value });
    
    // Apply changes immediately
    this.applySettings();
    
    // Save to localStorage
    this.saveSettings();
    
    console.log(`Setting updated: ${key} = ${value}`);
    return true;
  }

  // Update multiple settings
  updateSettings(newSettings) {
    let hasChanges = false;
    
    for (const [key, value] of Object.entries(newSettings)) {
      if (key in DEFAULT_SETTINGS && this.settings[key] !== value) {
        this.settings[key] = value;
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      // Update game store
      useGameStore.getState().updateSettings(newSettings);
      
      // Apply changes
      this.applySettings();
      
      // Save to localStorage
      this.saveSettings();
      
      console.log('Settings updated:', newSettings);
    }
    
    return hasChanges;
  }

  // Get current settings
  getSettings() {
    return { ...this.settings };
  }

  // Get specific setting
  getSetting(key) {
    return this.settings[key];
  }

  // Reset to default settings
  resetToDefaults() {
    this.settings = { ...DEFAULT_SETTINGS };
    
    // Update game store
    useGameStore.getState().updateSettings(this.settings);
    
    // Apply defaults
    this.applySettings();
    
    // Save to localStorage
    this.saveSettings();
    
    console.log('Settings reset to defaults');
    
    // Notify user
    useGameStore.getState().addNotification({
      type: 'info',
      message: '设置已重置为默认值',
      duration: 3000
    });
  }

  // Validate settings object
  validateSettings(settings) {
    const validated = {};
    
    for (const [key, defaultValue] of Object.entries(DEFAULT_SETTINGS)) {
      if (key in settings) {
        const value = settings[key];
        
        // Type validation
        if (typeof value === typeof defaultValue) {
          // Range validation for numbers
          if (typeof value === 'number' && key.includes('Volume')) {
            validated[key] = Math.max(0, Math.min(1, value));
          } else {
            validated[key] = value;
          }
        } else {
          validated[key] = defaultValue;
        }
      } else {
        validated[key] = defaultValue;
      }
    }
    
    return validated;
  }

  // Export settings to file
  exportSettings() {
    const exportData = {
      settings: this.settings,
      exportedAt: new Date().toISOString(),
      gameVersion: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xianni-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    useGameStore.getState().addNotification({
      type: 'success',
      message: '设置已导出',
      duration: 3000
    });
  }

  // Import settings from file
  async importSettings(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          if (importData.settings) {
            const validatedSettings = this.validateSettings(importData.settings);
            this.updateSettings(validatedSettings);
            
            useGameStore.getState().addNotification({
              type: 'success',
              message: '设置已导入',
              duration: 3000
            });
            
            resolve(true);
          } else {
            throw new Error('Invalid settings file format');
          }
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
}

export default new SettingsManager();