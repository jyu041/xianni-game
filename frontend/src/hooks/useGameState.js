import { useEffect } from 'react';
import useGameStore from '../managers/StateManager.js';
import CultivationManager from '../managers/CultivationManager.js';
import WorldManager from '../managers/WorldManager.js';
import AudioManager from '../managers/AudioManager.js';

export const useGameState = () => {
  const gameState = useGameStore();

  // Initialize managers when game starts
  useEffect(() => {
    if (gameState.gameState === 'playing') {
      CultivationManager.initialize?.();
      WorldManager.initialize?.();
      AudioManager.setMusicForState('playing');
    }
  }, [gameState.gameState]);

  // Auto-regeneration effects
  useEffect(() => {
    if (gameState.gameState !== 'playing' || gameState.isPaused) return;

    const regenInterval = setInterval(() => {
      const { player } = gameState;
      
      // Health regeneration
      if (player.stats.health < player.stats.maxHealth) {
        const healthRegen = player.stats.maxHealth * 0.01; // 1% per second
        gameState.updateStats({
          health: Math.min(player.stats.maxHealth, player.stats.health + healthRegen)
        });
      }

      // Mana regeneration
      if (player.stats.mana < player.stats.maxMana) {
        const manaRegen = player.stats.maxMana * 0.02; // 2% per second
        gameState.updateStats({
          mana: Math.min(player.stats.maxMana, player.stats.mana + manaRegen)
        });
      }

      // Energy regeneration
      if (player.stats.energy < player.stats.maxEnergy) {
        const energyRegen = player.stats.maxEnergy * 0.05; // 5% per second
        gameState.updateStats({
          energy: Math.min(player.stats.maxEnergy, player.stats.energy + energyRegen)
        });
      }

      // Spiritual energy regeneration
      if (player.cultivation.spiritualEnergy < player.cultivation.maxSpiritualEnergy) {
        const spiritualRegen = player.cultivation.maxSpiritualEnergy * 0.001; // 0.1% per second
        gameState.updateCultivation({
          spiritualEnergy: Math.min(
            player.cultivation.maxSpiritualEnergy, 
            player.cultivation.spiritualEnergy + spiritualRegen
          )
        });
      }
    }, 1000);

    return () => clearInterval(regenInterval);
  }, [gameState.gameState, gameState.isPaused]);

  return gameState;
};