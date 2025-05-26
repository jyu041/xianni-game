import React, { useEffect } from "react";
import useGameStore from "./managers/StateManager.js";
import { GAME_STATES } from "./utils/gameConstants.js";

// Screen Components
import HomeScreen from "./components/screens/HomeScreen.jsx";
import GameScreen from "./components/screens/GameScreen.jsx";
import LoadingScreen from "./components/screens/LoadingScreen.jsx";
import SettingsScreen from "./components/screens/SettingsScreen.jsx";

// Managers
import AudioManager from "./managers/AudioManager.js";
import SaveManager from "./managers/SaveManager.js";
import LocalizationManager from "./managers/LocalizationManager.js";

// Styles
import "./App.css";

function App() {
  const {
    gameState,
    currentScreen,
    isLoading,
    settings,
    setGameState,
    setCurrentScreen,
  } = useGameStore();

  // Initialize game systems
  useEffect(() => {
    console.log("🎮 仙逆 Game Starting...");

    // Initialize managers
    AudioManager.initialize();
    LocalizationManager.setLanguage(settings.language);

    // Auto-load if auto-save exists
    if (settings.autoSave && SaveManager.hasSlot(1)) {
      console.log("Auto-save detected");
    }

    return () => {
      // Cleanup
      AudioManager.cleanup();
    };
  }, []);

  // Handle screen transitions
  const handleScreenChange = (screen) => {
    setCurrentScreen(screen);

    // Update game state based on screen
    switch (screen) {
      case "home":
        setGameState(GAME_STATES.HOME);
        break;
      case "game":
        setGameState(GAME_STATES.PLAYING);
        break;
      case "loading":
        setGameState(GAME_STATES.LOADING);
        break;
      default:
        break;
    }
  };

  // Render current screen
  const renderCurrentScreen = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={handleScreenChange} />;
      case "game":
        return <GameScreen onNavigate={handleScreenChange} />;
      case "settings":
        return <SettingsScreen onNavigate={handleScreenChange} />;
      case "loading":
        return <LoadingScreen />;
      default:
        return <HomeScreen onNavigate={handleScreenChange} />;
    }
  };

  return (
    <div className="app">
      <div className="game-container">{renderCurrentScreen()}</div>

      {/* Global UI Elements */}
      <div className="global-ui">
        {/* Debug info in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="debug-info">
            <div>State: {gameState}</div>
            <div>Screen: {currentScreen}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
