// frontend/src/components/game/config/VfxConfigs.js
import vfxMetadata from '../../../assets/vfx_metadata.json';

// Parse VFX metadata and create usable configurations
export const VFX_CONFIGS = {};

// Process the metadata to create VFX configurations
const processVfxMetadata = () => {
  Object.entries(vfxMetadata).forEach(([key, value]) => {
    if (key === '_metadata') return;
    
    if (value.type === 'folder') {
      // Process folder contents
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subKey === 'type') return;
        if (subValue.type === 'gif') {
          const configKey = `${key}_${subKey.replace('.gif', '')}`;
          VFX_CONFIGS[configKey] = createVfxConfig(configKey, `${key}/${subKey}`, subValue);
        }
      });
    } else if (value.type === 'gif') {
      // Direct GIF file
      const configKey = key.replace('.gif', '');
      VFX_CONFIGS[configKey] = createVfxConfig(configKey, key, value);
    }
  });
};

// Create VFX configuration object
const createVfxConfig = (key, path, metadata) => {
  const config = {
    key: key,
    path: `/assets/vfx/${path}`,
    name: formatDisplayName(key),
    category: getCategoryFromPath(path),
    duration: metadata.total_duration_ms || (metadata.frame_count * 100), // Fallback duration
    frameCount: metadata.frame_count,
    dimensions: metadata.dimensions,
    scale: 1.0, // Default scale - let user control this
    offset: { x: 0, y: 0 }, // Default centered on player
    looping: metadata.looping || false,
    autoDestroy: true
  };

  return config;
};

// Format display name for UI
const formatDisplayName = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get category from file path
const getCategoryFromPath = (path) => {
  const parts = path.split('/');
  return parts.length > 1 ? parts[0] : 'misc';
};

// Calculate optimal scale based on dimensions
const calculateOptimalScale = (dimensions) => {
  if (!dimensions) return 1.0;
  
  const [width, height] = dimensions;
  const maxDimension = Math.max(width, height);
  
  // Scale effects to be reasonable size (target ~100-150px max dimension)
  if (maxDimension > 400) return 0.3;
  if (maxDimension > 300) return 0.4;
  if (maxDimension > 200) return 0.6;
  if (maxDimension > 150) return 0.8;
  return 1.0;
};

// Initialize configurations
processVfxMetadata();

// Get all VFX configs
export const getAllVfxConfigs = () => Object.values(VFX_CONFIGS);

// Get VFX config by key
export const getVfxConfig = (key) => VFX_CONFIGS[key];

// Get VFX configs by category
export const getVfxConfigsByCategory = (category) => {
  return Object.values(VFX_CONFIGS).filter(config => config.category === category);
};

// Get all categories
export const getVfxCategories = () => {
  const categories = new Set();
  Object.values(VFX_CONFIGS).forEach(config => categories.add(config.category));
  return Array.from(categories).sort();
};