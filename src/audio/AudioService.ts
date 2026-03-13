import { Howl, Howler } from 'howler';

// Define available tracks and effects
export type BGMTrack = 'lobby' | 'battle';
export type SFXTrack = 
  | 'click' 
  | 'card-hover' 
  | 'card-play' 
  | 'slash' 
  | 'charge' 
  | 'magic' 
  | 'hit' 
  | 'win' 
  | 'lose';

class AudioService {
  private bgmInstances: Record<BGMTrack, Howl>;
  private sfxInstances: Record<SFXTrack, Howl>;
  private currentBGM: BGMTrack | null = null;

  private isMuted: boolean = false;
  private masterVolume: number = 0.5;

  constructor() {
    // Initialize BGM
    // Note: Using import.meta.env.BASE_URL to ensure correct paths in both dev and GitHub Pages production
    const baseUrl = import.meta.env.BASE_URL;
    
    this.bgmInstances = {
      lobby: new Howl({
        src: [`${baseUrl}assets/audio/bgm-lobby.wav`],
        loop: true,
        volume: 0, // Start at 0 for fade in
        preload: true,
      }),
      battle: new Howl({
        src: [`${baseUrl}assets/audio/bgm-battle.wav`],
        loop: true,
        volume: 0,
        preload: true,
      }),
    };

    // Initialize SFX
    this.sfxInstances = {
      click: new Howl({ src: [`${baseUrl}assets/audio/sfx-click.wav`] }),
      'card-hover': new Howl({ src: [`${baseUrl}assets/audio/sfx-card-hover.wav`] }),
      'card-play': new Howl({ src: [`${baseUrl}assets/audio/sfx-card-play.wav`] }),
      slash: new Howl({ src: [`${baseUrl}assets/audio/sfx-slash.wav`] }),
      charge: new Howl({ src: [`${baseUrl}assets/audio/sfx-charge.wav`] }),
      magic: new Howl({ src: [`${baseUrl}assets/audio/sfx-magic.wav`] }),
      hit: new Howl({ src: [`${baseUrl}assets/audio/sfx-hit.wav`] }),
      win: new Howl({ src: [`${baseUrl}assets/audio/sfx-win.wav`] }),
      lose: new Howl({ src: [`${baseUrl}assets/audio/sfx-lose.wav`] }),
    };

    // Set initial global volume
    Howler.volume(this.masterVolume);
  }

  public playBGM(track: BGMTrack) {
    if (this.currentBGM === track) return;

    const fadeDuration = 1000;

    // Fade out current BGM if exists
    if (this.currentBGM) {
      const currentHowl = this.bgmInstances[this.currentBGM];
      currentHowl.fade(currentHowl.volume(), 0, fadeDuration);
      setTimeout(() => {
        currentHowl.pause();
      }, fadeDuration);
    }

    // Play and fade in new BGM
    const newHowl = this.bgmInstances[track];
    newHowl.play();
    newHowl.fade(0, 1, fadeDuration); // BGM volume relative to master

    this.currentBGM = track;
  }

  public playSFX(track: SFXTrack) {
    if (this.isMuted) return;
    this.sfxInstances[track].play();
  }

  public setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.masterVolume);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    return this.isMuted;
  }

  public getMutedState() {
    return this.isMuted;
  }
}

// Export as a singleton
export const audioService = new AudioService();
