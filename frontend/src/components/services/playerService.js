// frontend/src/services/playerService.js
import apiService from './apiService.js';

class PlayerService {
  async getAllPlayers() {
    try {
      return await apiService.get('/saves');
    } catch (error) {
      console.error('Failed to get players:', error);
      return [];
    }
  }

  async getPlayerById(id) {
    try {
      return await apiService.get(`/saves/${id}`);
    } catch (error) {
      console.error('Failed to get player:', error);
      return null;
    }
  }

  async createPlayer(playerData) {
    try {
      const saveData = {
        playerName: playerData.playerName,
        difficulty: playerData.difficulty,
        cultivation: playerData.cultivation,
        element: playerData.element,
      };
      
      return await apiService.post('/saves', saveData);
    } catch (error) {
      console.error('Failed to create player:', error);
      throw error;
    }
  }

  async updatePlayer(id, updates) {
    try {
      return await apiService.patch(`/saves/${id}`, updates);
    } catch (error) {
      console.error('Failed to update player:', error);
      throw error;
    }
  }

  async deletePlayer(id) {
    try {
      await apiService.delete(`/saves/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete player:', error);
      throw error;
    }
  }

  async addExperience(id, experience) {
    try {
      return await apiService.post(`/saves/${id}/experience`, { experience });
    } catch (error) {
      console.error('Failed to add experience:', error);
      throw error;
    }
  }

  async addGold(id, gold) {
    try {
      return await apiService.post(`/saves/${id}/gold`, { gold });
    } catch (error) {
      console.error('Failed to add gold:', error);
      throw error;
    }
  }

  async unlockStage(id, stageId) {
    try {
      return await apiService.post(`/saves/${id}/unlock-stage`, { stageId });
    } catch (error) {
      console.error('Failed to unlock stage:', error);
      throw error;
    }
  }

  async updateLastPlayed(id) {
    try {
      return await this.updatePlayer(id, {
        lastPlayed: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update last played:', error);
      throw error;
    }
  }

  async updatePlaytime(id, additionalSeconds) {
    try {
      const player = await this.getPlayerById(id);
      if (player) {
        const newPlaytime = (player.playtime || 0) + additionalSeconds;
        return await this.updatePlayer(id, { playtime: newPlaytime });
      }
      return null;
    } catch (error) {
      console.error('Failed to update playtime:', error);
      throw error;
    }
  }
}

export default new PlayerService();