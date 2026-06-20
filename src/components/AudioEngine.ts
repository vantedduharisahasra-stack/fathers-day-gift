/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple client-side synth engine using Web Audio API to give premium tactile responsive feedback
class AudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private initCheck() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public playMove() {
    this.initCheck();
    if (!this.ctx || this.muted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Low organic pop sound
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio check error', e);
    }
  }

  public playSuccess() {
    this.initCheck();
    if (!this.ctx || this.muted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const parent = this.ctx;
      const playTone = (freq: number, start: number, duration: number, vol: number) => {
        const osc = parent.createOscillator();
        const gain = parent.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, start + duration);

        gain.gain.setValueAtTime(vol, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(parent.destination);

        osc.start(start);
        osc.stop(start + duration);
      };

      // Play a lovely major pentatonic sparkling arpeggio
      const baseTime = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major
      notes.forEach((freq, idx) => {
        playTone(freq, baseTime + idx * 0.07, 0.4, 0.04);
      });
    } catch (e) {
      console.warn('Audio check error', e);
    }
  }

  public playPaper() {
    this.initCheck();
    if (!this.ctx || this.muted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      // White noise bandpass sweep for a crisp paper rustling sound
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.25);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseNode.start();
      noiseNode.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('Audio check error', e);
    }
  }
}

export const audio = new AudioEngine();
