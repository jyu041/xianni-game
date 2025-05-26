import React from "react";

const ManaBar = ({ current, max, showText = true, className = "" }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <div className={`mana-bar ${className}`}>
      {showText && <span className="bar-label">法力</span>}
      <div className="bar-container">
        <div
          className="bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: "#2196F3", // Blue
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

export default ManaBar;
