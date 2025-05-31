// frontend/src/services/stageService.js
import apiService from './apiService.js';

class StageService {
  async getAllStages() {
    return await apiService.get('/stages');
  }

  async getStageById(stageId) {
    return await apiService.get(`/stages/${stageId}`);
  }

  async createStage(stageConfig) {
    return await apiService.post('/stages', stageConfig);
  }

  async updateStage(stageId, stageConfig) {
    return await apiService.put(`/stages/${stageId}`, stageConfig);
  }
}

export default new StageService();