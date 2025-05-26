import React from "react";
import { COLOR_THEMES } from "../../../utils/gameConstants.js";

const ItemTooltip = ({ item, position = { x: 0, y: 0 } }) => {
  const getRarityColor = (rarity) => {
    return (
      COLOR_THEMES.RARITY[rarity?.toUpperCase()] || COLOR_THEMES.RARITY.COMMON
    );
  };

  const formatStatBonus = (stat, value) => {
    const statNames = {
      attack: "攻击力",
      defense: "防御力",
      health: "生命值",
      mana: "法力值",
      maxHealth: "最大生命",
      maxMana: "最大法力",
      maxSpiritualEnergy: "最大灵气",
      spiritualEnergyRegen: "灵气回复",
    };

    return `${statNames[stat] || stat}: +${value}`;
  };

  return (
    <div
      className="item-tooltip"
      style={{
        position: "fixed",
        left: position.x + 10,
        top: position.y + 10,
        zIndex: 1000,
      }}
    >
      <div className="tooltip-header">
        <div
          className="item-name"
          style={{ color: getRarityColor(item.rarity) }}
        >
          {item.name}
        </div>
        <div className="item-type">{item.type}</div>
        {item.rarity && (
          <div
            className="item-rarity"
            style={{ color: getRarityColor(item.rarity) }}
          >
            {item.rarity}
          </div>
        )}
      </div>

      <div className="tooltip-body">
        <div className="item-description">{item.description}</div>

        {item.stats && Object.keys(item.stats).length > 0 && (
          <div className="item-stats">
            <div className="stats-title">属性:</div>
            {Object.entries(item.stats).map(([stat, value]) => (
              <div key={stat} className="stat-line">
                {formatStatBonus(stat, value)}
              </div>
            ))}
          </div>
        )}

        {item.effects && (
          <div className="item-effects">
            <div className="effects-title">效果:</div>
            {item.effects.cultivationPoints && (
              <div className="effect-line">
                修为 +{item.effects.cultivationPoints}
              </div>
            )}
            {item.effects.spiritualEnergy && (
              <div className="effect-line">
                灵气 +{item.effects.spiritualEnergy}
              </div>
            )}
            {item.effects.stats &&
              Object.entries(item.effects.stats).map(([stat, value]) => (
                <div key={stat} className="effect-line">
                  {formatStatBonus(stat, value)}
                </div>
              ))}
          </div>
        )}

        {item.requirements && (
          <div className="item-requirements">
            <div className="requirements-title">需求:</div>
            {item.requirements.realm && (
              <div className="requirement-line">
                境界: {item.requirements.realm}
              </div>
            )}
            {item.requirements.stage && (
              <div className="requirement-line">
                层次: 第{item.requirements.stage}层
              </div>
            )}
          </div>
        )}

        {item.value && (
          <div className="item-value">价值: {item.value} 灵石</div>
        )}
      </div>
    </div>
  );
};

export default ItemTooltip;
