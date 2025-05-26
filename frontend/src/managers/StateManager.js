/**
 * StateManager
 * Game state management using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GAME_STATES, CULTIVATION_REALMS } from '../utils/gameConstants.js';

const useGameStore = create(
  persist(
    (set, get) => ({
      // Game State
      gameState: GAME_STATES.HOME,
      currentScreen: 'home',
      isPaused: false,
      isLoading: false,
      
      // Player Data
      player: {
        name: '王林',
        level: 1,
        experience: 0,
        experienceToNext: 100,
        
        // Cultivation Data
        cultivation: {
          realm: CULTIVATION_REALMS.QI_GATHERING,
          stage: 1,
          maxStage: 12,
          cultivationPoints: 0,
          spiritualEnergy: 100,
          maxSpiritualEnergy: 100,
          
          // Spiritual Roots
          spiritualRoots: {
            fire: 30,
            water: 25,
            wood: 40,
            metal: 20,
            earth: 35
          },
          
          // Techniques
          techniques: [],
          currentTechnique: null
        },
        
        // Stats
        stats: {
          health: 100,
          maxHealth: 100,
          mana: 50,
          maxMana: 50,
          energy: 100,
          maxEnergy: 100,
          attack: 10,
          defense: 5,
          speed: 8
        },
        
        // Position
        position: {
          region: 'starting_village',
          x: 0,
          y: 0
        }
      },
      
      // Inventory
      inventory: {
        items: [],
        maxSlots: 30,
        equipment: {
          weapon: null,
          armor: null,
          accessory: null,
          treasure: null
        }
      },
      
      // Sect Data
      sect: {
        currentSect: null,
        reputation: {},
        missions: [],
        relationships: {}
      },
      
      // World State
      world: {
        discoveredRegions: ['starting_village'],
        currentRegion: 'starting_village',
        timeOfDay: 'day',
        weather: 'clear',
        events: []
      },
      
      // UI State
      ui: {
        activeMenu: null,
        showInventory: false,
        showCultivation: false,
        showSect: false,
        showAlchemy: false,
        notifications: []
      },
      
      // Settings
      settings: {
        language: 'zh-CN',
        musicVolume: 0.8,
        sfxVolume: 0.8,
        voiceVolume: 0.8,
        graphics: 'medium',
        autoSave: true
      },
      
      // Actions
      setGameState: (state) => set({ gameState: state }),
      
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Player Actions
      updatePlayer: (updates) => set((state) => ({
        player: { ...state.player, ...updates }
      })),
      
      updateCultivation: (updates) => set((state) => ({
        player: {
          ...state.player,
          cultivation: { ...state.player.cultivation, ...updates }
        }
      })),
      
      updateStats: (updates) => set((state) => ({
        player: {
          ...state.player,
          stats: { ...state.player.stats, ...updates }
        }
      })),
      
      updatePosition: (position) => set((state) => ({
        player: {
          ...state.player,
          position: { ...state.player.position, ...position }
        }
      })),
      
      // Inventory Actions
      addItem: (item) => set((state) => {
        if (state.inventory.items.length >= state.inventory.maxSlots) {
          return state; // Inventory full
        }
        return {
          inventory: {
            ...state.inventory,
            items: [...state.inventory.items, { ...item, id: Date.now() }]
          }
        };
      }),
      
      removeItem: (itemId) => set((state) => ({
        inventory: {
          ...state.inventory,
          items: state.inventory.items.filter(item => item.id !== itemId)
        }
      })),
      
      equipItem: (item, slot) => set((state) => ({
        inventory: {
          ...state.inventory,
          equipment: {
            ...state.inventory.equipment,
            [slot]: item
          }
        }
      })),
      
      // UI Actions
      setActiveMenu: (menu) => set((state) => ({
        ui: { ...state.ui, activeMenu: menu }
      })),
      
      toggleInventory: () => set((state) => ({
        ui: { ...state.ui, showInventory: !state.ui.showInventory }
      })),
      
      toggleCultivation: () => set((state) => ({
        ui: { ...state.ui, showCultivation: !state.ui.showCultivation }
      })),
      
      toggleSect: () => set((state) => ({
        ui: { ...state.ui, showSect: !state.ui.showSect }
      })),
      
      toggleAlchemy: () => set((state) => ({
        ui: { ...state.ui, showAlchemy: !state.ui.showAlchemy }
      })),
      
      addNotification: (notification) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, {
            id: Date.now(),
            ...notification,
            timestamp: Date.now()
          }]
        }
      })),
      
      removeNotification: (id) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== id)
        }
      })),
      
      // Settings Actions
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      // World Actions
      updateWorld: (updates) => set((state) => ({
        world: { ...state.world, ...updates }
      })),
      
      discoverRegion: (region) => set((state) => ({
        world: {
          ...state.world,
          discoveredRegions: state.world.discoveredRegions.includes(region)
            ? state.world.discoveredRegions
            : [...state.world.discoveredRegions, region]
        }
      })),
      
      // Sect Actions
      updateSect: (updates) => set((state) => ({
        sect: { ...state.sect, ...updates }
      })),
      
      updateReputation: (sectId, change) => set((state) => ({
        sect: {
          ...state.sect,
          reputation: {
            ...state.sect.reputation,
            [sectId]: (state.sect.reputation[sectId] || 0) + change
          }
        }
      })),
      
      // Reset function for new game
      resetGame: () => set((state) => {
        const initialState = get();
        return {
          ...initialState,
          gameState: GAME_STATES.PLAYING,
          player: {
            ...initialState.player,
            name: '王林'
          }
        };
      })
    }),
    {
      name: 'xianni-game-state',
      version: 1
    }
  )
);

export default useGameStore;