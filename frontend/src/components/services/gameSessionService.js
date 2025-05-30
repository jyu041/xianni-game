// frontend/src/services/gameSessionService.js
import apiService from './apiService.js';

class GameSessionService {
  async startGameSession(playerId, stageId) {
    try {
      return await apiService.post('/game-sessions/start', {
        playerId,
        stageId
      });
    } catch (error) {
      console.error('Failed to start game session:', error);
      throw error;
    }
  }

  async endGameSession(sessionId, sessionData) {
    try {
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
    } catch (error) {
      console.error('Failed to end game session:', error);
      throw error;
    }
  }

  async getPlayerSessions(playerId) {
    try {
      return await apiService.get(`/game-sessions/player/${playerId}`);
    } catch (error) {
      console.error('Failed to get player sessions:', error);
      return [];
    }
  }

  async getPlayerCompletedSessions(playerId) {
    try {
      return await apiService.get(`/game-sessions/player/${playerId}/completed`);
    } catch (error) {
      console.error('Failed to get completed sessions:', error);
      return [];
    }
  }

  async getStageLeaderboard(stageId) {
    try {
      return await apiService.get(`/game-sessions/stage/${stageId}/leaderboard`);
    } catch (error) {
      console.error('Failed to get stage leaderboard:', error);
      return [];
    }
  }

  async getSessionById(sessionId) {
    try {
      return await apiService.get(`/game-sessions/${sessionId}`);
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }
}

export default new GameSessionService();