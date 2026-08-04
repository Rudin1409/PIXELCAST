// Web Audio API Synthesizer for Retro 8-Bit Sound FX

class RetroSoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.adminMuted = true; // Default: Suara laptop Admin SILENT agar TIDAK mengganggu audio panggung!
  }

  toggleAdminMute() {
    this.adminMuted = !this.adminMuted;
    return this.adminMuted;
  }

  shouldPlaySound() {
    if (!this.enabled) return false;
    // Jika sedang di halaman Admin dan Admin Mute aktif, jangan bunyikan suara di laptop Admin
    if (window.location.hash === '#admin' && this.adminMuted) {
      return false;
    }
    return true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCoin() {
    if (!this.shouldPlaySound()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.06, now); // Dikecilkan halus dari 0.15 agar tidak mengagetkan
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playClick() {
    if (!this.shouldPlaySound()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    gain.gain.setValueAtTime(0.05, now); // Dikecilkan dari 0.2
    gain.gain.linearRampToValueAtTime(0.005, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playApprove() {
    if (!this.shouldPlaySound()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.06, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.06 + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.1);
    });
  }

  playReject() {
    if (!this.shouldPlaySound()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playBoom() {
    if (!this.shouldPlaySound()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Sound FX 6: 8-Bit Power-Up Sound (Saat Sorotan Popup Aktif)
  playPowerUp() {
    if (!this.shouldPlaySound()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [392, 493.88, 587.33, 783.99, 987.77, 1174.66]; // G4, B4, D5, G5, B5, D6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);

      gain.gain.setValueAtTime(0.05, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.04 + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.08);
    });
  }

  // Sound FX 7: Arcade Spawn Chime (Saat Pesan Baru Meluncur di Panggung)
  playSpawnChime() {
    if (!this.shouldPlaySound()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.12); // C6

    gain.gain.setValueAtTime(0.04, now); // Dikecilkan sangat lembut dari 0.12
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Sound FX 8: Teleport / Warp Sound (Saat Clear Data / Reset)
  playWarp() {
    if (!this.shouldPlaySound()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 🎵 BGM 8-Bit Ambient Chiptune Synth Loop (Musik Latar Santai Panggung)
  startBGM() {
    if (this.bgmInterval) return;
    this.init();
    if (!this.ctx) return;

    // Melody Chiptune Relaxing Arcade (Cmaj7 -> Am7 -> Fmaj7 -> G7)
    const pattern = [
      523.25, 659.25, 783.99, 659.25,
      440.00, 523.25, 659.25, 523.25,
      349.23, 440.00, 523.25, 440.00,
      392.00, 493.88, 587.33, 493.88
    ];

    let noteIdx = 0;
    this.bgmPlaying = true;

    this.bgmInterval = setInterval(() => {
      if (!this.bgmPlaying || !this.shouldPlaySound()) return;
      
      const now = this.ctx.currentTime;
      const freq = pattern[noteIdx % pattern.length];
      noteIdx++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine'; // Suara lembut chill synth
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.065, now); // Dibesarkan sedikit lebih hangat dari 0.03
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    }, 420);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  toggleBGM() {
    if (this.bgmPlaying) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.bgmPlaying;
  }
}

window.soundFX = new RetroSoundFX();
