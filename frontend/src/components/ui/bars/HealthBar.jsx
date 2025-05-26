import React from "react";

const HealthBar = ({ current, max, showText = true, className = "" }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  const getHealthColor = (percent) => {
    if (percent > 60) return "#4CAF50"; // Green
    if (percent > 30) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  return (
    <div className={`health-bar ${className}`}>
      {showText && <span className="bar-label">生命</span>}
      <div className="bar-container">
        <div
          className="bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getHealthColor(percentage),
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

export default HealthBar;
