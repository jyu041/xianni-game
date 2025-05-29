import { useState } from "react";
import HomePage from "./components/pages/HomePage";
import CreateSaveSlot from "./components/pages/CreateSaveSlot";
import GameHome from "./components/pages/GameHome";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentSave, setCurrentSave] = useState(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const selectSave = (saveData) => {
    setCurrentSave(saveData);
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
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return <div className="app">{renderCurrentPage()}</div>;
}

export default App;
