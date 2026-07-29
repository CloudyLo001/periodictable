import { AUDIO_FILES } from './audio-manifest';

type SfxName = keyof typeof AUDIO_FILES;

/**
 * WebAudio SFX manager. Fails soft: missing files or a locked AudioContext
 * never block the app — sounds simply stay silent.
 */
export class AudioManager {
  private ctx: AudioContext | null = null;
  private buffers = new Map<SfxName, AudioBuffer>();
  private master: GainNode | null = null;
  private ambience: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private muted = false;
  private started = false;

  constructor() {
    const unlock = () => {
      this.start();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
  }

  private start(): void {
    if (this.started) return;
    this.started = true;
    try {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
      void this.preload();
    } catch {
      this.ctx = null;
    }
  }

  private async preload(): Promise<void> {
    if (!this.ctx) return;
    await Promise.all(
      (Object.keys(AUDIO_FILES) as SfxName[]).map(async (name) => {
        const url = AUDIO_FILES[name];
        if (!url) return;
        try {
          const res = await fetch(url);
          if (!res.ok) return;
          const data = await res.arrayBuffer();
          const buffer = await this.ctx!.decodeAudioData(data);
          this.buffers.set(name, buffer);
        } catch {
          /* sound unavailable; stay silent */
        }
      })
    );
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.05);
    }
  }

  play(name: SfxName, volume = 0.5): void {
    if (!this.ctx || !this.master || this.muted) return;
    const buffer = this.buffers.get(name);
    if (!buffer) return;
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    src.connect(gain).connect(this.master);
    src.start();
  }

  startAmbience(volume = 0.22): void {
    if (!this.ctx || !this.master || this.ambience) return;
    const buffer = this.buffers.get('ambience');
    if (!buffer) return;
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.8);
    src.connect(gain).connect(this.master);
    src.start();
    this.ambience = { src, gain };
  }

  stopAmbience(): void {
    if (!this.ctx || !this.ambience) return;
    const { src, gain } = this.ambience;
    this.ambience = null;
    gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.35);
    setTimeout(() => {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
    }, 1500);
  }
}
