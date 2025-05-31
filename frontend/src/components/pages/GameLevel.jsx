// frontend/src/components/pages/GameLevel.jsx
import { useState, useEffect, useRef } from "react";
import Phaser from "phaser";
import GameLevelHeader from "../game/GameLevelHeader";
import GameScene from "../game/GameScene";
import playerService from "../services/playerService";
import styles from "./GameLevel.module.css";

const GameLevel = ({ stageData, playerData, onGameEnd }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const gameStartTime = useRef(Date.now());

  const [gameState, setGameState] = useState({
    player: { x: 400, y: 300, health: 100, maxHealth: 100, speed: 5 },
    enemies: [],
    projectiles: [],
    experience: 0,
    score: 0,
    time: 0,
    isPaused: false,
    isGameOver: false,
  });

  // Global game state reference for Phaser
  let gameStateRef = gameState;

  // Create Phaser game
  const createPhaserGame = () => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight - 80,
      parent: gameRef.current,
      backgroundColor: "#001122",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: GameScene,
    };

    const game = new Phaser.Game(config);

    // Pass data to scene
    game.scene.start("GameScene", {
      gameStateRef: gameStateRef,
      updateGameState: setGameState,
    });

    return game;
  };

  // Game management
  const endGame = async (reason) => {
    const survivalTime = Math.floor(
      (Date.now() - gameStartTime.current) / 1000
    );
    const goldReward = Math.floor(gameState.score / 10);
    const expReward = gameState.experience;

    try {
      await playerService.updatePlaytime(playerData.id, survivalTime);

      if (reason === "completed") {
        await playerService.completeStage(
          playerData.id,
          stageData.stageId,
          gameState.score,
          expReward,
          goldReward
        );
      } else {
        await playerService.addExperience(
          playerData.id,
          Math.floor(expReward * 0.5)
        );
        await playerService.addGold(
          playerData.id,
          Math.floor(goldReward * 0.5)
        );
      }

      await playerService.updateLastPlayed(playerData.id);
    } catch (error) {
      console.error("Failed to update player data:", error);
    }

    onGameEnd(reason, gameState.score);
  };

  const pauseGame = () => {
    const newState = { ...gameState, isPaused: !gameState.isPaused };
    setGameState(newState);
    gameStateRef = newState;

    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene("GameScene");
      if (scene) {
        if (newState.isPaused) {
          scene.scene.pause();
        } else {
          scene.scene.resume();
        }
      }
    }
  };

  const quitGame = () => {
    endGame("quit");
  };

  // Update global reference when state changes
  useEffect(() => {
    gameStateRef = gameState;
  }, [gameState]);

  // Initialize Phaser
  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      console.log("Initializing Phaser game...");
      phaserGameRef.current = createPhaserGame();
    }

    return () => {
      if (phaserGameRef.current) {
        console.log("Destroying Phaser game...");
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  // Handle game over
  useEffect(() => {
    if (gameState.isGameOver) {
      const reason = gameState.completed ? "completed" : "died";
      setTimeout(() => endGame(reason), 1000); // Small delay to show final state
    }
  }, [gameState.isGameOver]);

  if (gameState.isGameOver) {
    const isCompleted = gameState.completed;
    return (
      <div className={styles.gameOver}>
        <div className={styles.gameOverContent}>
          <h2>{isCompleted ? "修炼成功！" : "渡劫失败"}</h2>
          <p>最终得分: {gameState.score}</p>
          <p>存活时间: {Math.floor(gameState.time)}秒</p>
          <p>击杀敌人: {Math.floor(gameState.score / 10)}</p>
          <p>获得经验: {gameState.experience}</p>
          {isCompleted && <p>🎉 恭喜通关！下一关卡已解锁！</p>}
          <button
            onClick={() =>
              onGameEnd(isCompleted ? "completed" : "died", gameState.score)
            }
          >
            返回关卡选择
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameLevel}>
      <GameLevelHeader
        playerData={playerData}
        gameState={gameState}
        onPause={pauseGame}
        onQuit={quitGame}
        isPaused={gameState.isPaused}
      />

      <div ref={gameRef} className={styles.gameCanvas} />

      {gameState.isPaused && (
        <div className={styles.pauseOverlay}>
          <div className={styles.pauseMenu}>
            <h3>修炼暂停</h3>
            <p>当前境界: {playerData.level}级</p>
            <p>当前得分: {gameState.score}</p>
            <p>存活时间: {Math.floor(gameState.time)}秒</p>
            <div className={styles.pauseActions}>
              <button onClick={pauseGame}>继续修炼</button>
              <button onClick={quitGame}>结束修炼</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLevel;
