import React, { useState } from "react";
import useGameStore from "../../../managers/StateManager.js";
import Modal from "../../ui/common/Modal.jsx";
import ItemTooltip from "./ItemTooltip.jsx";
import Button from "../../ui/common/Button.jsx";

const InventoryGrid = ({ onClose }) => {
  const { inventory, removeItem, equipItem } = useGameStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleUseItem = (item) => {
    if (item.type === "pill") {
      // Use pill
      // CultivationManager.consumePill(item.id);
      removeItem(item.id);
    } else if (item.slot) {
      // Equip item
      equipItem(item, item.slot);
      removeItem(item.id);
    }
    setSelectedItem(null);
  };

  const handleDiscardItem = (item) => {
    removeItem(item.id);
    setSelectedItem(null);
  };

  // Create grid with empty slots
  const gridSlots = [];
  for (let i = 0; i < inventory.maxSlots; i++) {
    const item = inventory.items[i];
    gridSlots.push(
      <div
        key={i}
        className={`inventory-slot ${item ? "has-item" : "empty"} ${
          selectedItem?.id === item?.id ? "selected" : ""
        }`}
        onClick={() => item && handleItemClick(item)}
        onMouseEnter={() => item && setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {item && (
          <div className="item-icon">
            <img src={item.icon || "/icons/default-item.png"} alt={item.name} />
            {item.stackable && item.quantity > 1 && (
              <span className="item-quantity">{item.quantity}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Modal title="背包" onClose={onClose} className="inventory-panel">
      <div className="inventory-content">
        {/* Equipment Slots */}
        <div className="equipment-section">
          <h3>装备</h3>
          <div className="equipment-slots">
            <div className="equipment-slot weapon">
              {inventory.equipment.weapon && (
                <div className="equipped-item">
                  <img
                    src={
                      inventory.equipment.weapon.icon ||
                      "/icons/default-weapon.png"
                    }
                    alt={inventory.equipment.weapon.name}
                  />
                </div>
              )}
              <span className="slot-label">武器</span>
            </div>

            <div className="equipment-slot armor">
              {inventory.equipment.armor && (
                <div className="equipped-item">
                  <img
                    src={
                      inventory.equipment.armor.icon ||
                      "/icons/default-armor.png"
                    }
                    alt={inventory.equipment.armor.name}
                  />
                </div>
              )}
              <span className="slot-label">护甲</span>
            </div>

            <div className="equipment-slot accessory">
              {inventory.equipment.accessory && (
                <div className="equipped-item">
                  <img
                    src={
                      inventory.equipment.accessory.icon ||
                      "/icons/default-accessory.png"
                    }
                    alt={inventory.equipment.accessory.name}
                  />
                </div>
              )}
              <span className="slot-label">饰品</span>
            </div>

            <div className="equipment-slot treasure">
              {inventory.equipment.treasure && (
                <div className="equipped-item">
                  <img
                    src={
                      inventory.equipment.treasure.icon ||
                      "/icons/default-treasure.png"
                    }
                    alt={inventory.equipment.treasure.name}
                  />
                </div>
              )}
              <span className="slot-label">法宝</span>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="inventory-section">
          <h3>
            物品 ({inventory.items.length}/{inventory.maxSlots})
          </h3>
          <div className="inventory-grid">{gridSlots}</div>
        </div>

        {/* Item Actions */}
        {selectedItem && (
          <div className="item-actions">
            <div className="selected-item-info">
              <strong>{selectedItem.name}</strong>
              <p>{selectedItem.description}</p>
            </div>

            <div className="action-buttons">
              {(selectedItem.type === "pill" || selectedItem.slot) && (
                <Button
                  onClick={() => handleUseItem(selectedItem)}
                  variant="primary"
                >
                  {selectedItem.type === "pill" ? "使用" : "装备"}
                </Button>
              )}

              <Button
                onClick={() => handleDiscardItem(selectedItem)}
                variant="danger"
              >
                丢弃
              </Button>

              <Button onClick={() => setSelectedItem(null)} variant="secondary">
                取消
              </Button>
            </div>
          </div>
        )}

        {/* Tooltip */}
        {hoveredItem && !selectedItem && <ItemTooltip item={hoveredItem} />}
      </div>
    </Modal>
  );
};

export default InventoryGrid;
