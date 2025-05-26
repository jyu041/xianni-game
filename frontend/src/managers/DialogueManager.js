import useGameStore from './StateManager.js';
import AudioManager from './AudioManager.js';

class DialogueManager {
  constructor() {
    this.currentDialogue = null;
    this.dialogueHistory = [];
    this.characterVoices = new Map();
    this.isPlaying = false;
  }

  // Start a dialogue sequence
  startDialogue(dialogueData) {
    if (this.isPlaying) {
      this.endDialogue();
    }

    this.currentDialogue = {
      ...dialogueData,
      currentLine: 0,
      choices: []
    };
    
    this.isPlaying = true;
    this.showDialogue();
  }

  // Show current dialogue line
  showDialogue() {
    if (!this.currentDialogue) return;

    const currentLine = this.currentDialogue.lines[this.currentDialogue.currentLine];
    if (!currentLine) {
      this.endDialogue();
      return;
    }

    // Play voice if available
    if (currentLine.voiceId && AudioManager.isInitialized) {
      AudioManager.playVoice(currentLine.voiceId);
    }

    // Update UI
    useGameStore.getState().updateUI({
      showDialogue: true,
      currentDialogue: {
        speaker: currentLine.speaker,
        text: currentLine.text,
        portrait: currentLine.portrait,
        choices: currentLine.choices || []
      }
    });
  }

  // Advance to next line
  nextLine() {
    if (!this.currentDialogue) return;

    this.currentDialogue.currentLine++;
    this.showDialogue();
  }

  // Make a choice in dialogue
  makeChoice(choiceIndex) {
    if (!this.currentDialogue) return;

    const currentLine = this.currentDialogue.lines[this.currentDialogue.currentLine];
    const choice = currentLine.choices[choiceIndex];

    if (choice) {
      // Execute choice effects
      if (choice.effects) {
        this.executeChoiceEffects(choice.effects);
      }

      // Jump to target line or continue
      if (choice.target) {
        this.currentDialogue.currentLine = choice.target;
      } else {
        this.currentDialogue.currentLine++;
      }

      this.showDialogue();
    }
  }

  // Execute choice effects
  executeChoiceEffects(effects) {
    const gameState = useGameStore.getState();

    if (effects.reputation) {
      Object.entries(effects.reputation).forEach(([sectId, change]) => {
        gameState.updateReputation(sectId, change);
      });
    }

    if (effects.items) {
      effects.items.forEach(item => {
        gameState.addItem(item);
      });
    }

    if (effects.cultivation) {
      gameState.updateCultivation(effects.cultivation);
    }
  }

  // End dialogue
  endDialogue() {
    if (this.currentDialogue) {
      this.dialogueHistory.push(this.currentDialogue);
    }

    this.currentDialogue = null;
    this.isPlaying = false;

    // Stop any playing voice
    AudioManager.stopAllVoices();

    // Update UI
    useGameStore.getState().updateUI({
      showDialogue: false,
      currentDialogue: null
    });
  }

  // Get dialogue history
  getHistory() {
    return this.dialogueHistory;
  }

  // Check if dialogue is playing
  isDialoguePlaying() {
    return this.isPlaying;
  }
}

export default new DialogueManager();