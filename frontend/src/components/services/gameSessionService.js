// frontend/src/services/gameSessionService.js
import apiService from './apiService.js';

class GameSessionService {
  async startGameSession(playerId, stageId) {
    return await apiService.post('/game-sessions/start', {
      playerId,
      stageId
    });
  }

  async endGameSession(sessionId, sessionData) {
    const {
      scoreAchieved = 0,
      endReason = 'completed',
      stats = {}
    } = sessionData;

    return await apiService.post(`/game-sessions/${sessionId}/end`, {
      scoreAchieved,
      endReason,
      stats
    });
  }

  async getPlayerSessions(playerId) {
    return await apiService.get(`/game-sessions/player/${playerId}`);
  }

  async getPlayerCompletedSessions(playerId) {
    return await apiService.get(`/game-sessions/player/${playerId}/completed`);
  }

  async getStageLeaderboard(stageId) {
    return await apiService.get(`/game-sessions/stage/${stageId}/leaderboard`);
  }

  async getSessionById(sessionId) {
    return await apiService.get(`/game-sessions/${sessionId}`);
  }
}

export default new GameSessionService();