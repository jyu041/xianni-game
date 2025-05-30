// frontend/src/components/pages/GameLevel.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import gameSessionService from "../services/gameSessionService";
import styles from "./GameLevel.module.css";

const GameLevel = ({ stageData, playerData, onGameEnd }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
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
  const mouse = useRef({ x: 0, y: 0 });

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

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    const gameLoop = () => {
      if (gameState.isPaused || gameState.isGameOver) return;

      // Update game state
      updatePlayer();
      updateEnemies();
      updateProjectiles();
      spawnEnemies();

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
    };
  }, [gameState.isPaused, gameState.isGameOver]);

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvasRef.current?.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvasRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const updatePlayer = () => {
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
      newPlayer.x = Math.max(25, Math.min(775, newPlayer.x));
      newPlayer.y = Math.max(25, Math.min(575, newPlayer.y));

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

  const updateProjectiles = () => {
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
            projectile.x <= 800 &&
            projectile.y >= 0 &&
            projectile.y <= 600
        );

      return { ...prev, projectiles: newProjectiles };
    });
  };

  const spawnEnemies = () => {
    setGameState((prev) => {
      if (prev.enemies.length < 20 && Math.random() < 0.02) {
        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch (side) {
          case 0:
            x = Math.random() * 800;
            y = -20;
            break;
          case 1:
            x = 820;
            y = Math.random() * 600;
            break;
          case 2:
            x = Math.random() * 800;
            y = 620;
            break;
          default:
            x = -20;
            y = Math.random() * 600;
            break;
        }

        const newEnemy = {
          id: Date.now() + Math.random(),
          x,
          y,
          health: 50,
          speed: 1 + Math.random(),
          size: 15,
        };

        return { ...prev, enemies: [...prev.enemies, newEnemy] };
      }
      return prev;
    });
  };

  const checkCollisions = () => {
    setGameState((prev) => {
      let newState = { ...prev };

      // Projectile-Enemy collisions
      newState.projectiles.forEach((projectile, pIndex) => {
        newState.enemies.forEach((enemy, eIndex) => {
          const dx = projectile.x - enemy.x;
          const dy = projectile.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < enemy.size + 5) {
            // Hit enemy
            newState.enemies[eIndex].health -= 25;
            newState.projectiles.splice(pIndex, 1);

            if (newState.enemies[eIndex].health <= 0) {
              newState.score += 10;
              newState.experience += 5;
              newState.enemies.splice(eIndex, 1);
            }
          }
        });
      });

      // Player-Enemy collisions
      newState.enemies.forEach((enemy) => {
        const dx = newState.player.x - enemy.x;
        const dy = newState.player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemy.size + 15) {
          newState.player.health -= 1;
          if (newState.player.health <= 0) {
            newState.isGameOver = true;
            endGame("died");
          }
        }
      });

      return newState;
    });
  };

  const fireProjectile = useCallback(() => {
    if (gameState.enemies.length === 0) return;

    // Auto-aim at nearest enemy
    const nearestEnemy = gameState.enemies.reduce(
      (nearest, enemy) => {
        const dx = gameState.player.x - enemy.x;
        const dy = gameState.player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < nearest.distance ? { enemy, distance } : nearest;
      },
      { enemy: null, distance: Infinity }
    );

    if (nearestEnemy.enemy) {
      const dx = nearestEnemy.enemy.x - gameState.player.x;
      const dy = nearestEnemy.enemy.y - gameState.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const projectile = {
        id: Date.now() + Math.random(),
        x: gameState.player.x,
        y: gameState.player.y,
        vx: (dx / distance) * 8,
        vy: (dy / distance) * 8,
        size: 5,
      };

      setGameState((prev) => ({
        ...prev,
        projectiles: [...prev.projectiles, projectile],
      }));
    }
  }, [gameState.player, gameState.enemies]);

  // Auto-fire projectiles
  useEffect(() => {
    const fireInterval = setInterval(fireProjectile, 300);
    return () => clearInterval(fireInterval);
  }, [fireProjectile]);

  const render = (ctx) => {
    // Clear canvas
    ctx.fillStyle = "#001122";
    ctx.fillRect(0, 0, 800, 600);

    // Draw player
    ctx.fillStyle = "#00ff00";
    ctx.beginPath();
    ctx.arc(gameState.player.x, gameState.player.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies
    ctx.fillStyle = "#ff0000";
    gameState.enemies.forEach((enemy) => {
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw projectiles
    ctx.fillStyle = "#ffff00";
    gameState.projectiles.forEach((projectile) => {
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw UI
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.fillText(`Health: ${gameState.player.health}`, 10, 30);
    ctx.fillText(`Score: ${gameState.score}`, 10, 50);
    ctx.fillText(`Time: ${Math.floor(gameState.time)}s`, 10, 70);
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
          <h2>游戏结束</h2>
          <p>最终得分: {gameState.score}</p>
          <p>存活时间: {Math.floor(gameState.time)}秒</p>
          <p>击杀敌人: {Math.floor(gameState.score / 10)}</p>
          <button onClick={() => onGameEnd("died", gameState.score)}>
            返回关卡选择
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameLevel}>
      <div className={styles.gameUI}>
        <div className={styles.playerStats}>
          <div className={styles.healthBar}>
            <div
              className={styles.healthFill}
              style={{
                width: `${
                  (gameState.player.health / gameState.player.maxHealth) * 100
                }%`,
              }}
            />
          </div>
          <span>
            生命值: {gameState.player.health}/{gameState.player.maxHealth}
          </span>
        </div>

        <div className={styles.gameStats}>
          <span>得分: {gameState.score}</span>
          <span>时间: {Math.floor(gameState.time)}s</span>
          <span>经验: {gameState.experience}</span>
        </div>

        <div className={styles.gameControls}>
          <button onClick={pauseGame}>
            {gameState.isPaused ? "继续" : "暂停"}
          </button>
          <button onClick={quitGame}>退出</button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className={styles.gameCanvas}
        width={800}
        height={600}
      />

      <div className={styles.instructions}>
        <p>使用 WASD 或方向键移动</p>
        <p>自动瞄准最近的敌人射击</p>
        <p>击败敌人获得分数和经验</p>
      </div>

      {gameState.isPaused && (
        <div className={styles.pauseOverlay}>
          <div className={styles.pauseMenu}>
            <h3>游戏暂停</h3>
            <button onClick={pauseGame}>继续游戏</button>
            <button onClick={quitGame}>退出游戏</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLevel;
