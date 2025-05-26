import React, { useState, useEffect } from "react";

const LoadingScreen = ({ message = "加载中...", progress = null }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <div className="loading-text">
          {message}
          {dots}
        </div>

        {progress !== null && (
          <div className="loading-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-text">{Math.round(progress)}%</div>
          </div>
        )}

        <div className="loading-tips">
          <p>修炼小贴士: 不同的功法适合不同的灵根资质</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
