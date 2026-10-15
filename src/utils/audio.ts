// Web Audio API Sound Effects & Atmospheric Audio Synthesizer

export type AmbientTrack = 'windmill' | 'bells' | 'oil' | 'hall' | 'river';

class SoundEffects {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  // Ambient sound generator nodes
  private ambientGain: GainNode | null = null;
  private ambientSources: Array<{ stop: () => void }> = [];
  public currentTrack: AmbientTrack | null = null;
  public ambientVolume: number = 0.4;
  private isAmbientPlaying: boolean = false;
  private ambientTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    const saved = localStorage.getItem('quiz_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('quiz_muted', String(this.isMuted));
    if (this.isMuted) {
      if (this.ambientGain) {
        this.ambientGain.gain.value = 0;
      }
      this.stopSpeech();
    } else {
      if (this.ambientGain && this.isAmbientPlaying) {
        this.ambientGain.gain.value = this.ambientVolume;
      }
    }
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.error(e);
    }
  }

  public playCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Arpeggio note sequence C5 -> E5 -> G5
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.08);
      osc1.frequency.setValueAtTime(783.99, now + 0.16);

      osc2.frequency.setValueAtTime(1046.5, now + 0.16);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.16);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch (e) {
      console.error(e);
    }
  }

  public playCombo(streak: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = Math.min(880, 440 + streak * 60);
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

      notes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.18, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    } catch (e) {
      console.error(e);
    }
  }

  public playShield() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.error(e);
    }
  }

  public playLifeLost() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.error(e);
    }
  }

  public playWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.error(e);
    }
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch (e) {
      console.error(e);
    }
  }

  public playAchievement() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Magical twinkling arpeggio (G4, B4, D5, G5, B5, D6)
      const freqs = [392, 493.88, 587.33, 783.99, 987.77, 1174.66];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.07);

        gain.gain.setValueAtTime(0.18, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.07 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.5);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // --- ATMOSPHERIC GENERATIVE SOUNDSCAPES ---
  public startAmbient(track: AmbientTrack) {
    this.stopAmbient();
    this.initCtx();
    if (!this.ctx) return;

    // If muted, automatically unmute so the user immediately hears the chosen ambient track
    if (this.isMuted) {
      this.isMuted = false;
      localStorage.setItem('quiz_muted', 'false');
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.currentTrack = track;
    this.isAmbientPlaying = true;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(this.ambientVolume, this.ctx.currentTime + 0.1);
    masterGain.connect(this.ctx.destination);
    this.ambientGain = masterGain;

    if (track === 'windmill') {
      // 1. «Мельница в Бариновке» — Степной ветер, шелест ковыля и скрип деревянных крыльев 1848 г.
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.03 * white) / 1.03;
        lastOut = output[i];
      }

      // Wind body
      const windSource = this.ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
      windFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const windLfo = this.ctx.createOscillator();
      const windLfoGain = this.ctx.createGain();
      windLfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
      windLfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
      windLfo.connect(windLfoGain);
      windLfoGain.connect(windFilter.frequency);

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);

      windSource.start();
      windLfo.start();

      // Grass rustle layer
      const grassSource = this.ctx.createBufferSource();
      grassSource.buffer = noiseBuffer;
      grassSource.loop = true;

      const grassFilter = this.ctx.createBiquadFilter();
      grassFilter.type = 'highpass';
      grassFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      const grassGain = this.ctx.createGain();
      grassGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      grassSource.connect(grassFilter);
      grassFilter.connect(grassGain);
      grassGain.connect(masterGain);

      grassSource.start();

      // Periodic windmill sail whoosh and authentic wood creak
      let millActive = true;
      const playMillCreak = () => {
        if (!millActive || !this.ctx || !this.ambientGain) return;
        const now = this.ctx.currentTime;

        // Sail whoosh
        const whooshFilter = this.ctx.createBiquadFilter();
        whooshFilter.type = 'bandpass';
        whooshFilter.frequency.setValueAtTime(180, now);
        whooshFilter.frequency.exponentialRampToValueAtTime(450, now + 0.4);
        whooshFilter.frequency.exponentialRampToValueAtTime(180, now + 0.9);
        whooshFilter.Q.setValueAtTime(2.5, now);

        const whooshGain = this.ctx.createGain();
        whooshGain.gain.setValueAtTime(0.001, now);
        whooshGain.gain.linearRampToValueAtTime(0.35, now + 0.4);
        whooshGain.gain.linearRampToValueAtTime(0.001, now + 0.9);

        const sailNoise = this.ctx.createBufferSource();
        sailNoise.buffer = noiseBuffer;
        sailNoise.connect(whooshFilter);
        whooshFilter.connect(whooshGain);
        whooshGain.connect(masterGain);
        sailNoise.start(now);
        sailNoise.stop(now + 1.0);

        // Timber creak (soft pitch-bent saw with bandpass)
        const creakOsc = this.ctx.createOscillator();
        const creakFilter = this.ctx.createBiquadFilter();
        const creakGain = this.ctx.createGain();

        creakOsc.type = 'sawtooth';
        creakOsc.frequency.setValueAtTime(260, now + 0.2);
        creakOsc.frequency.exponentialRampToValueAtTime(160, now + 0.55);

        creakFilter.type = 'bandpass';
        creakFilter.frequency.setValueAtTime(420, now + 0.2);
        creakFilter.Q.setValueAtTime(3.0, now + 0.2);

        creakGain.gain.setValueAtTime(0.001, now + 0.2);
        creakGain.gain.linearRampToValueAtTime(0.08, now + 0.28);
        creakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        creakOsc.connect(creakFilter);
        creakFilter.connect(creakGain);
        creakGain.connect(masterGain);

        creakOsc.start(now + 0.2);
        creakOsc.stop(now + 0.6);
      };

      playMillCreak();
      this.ambientTimer = setInterval(playMillCreak, 3200);

      this.ambientSources.push({
        stop: () => {
          millActive = false;
          try {
            windSource.stop();
            windLfo.stop();
            grassSource.stop();
          } catch {}
        }
      });
    } else if (track === 'bells') {
      // 2. «Благовест Утёвки» — Торжественный колокольный перезвон Троицкого храма
      let bellsActive = true;

      // Realistic Russian bronze bell synthesizer
      const strikeBell = (freq: number, volume: number, decay: number, delaySec: number = 0) => {
        if (!bellsActive || !this.ctx || !this.ambientGain) return;
        const now = this.ctx.currentTime + delaySec;

        // Authentic Russian bell overtone spectrum
        const partials = [
          { mult: 0.5, amp: 0.45, decayMult: 1.2 },   // Hum note (унтертон)
          { mult: 1.0, amp: 1.0, decayMult: 1.0 },    // Prime/strike (основной тон)
          { mult: 1.189, amp: 0.7, decayMult: 0.8 },  // Minor third (терция)
          { mult: 1.5, amp: 0.5, decayMult: 0.75 },   // Quint (квинта)
          { mult: 2.0, amp: 0.4, decayMult: 0.5 },    // Octave (номинал)
          { mult: 2.74, amp: 0.25, decayMult: 0.35 }  // Supernominal
        ];

        partials.forEach((p) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * p.mult, now);

          const peak = volume * p.amp * 0.2;
          const noteDecay = decay * p.decayMult;

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(peak, now + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + noteDecay);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + noteDecay);
        });
      };

      // Bell ringing rhythm: Deep Blagovest + melodic chime cascade
      let step = 0;
      const playBellSequence = () => {
        if (!bellsActive || !this.ctx) return;

        // Big Bass Bell toll (Благовест)
        strikeBell(220, 0.95, 4.2, 0.0);

        // Perezvon chimes (A-major / F# minor pentatonic Russian sacred bells)
        if (step % 2 === 0) {
          strikeBell(880, 0.45, 1.8, 0.8);
          strikeBell(659.25, 0.5, 2.0, 1.4);
          strikeBell(554.37, 0.55, 2.2, 2.0);
          strikeBell(440, 0.65, 2.8, 2.6);
        } else {
          strikeBell(554.37, 0.5, 2.2, 0.7);
          strikeBell(659.25, 0.5, 2.0, 1.3);
          strikeBell(880, 0.6, 2.2, 1.9);
          strikeBell(1108.7, 0.4, 1.5, 2.5);
          strikeBell(659.25, 0.5, 2.2, 3.1);
        }
        step++;
      };

      playBellSequence();
      this.ambientTimer = setInterval(playBellSequence, 4400);

      this.ambientSources.push({
        stop: () => {
          bellsActive = false;
        }
      });
    } else if (track === 'oil') {
      // 3. «Нефтяной промысел» — Чёткий ритм станка-качалки СКД и дыхание скважины
      let oilActive = true;

      const playPumpjackCycle = () => {
        if (!oilActive || !this.ctx || !this.ambientGain) return;
        const now = this.ctx.currentTime;

        // Phase 1 (t=0.0s): Upstroke mechanical hum (audible fundamental + harmonics for phone/laptop speakers)
        const motor1 = this.ctx.createOscillator();
        const motor2 = this.ctx.createOscillator();
        const motorGain = this.ctx.createGain();

        motor1.type = 'triangle';
        motor1.frequency.setValueAtTime(115, now);
        motor1.frequency.linearRampToValueAtTime(145, now + 0.9);

        motor2.type = 'sawtooth';
        motor2.frequency.setValueAtTime(230, now);
        motor2.frequency.linearRampToValueAtTime(290, now + 0.9);

        motorGain.gain.setValueAtTime(0.001, now);
        motorGain.gain.linearRampToValueAtTime(0.22, now + 0.2);
        motorGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

        motor1.connect(motorGain);
        motor2.connect(motorGain);
        motorGain.connect(masterGain);

        motor1.start(now);
        motor2.start(now);
        motor1.stop(now + 1.0);
        motor2.stop(now + 1.0);

        // Phase 2 (t=0.95s): Top crest counterweight gear clack
        [520, 1040].forEach((freq) => {
          const clack = this.ctx!.createOscillator();
          const clackGain = this.ctx!.createGain();
          clack.type = 'sine';
          clack.frequency.setValueAtTime(freq, now + 0.95);
          clackGain.gain.setValueAtTime(0.18, now + 0.95);
          clackGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
          clack.connect(clackGain);
          clackGain.connect(masterGain);
          clack.start(now + 0.95);
          clack.stop(now + 1.1);
        });

        // Phase 3 (t=1.2s): Heavy downstroke thud (deep bass with crisp upper thump)
        const thud = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thud.type = 'triangle';
        thud.frequency.setValueAtTime(130, now + 1.2);
        thud.frequency.exponentialRampToValueAtTime(65, now + 1.6);
        thudGain.gain.setValueAtTime(0.35, now + 1.2);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        thud.connect(thudGain);
        thudGain.connect(masterGain);
        thud.start(now + 1.2);
        thud.stop(now + 1.8);

        // Phase 4 (t=1.25s): Stuffing box pneumatic pressure hiss ("ts-chhhh")
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.6);
        const puffBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const puffData = puffBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          puffData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }

        const puffSource = this.ctx.createBufferSource();
        puffSource.buffer = puffBuffer;

        const puffFilter = this.ctx.createBiquadFilter();
        puffFilter.type = 'bandpass';
        puffFilter.frequency.setValueAtTime(1400, now + 1.25);
        puffFilter.frequency.exponentialRampToValueAtTime(700, now + 1.7);
        puffFilter.Q.setValueAtTime(1.5, now + 1.25);

        const puffGain = this.ctx.createGain();
        puffGain.gain.setValueAtTime(0.28, now + 1.25);
        puffGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        puffSource.connect(puffFilter);
        puffFilter.connect(puffGain);
        puffGain.connect(masterGain);

        puffSource.start(now + 1.25);
        puffSource.stop(now + 1.85);
      };

      playPumpjackCycle();
      this.ambientTimer = setInterval(playPumpjackCycle, 2400);

      this.ambientSources.push({
        stop: () => {
          oilActive = false;
        }
      });
    } else if (track === 'hall') {
      // 4. «Залы музея» — Акустика залов и старинная музыкальная шкатулка 19 века
      let hallActive = true;

      // Warm acoustic room drone
      const roomDrone = this.ctx.createOscillator();
      const roomGain = this.ctx.createGain();
      roomDrone.type = 'sine';
      roomDrone.frequency.setValueAtTime(196.0, this.ctx.currentTime); // G3
      roomGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      roomDrone.connect(roomGain);
      roomGain.connect(masterGain);
      roomDrone.start();

      // Antique celesta / music box chime function
      const playMusicBoxNote = (freq: number, delaySec: number) => {
        if (!hallActive || !this.ctx || !this.ambientGain) return;
        const now = this.ctx.currentTime + delaySec;

        const osc = this.ctx.createOscillator();
        const harm = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        harm.type = 'triangle';
        harm.frequency.setValueAtTime(freq * 3, now); // Metallic chime sheen

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        harm.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        harm.start(now);
        osc.stop(now + 1.9);
        harm.stop(now + 1.9);
      };

      // Serene contemplative 19th-century salon melody
      const melody = [
        523.25, // C5
        659.25, // E5
        783.99, // G5
        880.00, // A5
        783.99, // G5
        659.25, // E5
        587.33, // D5
        523.25  // C5
      ];

      let noteIdx = 0;
      const playMelodyNote = () => {
        if (!hallActive || !this.ctx) return;
        playMusicBoxNote(melody[noteIdx % melody.length], 0);
        noteIdx++;
      };

      playMelodyNote();
      this.ambientTimer = setInterval(playMelodyNote, 1300);

      this.ambientSources.push({
        stop: () => {
          hallActive = false;
          try { roomDrone.stop(); } catch {}
        }
      });
    } else if (track === 'river') {
      // 5. «Река Самара и волжские волны» — Плеск воды у песчаного берега и речной бриз
      let riverActive = true;

      const bufferSize = this.ctx.sampleRate * 2.5;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.03 * white) / 1.03;
        lastOut = data[i];
      }

      // Rolling water wave function
      const playWave = () => {
        if (!riverActive || !this.ctx || !this.ambientGain) return;
        const now = this.ctx.currentTime;

        const waveSource = this.ctx.createBufferSource();
        waveSource.buffer = noiseBuffer;

        const waveFilter = this.ctx.createBiquadFilter();
        waveFilter.type = 'lowpass';
        waveFilter.frequency.setValueAtTime(250, now);
        waveFilter.frequency.linearRampToValueAtTime(850, now + 1.5);
        waveFilter.frequency.linearRampToValueAtTime(200, now + 3.2);

        const waveGain = this.ctx.createGain();
        waveGain.gain.setValueAtTime(0.001, now);
        waveGain.gain.linearRampToValueAtTime(0.42, now + 1.4);
        waveGain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

        waveSource.connect(waveFilter);
        waveFilter.connect(waveGain);
        waveGain.connect(masterGain);

        waveSource.start(now);
        waveSource.stop(now + 3.5);

        // Water droplet ripple ping
        const drop = this.ctx.createOscillator();
        const dropGain = this.ctx.createGain();
        drop.type = 'sine';
        drop.frequency.setValueAtTime(1100, now + 1.6);
        drop.frequency.exponentialRampToValueAtTime(1800, now + 1.7);
        dropGain.gain.setValueAtTime(0.06, now + 1.6);
        dropGain.gain.exponentialRampToValueAtTime(0.001, now + 1.85);

        drop.connect(dropGain);
        dropGain.connect(masterGain);
        drop.start(now + 1.6);
        drop.stop(now + 1.9);
      };

      playWave();
      this.ambientTimer = setInterval(playWave, 3500);

      this.ambientSources.push({
        stop: () => {
          riverActive = false;
        }
      });
    }
  }

  public stopAmbient() {
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
    this.ambientSources.forEach((src) => {
      try { src.stop(); } catch {}
    });
    this.ambientSources = [];
    if (this.ambientGain) {
      try { this.ambientGain.disconnect(); } catch {}
      this.ambientGain = null;
    }
    this.isAmbientPlaying = false;
    this.currentTrack = null;
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && !this.isMuted) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx?.currentTime || 0);
    }
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }

  // --- WEB SPEECH API (RUSSIAN VOICE NARRATION) ---
  public speakText(text: string, onEnd?: () => void) {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean html or quotes
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/[*_#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const ruVoice = voices.find((v) => v.lang.startsWith('ru') || v.lang.includes('RU'));
    if (ruVoice) {
      utterance.voice = ruVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}

export const soundFx = new SoundEffects();
