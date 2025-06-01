// src/App.jsx
import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import CreateSaveSlot from "./pages/CreateSaveSlot";
import GameHome from "./pages/GameHome";
import GameLevel from "./pages/GameLevel";
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
        return <LandingPage onNavigate={navigateTo} />;
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
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return <div className="app">{renderCurrentPage()}</div>;
}

export default App;
