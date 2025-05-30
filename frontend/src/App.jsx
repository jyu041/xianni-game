// frontend/src/App.jsx
import { useState } from "react";
import HomePage from "./components/pages/HomePage";
import CreateSaveSlot from "./components/pages/CreateSaveSlot";
import GameHome from "./components/pages/GameHome";
import GameLevel from "./components/pages/GameLevel";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentSave, setCurrentSave] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);

  const navigateTo = (page, data = null) => {
    setCurrentPage(page);
    if (data) {
      if (page === "gameHome") {
        setCurrentSave(data);
      } else if (page === "gameLevel") {
        setCurrentStage(data);
      }
    }
  };

  const selectSave = (saveData) => {
    setCurrentSave(saveData);
    setCurrentPage("gameHome");
  };

  const handleGameEnd = (reason, score) => {
    console.log(`Game ended: ${reason}, Score: ${score}`);
    setCurrentPage("gameHome");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigateTo} />;
      case "createSave":
        return (
          <CreateSaveSlot onNavigate={navigateTo} onSaveCreated={selectSave} />
        );
      case "gameHome":
        return <GameHome saveData={currentSave} onNavigate={navigateTo} />;
      case "gameLevel":
        return (
          <GameLevel
            stageData={currentStage.stageData}
            playerData={currentStage.playerData}
            onGameEnd={handleGameEnd}
          />
        );
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return <div className="app">{renderCurrentPage()}</div>;
}

export default App;
