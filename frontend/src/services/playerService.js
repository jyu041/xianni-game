// frontend/src/services/playerService.js
import apiService from './apiService.js';

class PlayerService {
  async getAllPlayers() {
    return await apiService.get('/saves');
  }

  async getPlayerById(id) {
    return await apiService.get(`/saves/${id}`);
  }

  async createPlayer(playerData) {
    const saveData = {
      playerName: playerData.playerName,
      difficulty: playerData.difficulty,
      cultivation: playerData.cultivation,
      element: playerData.element,
    };
    
    return await apiService.post('/saves', saveData);
  }

  async updatePlayer(id, updates) {
    return await apiService.patch(`/saves/${id}`, updates);
  }

  async deletePlayer(id) {
    await apiService.delete(`/saves/${id}`);
    return true;
  }

  async addExperience(id, experience) {
    return await apiService.post(`/saves/${id}/experience`, { experience });
  }

  async addGold(id, gold) {
    return await apiService.post(`/saves/${id}/gold`, { gold });
  }

  async addGems(id, gems) {
    return await apiService.post(`/saves/${id}/gems`, { gems });
  }

  async unlockStage(id, stageId) {
    return await apiService.post(`/saves/${id}/unlock-stage`, { stageId });
  }

  async completeStage(id, stageId, score, experience, gold) {
    return await apiService.post(`/saves/${id}/complete-stage`, { 
      stageId, 
      score, 
      experience, 
      gold 
    });
  }

  async updateLastPlayed(id) {
    return await this.updatePlayer(id, {
      lastPlayed: new Date().toISOString()
    });
  }

  async updatePlaytime(id, additionalSeconds) {
    const player = await this.getPlayerById(id);
    if (player) {
      const newPlaytime = (player.playtime || 0) + additionalSeconds;
      return await this.updatePlayer(id, { playtime: newPlaytime });
    }
    return null;
  }
}

export default new PlayerService();