#!/usr/bin/env python3
"""
File Structure Generator for 仙逆 Game
Creates the complete directory and file structure for the cultivation game.
"""

import os
import json

def create_file_structure():
    """Create the complete file structure for the game"""
    
    # Base directories
    base_dirs = [
        # Components
        "src/components/game/world",
        "src/components/game/cultivation", 
        "src/components/game/inventory",
        "src/components/game/combat",
        "src/components/game/sect",
        "src/components/game/alchemy",
        "src/components/ui/bars",
        "src/components/ui/dialogs",
        "src/components/ui/manga",
        "src/components/ui/menus",
        "src/components/ui/common",
        "src/components/screens",
        
        # Managers
        "src/managers",
        
        # Hooks
        "src/hooks",
        
        # Utils
        "src/utils",
        
        # Data
        "src/data/cultivation",
        "src/data/world",
        "src/data/items",
        "src/data/sects",
        "src/data/localization",
        "src/data/manga",
        
        # Assets
        "src/assets/music/menu",
        "src/assets/music/world/peaceful",
        "src/assets/music/world/mysterious", 
        "src/assets/music/world/danger",
        "src/assets/music/combat/normal",
        "src/assets/music/combat/boss",
        "src/assets/music/combat/tribulation",
        "src/assets/music/sect/righteous",
        "src/assets/music/sect/demonic",
        "src/assets/music/sect/neutral",
        
        "src/assets/sfx/player/movement",
        "src/assets/sfx/player/cultivation",
        "src/assets/sfx/player/combat",
        "src/assets/sfx/player/interaction",
        "src/assets/sfx/enemies/beasts",
        "src/assets/sfx/enemies/demons",
        "src/assets/sfx/enemies/cultivators",
        "src/assets/sfx/boss/sect_masters",
        "src/assets/sfx/boss/ancient_beasts",
        "src/assets/sfx/boss/heavenly_tribulation",
        "src/assets/sfx/environment/weather",
        "src/assets/sfx/environment/locations",
        "src/assets/sfx/environment/ambient",
        "src/assets/sfx/ui/menu",
        "src/assets/sfx/ui/inventory",
        "src/assets/sfx/ui/notifications",
        
        "src/assets/voices/characters/protagonist",
        "src/assets/voices/characters/sect_members",
        "src/assets/voices/characters/masters",
        "src/assets/voices/characters/villains",
        "src/assets/voices/narrator",
        
        "src/assets/manga/story_sequences/prologue",
        "src/assets/manga/story_sequences/sect_introduction",
        "src/assets/manga/story_sequences/first_tribulation",
        "src/assets/manga/story_sequences/major_events",
        "src/assets/manga/character_portraits/expressions",
        "src/assets/manga/character_portraits/poses",
        "src/assets/manga/backgrounds",
        
        "src/assets/images/world/regions",
        "src/assets/images/world/locations", 
        "src/assets/images/world/landmarks",
        "src/assets/images/ui/icons",
        "src/assets/images/ui/frames",
        "src/assets/images/ui/effects",
        "src/assets/images/items/pills",
        "src/assets/images/items/treasures",
        "src/assets/images/items/materials",
        "src/assets/images/characters/player",
        "src/assets/images/characters/npcs",
        "src/assets/images/characters/enemies",
        
        "src/assets/fonts/chinese",
        "src/assets/fonts/english"
    ]
    
    # Component files
    component_files = {
        # Game components
        "src/components/game/world/WorldMap.jsx": create_react_component("WorldMap"),
        "src/components/game/world/RegionRenderer.jsx": create_react_component("RegionRenderer"),
        "src/components/game/world/LocationMarker.jsx": create_react_component("LocationMarker"),
        "src/components/game/world/PlayerMovement.jsx": create_react_component("PlayerMovement"),
        
        "src/components/game/cultivation/CultivationPanel.jsx": create_react_component("CultivationPanel"),
        "src/components/game/cultivation/RealmProgress.jsx": create_react_component("RealmProgress"),
        "src/components/game/cultivation/TechniqueList.jsx": create_react_component("TechniqueList"),
        "src/components/game/cultivation/BreakthroughModal.jsx": create_react_component("BreakthroughModal"),
        
        "src/components/game/inventory/InventoryGrid.jsx": create_react_component("InventoryGrid"),
        "src/components/game/inventory/ItemTooltip.jsx": create_react_component("ItemTooltip"),
        "src/components/game/inventory/EquipmentSlots.jsx": create_react_component("EquipmentSlots"),
        
        "src/components/game/combat/CombatInterface.jsx": create_react_component("CombatInterface"),
        "src/components/game/combat/SkillBar.jsx": create_react_component("SkillBar"),
        "src/components/game/combat/DamageNumbers.jsx": create_react_component("DamageNumbers"),
        
        "src/components/game/sect/SectInterface.jsx": create_react_component("SectInterface"),
        "src/components/game/sect/MissionBoard.jsx": create_react_component("MissionBoard"),
        "src/components/game/sect/RelationshipStatus.jsx": create_react_component("RelationshipStatus"),
        
        "src/components/game/alchemy/AlchemyInterface.jsx": create_react_component("AlchemyInterface"),
        "src/components/game/alchemy/PillCrafting.jsx": create_react_component("PillCrafting"),
        "src/components/game/alchemy/RecipeBook.jsx": create_react_component("RecipeBook"),
        
        # UI components
        "src/components/ui/bars/HealthBar.jsx": create_react_component("HealthBar"),
        "src/components/ui/bars/EnergyBar.jsx": create_react_component("EnergyBar"),
        "src/components/ui/bars/ManaBar.jsx": create_react_component("ManaBar"),
        "src/components/ui/bars/ExperienceBar.jsx": create_react_component("ExperienceBar"),
        
        "src/components/ui/dialogs/DialogBox.jsx": create_react_component("DialogBox"),
        "src/components/ui/dialogs/CharacterPortrait.jsx": create_react_component("CharacterPortrait"),
        "src/components/ui/dialogs/ChoiceButtons.jsx": create_react_component("ChoiceButtons"),
        
        "src/components/ui/manga/MangaViewer.jsx": create_react_component("MangaViewer"),
        "src/components/ui/manga/MangaPage.jsx": create_react_component("MangaPage"),
        "src/components/ui/manga/MangaControls.jsx": create_react_component("MangaControls"),
        
        "src/components/ui/menus/MainMenu.jsx": create_react_component("MainMenu"),
        "src/components/ui/menus/SettingsMenu.jsx": create_react_component("SettingsMenu"),
        "src/components/ui/menus/SaveLoadMenu.jsx": create_react_component("SaveLoadMenu"),
        "src/components/ui/menus/PauseMenu.jsx": create_react_component("PauseMenu"),
        
        "src/components/ui/common/Button.jsx": create_react_component("Button"),
        "src/components/ui/common/Modal.jsx": create_react_component("Modal"),
        "src/components/ui/common/Tooltip.jsx": create_react_component("Tooltip"),
        "src/components/ui/common/LoadingSpinner.jsx": create_react_component("LoadingSpinner"),
        
        # Screen components
        "src/components/screens/HomeScreen.jsx": create_react_component("HomeScreen"),
        "src/components/screens/GameScreen.jsx": create_react_component("GameScreen"),
        "src/components/screens/LoadingScreen.jsx": create_react_component("LoadingScreen"),
        "src/components/screens/SettingsScreen.jsx": create_react_component("SettingsScreen"),
    }
    
    # Manager files
    manager_files = {
        "src/managers/StateManager.js": create_manager_template("StateManager", "Game state management using Zustand"),
        "src/managers/SaveManager.js": create_manager_template("SaveManager", "Save/Load system with multiple slots"),
        "src/managers/AudioManager.js": create_manager_template("AudioManager", "Central audio management"),
        "src/managers/MusicManager.js": create_manager_template("MusicManager", "Background music control"),
        "src/managers/SFXManager.js": create_manager_template("SFXManager", "Sound effects management"),
        "src/managers/DialogueManager.js": create_manager_template("DialogueManager", "Character dialogue and voice acting"),
        "src/managers/MangaManager.js": create_manager_template("MangaManager", "Manga story sequences"),
        "src/managers/AssetManager.js": create_manager_template("AssetManager", "Asset loading and caching"),
        "src/managers/SettingsManager.js": create_manager_template("SettingsManager", "Game settings and preferences"),
        "src/managers/LocalizationManager.js": create_manager_template("LocalizationManager", "Multi-language support"),
        "src/managers/CultivationManager.js": create_manager_template("CultivationManager", "Cultivation system logic"),
        "src/managers/WorldManager.js": create_manager_template("WorldManager", "Open world exploration"),
        "src/managers/SectManager.js": create_manager_template("SectManager", "Sect relationships and missions"),
        "src/managers/AlchemyManager.js": create_manager_template("AlchemyManager", "Pill crafting and alchemy"),
        "src/managers/TreasureManager.js": create_manager_template("TreasureManager", "Treasure and equipment system"),
        "src/managers/QuestManager.js": create_manager_template("QuestManager", "Quest and mission system"),
        "src/managers/WeatherManager.js": create_manager_template("WeatherManager", "Dynamic weather system"),
        "src/managers/TimeManager.js": create_manager_template("TimeManager", "Day/night cycle and time"),
    }
    
    # Hook files
    hook_files = {
        "src/hooks/useGameState.js": create_hook_template("useGameState"),
        "src/hooks/useAudio.js": create_hook_template("useAudio"),
        "src/hooks/useCultivation.js": create_hook_template("useCultivation"),
        "src/hooks/useInventory.js": create_hook_template("useInventory"),
        "src/hooks/useWorld.js": create_hook_template("useWorld"),
        "src/hooks/useLocalization.js": create_hook_template("useLocalization"),
    }
    
    # Utility files
    util_files = {
        "src/utils/gameConstants.js": create_constants_template(),
        "src/utils/mathUtils.js": create_util_template("mathUtils", "Mathematical utility functions"),
        "src/utils/formatters.js": create_util_template("formatters", "Text and number formatting"),
        "src/utils/validators.js": create_util_template("validators", "Data validation functions"),
        "src/utils/pathfinding.js": create_util_template("pathfinding", "Pathfinding algorithms"),
    }
    
    # Data files
    data_files = {
        "src/data/cultivation/realms.js": create_data_template("cultivation realms"),
        "src/data/cultivation/techniques.js": create_data_template("cultivation techniques"),
        "src/data/cultivation/tribulations.js": create_data_template("heavenly tribulations"),
        "src/data/world/regions.js": create_data_template("world regions"),
        "src/data/world/locations.js": create_data_template("world locations"),
        "src/data/world/npcs.js": create_data_template("NPCs"),
        "src/data/items/pills.js": create_data_template("pills and medicines"),
        "src/data/items/treasures.js": create_data_template("treasures and artifacts"),
        "src/data/items/materials.js": create_data_template("crafting materials"),
        "src/data/sects/sectData.js": create_data_template("sect information"),
        "src/data/sects/relationships.js": create_data_template("sect relationships"),
        "src/data/localization/zh-CN.js": create_localization_template("zh-CN"),
        "src/data/localization/en-US.js": create_localization_template("en-US"),
        "src/data/localization/index.js": create_localization_index(),
        "src/data/manga/storySequences.js": create_data_template("manga story sequences"),
        "src/data/manga/characterData.js": create_data_template("character data"),
    }
    
    # README files for asset directories
    readme_files = {
        "src/assets/music/README.md": "# Music Assets\n\nBackground music files organized by context and mood.\n",
        "src/assets/sfx/README.md": "# Sound Effects\n\nSound effect files organized by source and category.\n",
        "src/assets/voices/README.md": "# Voice Acting\n\nCharacter voice lines and narrator audio.\n",
        "src/assets/manga/README.md": "# Manga Assets\n\nStory sequence images, character portraits, and backgrounds.\n",
        "src/assets/images/README.md": "# Game Images\n\nSprites, UI elements, and visual assets.\n",
        "src/assets/fonts/README.md": "# Fonts\n\nFont files for different languages.\n",
    }
    
    print("Creating directory structure...")
    
    # Create directories
    for directory in base_dirs:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")
    
    print("\nCreating component files...")
    create_files(component_files)
    
    print("\nCreating manager files...")
    create_files(manager_files)
    
    print("\nCreating hook files...")
    create_files(hook_files)
    
    print("\nCreating utility files...")
    create_files(util_files)
    
    print("\nCreating data files...")
    create_files(data_files)
    
    print("\nCreating README files...")
    create_files(readme_files)
    
    # Update package.json to add required dependencies
    update_package_json()
    
    print("\n✅ File structure created successfully!")
    print("\nNext steps:")
    print("1. Run 'npm install' to install new dependencies")
    print("2. Start implementing the managers and components")
    print("3. Add your asset files to the appropriate directories")

def create_files(file_dict):
    """Create files from a dictionary of file paths and contents"""
    for file_path, content in file_dict.items():
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Created: {file_path}")

def create_react_component(component_name):
    """Create a basic React component template"""
    return f"""import React from 'react';

const {component_name} = () => {{
  return (
    <div className="{component_name.lower()}">
      <h3>{component_name}</h3>
      {{/* TODO: Implement {component_name} component */}}
    </div>
  );
}};

export default {component_name};
"""

def create_manager_template(manager_name, description):
    """Create a basic manager template"""
    return f"""/**
 * {manager_name}
 * {description}
 */

class {manager_name} {{
  constructor() {{
    // TODO: Initialize {manager_name}
  }}

  // TODO: Implement {manager_name} methods
}}

export default new {manager_name}();
"""

def create_hook_template(hook_name):
    """Create a custom React hook template"""
    return f"""import {{ useState, useEffect }} from 'react';

export const {hook_name} = () => {{
  // TODO: Implement {hook_name} hook logic
  
  return {{
    // TODO: Return hook interface
  }};
}};
"""

def create_util_template(util_name, description):
    """Create a utility file template"""
    return f"""/**
 * {util_name}
 * {description}
 */

// TODO: Implement {util_name} functions

export {{}};
"""

def create_constants_template():
    """Create game constants template"""
    return """/**
 * Game Constants
 * Central location for all game constants and configuration
 */

// Game States
export const GAME_STATES = {
  HOME: 'home',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused'
};

// Cultivation Realms
export const CULTIVATION_REALMS = {
  QI_GATHERING: 'qi_gathering',
  FOUNDATION_BUILDING: 'foundation_building',
  CORE_FORMATION: 'core_formation',
  NASCENT_SOUL: 'nascent_soul'
};

// TODO: Add more game constants

export default {
  GAME_STATES,
  CULTIVATION_REALMS
};
"""

def create_data_template(data_type):
    """Create a data file template"""
    return f"""/**
 * {data_type.title()} Data
 * Game data for {data_type}
 */

// TODO: Implement {data_type} data structure

export const {data_type.upper().replace(' ', '_')}_DATA = {{
  // TODO: Add {data_type} data
}};

export default {data_type.upper().replace(' ', '_')}_DATA;
"""

def create_localization_template(locale):
    """Create localization file template"""
    return f"""/**
 * Localization - {locale}
 */

export const {locale.replace('-', '_')} = {{
  // Common UI
  common: {{
    start: '{locale}' === 'zh-CN' ? '开始' : 'Start',
    settings: '{locale}' === 'zh-CN' ? '设置' : 'Settings',
    save: '{locale}' === 'zh-CN' ? '保存' : 'Save',
    load: '{locale}' === 'zh-CN' ? '加载' : 'Load',
    // TODO: Add more translations
  }},
  
  // Game specific
  cultivation: {{
    realm: '{locale}' === 'zh-CN' ? '境界' : 'Realm',
    // TODO: Add cultivation translations
  }},
  
  // TODO: Add more translation categories
}};

export default {locale.replace('-', '_')};
"""

def create_localization_index():
    """Create localization index file"""
    return """/**
 * Localization Index
 * Central localization management
 */

import zh_CN from './zh-CN.js';
import en_US from './en-US.js';

export const SUPPORTED_LOCALES = {
  'zh-CN': zh_CN,
  'en-US': en_US
};

export const DEFAULT_LOCALE = 'zh-CN';

export default SUPPORTED_LOCALES;
"""

def update_package_json():
    """Update package.json with required dependencies"""
    try:
        # Read existing package.json
        with open('package.json', 'r') as f:
            package_data = json.load(f)
        
        # Add new dependencies
        new_dependencies = {
            "zustand": "^4.4.7",
            "three": "^0.159.0"
        }
        
        if 'dependencies' not in package_data:
            package_data['dependencies'] = {}
        
        package_data['dependencies'].update(new_dependencies)
        
        # Write updated package.json
        with open('package.json', 'w') as f:
            json.dump(package_data, f, indent=2)
        
        print("Updated package.json with new dependencies")
        
    except FileNotFoundError:
        print("Warning: package.json not found in current directory")
    except Exception as e:
        print(f"Warning: Could not update package.json: {e}")

if __name__ == "__main__":
    create_file_structure()