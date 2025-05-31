// frontend/src/components/pages/GameLevel.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import GameLevelHeader from "../game/GameLevelHeader";
import gameSessionService from "../services/gameSessionService";
import styles from "./GameLevel.module.css";

const GameLevel = ({ stageData, playerData, onGameEnd }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastFireTime = useRef(0);
  const [gameState, setGameState] = useState({
    player: {
      x: 400,
      y: 300,
      health: 100,
      maxHealth: 100,
      speed: 5,
      experience: 0,
      level: 1,
    },
    enemies: [],
    projectiles: [],
    experience: 0,
    score: 0,
    time: 0,
    gameSession: null,
    isPaused: false,
    isGameOver: false,
  });

  const keys = useRef({});

  // Initialize game session
  useEffect(() => {
    const initGame = async () => {
      try {
        const session = await gameSessionService.startGameSession(
          playerData.id,
          stageData.stageId
        );
        setGameState((prev) => ({ ...prev, gameSession: session }));
      } catch (error) {
        console.error("Failed to start game session:", error);
      }
    };

    initGame();
  }, [playerData.id, stageData.stageId]);

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Set canvas size to fill the screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 80; // Account for header height
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gameLoop = () => {
      if (gameState.isPaused || gameState.isGameOver) return;

      // Clear canvas
      ctx.fillStyle = "#001122";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update game state
      updatePlayer(canvas);
      updateEnemies();
      updateProjectiles(canvas);
      spawnEnemies(canvas);
      autoFire();

      // Check collisions
      checkCollisions();

      // Render
      render(ctx);

      // Update time
      setGameState((prev) => ({ ...prev, time: prev.time + 1 / 60 }));
    };

    gameLoopRef.current = setInterval(gameLoop, 1000 / 60);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gameState.isPaused, gameState.isGameOver]);

  const updatePlayer = (canvas) => {
    setGameState((prev) => {
      const newPlayer = { ...prev.player };

      // Movement
      if (keys.current["w"] || keys.current["arrowup"])
        newPlayer.y -= newPlayer.speed;
      if (keys.current["s"] || keys.current["arrowdown"])
        newPlayer.y += newPlayer.speed;
      if (keys.current["a"] || keys.current["arrowleft"])
        newPlayer.x -= newPlayer.speed;
      if (keys.current["d"] || keys.current["arrowright"])
        newPlayer.x += newPlayer.speed;

      // Boundary checking
      newPlayer.x = Math.max(25, Math.min(canvas.width - 25, newPlayer.x));
      newPlayer.y = Math.max(25, Math.min(canvas.height - 25, newPlayer.y));

      return { ...prev, player: newPlayer };
    });
  };

  const updateEnemies = () => {
    setGameState((prev) => {
      const newEnemies = prev.enemies.map((enemy) => {
        // Move towards player
        const dx = prev.player.x - enemy.x;
        const dy = prev.player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          enemy.x += (dx / distance) * enemy.speed;
          enemy.y += (dy / distance) * enemy.speed;
        }

        return enemy;
      });

      return { ...prev, enemies: newEnemies };
    });
  };

  const updateProjectiles = (canvas) => {
    setGameState((prev) => {
      const newProjectiles = prev.projectiles
        .map((projectile) => ({
          ...projectile,
          x: projectile.x + projectile.vx,
          y: projectile.y + projectile.vy,
        }))
        .filter(
          (projectile) =>
            projectile.x >= 0 &&
            projectile.x <= canvas.width &&
            projectile.y >= 0 &&
            projectile.y <= canvas.height
        );

      return { ...prev, projectiles: newProjectiles };
    });
  };

  const spawnEnemies = (canvas) => {
    setGameState((prev) => {
      if (prev.enemies.length < 20 && Math.random() < 0.02) {
        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch (side) {
          case 0: // Top
            x = Math.random() * canvas.width;
            y = -20;
            break;
          case 1: // Right
            x = canvas.width + 20;
            y = Math.random() * canvas.height;
            break;
          case 2: // Bottom
            x = Math.random() * canvas.width;
            y = canvas.height + 20;
            break;
          default: // Left
            x = -20;
            y = Math.random() * canvas.height;
            break;
        }

        const newEnemy = {
          id: Date.now() + Math.random(),
          x,
          y,
          health: 50,
          speed: 1 + Math.random() * 2,
          size: 15,
          type: Math.floor(Math.random() * 3), // Different enemy types
        };

        return { ...prev, enemies: [...prev.enemies, newEnemy] };
      }
      return prev;
    });
  };

  const autoFire = () => {
    const now = Date.now();
    if (now - lastFireTime.current < 300) return; // Fire rate limit

    setGameState((prev) => {
      if (prev.enemies.length === 0) return prev;

      // Auto-aim at nearest enemy
      const nearestEnemy = prev.enemies.reduce(
        (nearest, enemy) => {
          const dx = prev.player.x - enemy.x;
          const dy = prev.player.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          return distance < nearest.distance ? { enemy, distance } : nearest;
        },
        { enemy: null, distance: Infinity }
      );

      if (nearestEnemy.enemy) {
        const dx = nearestEnemy.enemy.x - prev.player.x;
        const dy = nearestEnemy.enemy.y - prev.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const projectile = {
          id: Date.now() + Math.random(),
          x: prev.player.x,
          y: prev.player.y,
          vx: (dx / distance) * 8,
          vy: (dy / distance) * 8,
          size: 5,
        };

        lastFireTime.current = now;
        return {
          ...prev,
          projectiles: [...prev.projectiles, projectile],
        };
      }

      return prev;
    });
  };

  const checkCollisions = () => {
    setGameState((prev) => {
      let newState = { ...prev };
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
        const dx = newState.player.x - enemy.x;
        const dy = newState.player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemy.size + 15) {
          newState.player.health = Math.max(0, newState.player.health - 0.5);
          if (newState.player.health <= 0) {
            newState.isGameOver = true;
            endGame("died");
          }
        }
      });

      newState.score += scoreGained;
      newState.experience += expGained;

      return newState;
    });
  };

  const render = (ctx) => {
    // Draw player
    ctx.fillStyle = "#00ff88";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(gameState.player.x, gameState.player.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw player inner glow
    ctx.fillStyle = "#88ffaa";
    ctx.beginPath();
    ctx.arc(gameState.player.x, gameState.player.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies
    gameState.enemies.forEach((enemy) => {
      // Enemy body
      const colors = ["#ff4444", "#ff8844", "#ff44aa"];
      ctx.fillStyle = colors[enemy.type] || "#ff4444";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Enemy health bar
      if (enemy.health < 50) {
        const barWidth = enemy.size * 2;
        const barHeight = 4;
        const barX = enemy.x - barWidth / 2;
        const barY = enemy.y - enemy.size - 10;

        ctx.fillStyle = "#660000";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = "#ff0000";
        ctx.fillRect(barX, barY, (enemy.health / 50) * barWidth, barHeight);
      }
    });

    // Draw projectiles
    gameState.projectiles.forEach((projectile) => {
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
      ctx.shadowBlur = 0;
    });
  };

  const endGame = async (reason) => {
    if (!gameState.gameSession) return;

    try {
      await gameSessionService.endGameSession(gameState.gameSession.id, {
        scoreAchieved: gameState.score,
        endReason: reason,
        stats: {
          enemiesKilled: Math.floor(gameState.score / 10),
          survivalTime: Math.floor(gameState.time),
          experienceGained: gameState.experience,
        },
      });
      onGameEnd(reason, gameState.score);
    } catch (error) {
      console.error("Failed to end game session:", error);
      onGameEnd(reason, gameState.score);
    }
  };

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const quitGame = () => {
    endGame("quit");
  };

  if (gameState.isGameOver) {
    return (
      <div className={styles.gameOver}>
        <div className={styles.gameOverContent}>
          <h2>渡劫失败</h2>
          <p>最终得分: {gameState.score}</p>
          <p>存活时间: {Math.floor(gameState.time)}秒</p>
          <p>击杀敌人: {Math.floor(gameState.score / 10)}</p>
          <p>获得经验: {gameState.experience}</p>
          <button onClick={() => onGameEnd("died", gameState.score)}>
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
