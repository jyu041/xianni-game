import useGameStore from './StateManager.js';

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.musicNodes = new Map();
    this.sfxNodes = new Map();
    this.voiceNodes = new Map();
    
    this.currentMusic = null;
    this.musicVolume = 0.8;
    this.sfxVolume = 0.8;
    this.voiceVolume = 0.8;
    
    this.musicFiles = new Map();
    this.sfxFiles = new Map();
    this.voiceFiles = new Map();
    
    this.isInitialized = false;
  }

  // Initialize audio system
  async initialize() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Handle browser autoplay policy
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Load initial audio files
      await this.loadInitialAudio();
      
      // Subscribe to settings changes
      this.subscribeToSettings();
      
      this.isInitialized = true;
      console.log('AudioManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
    }
  }

  // Load initial audio files
  async loadInitialAudio() {
    // Load menu music
    await this.loadMusic('menu_theme', '/assets/music/menu/main_theme.mp3');
    
    // Load basic SFX
    await this.loadSFX('button_click', '/assets/sfx/ui/button_click.mp3');
    await this.loadSFX('notification', '/assets/sfx/ui/notification.mp3');
    await this.loadSFX('breakthrough', '/assets/sfx/player/breakthrough.mp3');
    
    // Load voice samples
    await this.loadVoice('narrator_intro', '/assets/voices/narrator/intro.mp3');
  }

  // Subscribe to game settings changes
  subscribeToSettings() {
    useGameStore.subscribe((state) => {
      this.musicVolume = state.settings.musicVolume;
      this.sfxVolume = state.settings.sfxVolume;
      this.voiceVolume = state.settings.voiceVolume;
      
      // Update current playing audio volumes
      this.updateAllVolumes();
    });
  }

  // Load music file
  async loadMusic(id, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.musicFiles.set(id, audioBuffer);
      console.log(`Loaded music: ${id}`);
    } catch (error) {
      console.warn(`Failed to load music ${id}:`, error);
    }
  }

  // Load SFX file
  async loadSFX(id, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.sfxFiles.set(id, audioBuffer);
      console.log(`Loaded SFX: ${id}`);
    } catch (error) {
      console.warn(`Failed to load SFX ${id}:`, error);
    }
  }

  // Load voice file
  async loadVoice(id, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.voiceFiles.set(id, audioBuffer);
      console.log(`Loaded voice: ${id}`);
    } catch (error) {
      console.warn(`Failed to load voice ${id}:`, error);
    }
  }

  // Play music (loops by default)
  playMusic(id, loop = true, fadeIn = true) {
    if (!this.isInitialized || !this.musicFiles.has(id)) {
      console.warn(`Music ${id} not found or AudioManager not initialized`);
      return null;
    }

    // Stop current music
    this.stopMusic();

    const audioBuffer = this.musicFiles.get(id);
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    source.loop = loop;
    
    // Set initial volume
    gainNode.gain.value = fadeIn ? 0 : this.musicVolume;
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Start playing
    source.start();
    
    // Fade in if requested
    if (fadeIn) {
      gainNode.gain.linearRampToValueAtTime(this.musicVolume, this.audioContext.currentTime + 2);
    }
    
    // Store references
    this.currentMusic = { source, gainNode, id };
    this.musicNodes.set(id, { source, gainNode });
    
    console.log(`Playing music: ${id}`);
    return this.currentMusic;
  }

  // Stop current music
  stopMusic(fadeOut = true) {
    if (!this.currentMusic) return;

    const { source, gainNode } = this.currentMusic;
    
    if (fadeOut) {
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
      setTimeout(() => {
        source.stop();
      }, 1000);
    } else {
      source.stop();
    }
    
    this.musicNodes.delete(this.currentMusic.id);
    this.currentMusic = null;
  }

  // Play sound effect
  playSFX(id, volume = 1) {
    if (!this.isInitialized || !this.sfxFiles.has(id)) {
      console.warn(`SFX ${id} not found or AudioManager not initialized`);
      return null;
    }

    const audioBuffer = this.sfxFiles.get(id);
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    gainNode.gain.value = this.sfxVolume * volume;
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Start playing
    source.start();
    
    // Clean up when finished
    source.onended = () => {
      this.sfxNodes.delete(source);
    };
    
    this.sfxNodes.set(source, { source, gainNode });
    
    return { source, gainNode };
  }

  // Play voice line
  playVoice(id, volume = 1) {
    if (!this.isInitialized || !this.voiceFiles.has(id)) {
      console.warn(`Voice ${id} not found or AudioManager not initialized`);
      return null;
    }

    // Stop any current voice
    this.stopAllVoices();

    const audioBuffer = this.voiceFiles.get(id);
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    gainNode.gain.value = this.voiceVolume * volume;
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Start playing
    source.start();
    
    // Clean up when finished
    source.onended = () => {
      this.voiceNodes.delete(source);
    };
    
    this.voiceNodes.set(source, { source, gainNode });
    
    console.log(`Playing voice: ${id}`);
    return { source, gainNode };
  }

  // Stop all voices
  stopAllVoices() {
    this.voiceNodes.forEach(({ source }) => {
      source.stop();
    });
    this.voiceNodes.clear();
  }

  // Update all audio volumes
  updateAllVolumes() {
    // Update music volume
    if (this.currentMusic) {
      this.currentMusic.gainNode.gain.value = this.musicVolume;
    }
    
    // Update SFX volumes
    this.sfxNodes.forEach(({ gainNode }) => {
      gainNode.gain.value = this.sfxVolume;
    });
    
    // Update voice volumes
    this.voiceNodes.forEach(({ gainNode }) => {
      gainNode.gain.value = this.voiceVolume;
    });
  }

  // Set music for current game state
  setMusicForState(gameState) {
    switch (gameState) {
      case 'home':
        this.playMusic('menu_theme');
        break;
      case 'playing':
        this.playMusic('world_peaceful');
        break;
      case 'combat':
        this.playMusic('combat_normal');
        break;
      default:
        break;
    }
  }

  // Cleanup
  cleanup() {
    this.stopMusic(false);
    this.stopAllVoices();
    
    this.sfxNodes.forEach(({ source }) => {
      source.stop();
    });
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.isInitialized = false;
    console.log('AudioManager cleaned up');
  }
}

export default new AudioManager();