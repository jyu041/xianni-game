import React from "react";

const EnergyBar = ({ current, max, showText = true, className = "" }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <div className={`energy-bar ${className}`}>
      {showText && <span className="bar-label">体力</span>}
      <div className="bar-container">
        <div
          className="bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: "#FFC107", // Yellow
          }}
        />
        {showText && (
          <span className="bar-text">
            {Math.round(current)} / {Math.round(max)}
          </span>
        )}
      </div>
    </div>
  );
};

export default EnergyBar;
