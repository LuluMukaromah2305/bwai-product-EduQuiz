class AmbientMp3Player {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private hasPreWarmed: boolean = false;

  // We use a highly reliable, relaxing copyright-free ambient instrumental study track
  private readonly trackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

  constructor() {
    this.setupGlobalPrewarm();
  }

  /**
   * Automatically pre-warms the audio on any early user interaction.
   * This handles the browser's Autoplay Policy seamlessly and makes it 100% automatic.
   */
  private setupGlobalPrewarm() {
    if (typeof window === "undefined") return;

    const prewarm = () => {
      if (this.hasPreWarmed) return;
      this.hasPreWarmed = true;

      try {
        if (!this.audio) {
          this.audio = new Audio(this.trackUrl);
          this.audio.loop = true;
          this.audio.volume = 0.25; // Quiet, calming study volume
          // Pre-load the track
          this.audio.load();
        }
      } catch (e) {
        console.warn("Prewarm failed, will retry on direct play state", e);
      }

      // Cleanup listeners once prewarmed
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("click", prewarm);
      window.removeEventListener("keydown", prewarm);
      window.removeEventListener("touchstart", prewarm);
      window.removeEventListener("mousedown", prewarm);
    };

    window.addEventListener("click", prewarm, { passive: true });
    window.addEventListener("keydown", prewarm, { passive: true });
    window.addEventListener("touchstart", prewarm, { passive: true });
    window.addEventListener("mousedown", prewarm, { passive: true });
  }

  start() {
    if (!this.audio) {
      try {
        this.audio = new Audio(this.trackUrl);
        this.audio.loop = true;
        this.audio.volume = 0.25;
      } catch (e) {
        console.error("Gagal meluncurkan instrumen audio MP3", e);
      }
    }

    if (this.audio) {
      this.isPlaying = true;
      this.audio.play().catch(err => {
        console.warn("Autoplay was blocked initially. Forcing automatic retry pool...", err);
        
        // Retrying continuously with recursive safe intervals to bypass temporary blocks
        const forceRetry = setInterval(() => {
          if (this.audio && this.isPlaying) {
            this.audio.play()
              .then(() => clearInterval(forceRetry))
              .catch(() => {});
          } else {
            clearInterval(forceRetry);
          }
        }, 300);
      });
    }
  }

  cleanup() {
    this.isPlaying = false;
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch (err) {}
      this.audio = null;
    }
    this.hasPreWarmed = false;
    this.setupGlobalPrewarm(); // Re-arm for subsequent attempts
  }
}

export const ambientMusic = new AmbientMp3Player();
