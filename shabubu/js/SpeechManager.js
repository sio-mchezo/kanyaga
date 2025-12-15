// Simple Speech Manager - Only speaks random words
class SpeechManager {
  constructor(faceManager, headMotion) {
    this.faceManager = faceManager;
    this.headMotion = headMotion;
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;

    // Use default voice
    this.availableVoices = [];
    this.currentVoice = null;
  }

  async init() {
    // Load voices but use default
    this.loadVoices();
    console.log("SpeechManager ready");
  }

  loadVoices() {
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      this.availableVoices = voices;
      // Use first available voice
      this.currentVoice = voices[0];
    }
  }

  // Speak one random word from the list
  speakRandomWord() {
    if (this.isSpeaking || !this.faceManager.isReady) return;

    // Pick random word
    const randomIndex = Math.floor(Math.random() * RANDOM_WORDS.length);
    const text = RANDOM_WORDS[randomIndex];

    console.log("Speaking:", text);

    // Start animations
    this.faceManager.mouthshape(text);
    if (this.headMotion) {
      this.headMotion.startAnimation();
    }

    this.isSpeaking = true;

    // Create speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.0;
    utterance.rate = 0.85;
    utterance.volume = 1.0;

    if (this.currentVoice) {
      utterance.voice = this.currentVoice;
    }

    // Event listeners
    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.headMotion) {
        setTimeout(() => {
          this.headMotion.stopAnimation();
        }, 200);
      }
      this.faceManager.resetToNeutral();
    };

    utterance.onerror = (event) => {
      console.log("Speech error:", event);
      this.isSpeaking = false;
      if (this.headMotion) {
        this.headMotion.stopAnimation();
      }
      this.faceManager.resetToNeutral();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;

      if (this.headMotion) {
        this.headMotion.stopAnimation();
      }
      this.faceManager.resetToNeutral();
    }
  }
}
