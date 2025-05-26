import React, { useState, useEffect } from "react";
import useGameStore from "../../../managers/StateManager.js";
import WorldManager from "../../../managers/WorldManager.js";
import { WORLD_REGIONS_DATA } from "../../../data/world/regions.js";
import Button from "../../ui/common/Button.jsx";

const WorldMap = () => {
  const { player, world, discoverRegion } = useGameStore();
  const [selectedRegion, setSelectedRegion] = useState(player.position.region);

  const availableRegions = WorldManager.getAvailableRegions(player);

  const handleRegionClick = (regionId) => {
    setSelectedRegion(regionId);
  };

  const handleTravelToRegion = () => {
    if (selectedRegion && selectedRegion !== player.position.region) {
      WorldManager.moveToRegion(selectedRegion);
    }
  };

  const selectedRegionData = WORLD_REGIONS_DATA[selectedRegion];
  const currentRegionData = WORLD_REGIONS_DATA[player.position.region];

  return (
    <div className="world-map">
      <div className="map-header">
        <h2>世界地图</h2>
        <div className="current-location">
          当前位置: {currentRegionData?.name || "未知"}
        </div>
        <div className="weather-info">
          天气: {WorldManager.getWeatherName(world.weather)} | 时间:{" "}
          {WorldManager.getFormattedTime().time}
        </div>
      </div>

      <div className="map-content">
        <div className="regions-grid">
          {Object.values(WORLD_REGIONS_DATA).map((region) => {
            const isDiscovered = world.discoveredRegions.includes(region.id);
            const isAvailable = availableRegions.some(
              (r) => r.id === region.id
            );
            const isCurrent = player.position.region === region.id;
            const isSelected = selectedRegion === region.id;

            return (
              <div
                key={region.id}
                className={`region-card ${
                  isDiscovered ? "discovered" : "undiscovered"
                } 
                           ${isAvailable ? "available" : "locked"}
                           ${isCurrent ? "current" : ""}
                           ${isSelected ? "selected" : ""}`}
                onClick={() => isDiscovered && handleRegionClick(region.id)}
              >
                <div className="region-name">
                  {isDiscovered ? region.name : "???"}
                </div>
                <div className="region-level">
                  等级: {isDiscovered ? region.level : "?"}
                </div>
                {isDiscovered && (
                  <div className="region-description">{region.description}</div>
                )}
                {isCurrent && <div className="current-marker">当前位置</div>}
                {!isAvailable && isDiscovered && (
                  <div className="locked-overlay">
                    <span>修为不足</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedRegionData && (
          <div className="region-details">
            <h3>{selectedRegionData.name}</h3>
            <p>{selectedRegionData.description}</p>

            <div className="region-stats">
              <div className="stat">
                <label>等级要求:</label>
                <span>{selectedRegionData.level}</span>
              </div>
              <div className="stat">
                <label>灵气浓度:</label>
                <span>{selectedRegionData.effects.spiritualEnergyMod}x</span>
              </div>
              <div className="stat">
                <label>危险等级:</label>
                <span>{selectedRegionData.effects.dangerLevel}/5</span>
              </div>
              <div className="stat">
                <label>修炼加成:</label>
                <span>
                  +
                  {(selectedRegionData.effects.cultivationBonus * 100).toFixed(
                    0
                  )}
                  %
                </span>
              </div>
            </div>

            {selectedRegion !== player.position.region && (
              <Button
                onClick={handleTravelToRegion}
                variant="primary"
                disabled={
                  !availableRegions.some((r) => r.id === selectedRegion)
                }
              >
                前往此地
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap;
