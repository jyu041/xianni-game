import useGameStore from './StateManager.js';
import { WORLD_REGIONS, WEATHER_TYPES, TIME_OF_DAY } from '../utils/gameConstants.js';
import { WORLD_REGIONS_DATA } from '../data/world/regions.js';
import { WORLD_LOCATIONS_DATA } from '../data/world/locations.js';

class WorldManager {
  constructor() {
    this.timeScale = 1; // Real seconds per game hour
    this.weatherTimer = null;
    this.timeTimer = null;
    this.currentGameTime = {
      hour: 6, // Start at dawn
      day: 1,
      month: 1,
      year: 1
    };
  }

  // Initialize world systems
  initialize() {
    this.startTimeSystem();
    this.startWeatherSystem();
    console.log('WorldManager initialized');
  }

  // Start time progression
  startTimeSystem() {
    this.timeTimer = setInterval(() => {
      this.advanceTime();
    }, this.timeScale * 1000); // Convert to milliseconds
  }

  // Start weather system
  startWeatherSystem() {
    this.weatherTimer = setInterval(() => {
      this.updateWeather();
    }, 60000); // Check weather every minute
  }

  // Advance game time
  advanceTime() {
    this.currentGameTime.hour += 1;
    
    if (this.currentGameTime.hour >= 24) {
      this.currentGameTime.hour = 0;
      this.currentGameTime.day += 1;
    }
    
    if (this.currentGameTime.day > 30) {
      this.currentGameTime.day = 1;
      this.currentGameTime.month += 1;
    }
    
    if (this.currentGameTime.month > 12) {
      this.currentGameTime.month = 1;
      this.currentGameTime.year += 1;
    }
    
    // Update time of day
    const timeOfDay = this.getTimeOfDay();
    useGameStore.getState().updateWorld({ timeOfDay });
    
    // Trigger time-based events
    this.checkTimeEvents();
  }

  // Get current time of day
  getTimeOfDay() {
    const hour = this.currentGameTime.hour;
    
    if (hour >= 5 && hour < 7) return TIME_OF_DAY.DAWN;
    if (hour >= 7 && hour < 12) return TIME_OF_DAY.MORNING;
    if (hour >= 12 && hour < 14) return TIME_OF_DAY.NOON;
    if (hour >= 14 && hour < 18) return TIME_OF_DAY.AFTERNOON;
    if (hour >= 18 && hour < 20) return TIME_OF_DAY.DUSK;
    if (hour >= 20 && hour < 23) return TIME_OF_DAY.NIGHT;
    return TIME_OF_DAY.MIDNIGHT;
  }

  // Update weather patterns
  updateWeather() {
    const gameState = useGameStore.getState();
    const currentRegion = gameState.world.currentRegion;
    const regionData = this.getRegionData(currentRegion);
    
    // Calculate weather based on region, season, and random factors
    const newWeather = this.calculateWeather(regionData, gameState.world.weather);
    
    if (newWeather !== gameState.world.weather) {
      gameState.updateWorld({ weather: newWeather });
      
      // Notify player of weather change
      gameState.addNotification({
        type: 'info',
        message: `天气变化: ${this.getWeatherName(newWeather)}`,
        duration: 3000
      });
    }
  }

  // Calculate new weather
  calculateWeather(regionData, currentWeather) {
    const weatherChances = regionData.weatherPatterns || {
      [WEATHER_TYPES.CLEAR]: 0.4,
      [WEATHER_TYPES.CLOUDY]: 0.3,
      [WEATHER_TYPES.RAIN]: 0.2,
      [WEATHER_TYPES.STORM]: 0.1
    };
    
    // Add some persistence to current weather
    if (currentWeather && Math.random() < 0.7) {
      return currentWeather;
    }
    
    const random = Math.random();
    let cumulative = 0;
    
    for (const [weather, chance] of Object.entries(weatherChances)) {
      cumulative += chance;
      if (random <= cumulative) {
        return weather;
      }
    }
    
    return WEATHER_TYPES.CLEAR;
  }

  // Get weather display name
  getWeatherName(weather) {
    const names = {
      [WEATHER_TYPES.CLEAR]: '晴朗',
      [WEATHER_TYPES.CLOUDY]: '多云',
      [WEATHER_TYPES.RAIN]: '下雨',
      [WEATHER_TYPES.STORM]: '暴风雨',
      [WEATHER_TYPES.SNOW]: '下雪',
      [WEATHER_TYPES.FOG]: '大雾',
      [WEATHER_TYPES.SPIRITUAL_STORM]: '灵气风暴'
    };
    return names[weather] || '未知';
  }

  // Check for time-based events
  checkTimeEvents() {
    const hour = this.currentGameTime.hour;
    const gameState = useGameStore.getState();
    
    // Dawn meditation bonus
    if (hour === 6) {
      gameState.addNotification({
        type: 'cultivation',
        message: '黎明时分，适合修炼',
        duration: 5000
      });
    }
    
    // Midnight spiritual energy boost
    if (hour === 0) {
      const player = gameState.player;
      const bonus = Math.floor(player.cultivation.maxSpiritualEnergy * 0.1);
      
      gameState.updateCultivation({
        spiritualEnergy: Math.min(
          player.cultivation.maxSpiritualEnergy,
          player.cultivation.spiritualEnergy + bonus
        )
      });
      
      gameState.addNotification({
        type: 'cultivation',
        message: `子时到来，灵气回复 ${bonus}`,
        duration: 3000
      });
    }
  }

  // Move player to new region
  moveToRegion(regionId, locationId = null) {
    const gameState = useGameStore.getState();
    const regionData = this.getRegionData(regionId);
    
    if (!regionData) {
      console.warn(`Region ${regionId} not found`);
      return false;
    }
    
    // Check if region is discovered
    if (!gameState.world.discoveredRegions.includes(regionId)) {
      gameState.discoverRegion(regionId);
      gameState.addNotification({
        type: 'info',
        message: `发现新区域: ${regionData.name}`,
        duration: 5000
      });
    }
    
    // Update player position
    const newPosition = {
      region: regionId,
      location: locationId || regionData.defaultLocation || null,
      x: 0,
      y: 0
    };
    
    gameState.updatePosition(newPosition);
    gameState.updateWorld({ currentRegion: regionId });
    
    // Trigger region entry events
    this.triggerRegionEvents(regionId);
    
    return true;
  }

  // Trigger events when entering a region
  triggerRegionEvents(regionId) {
    const regionData = this.getRegionData(regionId);
    const gameState = useGameStore.getState();
    
    if (regionData.enterMessage) {
      gameState.addNotification({
        type: 'info',
        message: regionData.enterMessage,
        duration: 5000
      });
    }
    
    // Apply region effects
    if (regionData.effects) {
      // Spiritual energy regeneration bonus/penalty
      if (regionData.effects.spiritualEnergyMod) {
        // This would be applied in the cultivation system
      }
      
      // Danger level affects random encounters
      if (regionData.effects.dangerLevel) {
        // This would be used by encounter system
      }
    }
  }

  // Get region data
  getRegionData(regionId) {
    return WORLD_REGIONS_DATA[regionId];
  }

  // Get location data
  getLocationData(locationId) {
    return WORLD_LOCATIONS_DATA[locationId];
  }

  // Get available regions for player
  getAvailableRegions(player) {
    return Object.values(WORLD_REGIONS_DATA).filter(region => {
      // Check if player meets requirements
      if (region.requirements) {
        if (region.requirements.minRealm) {
          const playerRealmLevel = this.getRealmLevel(player.cultivation.realm);
          const requiredRealmLevel = this.getRealmLevel(region.requirements.minRealm);
          if (playerRealmLevel < requiredRealmLevel) return false;
        }
        
        if (region.requirements.minStage && player.cultivation.stage < region.requirements.minStage) {
          return false;
        }
      }
      
      return true;
    });
  }

  // Get realm level for comparison
  getRealmLevel(realmId) {
    const realmOrder = [
      'qi_gathering',
      'foundation_building', 
      'core_formation',
      'nascent_soul'
    ];
    return realmOrder.indexOf(realmId) + 1;
  }

  // Get current game time formatted
  getFormattedTime() {
    const { hour, day, month, year } = this.currentGameTime;
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      date: `${year}年${month}月${day}日`,
      timeOfDay: this.getTimeOfDay()
    };
  }

  // Cleanup
  cleanup() {
    if (this.timeTimer) {
      clearInterval(this.timeTimer);
      this.timeTimer = null;
    }
    
    if (this.weatherTimer) {
      clearInterval(this.weatherTimer);
      this.weatherTimer = null;
    }
    
    console.log('WorldManager cleaned up');
  }
}

export default new WorldManager();