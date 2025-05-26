import React from "react";

const ExperienceBar = ({ current, max, showText = true, className = "" }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <div className={`experience-bar ${className}`}>
      {showText && <span className="bar-label">经验</span>}
      <div className="bar-container">
        <div
          className="bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: "#9C27B0", // Purple
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

export default ExperienceBar;
