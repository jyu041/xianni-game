// backend/src/main/java/org/jyu041/backend/service/EquipmentService.java
package org.jyu041.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EquipmentService {

    private final List<Map<String, Object>> availableEquipment = new ArrayList<>();

    public EquipmentService() {
        initializeTestEquipment();
    }

    private void initializeTestEquipment() {
        // Test weapons for demonstration
        availableEquipment.add(createWeapon(
                "iron_sword", "铁剑", "普通的铁制长剑", "common", "weapon",
                Map.of("attackPercent", 15)
        ));

        availableEquipment.add(createWeapon(
                "steel_sword", "钢剑", "锋利的钢制长剑", "uncommon", "weapon",
                Map.of("attackPercent", 25, "healthPercent", 10)
        ));

        availableEquipment.add(createWeapon(
                "spirit_blade", "灵刃", "蕴含灵气的神秘剑刃", "rare", "weapon",
                Map.of("attackPercent", 35, "manaPercent", 20)
        ));

        availableEquipment.add(createWeapon(
                "dragon_slayer", "屠龙刀", "传说中的屠龙神兵", "epic", "weapon",
                Map.of("attackPercent", 50, "healthPercent", 25, "manaPercent", 15)
        ));

        // Test armor
        availableEquipment.add(createArmor(
                "leather_armor", "皮甲", "简单的皮质护甲", "common", "armor",
                Map.of("healthPercent", 20, "defensePercent", 10)
        ));

        availableEquipment.add(createArmor(
                "chain_mail", "锁子甲", "金属环扣编织的护甲", "uncommon", "armor",
                Map.of("healthPercent", 35, "defensePercent", 20, "healthRegenPercent", 25)
        ));

        availableEquipment.add(createArmor(
                "spirit_robe", "灵袍", "修仙者的法袍", "rare", "armor",
                Map.of("healthPercent", 30, "manaPercent", 40, "manaRegenPercent", 30)
        ));

        availableEquipment.add(createArmor(
                "immortal_armor", "仙甲", "仙人级别的护甲", "legendary", "armor",
                Map.of("healthPercent", 60, "defensePercent", 40, "manaPercent", 30, "healthRegenPercent", 50)
        ));

        // Test accessories
        availableEquipment.add(createAccessory(
                "power_ring", "力量戒指", "增强攻击力的戒指", "uncommon", "ring",
                Map.of("attackPercent", 20, "healthPercent", 15)
        ));

        availableEquipment.add(createAccessory(
                "mana_amulet", "法力护符", "提升灵气的神秘护符", "rare", "amulet",
                Map.of("manaPercent", 35, "manaRegenPercent", 40)
        ));

        availableEquipment.add(createAccessory(
                "cultivation_pearl", "修炼珠", "辅助修炼的宝珠", "epic", "accessory",
                Map.of("healthPercent", 25, "manaPercent", 25, "attackPercent", 15, "defensePercent", 15)
        ));

        availableEquipment.add(createAccessory(
                "heaven_defying_crown", "逆天冠", "逆天而行的神器", "legendary", "crown",
                Map.of("attackPercent", 40, "healthPercent", 40, "manaPercent", 40, "defensePercent", 30, "healthRegenPercent", 100, "manaRegenPercent", 100)
        ));
    }

    private Map<String, Object> createWeapon(String id, String name, String description, String rarity, String type, Map<String, Integer> stats) {
        Map<String, Object> weapon = new HashMap<>();
        weapon.put("id", id);
        weapon.put("name", name);
        weapon.put("description", description);
        weapon.put("rarity", rarity);
        weapon.put("type", type);
        weapon.put("category", "weapon");
        weapon.put("stats", stats);
        weapon.put("icon", "⚔️");
        weapon.put("levelRequirement", getLevelRequirement(rarity));
        return weapon;
    }

    private Map<String, Object> createArmor(String id, String name, String description, String rarity, String type, Map<String, Integer> stats) {
        Map<String, Object> armor = new HashMap<>();
        armor.put("id", id);
        armor.put("name", name);
        armor.put("description", description);
        armor.put("rarity", rarity);
        armor.put("type", type);
        armor.put("category", "armor");
        armor.put("stats", stats);
        armor.put("icon", "🛡️");
        armor.put("levelRequirement", getLevelRequirement(rarity));
        return armor;
    }

    private Map<String, Object> createAccessory(String id, String name, String description, String rarity, String type, Map<String, Integer> stats) {
        Map<String, Object> accessory = new HashMap<>();
        accessory.put("id", id);
        accessory.put("name", name);
        accessory.put("description", description);
        accessory.put("rarity", rarity);
        accessory.put("type", type);
        accessory.put("category", "accessory");
        accessory.put("stats", stats);
        accessory.put("icon", "💍");
        accessory.put("levelRequirement", getLevelRequirement(rarity));
        return accessory;
    }

    private int getLevelRequirement(String rarity) {
        switch (rarity) {
            case "common": return 1;
            case "uncommon": return 5;
            case "rare": return 15;
            case "epic": return 25;
            case "legendary": return 40;
            default: return 1;
        }
    }

    public List<Map<String, Object>> getAvailableEquipment() {
        return new ArrayList<>(availableEquipment);
    }

    public Map<String, Object> getEquipmentById(String itemId) {
        return availableEquipment.stream()
                .filter(item -> itemId.equals(item.get("id")))
                .findFirst()
                .orElse(null);
    }

    public String getRarityColor(String rarity) {
        switch (rarity) {
            case "common": return "#9e9e9e";
            case "uncommon": return "#4caf50";
            case "rare": return "#2196f3";
            case "epic": return "#9c27b0";
            case "legendary": return "#ff9800";
            default: return "#9e9e9e";
        }
    }
}