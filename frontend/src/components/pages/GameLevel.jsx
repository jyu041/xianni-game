// frontend/src/components/pages/GameLevel.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import GameLevelHeader from "../game/GameLevelHeader";
import playerService from "../services/playerService";
import styles from "./GameLevel.module.css";

const GameLevel = ({ stageData, playerData, onGameEnd }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastFireTime = useRef(0);
  const keys = useRef({});
  const gameStateRef = useRef();
  const gameStartTime = useRef(Date.now());

  const [gameState, setGameState] = useState({
    player: {
      x: 400,
      y: 300,
      health: 100,
      maxHealth: 100,
      speed: 5,
    },
    enemies: [],
    projectiles: [],
    experience: 0,
    score: 0,
    time: 0,
    isPaused: false,
    isGameOver: false,
  });

  // Keep a ref to current game state for game loop
  gameStateRef.current = gameState;

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      keys.current[key] = true;
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(key)
      ) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      keys.current[key] = false;
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(key)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Canvas setup and game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 80;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Game loop
    const gameLoop = () => {
      const currentState = gameStateRef.current;

      if (currentState.isPaused || currentState.isGameOver) {
        return;
      }

      // Create new state object
      let newState = { ...currentState };

      // Update player position
      const player = { ...newState.player };
      if (keys.current["w"] || keys.current["arrowup"]) {
        player.y = Math.max(25, player.y - player.speed);
      }
      if (keys.current["s"] || keys.current["arrowdown"]) {
        player.y = Math.min(canvas.height - 25, player.y + player.speed);
      }
      if (keys.current["a"] || keys.current["arrowleft"]) {
        player.x = Math.max(25, player.x - player.speed);
      }
      if (keys.current["d"] || keys.current["arrowright"]) {
        player.x = Math.min(canvas.width - 25, player.x + player.speed);
      }
      newState.player = player;

      // Update enemies
      newState.enemies = newState.enemies.map((enemy) => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          return {
            ...enemy,
            x: enemy.x + (dx / distance) * enemy.speed,
            y: enemy.y + (dy / distance) * enemy.speed,
          };
        }
        return enemy;
      });

      // Update projectiles
      newState.projectiles = newState.projectiles
        .map((projectile) => ({
          ...projectile,
          x: projectile.x + projectile.vx,
          y: projectile.y + projectile.vy,
        }))
        .filter(
          (projectile) =>
            projectile.x >= -50 &&
            projectile.x <= canvas.width + 50 &&
            projectile.y >= -50 &&
            projectile.y <= canvas.height + 50
        );

      // Spawn enemies
      const spawnRate = Math.min(0.08, 0.02 + newState.time * 0.001);
      const maxEnemies = Math.min(30, 10 + Math.floor(newState.time / 10));

      if (newState.enemies.length < maxEnemies && Math.random() < spawnRate) {
        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch (side) {
          case 0: // Top
            x = Math.random() * canvas.width;
            y = -30;
            break;
          case 1: // Right
            x = canvas.width + 30;
            y = Math.random() * canvas.height;
            break;
          case 2: // Bottom
            x = Math.random() * canvas.width;
            y = canvas.height + 30;
            break;
          default: // Left
            x = -30;
            y = Math.random() * canvas.height;
            break;
        }

        const enemyTypes = [
          { health: 50, speed: 1.5, size: 15, color: "#ff4444" },
          { health: 75, speed: 1.0, size: 18, color: "#ff8844" },
          { health: 100, speed: 0.8, size: 20, color: "#ff44aa" },
        ];

        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

        const newEnemy = {
          id: Date.now() + Math.random(),
          x,
          y,
          health: type.health,
          maxHealth: type.health,
          speed: type.speed + Math.random() * 0.5,
          size: type.size,
          color: type.color,
        };

        newState.enemies.push(newEnemy);
      }

      // Auto fire
      const now = Date.now();
      if (now - lastFireTime.current > 300 && newState.enemies.length > 0) {
        const nearestEnemy = newState.enemies.reduce(
          (nearest, enemy) => {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < nearest.distance ? { enemy, distance } : nearest;
          },
          { enemy: null, distance: Infinity }
        );

        if (nearestEnemy.enemy) {
          const dx = nearestEnemy.enemy.x - player.x;
          const dy = nearestEnemy.enemy.y - player.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const projectile = {
            id: Date.now() + Math.random(),
            x: player.x,
            y: player.y,
            vx: (dx / distance) * 8,
            vy: (dy / distance) * 8,
            size: 5,
          };

          newState.projectiles.push(projectile);
          lastFireTime.current = now;
        }
      }

      // Check collisions
      let scoreGained = 0;
      let expGained = 0;

      // Projectile-Enemy collisions
      for (
        let pIndex = newState.projectiles.length - 1;
        pIndex >= 0;
        pIndex--
      ) {
        const projectile = newState.projectiles[pIndex];

        for (let eIndex = newState.enemies.length - 1; eIndex >= 0; eIndex--) {
          const enemy = newState.enemies[eIndex];
          const dx = projectile.x - enemy.x;
          const dy = projectile.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < enemy.size + projectile.size) {
            // Hit enemy
            newState.enemies[eIndex] = {
              ...enemy,
              health: enemy.health - 25,
            };
            newState.projectiles.splice(pIndex, 1);

            if (newState.enemies[eIndex].health <= 0) {
              scoreGained += 10;
              expGained += 5;
              newState.enemies.splice(eIndex, 1);
            }
            break;
          }
        }
      }

      // Player-Enemy collisions
      newState.enemies.forEach((enemy) => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemy.size + 15) {
          newState.player.health = Math.max(0, newState.player.health - 0.5);
          if (newState.player.health <= 0) {
            newState.isGameOver = true;
          }
        }
      });

      // Update score and experience
      newState.score += scoreGained;
      newState.experience += expGained;

      // Update time
      newState.time = newState.time + 1 / 60;

      // Check for stage completion (survival for 5 minutes)
      if (newState.time >= 300 && !newState.isGameOver) {
        newState.isGameOver = true;
        newState.completed = true;
      }

      // Render
      render(ctx, newState, canvas);

      // Update state
      setGameState(newState);
    };

    gameLoopRef.current = setInterval(gameLoop, 1000 / 60);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const render = (ctx, state, canvas) => {
    // Clear canvas
    ctx.fillStyle = "#001122";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.save();
    ctx.fillStyle = "#00ff88";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw player inner glow
    ctx.fillStyle = "#88ffaa";
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw enemies
    state.enemies.forEach((enemy) => {
      ctx.save();

      // Enemy body
      ctx.fillStyle = enemy.color || "#ff4444";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Enemy health bar (if damaged)
      if (enemy.health < enemy.maxHealth) {
        const barWidth = enemy.size * 2;
        const barHeight = 4;
        const barX = enemy.x - barWidth / 2;
        const barY = enemy.y - enemy.size - 10;

        // Background
        ctx.fillStyle = "#660000";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(
          barX,
          barY,
          (enemy.health / enemy.maxHealth) * barWidth,
          barHeight
        );
      }

      ctx.restore();
    });

    // Draw projectiles
    state.projectiles.forEach((projectile) => {
      ctx.save();
      ctx.fillStyle = "#ffff00";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Projectile glow effect
      ctx.shadowColor = "#ffff00";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.size - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  const endGame = async (reason) => {
    const survivalTime = Math.floor(
      (Date.now() - gameStartTime.current) / 1000
    );

    // Calculate rewards
    const goldReward = Math.floor(gameState.score / 10);
    const expReward = gameState.experience;

    try {
      // Update playtime
      await playerService.updatePlaytime(playerData.id, survivalTime);

      if (reason === "completed") {
        // Stage completed - give full rewards and unlock next stage
        await playerService.completeStage(
          playerData.id,
          stageData.stageId,
          gameState.score,
          expReward,
          goldReward
        );
      } else {
        // Stage failed - give partial rewards
        await playerService.addExperience(
          playerData.id,
          Math.floor(expReward * 0.5)
        );
        await playerService.addGold(
          playerData.id,
          Math.floor(goldReward * 0.5)
        );
      }

      // Update last played
      await playerService.updateLastPlayed(playerData.id);
    } catch (error) {
      console.error("Failed to update player data:", error);
    }

    onGameEnd(reason, gameState.score);
  };

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const quitGame = () => {
    endGame("quit");
  };

  // Handle game over
  useEffect(() => {
    if (gameState.isGameOver) {
      const reason = gameState.completed ? "completed" : "died";
      endGame(reason);
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

      <canvas ref={canvasRef} className={styles.gameCanvas} />

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
